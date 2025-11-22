import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form, Typography } from "antd";

const { Title } = Typography;

type Cliente = { key: number; nombre: string; telefono: string; email: string; cuit_dni: string; direccion: string };

const datosEjemplo: Cliente[] = [
  { key: 1, nombre: "Juan Pérez", telefono: "123456789", cuit_dni: '36.674.908', email: "juan@mail.com", direccion: "Calle Falsa 123" },
  { key: 2, nombre: "Ana López", telefono: "987654321", cuit_dni: '54.746.398', email: "ana@mail.com", direccion: "Av. Siempre Viva 456" },
];

export default function ClientesVentas() {
  const [data, setData] = useState<Cliente[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Cliente) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Cliente, "key">) => {
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values } : item));
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }

  const columns = [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Email", dataIndex: "email" },
    { title: "CUIT/DNI", dataIndex: "cuit_dni" },
    { title: "Dirección", dataIndex: "direccion" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Cliente) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{padding: 24, width: '100%'}}>
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Lista de Clientes</Title>
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar cliente..."
          allowClear
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar cliente</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar cliente" : "Agregar cliente"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}> <Input /> </Form.Item>
          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: "Ingrese el teléfono" }]}> <Input /> </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Ingrese el email" }]}> <Input /> </Form.Item>
          <Form.Item label="CUIT/DNI" name="cuit_dni" rules={[{ required: true, message: "Ingrese el CUIT o DNI" }]}> <Input /> </Form.Item>
          <Form.Item label="Dirección" name="direccion" rules={[{ required: true, message: "Ingrese la dirección" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
