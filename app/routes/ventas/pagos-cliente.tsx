import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

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
  const [productoItems, setProductoItems] = useState<ProductoPago[]>([]);
  const [total, setTotal] = useState(0);

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

  // recalcular total cuando cambian los productos
  useEffect(() => {
    const newTotal = productoItems.reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0);
    setTotal(newTotal);
  }, [productoItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setProductoItems([]);
    setTotal(0);
    setModalOpen(true);
  };

  const handleEdit = (record: PagoCliente) => {
    setEditing(record);
    form.setFieldsValue(record);
    setProductoItems(record.productos);
    setTotal(record.monto);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<PagoCliente, "key" | "idPago" | "productos" | "monto">) => {
      if (productoItems.length === 0) {
        message.error("Debe agregar al menos un producto al pago");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, productos: productoItems, monto: total } : item));
      } else {
        const newId = `PG-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { ...values, key: Date.now(), idPago: newId, productos: productoItems, monto: total }]);
      }
      setModalOpen(false);
      setEditing(null);
      setProductoItems([]);
      setTotal(0);
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
          {editing && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>ID Pago: </Typography.Text>
              <Typography.Text>{editing.idPago}</Typography.Text>
            </div>
          )}
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <div style={{ marginBottom: 12 }}>
            <Typography.Text strong>Monto: </Typography.Text>
            <Typography.Text>${total.toLocaleString()}</Typography.Text>
          </div>
        </Form>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Productos pagados</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setProductoItems([...productoItems, { nombre: '', cantidad: 1, precioUnitario: 0 }])}
            >
              Agregar Producto
            </Button>
          </div>
          <Table
            dataSource={productoItems}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
            columns={[
              { 
                title: 'Producto', 
                dataIndex: 'nombre',
                width: '40%',
                render: (text: string, record: ProductoPago, index: number) => (
                  <Input
                    value={text}
                    onChange={(e) => {
                      const newItems = [...productoItems];
                      newItems[index] = { ...record, nombre: e.target.value };
                      setProductoItems(newItems);
                    }}
                  />
                )
              },
              { 
                title: 'Cantidad', 
                dataIndex: 'cantidad',
                width: '25%',
                render: (value: number, record: ProductoPago, index: number) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(value) => {
                      const newItems = [...productoItems];
                      newItems[index] = { ...record, cantidad: value || 1 };
                      setProductoItems(newItems);
                    }}
                  />
                )
              },
              { 
                title: 'Precio Unitario', 
                dataIndex: 'precioUnitario',
                width: '25%',
                render: (value: number, record: ProductoPago, index: number) => (
                  <InputNumber
                    min={0}
                    value={value}
                    onChange={(value) => {
                      const newItems = [...productoItems];
                      newItems[index] = { ...record, precioUnitario: value || 0 };
                      setProductoItems(newItems);
                    }}
                    prefix="$"
                  />
                )
              },
              {
                title: '',
                width: '10%',
                render: (_: any, _record: ProductoPago, index: number) => (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newItems = [...productoItems];
                      newItems.splice(index, 1);
                      setProductoItems(newItems);
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
