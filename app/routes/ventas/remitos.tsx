import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type ProductoRemito = {
  nombre: string;
  cantidad: number;
};

type Remito = {
  key: number;
  idRemito: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  productos: ProductoRemito[];
};

const datosEjemplo: Remito[] = [
  {
    key: 1,
    idRemito: "R-001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    productos: [
      { nombre: "Producto A", cantidad: 2 },
      { nombre: "Producto B", cantidad: 1 },
    ],
  },
  {
    key: 2,
    idRemito: "R-002",
    idCliente: "CL-02",
    fecha: "2025-09-25",
    nombreCliente: "Ana López",
    productos: [
      { nombre: "Producto C", cantidad: 3 },
      { nombre: "Producto D", cantidad: 2 },
    ],
  },
];

export default function RemitosVentas() {
  const [data, setData] = useState<Remito[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Remito | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<Remito | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(remito => {
    const searchLower = search.toLowerCase();
    return (
      remito.idRemito.toLowerCase().includes(searchLower) ||
      remito.idCliente.toLowerCase().includes(searchLower) ||
      remito.fecha.toLowerCase().includes(searchLower) ||
      remito.nombreCliente.toLowerCase().includes(searchLower) ||
      remito.productos.some(prod => prod.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Remito) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<Remito, "key">) => {
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
    { title: "ID Remito", dataIndex: "idRemito" },
    { title: "ID Cliente", dataIndex: "idCliente" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Cliente", dataIndex: "nombreCliente" },
    {
      title: "Cantidad",
      key: "cantidad",
      render: (_: any, record: Remito) => record.productos.reduce((acc, prod) => acc + prod.cantidad, 0),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Remito) => (
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
        <h2 style={{ margin: 0 }}>Remitos</h2>
        <Button type="primary" onClick={handleAdd}>Agregar remito</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar remito..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar remito" : "Agregar remito"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Remito" name="idRemito" rules={[{ required: true, message: "Ingrese el ID de remito" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Cantidad" name="total" rules={[{ required: true, message: "Ingrese el total" }]}> <Input type="number" /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de remito"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Remito:</b> {detalle.idRemito}</p>
            <p><b>ID Cliente:</b> {detalle.idCliente}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Cliente:</b> {detalle.nombreCliente}</p>
            <b>Productos:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Producto</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalle.productos.map((prod, idx) => (
                  <tr key={idx}>
                    <td>{prod.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{prod.cantidad}</td>
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
