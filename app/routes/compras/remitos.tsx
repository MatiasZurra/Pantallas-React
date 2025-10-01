
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type MateriaPrimaRemito = {
  nombre: string;
  cantidad: number;
};

type RemitoCompra = {
  key: number;
  idRemito: string;
  idProveedor: string;
  fecha: string;
  nombreProveedor: string;
  materiasPrimas: MateriaPrimaRemito[];
};

const datosEjemplo: RemitoCompra[] = [
  {
    key: 1,
    idRemito: "RC-001",
    idProveedor: "PR-01",
    fecha: "2025-09-24",
    nombreProveedor: "Proveedor Uno",
    materiasPrimas: [
      { nombre: "Harina", cantidad: 10 },
      { nombre: "Azúcar", cantidad: 5 },
    ],
  },
  {
    key: 2,
    idRemito: "RC-002",
    idProveedor: "PR-02",
    fecha: "2025-09-25",
    nombreProveedor: "Proveedor Dos",
    materiasPrimas: [
      { nombre: "Sal", cantidad: 20 },
      { nombre: "Aceite", cantidad: 3 },
    ],
  },
];

export default function RemitosCompras() {
  const [data, setData] = useState<RemitoCompra[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RemitoCompra | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<RemitoCompra | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(remito => {
    const searchLower = search.toLowerCase();
    return (
      remito.idRemito.toLowerCase().includes(searchLower) ||
      remito.idProveedor.toLowerCase().includes(searchLower) ||
      remito.fecha.toLowerCase().includes(searchLower) ||
      remito.nombreProveedor.toLowerCase().includes(searchLower) ||
      remito.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: RemitoCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<RemitoCompra, "key" | "materiasPrimas">) => {
      const materiasPrimas = editing ? editing.materiasPrimas : [];
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas } : item));
      } else {
        setData([...data, { ...values, materiasPrimas, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Remito", dataIndex: "idRemito" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: RemitoCompra) => (
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
        <h2 style={{ margin: 0 }}>Remitos de compras</h2>
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
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
            <p><b>ID Proveedor:</b> {detalle.idProveedor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Proveedor:</b> {detalle.nombreProveedor}</p>
            <b>Materia prima entregada:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Materia prima</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalle.materiasPrimas.map((mat, idx) => (
                  <tr key={idx}>
                    <td>{mat.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{mat.cantidad}</td>
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
