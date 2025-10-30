import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

interface Direccion {
  key: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  telefono: string;
}

const datosEjemplo: Array<Direccion> = [
  { 
    key: 1, 
    nombre: "Sucursal Centro",
    direccion: "Av. Principal 123",
    ciudad: "Buenos Aires",
    provincia: "Buenos Aires",
    codigo_postal: "C1001",
    telefono: "11-1234-5678"
  },
  { 
    key: 2, 
    nombre: "Depósito Norte",
    direccion: "Ruta 9 km 50",
    ciudad: "Escobar",
    provincia: "Buenos Aires",
    codigo_postal: "B1625",
    telefono: "11-8765-4321"
  }
];

export default function DireccionesMaestros() {
  const [data, setData] = useState<Direccion[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Direccion | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Direccion) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(record: Direccion) {
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
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Ciudad",
      dataIndex: "ciudad",
      key: "ciudad",
    },
    {
      title: "Provincia",
      dataIndex: "provincia",
      key: "provincia",
    },
    {
      title: "Código Postal",
      dataIndex: "codigo_postal",
      key: "codigo_postal",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Direccion) => (
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
          placeholder="Buscar dirección..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agregar Dirección
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} scroll={{ x: true }} />

      <Modal
        title={editing ? "Editar Dirección" : "Nueva Dirección"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
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
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: "Por favor ingrese la dirección" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ciudad"
            label="Ciudad"
            rules={[{ required: true, message: "Por favor ingrese la ciudad" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="provincia"
            label="Provincia"
            rules={[{ required: true, message: "Por favor ingrese la provincia" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="codigo_postal"
            label="Código Postal"
            rules={[{ required: true, message: "Por favor ingrese el código postal" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: "Por favor ingrese el teléfono" }]}
          >
            <Input />
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