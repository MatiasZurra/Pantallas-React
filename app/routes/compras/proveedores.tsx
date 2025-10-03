import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form } from "antd";

type Proveedor = { key: number; nombre: string; telefono: string; email: string; cuit: string; direccion: string };

const datosEjemplo: Proveedor[] = [
  { key: 1, nombre: "Distribuidora Norte", telefono: "1122334455", cuit: '30-12345678-9', email: "norte@proveedor.com", direccion: "Av. Central 100" },
  { key: 2, nombre: "Materias Primas SA", telefono: "2233445566", cuit: '30-87654321-0', email: "mp@proveedor.com", direccion: "Ruta 8 Km 45" },
];


export default function ProveedoresCompras() {
  const [data, setData] = useState<Proveedor[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Proveedor) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Proveedor, "key">) => {
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
    { title: "CUIT", dataIndex: "cuit" },
    { title: "Dirección", dataIndex: "direccion" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Proveedor) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Proveedores</h2>
        <Button type="primary" onClick={handleAdd}>Agregar proveedor</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar proveedor..."
          allowClear
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar proveedor" : "Agregar proveedor"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}> <Input /> </Form.Item>
          <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: "Ingrese el teléfono" }]}> <Input /> </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Ingrese el email" }]}> <Input /> </Form.Item>
          <Form.Item label="CUIT" name="cuit" rules={[{ required: true, message: "Ingrese el CUIT" }]}> <Input /> </Form.Item>
          <Form.Item label="Dirección" name="direccion" rules={[{ required: true, message: "Ingrese la dirección" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
