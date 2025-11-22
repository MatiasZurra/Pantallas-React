import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
  const [productoItems, setProductoItems] = useState<ProductoRemito[]>([]);
  const [cantidadTotal, setCantidadTotal] = useState(0);

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

  useEffect(() => {
    const total = productoItems.reduce((acc, p) => acc + (p.cantidad || 0), 0);
    setCantidadTotal(total);
  }, [productoItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setProductoItems([]);
    setCantidadTotal(0);
    setModalOpen(true);
  };

  const handleEdit = (record: Remito) => {
    setEditing(record);
    form.setFieldsValue(record);
    setProductoItems(record.productos);
    setCantidadTotal(record.productos.reduce((acc,p)=>acc+p.cantidad,0));
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<Remito, "key" | "idRemito" | "productos">) => {
      if (productoItems.length === 0) {
        message.error("Debe agregar al menos un producto al remito");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, productos: productoItems } : item));
      } else {
        const newId = `R-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { ...values, key: Date.now(), idRemito: newId, productos: productoItems }]);
      }
      setModalOpen(false);
      setEditing(null);
      setProductoItems([]);
      setCantidadTotal(0);
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
    <div style={{width:'100%', padding: 24 }}>
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Remitos de Ventas</Title>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar remito..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar remito</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar remito" : "Agregar remito"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          {editing && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>ID Remito: </Typography.Text>
              <Typography.Text>{editing.idRemito}</Typography.Text>
            </div>
          )}
          <Form.Item label="ID Cliente" name="idCliente" rules={[{ required: true, message: "Ingrese el ID de cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Cliente" name="nombreCliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> <Input /> </Form.Item>
          <div style={{ marginBottom: 12 }}>
            <Typography.Text strong>Cantidad total: </Typography.Text>
            <Typography.Text>{cantidadTotal}</Typography.Text>
          </div>
        </Form>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Productos</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setProductoItems([...productoItems, { nombre: '', cantidad: 1 }])}
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
                width: '60%',
                render: (text: string, record: ProductoRemito, index: number) => (
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
                width: '30%',
                render: (value: number, record: ProductoRemito, index: number) => (
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
                title: '',
                width: '10%',
                render: (_: any, _record: ProductoRemito, index: number) => (
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
