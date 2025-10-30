import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message, Switch } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

type ProductoPedido = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type OrdenPedido = {
  key: number;
  idPedido: string;
  idCliente: string;
  idEmpleado: string;
  fechaPedido: string;
  fechaEntrega: string;
  horaEntrega: string;
  envio: boolean;
  cliente: string;
  empleado: string;
  productos: ProductoPedido[];
};

const datosEjemplo: OrdenPedido[] = [
  {
    key: 1,
    idPedido: "OP-001",
    idCliente: "CL-01",
    idEmpleado: "EMP-01",
    fechaPedido: "2025-09-24",
    fechaEntrega: "2025-09-25",
    horaEntrega: "14:00",
    envio: true,
    cliente: "Juan Pérez",
    empleado: "Carlos Díaz",
    productos: [
      { nombre: "Producto X", cantidad: 2, precioUnitario: 2000 },
      { nombre: "Producto Y", cantidad: 1, precioUnitario: 5000 },
    ],
  },
  {
    key: 2,
    idPedido: "OP-002",
    idCliente: "CL-02",
    idEmpleado: "EMP-02",
    fechaPedido: "2025-09-25",
    fechaEntrega: "2025-09-26",
    horaEntrega: "10:30",
    envio: false,
    cliente: "Ana López",
    empleado: "María Gómez",
    productos: [
      { nombre: "Producto Z", cantidad: 3, precioUnitario: 1500 },
      { nombre: "Producto W", cantidad: 2, precioUnitario: 2500 },
    ],
  },
];


export default function OrdenPedidoVentas() {
  const [data, setData] = useState<OrdenPedido[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenPedido | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenPedido | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [productoItems, setProductoItems] = useState<ProductoPedido[]>([]);

  const filteredData = data.filter(pedido => {
    const searchLower = search.toLowerCase();
    return (
      pedido.idPedido.toLowerCase().includes(searchLower) ||
      pedido.idCliente.toLowerCase().includes(searchLower) ||
      pedido.idEmpleado.toLowerCase().includes(searchLower) ||
      pedido.fechaPedido.toLowerCase().includes(searchLower) ||
      pedido.fechaEntrega.toLowerCase().includes(searchLower) ||
      pedido.horaEntrega.toLowerCase().includes(searchLower) ||
      (pedido.envio ? "sí" : "no").includes(searchLower) ||
      pedido.cliente.toLowerCase().includes(searchLower) ||
      pedido.empleado.toLowerCase().includes(searchLower) ||
      pedido.productos.some(prod => prod.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setProductoItems([]);
    setModalOpen(true);
  };

  const handleEdit = (record: OrdenPedido) => {
    setEditing(record);
    form.setFieldsValue(record);
    setProductoItems(record.productos);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<OrdenPedido, "key" | "idPedido" | "productos">) => {
      if (productoItems.length === 0) {
        message.error("Debe agregar al menos un producto al pedido");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, productos: productoItems } : item));
      } else {
        // Generar un nuevo ID de pedido (simulado)
        const newId = `OP-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { 
          ...values, 
          key: Date.now(), 
          idPedido: newId,
          productos: productoItems 
        }]);
      }
      setModalOpen(false);
      setEditing(null);
      setProductoItems([]);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Pedido", dataIndex: "idPedido" },
    { title: "Cliente", dataIndex: "cliente" },
    { title: "Empleado", dataIndex: "empleado" },
    { title: "Fecha Pedido", dataIndex: "fechaPedido" },
    { title: "Fecha Entrega", dataIndex: "fechaEntrega" },
    { title: "Hora Entrega", dataIndex: "horaEntrega" },
    { title: "Envío", dataIndex: "envio", render: (v: boolean) => v ? "Sí" : "No" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenPedido) => (
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
        <Title level={2}>Órdenes de Pedido</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar orden de pedido..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar Orden de Pedido</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 8 }} rowKey="key" bordered />
      <Modal
        open={modalOpen}
        title={editing ? "Editar Orden de Pedido" : "Nueva Orden de Pedido"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          {editing && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>ID Pedido: </Typography.Text>
              <Typography.Text>{editing.idPedido}</Typography.Text>
            </div>
          )}
          <Form.Item label="Cliente" name="cliente" rules={[{ required: true, message: "Ingrese el cliente" }]}> <Input /> </Form.Item>
          <Form.Item label="Empleado" name="empleado" rules={[{ required: true, message: "Ingrese el empleado" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha Pedido" name="fechaPedido" rules={[{ required: true, message: "Ingrese la fecha de pedido" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Fecha Entrega" name="fechaEntrega" rules={[{ required: true, message: "Ingrese la fecha de entrega" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Hora Entrega" name="horaEntrega" rules={[{ required: true, message: "Ingrese la hora de entrega" }]}> <Input type="time" /> </Form.Item>
          <Form.Item label="Envío" name="envio" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Productos del Pedido</Title>
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
                render: (text: string, record: ProductoPedido, index: number) => (
                  <Input
                    value={text}
                    onChange={(e) => {
                      const newDetalle = [...productoItems];
                      newDetalle[index] = { ...record, nombre: e.target.value };
                      setProductoItems(newDetalle);
                    }}
                  />
                )
              },
              { 
                title: 'Cantidad', 
                dataIndex: 'cantidad',
                width: '25%',
                render: (value: number, record: ProductoPedido, index: number) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(value) => {
                      const newDetalle = [...productoItems];
                      newDetalle[index] = { ...record, cantidad: value || 1 };
                      setProductoItems(newDetalle);
                    }}
                  />
                )
              },
              { 
                title: 'Precio Unitario', 
                dataIndex: 'precioUnitario',
                width: '25%',
                render: (value: number, record: ProductoPedido, index: number) => (
                  <InputNumber
                    min={0}
                    value={value}
                    onChange={(value) => {
                      const newDetalle = [...productoItems];
                      newDetalle[index] = { ...record, precioUnitario: value || 0 };
                      setProductoItems(newDetalle);
                    }}
                    prefix="$"
                  />
                )
              },
              {
                title: '',
                width: '10%',
                render: (_: any, _record: ProductoPedido, index: number) => (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newDetalle = [...productoItems];
                      newDetalle.splice(index, 1);
                      setProductoItems(newDetalle);
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
        title="Detalle de Orden de Pedido"
        onCancel={() => setDetalleOpen(false)}
        footer={null}
      >
        {detalle && (
          <>
            <p><b>ID Pedido:</b> {detalle.idPedido}</p>
            <p><b>Cliente:</b> {detalle.cliente}</p>
            <p><b>Empleado:</b> {detalle.empleado}</p>
            <p><b>Fecha Pedido:</b> {detalle.fechaPedido}</p>
            <p><b>Fecha Entrega:</b> {detalle.fechaEntrega}</p>
            <p><b>Hora Entrega:</b> {detalle.horaEntrega}</p>
            <p><b>Envío:</b> {detalle.envio ? "Sí" : "No"}</p>
            <b>Productos:</b>
            <Table
              columns={[
                { title: "Nombre", dataIndex: "nombre" },
                { title: "Cantidad", dataIndex: "cantidad" },
                { title: "Precio Unitario", dataIndex: "precioUnitario" },
              ]}
              dataSource={detalle.productos}
              pagination={false}
              size="small"
              rowKey="nombre"
              style={{ marginTop: 8 }}
            />
          </>
        )}
      </Modal>
    </div>
  );
}

