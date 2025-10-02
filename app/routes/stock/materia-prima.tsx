import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form, Card } from "antd";

type Materia = { key: number; nombre: string; stock: number };

const datosEjemplo: Materia[] = [
  { key: 1, nombre: "Harina 000", stock: 120 },
  { key: 2, nombre: "Huevo", stock: 80 },
];

export default function StockMateriaPrima() {
  const [data, setData] = useState<Materia[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Materia | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Materia) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Materia, "key">) => {
      if (editing) {
        setData(data.map(item => (item.key === editing.key ? { ...editing, ...values } : item)));
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f7f7f7', padding: 32 }}>
      <Card title="Materia Prima" style={{ width: 600, boxShadow: '0 2px 8px #e6e6e6' }}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', display: 'flex' }}>
          <Input.Search
            placeholder="Buscar materia prima"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            allowClear
            style={{ maxWidth: 300 }}
          />
          <Button type="primary" onClick={handleAdd}>Agregar Materia Prima</Button>
        </Space>
        <Table
          columns={[
            { title: "Nombre", dataIndex: "nombre" },
            { title: "Stock", dataIndex: "stock" },
            {
              title: "Acciones",
              render: (_, record) => (
                <Space>
                  <Button onClick={() => handleEdit(record)}>Editar</Button>
                  <Button danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
                </Space>
              )
            }
          ]}
          dataSource={filteredData}
          pagination={{ pageSize: 8 }}
        />
        <Modal
          open={modalOpen}
          title={editing ? "Editar Materia Prima" : "Nueva Materia Prima"}
          onCancel={() => setModalOpen(false)}
          onOk={handleOk}
          okText="Guardar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Ingrese el stock" }]}>
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}