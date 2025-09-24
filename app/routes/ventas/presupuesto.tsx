import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type Presupuesto = {
  key: number;
  idPresupuesto: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  total: number;
};

const datosEjemplo: Presupuesto[] = [
  {
    key: 1,
    idPresupuesto: "P-001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    total: 12000
  },
  {
    key: 2,
    idPresupuesto: "P-002",
    idCliente: "CL-02",
    fecha: "2025-09-25",
    nombreCliente: "Ana López",
    total: 18000
  },
];

export default function PresupuestoVentas() {
  const [data, setData] = useState<Presupuesto[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Presupuesto | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Presupuesto) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<Presupuesto, "key">) => {
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values } : item));
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Presupuesto", dataIndex: "idPresupuesto" },
    { title: "ID Cliente", dataIndex: "idCliente" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Cliente", dataIndex: "nombreCliente" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Presupuesto) => (
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
        <h2 style={{ margin: 0 }}>Presupuestos</h2>
        <Button type="primary" onClick={handleAdd}>Agregar presupuesto</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar presupuesto" : "Agregar presupuesto"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Presupuesto" name="idPresupuesto" rules={[{ required: true, message: "Ingrese el ID de presupuesto" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Total" name="total" rules={[{ required: true, message: "Ingrese el total" }]}> <Input type="number" /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
