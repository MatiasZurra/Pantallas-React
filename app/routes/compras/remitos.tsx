
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
  const [materiasItems, setMateriasItems] = useState<MateriaPrimaRemito[]>([]);
  const [cantidadTotal, setCantidadTotal] = useState(0);

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

  useEffect(() => {
    const total = materiasItems.reduce((acc, m) => acc + (m.cantidad || 0), 0);
    setCantidadTotal(total);
  }, [materiasItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setMateriasItems([]);
    setCantidadTotal(0);
    setModalOpen(true);
  };

  const handleEdit = (record: RemitoCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setMateriasItems(record.materiasPrimas);
    setCantidadTotal(record.materiasPrimas.reduce((acc, m) => acc + (m.cantidad || 0), 0));
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<RemitoCompra, "key" | "idRemito" | "materiasPrimas">) => {
      if (materiasItems.length === 0) {
        message.error('Debe agregar al menos una materia prima al remito');
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas: materiasItems } : item));
      } else {
        const newId = `RC-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { ...values, materiasPrimas: materiasItems, idRemito: newId, key: Date.now() }]);
      }

      setModalOpen(false);
      setEditing(null);
      setMateriasItems([]);
      setCantidadTotal(0);
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
        <Title level={2}>Remitos de Compras</Title>
      </div>
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
          <div style={{ marginBottom: 12 }}>
            <Typography.Text strong>Cantidad total: </Typography.Text>
            <Typography.Text>{cantidadTotal}</Typography.Text>
          </div>
        </Form>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Materia prima</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setMateriasItems([...materiasItems, { nombre: '', cantidad: 1 }])}
            >
              Agregar Materia Prima
            </Button>
          </div>
          <Table
            dataSource={materiasItems}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
            columns={[
              { 
                title: 'Materia prima', 
                dataIndex: 'nombre',
                width: '60%',
                render: (text: string, record: MateriaPrimaRemito, index: number) => (
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
                width: '30%',
                render: (value: number, record: MateriaPrimaRemito, index: number) => (
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
                title: '',
                width: '10%',
                render: (_: any, _record: MateriaPrimaRemito, index: number) => (
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
