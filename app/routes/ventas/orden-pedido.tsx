import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type ProductoPedido = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

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
  productos: ProductoPedido[];
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
    empleado: "Carlos Díaz",
    productos: [
      { nombre: "Producto X", cantidad: 2, precioUnitario: 2000 },
      { nombre: "Producto Y", cantidad: 1, precioUnitario: 5000 },
    ],
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
    empleado: "María Gómez",
    productos: [
      { nombre: "Producto Z", cantidad: 3, precioUnitario: 1500 },
      { nombre: "Producto W", cantidad: 2, precioUnitario: 2500 },
    ],
  },
];

export default function OrdenPedidoVentas() {
  const [data, setData] = useState<OrdenPedido[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenPedido | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenPedido | null>(null);
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
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
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
      <Modal
        open={detalleOpen}
        title="Detalle de orden de pedido"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Pedido:</b> {detalle.idPedido}</p>
            <p><b>ID Cliente:</b> {detalle.idCliente}</p>
            <p><b>ID Empleado:</b> {detalle.idEmpleado}</p>
            <p><b>Fecha de pedido:</b> {detalle.fechaPedido}</p>
            <p><b>Fecha de entrega:</b> {detalle.fechaEntrega}</p>
            <p><b>Hora de entrega:</b> {detalle.horaEntrega}</p>
            <p><b>Envío:</b> {detalle.envio ? 'Sí' : 'No'}</p>
            <p><b>Cliente:</b> {detalle.cliente}</p>
            <p><b>Empleado:</b> {detalle.empleado}</p>
            <b>Productos:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Producto</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Cantidad</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Precio unitario</th>
                </tr>
              </thead>
              <tbody>
                {detalle.productos.map((prod, idx) => (
                  <tr key={idx}>
                    <td>{prod.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{prod.cantidad}</td>
                    <td style={{ textAlign: 'right' }}>${prod.precioUnitario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
