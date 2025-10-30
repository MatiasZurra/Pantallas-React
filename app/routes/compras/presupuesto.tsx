
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
  const [search, setSearch] = useState("");
  const [materiasItems, setMateriasItems] = useState<MateriaPrimaPresupuesto[]>([]);
  const [total, setTotal] = useState<number>(0);

  const filteredData = data.filter(presupuesto => {
    const searchLower = search.toLowerCase();
    return (
      presupuesto.idPresupuesto.toLowerCase().includes(searchLower) ||
      presupuesto.idProveedor.toLowerCase().includes(searchLower) ||
      presupuesto.nombreProveedor.toLowerCase().includes(searchLower) ||
      presupuesto.fecha.toLowerCase().includes(searchLower) ||
      presupuesto.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    const newTotal = materiasItems.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
    setTotal(newTotal);
  }, [materiasItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setMateriasItems([]);
    setTotal(0);
    // Generar nuevo ID de presupuesto
    const lastId = Math.max(...data.map(item => parseInt(item.idPresupuesto.split('-')[1])), 0);
    const newId = `PB-${String(lastId + 1).padStart(3, '0')}`;
    form.setFieldsValue({ idPresupuesto: newId });
    setModalOpen(true);
  };

  const handleEdit = (record: PresupuestoCompra) => {
    setEditing(record);
    setMateriasItems(record.materiasPrimas);
    setTotal(record.total);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    if (materiasItems.length === 0) {
      message.error('Debe agregar al menos una materia prima');
      return;
    }

    form.validateFields().then((values: Omit<PresupuestoCompra, 'key' | 'materiasPrimas' | 'total'>) => {
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { 
          ...editing, 
          ...values, 
          materiasPrimas: materiasItems,
          total 
        } : item));
      } else {
        setData([...data, { 
          ...values, 
          materiasPrimas: materiasItems,
          total,
          key: Date.now() 
        }]);
      }
      setModalOpen(false);
      setEditing(null);
      setMateriasItems([]);
      setTotal(0);
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
        <Title level={2}>Presupuestos de Compras</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar presupuesto..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar presupuesto</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar presupuesto" : "Agregar presupuesto"}
        onCancel={() => { 
          setModalOpen(false); 
          setEditing(null); 
          setMateriasItems([]); 
          setTotal(0);
          form.resetFields(); 
        }}
        onOk={handleOk}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Presupuesto" name="idPresupuesto"> 
            <Input disabled={!editing} />
          </Form.Item>
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> 
            <Input /> 
          </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> 
            <Input type="date" /> 
          </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> 
            <Input /> 
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Materias Primas</Title>
            <Button 
              type="dashed" 
              onClick={() => setMateriasItems([...materiasItems, { nombre: '', cantidad: 0, precioUnitario: 0 }])}
              icon={<PlusOutlined />}
              style={{ marginBottom: 8 }}
            >
              Agregar materia prima
            </Button>
            <Table
              dataSource={materiasItems}
              pagination={false}
              rowKey={(record, index) => index?.toString() || '0'}
              columns={[
                {
                  title: 'Materia Prima',
                  dataIndex: 'nombre',
                  render: (_, record, index) => (
                    <Input
                      value={record.nombre}
                      onChange={e => {
                        const newItems = [...materiasItems];
                        newItems[index].nombre = e.target.value;
                        setMateriasItems(newItems);
                      }}
                    />
                  )
                },
                {
                  title: 'Cantidad',
                  dataIndex: 'cantidad',
                  render: (_, record, index) => (
                    <InputNumber
                      value={record.cantidad}
                      min={0}
                      onChange={value => {
                        const newItems = [...materiasItems];
                        newItems[index].cantidad = value || 0;
                        setMateriasItems(newItems);
                      }}
                    />
                  )
                },
                {
                  title: 'Precio Unitario',
                  dataIndex: 'precioUnitario',
                  render: (_, record, index) => (
                    <InputNumber
                      value={record.precioUnitario}
                      min={0}
                      prefix="$"
                      onChange={value => {
                        const newItems = [...materiasItems];
                        newItems[index].precioUnitario = value || 0;
                        setMateriasItems(newItems);
                      }}
                    />
                  )
                },
                {
                  title: 'Acciones',
                  render: (_, __, index) => (
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => setMateriasItems(materiasItems.filter((_, i) => i !== index))}
                    />
                  )
                }
              ]}
            />
          </div>

          <Form.Item label="Total">
            <InputNumber
              disabled
              value={total}
              prefix="$"
              style={{ width: '200px' }}
            />
          </Form.Item>
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
