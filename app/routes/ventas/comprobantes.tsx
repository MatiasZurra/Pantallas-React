import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type DetalleComprobante = {
  producto: string;
  cantidad: number;
  precioUnitario: number;
};

type ComprobanteVenta = {
  key: number;
  idComprobante: string;
  tipo: string;
  fecha: string;
  cliente: string;
  empleado: string;
  detalle: DetalleComprobante[];
};

const datosEjemplo: ComprobanteVenta[] = [
  {
    key: 1,
    idComprobante: "CV-001",
    tipo: "Factura A",
    fecha: "2025-09-24",
    cliente: "Juan Pérez",
    empleado: "Carlos Díaz",
    detalle: [
      { producto: "Producto X", cantidad: 2, precioUnitario: 2000 },
      { producto: "Producto Y", cantidad: 1, precioUnitario: 5000 },
    ],
  },
  {
    key: 2,
    idComprobante: "CV-002",
    tipo: "Factura B",
    fecha: "2025-09-25",
    cliente: "Ana López",
    empleado: "María Gómez",
    detalle: [
      { producto: "Producto Z", cantidad: 3, precioUnitario: 1500 },
      { producto: "Producto W", cantidad: 2, precioUnitario: 2500 },
    ],
  },
];

export default function ComprobantesVentas() {
  const [data, setData] = useState<ComprobanteVenta[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComprobanteVenta | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<ComprobanteVenta | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(comp => {
    const searchLower = search.toLowerCase();
    return (
      comp.idComprobante.toLowerCase().includes(searchLower) ||
      comp.tipo.toLowerCase().includes(searchLower) ||
      comp.fecha.toLowerCase().includes(searchLower) ||
      comp.cliente.toLowerCase().includes(searchLower) ||
      comp.empleado.toLowerCase().includes(searchLower) ||
      comp.detalle.some(det => det.producto.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: ComprobanteVenta) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<ComprobanteVenta, "key">) => {
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values } : item));
      } else {
        setData([...data, { ...values, key: Date.now(), detalle: [] }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Comprobante", dataIndex: "idComprobante", width: 160 },
    { title: "Tipo", dataIndex: "tipo", width: 120 },
    { title: "Fecha", dataIndex: "fecha", width: 120 },
    { title: "Cliente", dataIndex: "cliente", width: 200 },
    { title: "Empleado", dataIndex: "empleado", width: 200 },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: ComprobanteVenta) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Comprobantes de Venta</h2>
        <Button type="primary" onClick={handleAdd}>Nuevo Comprobante</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar comprobante..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} rowKey="key" bordered />
      <Modal
        open={modalOpen}
        title={editing ? "Editar Comprobante" : "Nuevo Comprobante"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Comprobante" name="idComprobante" rules={[{ required: true, message: "Ingrese el ID de comprobante" }]}> <Input /> </Form.Item>
          <Form.Item label="Tipo" name="tipo" rules={[{ required: true, message: "Ingrese el tipo" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="cliente" rules={[{ required: true, message: "Ingrese el cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Empleado" name="empleado" rules={[{ required: true, message: "Ingrese el empleado" }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de Comprobante"
        onCancel={() => setDetalleOpen(false)}
        footer={null}
      >
        {detalle && (
          <>
            <p><b>ID Comprobante:</b> {detalle.idComprobante}</p>
            <p><b>Tipo:</b> {detalle.tipo}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Cliente:</b> {detalle.cliente}</p>
            <p><b>Empleado:</b> {detalle.empleado}</p>
            <b>Detalle:</b>
            <Table
              columns={[
                { title: "Producto", dataIndex: "producto" },
                { title: "Cantidad", dataIndex: "cantidad" },
                { title: "Precio Unitario", dataIndex: "precioUnitario" },
              ]}
              dataSource={detalle.detalle}
              pagination={false}
              size="small"
              rowKey="producto"
              style={{ marginTop: 8 }}
            />
          </>
        )}
      </Modal>
    </div>

  );
}


