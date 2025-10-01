import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type Comprobante = {
  key: number;
  idComprobanteVenta: string;
  idTipoComprobante: string;
  idOrdenPedido: string;
  idCliente: string;
  fecha: string;
  nombreCliente: string;
  total: number;
};

const datosEjemplo: Comprobante[] = [
  {
    key: 1,
    idComprobanteVenta: "CV-001",
    idTipoComprobante: "TC-01",
    idOrdenPedido: "OP-1001",
    idCliente: "CL-01",
    fecha: "2025-09-24",
    nombreCliente: "Juan Pérez",
    total: 15000
  },
  {
    key: 2,
    idComprobanteVenta: "CV-002",
    idTipoComprobante: "TC-02",
    idOrdenPedido: "OP-1002",
    idCliente: "CL-02",
    fecha: "2025-09-24",
    nombreCliente: "Ana López",
    total: 20000
  },
];

export default function ComprobantesVentas() {
  const [data, setData] = useState<Comprobante[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Comprobante | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(comprobante => {
    const searchLower = search.toLowerCase();
    return (
      comprobante.idComprobanteVenta.toLowerCase().includes(searchLower) ||
      comprobante.idTipoComprobante.toLowerCase().includes(searchLower) ||
      comprobante.idOrdenPedido.toLowerCase().includes(searchLower) ||
      comprobante.idCliente.toLowerCase().includes(searchLower) ||
      comprobante.fecha.toLowerCase().includes(searchLower) ||
      comprobante.nombreCliente.toLowerCase().includes(searchLower) ||
      String(comprobante.total).includes(searchLower)
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: Comprobante) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<Comprobante, "key">) => {
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
    { title: "ID Comprobante Venta", dataIndex: "idComprobanteVenta" },
    { title: "ID Tipo Comprobante", dataIndex: "idTipoComprobante" },
    { title: "ID Orden Pedido", dataIndex: "idOrdenPedido" },
    { title: "ID Cliente", dataIndex: "idCliente" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Cliente", dataIndex: "nombreCliente" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Comprobante) => (
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
        <h2 style={{ margin: 0 }}>Comprobantes</h2>
        <Button type="primary" onClick={handleAdd}>Agregar comprobante</Button>
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
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar comprobante" : "Agregar comprobante"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Comprobante Venta" name="idComprobanteVenta" rules={[{ required: true, message: "Ingrese el ID de comprobante de venta" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Tipo Comprobante" name="idTipoComprobante" rules={[{ required: true, message: "Ingrese el ID de tipo de comprobante" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Orden Pedido" name="idOrdenPedido" rules={[{ required: true, message: "Ingrese el ID de orden de pedido" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Total" name="total" rules={[{ required: true, message: "Ingrese el total" }]}> <Input type="number" /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
