import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography } from "antd";

const { Title } = Typography;

type Maquina = {
  key: number;
  id_maquina: string;
  descripcion: string;
};

const datosEjemplo: Maquina[] = [
  { key: 1, id_maquina: "M-001", descripcion: "Torno industrial" },
  { key: 2, id_maquina: "M-002", descripcion: "Fresadora de precisión" },
];

export default function Maquinas() {
  const [data, setData] = useState<Maquina[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Maquina | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  // ------------------ FILTRO ------------------
  const filteredData = data.filter(m => {
    const s = search.toLowerCase();
    return (
      m.id_maquina.toLowerCase().includes(s) ||
      m.descripcion.toLowerCase().includes(s)
    );
  });

  // ------------------ TABLE COLUMNS ------------------
  const columns = [
    { title: "ID Máquina", dataIndex: "id_maquina" },
    { title: "Descripción", dataIndex: "descripcion" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Maquina) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  // ------------------ HANDLERS ------------------
  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Maquina) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Maquina, "key">) => {
      if (editing) {
        // actualizar
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values } : item));
      } else {
        // agregar
        setData([...data, { ...values, key: Date.now() }]);
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }

  // ------------------ UI ------------------
  return (
    <div style={{ width:'100%', padding: 24 }}>
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Máquinas</Title>


      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Buscar máquina..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar máquina</Button>
      </div>

      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />

      {/* MODAL */}
      <Modal
        open={modalOpen}
        title={editing ? "Editar máquina" : "Agregar máquina"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="ID Máquina"
            name="id_maquina"
            rules={[{ required: true, message: "Ingrese el ID de la máquina" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: "Ingrese la descripción" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
