import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography } from "antd";

const { Title } = Typography;

type ProductoPago = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type PagoCliente = {
  key: number;
  idPago: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  monto: number;
  productos: ProductoPago[];
};

const datosEjemplo: PagoCliente[] = [
  {
    key: 1,
    idPago: "PG-001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    monto: 5000,
    productos: [
      { nombre: "Producto A", cantidad: 2, precioUnitario: 1000 },
      { nombre: "Producto B", cantidad: 1, precioUnitario: 3000 },
    ],
  },
  {
    key: 2,
    idPago: "PG-002",
    idCliente: "CL-02",
    fecha: "2025-09-25",
    nombreCliente: "Ana López",
    monto: 7000,
    productos: [
      { nombre: "Producto C", cantidad: 3, precioUnitario: 2000 },
      { nombre: "Producto D", cantidad: 1, precioUnitario: 1000 },
    ],
  },
];

export default function PagosClienteVentas() {
  const [data, setData] = useState<PagoCliente[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PagoCliente | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<PagoCliente | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(pago => {
    const searchLower = search.toLowerCase();
    return (
      pago.idPago.toLowerCase().includes(searchLower) ||
      pago.idCliente.toLowerCase().includes(searchLower) ||
      pago.fecha.toLowerCase().includes(searchLower) ||
      pago.nombreCliente.toLowerCase().includes(searchLower) ||
      String(pago.monto).includes(searchLower) ||
      pago.productos.some(prod => prod.nombre.toLowerCase().includes(searchLower))
    );
  });

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
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Pagos de Clientes</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar pago..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar pago del cliente</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
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
      <Modal
        open={detalleOpen}
        title="Detalle de pago"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Pago:</b> {detalle.idPago}</p>
            <p><b>ID Cliente:</b> {detalle.idCliente}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Cliente:</b> {detalle.nombreCliente}</p>
            <p><b>Monto:</b> {detalle.monto}</p>
            <b>Productos pagados:</b>
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
