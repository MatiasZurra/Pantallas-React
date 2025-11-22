import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form, Typography } from "antd";


const {Title}= Typography;
type Producto = { key: number; nombre: string; categoria: string };

const datosEjemplo: Producto[] = [
  { key: 1, nombre: "Ravioles", categoria: "Pasta rellena" },
  { key: 2, nombre: "Tallarines", categoria: "Pasta larga" },
];

export default function StockProductos() {
  const [data, setData] = useState<Producto[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v =>
      String(v).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Producto) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Producto, "key">) => {
      if (editing) {
        setData(
          data.map(item =>
            item.key === editing.key ? { ...editing, ...values } : item
          )
        );
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  }

  const columns = [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Categoría", dataIndex: "categoria" },
    {
      title: "Acciones",
      render: (_: any, record: Producto) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.key)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{width:'100%', padding: 24 }}>
      {/* Encabezado */}
    
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Stock de Productos</Title>
       
    

      {/* Barra de búsqueda */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between'}}>
        <Input.Search
          placeholder="Buscar producto..."
          allowClear
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agrgar Producto
        </Button>
      </div>

      {/* Tabla */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
        bordered
        rowKey="key"
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        title={editing ? "Editar Producto" : "Nuevo Producto"}
        onCancel={() => {
          setModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleOk}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoria"
            label="Categoría"
            rules={[{ required: true, message: "Ingrese la categoría" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
