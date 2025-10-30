import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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

  const [detalleItems, setDetalleItems] = useState<DetalleComprobante[]>([]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setDetalleItems([]);
    setModalOpen(true);
  };

  const handleEdit = (record: ComprobanteVenta) => {
    setEditing(record);
    form.setFieldsValue(record);
    setDetalleItems(record.detalle);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<ComprobanteVenta, "key" | "idComprobante">) => {
      if (detalleItems.length === 0) {
        message.error("Debe agregar al menos un producto al comprobante");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, detalle: detalleItems } : item));
      } else {
        // Generar un nuevo ID de comprobante (simulado)
        const newId = `CV-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { 
          ...values, 
          key: Date.now(), 
          idComprobante: newId,
          detalle: detalleItems 
        }]);
      }
      setModalOpen(false);
      setEditing(null);
      setDetalleItems([]);
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
        <Title level={2}>Comprobantes de Venta</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar comprobante..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Nuevo Comprobante</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} rowKey="key" bordered />
      <Modal
        open={modalOpen}
        title={editing ? "Editar Comprobante" : "Nuevo Comprobante"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          {editing && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>ID Comprobante: </Typography.Text>
              <Typography.Text>{editing.idComprobante}</Typography.Text>
            </div>
          )}
          <Form.Item label="Tipo" name="tipo" rules={[{ required: true, message: "Ingrese el tipo" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="cliente" rules={[{ required: true, message: "Ingrese el cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Empleado" name="empleado" rules={[{ required: true, message: "Ingrese el empleado" }]}> <Input /> </Form.Item>
        </Form>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Detalle del Comprobante</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setDetalleItems([...detalleItems, { producto: '', cantidad: 1, precioUnitario: 0 }])}
            >
              Agregar Producto
            </Button>
          </div>
          <Table
            dataSource={detalleItems}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
            columns={[
              { 
                title: 'Producto', 
                dataIndex: 'producto',
                width: '40%',
                render: (text: string, record: DetalleComprobante, index: number) => (
                  <Input
                    value={text}
                    onChange={(e) => {
                      const newDetalle = [...detalleItems];
                      newDetalle[index] = { ...record, producto: e.target.value };
                      setDetalleItems(newDetalle);
                    }}
                  />
                )
              },
              { 
                title: 'Cantidad', 
                dataIndex: 'cantidad',
                width: '25%',
                render: (value: number, record: DetalleComprobante, index: number) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(value) => {
                      const newDetalle = [...detalleItems];
                      newDetalle[index] = { ...record, cantidad: value || 1 };
                      setDetalleItems(newDetalle);
                    }}
                  />
                )
              },
              { 
                title: 'Precio Unitario', 
                dataIndex: 'precioUnitario',
                width: '25%',
                render: (value: number, record: DetalleComprobante, index: number) => (
                  <InputNumber
                    min={0}
                    value={value}
                    onChange={(value) => {
                      const newDetalle = [...detalleItems];
                      newDetalle[index] = { ...record, precioUnitario: value || 0 };
                      setDetalleItems(newDetalle);
                    }}
                    prefix="$"
                  />
                )
              },
              {
                title: '',
                width: '10%',
                render: (_: any, _record: DetalleComprobante, index: number) => (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newDetalle = [...detalleItems];
                      newDetalle.splice(index, 1);
                      setDetalleItems(newDetalle);
                    }}
                  />
                )
              }
            ]}
          />
        </div>
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


