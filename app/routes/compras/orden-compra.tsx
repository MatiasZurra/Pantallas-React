import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type MateriaPrima = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type OrdenCompra = {
  key: number;
  idOrden: string;
  idProveedor: string;
  nombreProveedor: string;
  fecha: string;
  total: number;
  materiasPrimas: MateriaPrima[];
};

const datosEjemplo: OrdenCompra[] = [
  {
    key: 1,
    idOrden: "OC-001",
    idProveedor: "PR-01",
    nombreProveedor: "Proveedor Uno",
    fecha: "2025-09-24",
    total: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 5, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 3, precioUnitario: 1000 },
    ],
  },
  {
    key: 2,
    idOrden: "OC-002",
    idProveedor: "PR-02",
    nombreProveedor: "Proveedor Dos",
    fecha: "2025-09-25",
    total: 8000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 10, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 2, precioUnitario: 3000 },
    ],
  },
];

export default function OrdenCompraCompras() {
  const [data, setData] = useState<OrdenCompra[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenCompra | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenCompra | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(orden => {
    const searchLower = search.toLowerCase();
    return (
      orden.idOrden.toLowerCase().includes(searchLower) ||
      orden.idProveedor.toLowerCase().includes(searchLower) ||
      orden.nombreProveedor.toLowerCase().includes(searchLower) ||
      orden.fecha.toLowerCase().includes(searchLower) ||
      orden.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: OrdenCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<OrdenCompra, "key" | "materiasPrimas" | "total">) => {
      const materiasPrimas = editing ? editing.materiasPrimas : [];
      const total = materiasPrimas.reduce((acc, mat) => acc + mat.cantidad * mat.precioUnitario, 0);
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas, total } : item));
      } else {
        setData([...data, { ...values, materiasPrimas, total, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Orden", dataIndex: "idOrden" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenCompra) => (
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
        <h2 style={{ margin: 0 }}>
3rdenes de Compra</h2>
        <Button type="primary" onClick={handleAdd}>Agregar orden de compra</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar orden de compra..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar orden de compra" : "Agregar orden de compra"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Orden" name="idOrden" rules={[{ required: true, message: "Ingrese el ID de orden" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Total" name="total" rules={[{ required: true, message: "Ingrese el total" }]}> <Input type="number" disabled /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de orden de compra"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Orden:</b> {detalle.idOrden}</p>
            <p><b>ID Proveedor:</b> {detalle.idProveedor}</p>
            <p><b>Proveedor:</b> {detalle.nombreProveedor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Total:</b> {detalle.total}</p>
            <b>Materia prima:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Nombre</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Cantidad</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Precio unitario</th>
                </tr>
              </thead>
              <tbody>
                {detalle.materiasPrimas.map((mat, idx) => (
                  <tr key={idx}>
                    <td>{mat.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{mat.cantidad}</td>
                    <td style={{ textAlign: 'right' }}>${mat.precioUnitario}</td>
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
