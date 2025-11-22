
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;
type MateriaPrimaPago = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type PagoProveedor = {
  key: number;
  idPago: string;
  idProveedor: string;
  fecha: string;
  nombreProveedor: string;
  monto: number;
  materiasPrimas: MateriaPrimaPago[];
};

const datosEjemplo: PagoProveedor[] = [
  {
    key: 1,
    idPago: "PGP-001",
    idProveedor: "PR-01",
    fecha: "2025-09-24",
    nombreProveedor: "Proveedor Uno",
    monto: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 10, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 5, precioUnitario: 800 },
    ],
  },
  {
    key: 2,
    idPago: "PGP-002",
    idProveedor: "PR-02",
    fecha: "2025-09-25",
    nombreProveedor: "Proveedor Dos",
    monto: 10000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 20, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 3, precioUnitario: 2000 },
    ],
  },
];

export default function PagosProveedorCompras() {
  const [data, setData] = useState<PagoProveedor[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PagoProveedor | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<PagoProveedor | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [materiasItems, setMateriasItems] = useState<MateriaPrimaPago[]>([]);
  const [monto, setMonto] = useState(0);

  const filteredData = data.filter(pago => {
    const searchLower = search.toLowerCase();
    return (
      pago.idPago.toLowerCase().includes(searchLower) ||
      pago.idProveedor.toLowerCase().includes(searchLower) ||
      pago.nombreProveedor.toLowerCase().includes(searchLower) ||
      pago.fecha.toLowerCase().includes(searchLower) ||
      pago.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setMateriasItems([]);
    setMonto(0);
    setModalOpen(true);
  };

  const handleEdit = (record: PagoProveedor) => {
    setEditing(record);
    form.setFieldsValue(record);
    setMateriasItems(record.materiasPrimas);
    setMonto(record.monto);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<PagoProveedor, "key" | "idPago" | "materiasPrimas" | "monto">) => {
      if (materiasItems.length === 0) {
        message.error("Debe agregar al menos una materia prima al pago");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas: materiasItems, monto } : item));
      } else {
        const newId = `PGP-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { ...values, materiasPrimas: materiasItems, monto, idPago: newId, key: Date.now() }]);
      }

      setModalOpen(false);
      setEditing(null);
      setMateriasItems([]);
      setMonto(0);
      form.resetFields();
    });
  };

  useEffect(() => {
    const newMonto = materiasItems.reduce((acc, m) => acc + (m.cantidad * m.precioUnitario), 0);
    setMonto(newMonto);
  }, [materiasItems]);

  const columns = [
    { title: "ID Pago", dataIndex: "idPago" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Monto", dataIndex: "monto" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: PagoProveedor) => (
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
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Pagos a Proveedores</Title>
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar pago..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar pago</Button>
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
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
          <div style={{ marginBottom: 12 }}>
            <Typography.Text strong>Monto: </Typography.Text>
            <Typography.Text>${monto.toLocaleString()}</Typography.Text>
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
                title: 'Materia prima', 
                dataIndex: 'nombre',
                width: '40%',
                render: (text: string, record: MateriaPrimaPago, index: number) => (
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
                render: (value: number, record: MateriaPrimaPago, index: number) => (
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
                render: (value: number, record: MateriaPrimaPago, index: number) => (
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
                render: (_: any, _record: MateriaPrimaPago, index: number) => (
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
        title="Detalle de pago"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Pago:</b> {detalle.idPago}</p>
            <p><b>ID Proveedor:</b> {detalle.idProveedor}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <p><b>Proveedor:</b> {detalle.nombreProveedor}</p>
            <p><b>Monto:</b> {detalle.monto}</p>
            <b>Materia prima pagada:</b>
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
