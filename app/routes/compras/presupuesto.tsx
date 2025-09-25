
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type MateriaPrimaPresupuesto = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type PresupuestoCompra = {
  key: number;
  idPresupuesto: string;
  idProveedor: string;
  fecha: string;
  nombreProveedor: string;
  total: number;
  materiasPrimas: MateriaPrimaPresupuesto[];
};

const datosEjemplo: PresupuestoCompra[] = [
  {
    key: 1,
    idPresupuesto: "PB-001",
    idProveedor: "PR-01",
    fecha: "2025-09-24",
    nombreProveedor: "Proveedor Uno",
    total: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 10, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 5, precioUnitario: 800 },
    ],
  },
  {
    key: 2,
    idPresupuesto: "PB-002",
    idProveedor: "PR-02",
    fecha: "2025-09-25",
    nombreProveedor: "Proveedor Dos",
    total: 10000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 20, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 3, precioUnitario: 2000 },
    ],
  },
];

export default function PresupuestoCompras() {
  const [data, setData] = useState<PresupuestoCompra[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PresupuestoCompra | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<PresupuestoCompra | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: PresupuestoCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<PresupuestoCompra, "key" | "materiasPrimas" | "total">) => {
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
    { title: "ID Presupuesto", dataIndex: "idPresupuesto" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: PresupuestoCompra) => (
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
        <h2 style={{ margin: 0 }}>Presupuestos de compras</h2>
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
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
            <p><b>ID Proveedor:</b> {detalle.idProveedor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Proveedor:</b> {detalle.nombreProveedor}</p>
            <p><b>Total:</b> {detalle.total}</p>
            <b>Materia prima presupuestada:</b>
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
