import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type PagoCliente = {
  key: number;
  idPago: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  monto: number;
};

const datosEjemplo: PagoCliente[] = [
  {
    key: 1,
    idPago: "PG-001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    monto: 5000
  },
  {
    key: 2,
    idPago: "PG-002",
    idCliente: "CL-02",
    fecha: "2025-09-25",
    nombreCliente: "Ana López",
    monto: 7000
  },
];

export default function PagosClienteVentas() {
  const [data, setData] = useState<PagoCliente[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PagoCliente | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: PagoCliente) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<PagoCliente, "key">) => {
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
    { title: "ID Pago", dataIndex: "idPago" },
    { title: "ID Cliente", dataIndex: "idCliente" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Cliente", dataIndex: "nombreCliente" },
    { title: "Monto", dataIndex: "monto" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: PagoCliente) => (
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
        <h2 style={{ margin: 0 }}>Pagos de cliente</h2>
        <Button type="primary" onClick={handleAdd}>Agregar pago</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar pago" : "Agregar pago"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Pago" name="idPago" rules={[{ required: true, message: "Ingrese el ID de pago" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Monto" name="monto" rules={[{ required: true, message: "Ingrese el monto" }]}> <Input type="number" /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
