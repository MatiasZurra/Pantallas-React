import React, { useState, } from "react";
import { Table, Button, Modal, Form, Input, Space, Typography } from "antd";


const {Title}= Typography

type MaquinaMantenimiento = {
  nombre: string;
  descripcion: string;
};

type OrdenMantenimiento = {
  key: number;
  idOrdenMantenimiento: string;
  idEmpleado: string;
  fecha: string;
  maquinas: MaquinaMantenimiento[];
};

const datosEjemplo: OrdenMantenimiento[] = [
  {
    key: 1,
    idOrdenMantenimiento: "OM-001",
    idEmpleado: "EMP-01",
    fecha: "2025-10-01",
    maquinas: [
      { nombre: "Torno", descripcion: "Cambio de aceite y ajuste de piezas" },
      { nombre: "Fresadora", descripcion: "Limpieza general y calibración" },
    ],
  },
  {
    key: 2,
    idOrdenMantenimiento: "OM-002",
    idEmpleado: "EMP-02",
    fecha: "2025-10-02",
    maquinas: [
      { nombre: "Prensa", descripcion: "Reemplazo de filtro y engrase" },
    ],
  },
];

export default function OrdenesMantenimiento() {
  const [data, setData] = useState<OrdenMantenimiento[]>(datosEjemplo);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OrdenMantenimiento | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalle, setDetalle] = useState<OrdenMantenimiento | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const filteredData = data.filter(orden => {
    const searchLower = search.toLowerCase();
    return (
      orden.idOrdenMantenimiento.toLowerCase().includes(searchLower) ||
      orden.idEmpleado.toLowerCase().includes(searchLower) ||
      orden.fecha.toLowerCase().includes(searchLower) ||
      orden.maquinas.some(m => m.nombre.toLowerCase().includes(searchLower) || m.descripcion.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: "ID Orden de Mantenimiento", dataIndex: "idOrdenMantenimiento" },
    { title: "ID Empleado", dataIndex: "idEmpleado" },
    { title: "Fecha", dataIndex: "fecha" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: OrdenMantenimiento) => (
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

  function handleEdit(record: OrdenMantenimiento) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<OrdenMantenimiento, "key" | "maquinas">) => {
      const maquinas = editing ? editing.maquinas : [];
      if (editing) {
        setData(data.map(item => item.key === editing.key ? { ...editing, ...values, maquinas } : item));
      } else {
        setData([...data, { ...values, maquinas, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }

  return (
    <div style={{width:'100%', padding: 24 }}>
      
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Órdenes de Mantenimiento</Title>
      
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
        title={editing ? "Editar orden de mantenimiento" : "Agregar orden de mantenimiento"}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        onOk={handleOk}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="ID Orden de Mantenimiento" name="idOrdenMantenimiento" rules={[{ required: true, message: "Ingrese el ID de orden de mantenimiento" }]}> <Input /> </Form.Item>
          <Form.Item label="ID Empleado" name="idEmpleado" rules={[{ required: true, message: "Ingrese el ID de empleado" }]}> <Input /> </Form.Item>
          <Form.Item label="Fecha" name="fecha" rules={[{ required: true, message: "Ingrese la fecha" }]}> <Input type="date" /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={detalleOpen}
        title="Detalle de orden de mantenimiento"
        onCancel={() => { setDetalleOpen(false); setDetalle(null); }}
        footer={null}
      >
        {detalle && (
          <div>
            <p><b>ID Orden de Mantenimiento:</b> {detalle.idOrdenMantenimiento}</p>
            <p><b>ID Empleado:</b> {detalle.idEmpleado}</p>
            <p><b>Fecha:</b> {detalle.fecha}</p>
            <b>Máquinas intervenidas:</b>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Máquina</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {detalle.maquinas.map((maq, idx) => (
                  <tr key={idx}>
                    <td>{maq.nombre}</td>
                    <td>{maq.descripcion}</td>
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
