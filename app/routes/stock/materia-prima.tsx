import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form, Typography } from "antd";

type Materia = { key: number; nombre: string; stock: number };
const {Title}= Typography;
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
    Object.values(item).some(v =>
      String(v).toLowerCase().includes(busqueda.toLowerCase())
    )
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
        setData(
          data.map(item =>
            item.key === editing.key ? { ...editing, ...values } : item
          )
        );
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
      form.resetFields();
      setEditing(null);
    });
  }

  const columns = [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Stock", dataIndex: "stock" },
    {
      title: "Acciones",
      render: (_: any, record: Materia) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width:'100%', padding: 24 }}>
      {/* Encabezado */}

        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Stock de Materia Prima</Title>
      

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Buscar materia prima..."
          allowClear
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agregar Materia Prima
        </Button>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        bordered
        rowKey="key"
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        title={editing ? "Editar Materia Prima" : "Nueva Materia Prima"}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleOk}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Ingrese el stock" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
