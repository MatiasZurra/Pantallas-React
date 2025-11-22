import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography } from "antd";

const { Title } = Typography;
type ProductoPresupuesto = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type Presupuesto = {
  key: number;
  idPresupuesto: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  total: number;
  productos: ProductoPresupuesto[];
};

const datosEjemplo: Presupuesto[] = [
  {
    key: 1,
    idPresupuesto: "P-001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    total: 12000,
    productos: [
      { nombre: "Producto A", cantidad: 2, precioUnitario: 3000 },
      { nombre: "Producto B", cantidad: 1, precioUnitario: 6000 },
    ],
  },
  {
    key: 2,
    idPresupuesto: "P-002",
    idCliente: "CL-02",
    fecha: "2025-09-25",
    nombreCliente: "Ana López",
    total: 18000,
    productos: [
      { nombre: "Producto C", cantidad: 3, precioUnitario: 4000 },
      { nombre: "Producto D", cantidad: 2, precioUnitario: 3000 },
    ],
  },
];


export default function PresupuestoVentas() {
  const [data, setData] = useState<Presupuesto[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Presupuesto | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<Presupuesto | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(presupuesto => {
    const searchLower = search.toLowerCase();
    return (
      presupuesto.idPresupuesto.toLowerCase().includes(searchLower) ||
      presupuesto.idCliente.toLowerCase().includes(searchLower) ||
      presupuesto.fecha.toLowerCase().includes(searchLower) ||
      presupuesto.nombreCliente.toLowerCase().includes(searchLower) ||
      String(presupuesto.total).includes(searchLower) ||
      presupuesto.productos.some(prod => prod.nombre.toLowerCase().includes(searchLower))
    );
  });

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
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, width: '100%'}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Presupuestos de Ventas</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar presupuesto..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar presupuesto</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
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
      <Modal
        open={detalleOpen}
        title="Detalle de presupuesto"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Presupuesto:</b> {detalle.idPresupuesto}</p>
            <p><b>ID Cliente:</b> {detalle.idCliente}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Cliente:</b> {detalle.nombreCliente}</p>
            <p><b>Total:</b> {detalle.total}</p>
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
