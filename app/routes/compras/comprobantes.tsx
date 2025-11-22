import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

type MateriaPrima = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type ComprobanteCompra = {
  key: number;
  idComprobante: string;
  idProveedor: string;
  nombreProveedor: string;
  fecha: string;
  total: number;
  materiasPrimas: MateriaPrima[];
};

const datosEjemplo: ComprobanteCompra[] = [
  {
    key: 1,
    idComprobante: "CC-001",
    idProveedor: "PR-01",
    nombreProveedor: "Proveedor Uno",
    fecha: "2025-09-24",
    total: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 10, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 5, precioUnitario: 800 },
    ],
  },
  {
    key: 2,
    idComprobante: "CC-002",
    idProveedor: "PR-02",
    nombreProveedor: "Proveedor Dos",
    fecha: "2025-09-25",
    total: 10000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 20, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 3, precioUnitario: 2000 },
    ],
  },
];

export default function ComprobantesCompras() {
  const [data, setData] = useState<ComprobanteCompra[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ComprobanteCompra | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<ComprobanteCompra | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [materiasItems, setMateriasItems] = useState<MateriaPrima[]>([]);
  const [total, setTotal] = useState(0);

  const filteredData = data.filter(comprobante => {
    const searchLower = search.toLowerCase();
    return (
      comprobante.idComprobante.toLowerCase().includes(searchLower) ||
      comprobante.idProveedor.toLowerCase().includes(searchLower) ||
      comprobante.nombreProveedor.toLowerCase().includes(searchLower) ||
      comprobante.fecha.toLowerCase().includes(searchLower) ||
      comprobante.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    const newTotal = materiasItems.reduce((acc, m) => acc + (m.cantidad * m.precioUnitario), 0);
    setTotal(newTotal);
  }, [materiasItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setMateriasItems([]);
    setTotal(0);
    setModalOpen(true);
  };

  const handleEdit = (record: ComprobanteCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setMateriasItems(record.materiasPrimas);
    setTotal(record.total);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<ComprobanteCompra, "key" | "idComprobante" | "materiasPrimas" | "total">) => {
      if (materiasItems.length === 0) {
        message.error("Debe agregar al menos una materia prima al comprobante");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas: materiasItems, total } : item));
      } else {
        const newId = `CC-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { ...values, materiasPrimas: materiasItems, total, idComprobante: newId, key: Date.now() }]);
      }

      setModalOpen(false);
      setEditing(null);
      setMateriasItems([]);
      setTotal(0);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Comprobante", dataIndex: "idComprobante" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: ComprobanteCompra) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width:'100%', padding: 24 }}>
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Comprobantes de Compras</Title>
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar comprobante..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar comprobante</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar comprobante" : "Agregar comprobante"}
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <div style={{ marginBottom: 12 }}>
            <Typography.Text strong>Total: </Typography.Text>
            <Typography.Text>${total.toLocaleString()}</Typography.Text>
          </div>
        </Form>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Materia prima</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setMateriasItems([...materiasItems, { nombre: '', cantidad: 1, precioUnitario: 0 }])}
            >
              Agregar Materia
            </Button>
          </div>
          <Table
            dataSource={materiasItems}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
            columns={[
              { 
                title: 'Nombre', 
                dataIndex: 'nombre',
                width: '40%',
                render: (text: string, record: MateriaPrima, index: number) => (
                  <Input
                    value={text}
                    onChange={(e) => {
                      const newItems = [...materiasItems];
                      newItems[index] = { ...record, nombre: e.target.value };
                      setMateriasItems(newItems);
                    }}
                  />
                )
              },
              { 
                title: 'Cantidad', 
                dataIndex: 'cantidad',
                width: '20%',
                render: (value: number, record: MateriaPrima, index: number) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(value) => {
                      const newItems = [...materiasItems];
                      newItems[index] = { ...record, cantidad: value || 1 };
                      setMateriasItems(newItems);
                    }}
                  />
                )
              },
              { 
                title: 'Precio Unitario', 
                dataIndex: 'precioUnitario',
                width: '25%',
                render: (value: number, record: MateriaPrima, index: number) => (
                  <InputNumber
                    min={0}
                    value={value}
                    onChange={(value) => {
                      const newItems = [...materiasItems];
                      newItems[index] = { ...record, precioUnitario: value || 0 };
                      setMateriasItems(newItems);
                    }}
                    prefix="$"
                  />
                )
              },
              {
                title: '',
                width: '10%',
                render: (_: any, _record: MateriaPrima, index: number) => (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newItems = [...materiasItems];
                      newItems.splice(index, 1);
                      setMateriasItems(newItems);
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
        title="Detalle de comprobante"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Comprobante:</b> {detalle.idComprobante}</p>
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
