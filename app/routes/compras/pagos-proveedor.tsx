
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography } from "antd";

const { Title } = Typography;
type MateriaPrimaPago = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type PagoProveedor = {
  key: number;
  idPago: string;
  idProveedor: string;
  fecha: string;
  nombreProveedor: string;
  monto: number;
  materiasPrimas: MateriaPrimaPago[];
};

const datosEjemplo: PagoProveedor[] = [
  {
    key: 1,
    idPago: "PGP-001",
    idProveedor: "PR-01",
    fecha: "2025-09-24",
    nombreProveedor: "Proveedor Uno",
    monto: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 10, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 5, precioUnitario: 800 },
    ],
  },
  {
    key: 2,
    idPago: "PGP-002",
    idProveedor: "PR-02",
    fecha: "2025-09-25",
    nombreProveedor: "Proveedor Dos",
    monto: 10000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 20, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 3, precioUnitario: 2000 },
    ],
  },
];

export default function PagosProveedorCompras() {
  const [data, setData] = useState<PagoProveedor[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PagoProveedor | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<PagoProveedor | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(pago => {
    const searchLower = search.toLowerCase();
    return (
      pago.idPago.toLowerCase().includes(searchLower) ||
      pago.idProveedor.toLowerCase().includes(searchLower) ||
      pago.nombreProveedor.toLowerCase().includes(searchLower) ||
      pago.fecha.toLowerCase().includes(searchLower) ||
      pago.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: PagoProveedor) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<PagoProveedor, "key" | "materiasPrimas" | "monto">) => {
      const materiasPrimas = editing ? editing.materiasPrimas : [];
      const monto = materiasPrimas.reduce((acc, mat) => acc + mat.cantidad * mat.precioUnitario, 0);
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas, monto } : item));
      } else {
        setData([...data, { ...values, materiasPrimas, monto, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Pago", dataIndex: "idPago" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Monto", dataIndex: "monto" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: PagoProveedor) => (
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
        <Title level={2}>Pagos a Proveedores</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar pago..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar pago</Button>
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
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
            <p><b>ID Proveedor:</b> {detalle.idProveedor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Proveedor:</b> {detalle.nombreProveedor}</p>
            <p><b>Monto:</b> {detalle.monto}</p>
            <b>Materia prima pagada:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Materia prima</th>
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
