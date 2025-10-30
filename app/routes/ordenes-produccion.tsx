import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography, InputNumber, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

type ProductoElaborado = {
  nombre: string;
  cantidad: number;
  descripcion?: string;
};

type MateriaPrimaUtilizada = {
  nombre: string;
  cantidad: number;
  unidad: string;
};

type OrdenProduccion = {
  key: number;
  idOrdenProduccion: string;
  idEmpleado: string;
  fechaElaboracion: string;
  productos: ProductoElaborado[];
  materiasPrimas: MateriaPrimaUtilizada[];
};

const datosEjemplo: OrdenProduccion[] = [
  {
    key: 1,
    idOrdenProduccion: "OPR-001",
    idEmpleado: "EMP-01",
    fechaElaboracion: "2025-10-01",
    productos: [
      { nombre: "Pan", cantidad: 100 },
      { nombre: "Bizcocho", cantidad: 50 },
    ],
    materiasPrimas: [
      { nombre: "Harina", cantidad: 80, unidad: "kg" },
      { nombre: "Levadura", cantidad: 10, unidad: "kg" },
      { nombre: "Sal", cantidad: 5, unidad: "kg" },
    ],
  },
  {
    key: 2,
    idOrdenProduccion: "OPR-002",
    idEmpleado: "EMP-02",
    fechaElaboracion: "2025-10-02",
    productos: [
      { nombre: "Torta", cantidad: 20 },
    ],
    materiasPrimas: [
      { nombre: "Harina", cantidad: 20, unidad: "kg" },
      { nombre: "Azúcar", cantidad: 5, unidad: "kg" },
      { nombre: "Huevos", cantidad: 12, unidad: "unidades" },
    ],
  },
];

export default function OrdenesProduccion() {
  const [data, setData] = useState<OrdenProduccion[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenProduccion | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenProduccion | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState<ProductoElaborado[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrimaUtilizada[]>([]);

  const filteredData = data.filter(orden => {
    const searchLower = search.toLowerCase();
    return (
      orden.idOrdenProduccion.toLowerCase().includes(searchLower) ||
      orden.idEmpleado.toLowerCase().includes(searchLower) ||
      orden.fechaElaboracion.toLowerCase().includes(searchLower) ||
      orden.productos.some(p => p.nombre.toLowerCase().includes(searchLower)) ||
      orden.materiasPrimas.some(mp => mp.nombre.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: "ID Orden de Producción", dataIndex: "idOrdenProduccion" },
    { title: "ID Empleado", dataIndex: "idEmpleado" },
    { title: "Fecha de elaboración", dataIndex: "fechaElaboracion" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenProduccion) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>Editar</Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
          <Button size="small" onClick={() => { setDetalle(record); setDetalleOpen(true); }}>Ver detalle</Button>
        </Space>
      ),
    },
  ];

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setProductos([]);
    setMateriasPrimas([]);
    
    // Generar nuevo ID
    const lastId = Math.max(...data.map(item => parseInt(item.idOrdenProduccion.split('-')[1])), 0);
    const newId = `OPR-${String(lastId + 1).padStart(3, '0')}`;
    form.setFieldsValue({ 
      idOrdenProduccion: newId,
      fechaElaboracion: new Date().toISOString().split('T')[0]
    });
    setModalOpen(true);
  }

  function handleEdit(record: OrdenProduccion) {
    setEditing(record);
    setProductos(record.productos);
    setMateriasPrimas(record.materiasPrimas);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    if (materiasPrimas.length === 0) {
      message.error('Debe agregar al menos una materia prima');
      return;
    }

    if (productos.length === 0) {
      message.error('Debe agregar al menos un producto');
      return;
    }

    form.validateFields().then((values: Omit<OrdenProduccion, 'key' | 'productos' | 'materiasPrimas'>) => {
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { 
          ...editing, 
          ...values, 
          productos, 
          materiasPrimas 
        } : item));
      } else {
        setData([...data, { 
          ...values, 
          productos, 
          materiasPrimas,
          key: Date.now() 
        }]);
      }
      setModalOpen(false);
      setEditing(null);
      setProductos([]);
      setMateriasPrimas([]);
      form.resetFields();
    });
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Órdenes de Producción</Title>
        
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
        <Input.Search
          placeholder="Buscar orden..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>Agregar orden</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar orden de producción" : "Agregar orden de producción"}
        onCancel={() => { 
          setModalOpen(false); 
          setEditing(null); 
          setProductos([]);
          setMateriasPrimas([]);
          form.resetFields(); 
        }}
        onOk={handleOk}
        width={1000}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Orden de Producción" name="idOrdenProduccion">
            <Input disabled />
          </Form.Item>
          <Form.Item label="ID Empleado" name="idEmpleado" rules={[{ required: true, message: "Ingrese el ID de empleado" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Fecha de elaboración" name="fechaElaboracion" rules={[{ required: true, message: "Ingrese la fecha de elaboración" }]}>
            <Input type="date" />
          </Form.Item>

          {/* Tabla de Materias Primas */}
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Materias Primas</Title>
            <Button
              type="dashed"
              onClick={() => setMateriasPrimas([...materiasPrimas, { nombre: '', cantidad: 0, unidad: 'kg' }])}
              icon={<PlusOutlined />}
              style={{ marginBottom: 8 }}
            >
              Agregar Materia Prima
            </Button>
            <Table
              dataSource={materiasPrimas}
              pagination={false}
              rowKey={(record, index) => `mp-${index}`}
              columns={[
                {
                  title: 'Materia Prima',
                  dataIndex: 'nombre',
                  render: (_, record, index) => (
                    <Input
                      value={record.nombre}
                      onChange={e => {
                        const newItems = [...materiasPrimas];
                        newItems[index].nombre = e.target.value;
                        setMateriasPrimas(newItems);
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
                        const newItems = [...materiasPrimas];
                        newItems[index].cantidad = value || 0;
                        setMateriasPrimas(newItems);
                      }}
                    />
                  )
                },
                {
                  title: 'Unidad',
                  dataIndex: 'unidad',
                  render: (_, record, index) => (
                    <Input
                      value={record.unidad}
                      onChange={e => {
                        const newItems = [...materiasPrimas];
                        newItems[index].unidad = e.target.value;
                        setMateriasPrimas(newItems);
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
                      onClick={() => setMateriasPrimas(materiasPrimas.filter((_, i) => i !== index))}
                    />
                  )
                }
              ]}
            />
          </div>

          {/* Tabla de Productos */}
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Productos a Elaborar</Title>
            <Button
              type="dashed"
              onClick={() => setProductos([...productos, { nombre: '', cantidad: 0, descripcion: '' }])}
              icon={<PlusOutlined />}
              style={{ marginBottom: 8 }}
            >
              Agregar Producto
            </Button>
            <Table
              dataSource={productos}
              pagination={false}
              rowKey={(record, index) => `prod-${index}`}
              columns={[
                {
                  title: 'Producto',
                  dataIndex: 'nombre',
                  render: (_, record, index) => (
                    <Input
                      value={record.nombre}
                      onChange={e => {
                        const newItems = [...productos];
                        newItems[index].nombre = e.target.value;
                        setProductos(newItems);
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
                        const newItems = [...productos];
                        newItems[index].cantidad = value || 0;
                        setProductos(newItems);
                      }}
                    />
                  )
                },
                {
                  title: 'Descripción',
                  dataIndex: 'descripcion',
                  render: (_, record, index) => (
                    <Input
                      value={record.descripcion}
                      onChange={e => {
                        const newItems = [...productos];
                        newItems[index].descripcion = e.target.value;
                        setProductos(newItems);
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
                      onClick={() => setProductos(productos.filter((_, i) => i !== index))}
                    />
                  )
                }
              ]}
            />
          </div>
        </Form>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de orden de producción"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Orden de Producción:</b> {detalle.idOrdenProduccion}</p>
            <p><b>ID Empleado:</b> {detalle.idEmpleado}</p>
            <p><b>Fecha de elaboración:</b> {detalle.fechaElaboracion}</p>
            <b>Productos elaborados:</b>
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
            <b style={{ marginTop: 16, display: 'inline-block' }}>Materia prima utilizada:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Materia prima</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'right' }}>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalle.materiasPrimas.map((mp, idx) => (
                  <tr key={idx}>
                    <td>{mp.nombre}</td>
                    <td style={{ textAlign: 'right' }}>{mp.cantidad}</td>
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
