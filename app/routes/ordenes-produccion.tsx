import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type ProductoElaborado = {
  nombre: string;
  cantidad: number;
};

type MateriaPrimaUtilizada = {
  nombre: string;
  cantidad: number;
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
      { nombre: "Harina", cantidad: 80 },
      { nombre: "Levadura", cantidad: 10 },
      { nombre: "Sal", cantidad: 5 },
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
      { nombre: "Harina", cantidad: 20 },
      { nombre: "Azúcar", cantidad: 5 },
      { nombre: "Huevos", cantidad: 12 },
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
    setModalOpen(true);
  }

  function handleEdit(record: OrdenProduccion) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<OrdenProduccion, "key" | "productos" | "materiasPrimas">) => {
      const productos = editing ? editing.productos : [];
      const materiasPrimas = editing ? editing.materiasPrimas : [];
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, productos, materiasPrimas } : item));
      } else {
        setData([...data, { ...values, productos, materiasPrimas, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Órdenes de Producción</h2>
        <Button type="primary" onClick={handleAdd}>Agregar orden</Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar orden..."
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 6 }} bordered rowKey="key" />
      <Modal
        open={modalOpen}
        title={editing ? "Editar orden de producción" : "Agregar orden de producción"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Orden de Producción" name="idOrdenProduccion" rules={[{ required: true, message: "Ingrese el ID de orden de producción" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Empleado" name="idEmpleado" rules={[{ required: true, message: "Ingrese el ID de empleado" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha de elaboración" name="fechaElaboracion" rules={[{ required: true, message: "Ingrese la fecha de elaboración" }]}> <Input type="date" /> </Form.Item>
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
