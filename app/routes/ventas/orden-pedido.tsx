import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type OrdenPedido = {
  key: number;
  idPedido: string;
  idCliente: string;
  idEmpleado: string;
  fechaPedido: string;
  fechaEntrega: string;
  horaEntrega: string;
  envio: boolean;
  cliente: string;
  empleado: string;
};

const datosEjemplo: OrdenPedido[] = [
  {
    key: 1,
    idPedido: "OP-001",
    idCliente: "CL-01",
    idEmpleado: "EMP-01",
    fechaPedido: "2025-09-24",
    fechaEntrega: "2025-09-25",
    horaEntrega: "14:00",
    envio: true,
    cliente: "Juan Pérez",
    empleado: "Carlos Díaz"
  },
  {
    key: 2,
    idPedido: "OP-002",
    idCliente: "CL-02",
    idEmpleado: "EMP-02",
    fechaPedido: "2025-09-25",
    fechaEntrega: "2025-09-26",
    horaEntrega: "10:30",
    envio: false,
    cliente: "Ana López",
    empleado: "María Gómez"
  },
];

export default function OrdenPedidoVentas() {
  const [data, setData] = useState<OrdenPedido[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenPedido | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: OrdenPedido) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<OrdenPedido, "key">) => {
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
    { title: "ID Pedido", dataIndex: "idPedido" },
    { title: "ID Cliente", dataIndex: "idCliente" },
    { title: "ID Empleado", dataIndex: "idEmpleado" },
    { title: "Fecha de pedido", dataIndex: "fechaPedido" },
    { title: "Fecha de entrega", dataIndex: "fechaEntrega" },
    { title: "Hora de entrega", dataIndex: "horaEntrega" },
    { title: "Envío", dataIndex: "envio", render: (envio: boolean) => envio ? "Sí" : "No" },
    { title: "Cliente", dataIndex: "cliente" },
    { title: "Empleado", dataIndex: "empleado" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenPedido) => (
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
        <h2 style={{ margin: 0 }}>Órdenes de Pedido</h2>
        <Button type="primary" onClick={handleAdd}>Agregar orden de pedido</Button>
      </div>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar orden de pedido" : "Agregar orden de pedido"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Pedido" name="idPedido" rules={[{ required: true, message: "Ingrese el ID de pedido" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Empleado" name="idEmpleado" rules={[{ required: true, message: "Ingrese el ID de empleado" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha de pedido" name="fechaPedido" rules={[{ required: true, message: "Ingrese la fecha de pedido" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Fecha de entrega" name="fechaEntrega" rules={[{ required: true, message: "Ingrese la fecha de entrega" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Hora de entrega" name="horaEntrega" rules={[{ required: true, message: "Ingrese la hora de entrega" }]}> <Input type="time" /> </Form.Item>
          <Form.Item label="Envío" name="envio" rules={[{ required: true, message: "Seleccione si hay envío" }]}> <Input type="checkbox" /> </Form.Item>
          <Form.Item label="Cliente (Nombre)" name="cliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Empleado (Nombre)" name="empleado" rules={[{ required: true, message: "Ingrese el nombre del empleado" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
