import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

type MateriaPrima = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

type OrdenCompra = {
  key: number;
  idOrden: string;
  idProveedor: string;
  nombreProveedor: string;
  fecha: string;
  total: number;
  materiasPrimas: MateriaPrima[];
};

const datosEjemplo: OrdenCompra[] = [
  {
    key: 1,
    idOrden: "OC-001",
    idProveedor: "PR-01",
    nombreProveedor: "Proveedor Uno",
    fecha: "2025-09-24",
    total: 9000,
    materiasPrimas: [
      { nombre: "Harina", cantidad: 5, precioUnitario: 500 },
      { nombre: "Azúcar", cantidad: 3, precioUnitario: 1000 },
    ],
  },
  {
    key: 2,
    idOrden: "OC-002",
    idProveedor: "PR-02",
    nombreProveedor: "Proveedor Dos",
    fecha: "2025-09-25",
    total: 8000,
    materiasPrimas: [
      { nombre: "Sal", cantidad: 10, precioUnitario: 200 },
      { nombre: "Aceite", cantidad: 2, precioUnitario: 3000 },
    ],
  },
];

export default function OrdenCompraCompras() {
  const [data, setData] = useState<OrdenCompra[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenCompra | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenCompra | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [materiasPrimasItems, setMateriasPrimasItems] = useState<MateriaPrima[]>([]);
  const [total, setTotal] = useState(0);

  const filteredData = data.filter(orden => {
    const searchLower = search.toLowerCase();
    return (
      orden.idOrden.toLowerCase().includes(searchLower) ||
      orden.idProveedor.toLowerCase().includes(searchLower) ||
      orden.nombreProveedor.toLowerCase().includes(searchLower) ||
      orden.fecha.toLowerCase().includes(searchLower) ||
      orden.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  // Calcular total cuando cambian las materias primas
  useEffect(() => {
    const newTotal = materiasPrimasItems.reduce((acc, mp) => acc + (mp.cantidad * mp.precioUnitario), 0);
    setTotal(newTotal);
  }, [materiasPrimasItems]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setMateriasPrimasItems([]);
    setTotal(0);
    setModalOpen(true);
  };

  const handleEdit = (record: OrdenCompra) => {
    setEditing(record);
    form.setFieldsValue(record);
    setMateriasPrimasItems(record.materiasPrimas);
    setTotal(record.total);
    setModalOpen(true);
  };

  const handleDelete = (key: number) => {
    setData(data.filter(item => item.key !== key));
  };

  const handleOk = () => {
    form.validateFields().then((values: Omit<OrdenCompra, "key" | "idOrden" | "materiasPrimas" | "total">) => {
      if (materiasPrimasItems.length === 0) {
        message.error("Debe agregar al menos una materia prima a la orden");
        return;
      }

      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, materiasPrimas: materiasPrimasItems, total } : item));
      } else {
        // Generar un nuevo ID de orden (simulado)
        const newId = `OC-${String(data.length + 1).padStart(3, '0')}`;
        setData([...data, { 
          ...values, 
          key: Date.now(), 
          idOrden: newId,
          materiasPrimas: materiasPrimasItems,
          total 
        }]);
      }
      setModalOpen(false);
      setEditing(null);
      setMateriasPrimasItems([]);
      setTotal(0);
      form.resetFields();
    });
  };

  const columns = [
    { title: "ID Orden", dataIndex: "idOrden" },
    { title: "ID Proveedor", dataIndex: "idProveedor" },
    { title: "Proveedor", dataIndex: "nombreProveedor" },
    { title: "Fecha", dataIndex: "fecha" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenCompra) => (
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
        <Title level={2}>Órdenes de Compra</Title>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar orden de compra..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar orden de compra</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar orden de compra" : "Agregar orden de compra"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          {editing && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>ID Orden: </Typography.Text>
              <Typography.Text>{editing.idOrden}</Typography.Text>
            </div>
          )}
          <Form.Item label="ID Proveedor" name="idProveedor" rules={[{ required: true, message: "Ingrese el ID de proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Proveedor" name="nombreProveedor" rules={[{ required: true, message: "Ingrese el nombre del proveedor" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
          <div style={{ marginBottom: 16 }}>
            <Typography.Text strong>Total: </Typography.Text>
            <Typography.Text>${total.toLocaleString()}</Typography.Text>
          </div>
        </Form>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Materias Primas</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setMateriasPrimasItems([...materiasPrimasItems, { nombre: '', cantidad: 1, precioUnitario: 0 }])}
            >
              Agregar Materia Prima
            </Button>
          </div>
          <Table
            dataSource={materiasPrimasItems}
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
                      const newItems = [...materiasPrimasItems];
                      newItems[index] = { ...record, nombre: e.target.value };
                      setMateriasPrimasItems(newItems);
                    }}
                  />
                )
              },
              { 
                title: 'Cantidad', 
                dataIndex: 'cantidad',
                width: '25%',
                render: (value: number, record: MateriaPrima, index: number) => (
                  <InputNumber
                    min={1}
                    value={value}
                    onChange={(value) => {
                      const newItems = [...materiasPrimasItems];
                      newItems[index] = { ...record, cantidad: value || 1 };
                      setMateriasPrimasItems(newItems);
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
                      const newItems = [...materiasPrimasItems];
                      newItems[index] = { ...record, precioUnitario: value || 0 };
                      setMateriasPrimasItems(newItems);
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
                      const newItems = [...materiasPrimasItems];
                      newItems.splice(index, 1);
                      setMateriasPrimasItems(newItems);
                    }}
                  />
                )
              }
            ]}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <Typography.Text strong>Total: ${total.toLocaleString()}</Typography.Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de orden de compra"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Orden:</b> {detalle.idOrden}</p>
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
