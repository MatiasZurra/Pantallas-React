import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

type Receta = {
  key: number;
  nombre: string;
  descripcion: string;
  tiempo_preparacion: number;
};

const datosEjemplo: Receta[] = [
  { 
    key: 1, 
    nombre: "Salsa fileto", 
    descripcion: "Salsa de tomate casera con albahaca",
    tiempo_preparacion: 30
  },
  { 
    key: 2, 
    nombre: "Masa para fideos", 
    descripcion: "Masa base para pastas frescas",
    tiempo_preparacion: 45
  },

];

export default function RecetasMaestros() {
  const [data, setData] = useState<Receta[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Receta | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Receta) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(record: Receta) {
    setData(data.filter(item => item.key !== record.key));
  }

  function handleSave(values: any) {
    if (editing) {
      setData(data.map(item => 
        item.key === editing.key ? { ...values, key: item.key } : item
      ));
    } else {
      const newKey = Math.max(0, ...data.map(item => item.key)) + 1;
      setData([...data, { ...values, key: newKey }]);
    }
    setModalOpen(false);
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Tiempo de preparación (min)",
      dataIndex: "tiempo_preparacion",
      key: "tiempo_preparacion",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Receta) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Input.Search
          placeholder="Buscar receta..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agregar Receta
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} />

      <Modal
        title={editing ? "Editar Receta" : "Nueva Receta"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: "Por favor ingrese la descripción" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="tiempo_preparacion"
            label="Tiempo de preparación (minutos)"
            rules={[{ required: true, message: "Por favor ingrese el tiempo de preparación" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}