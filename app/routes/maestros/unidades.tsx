import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";

interface UnidadMedida {
  key: number;
  nombre: string;
  abreviatura: string;
  descripcion: string;
}

const datosEjemplo: UnidadMedida[] = [
  {
    key: 1,
    nombre: "Kilogramos",
    abreviatura: "Kg",
    descripcion: "Unidad de medida de peso en el sistema métrico",
  },
  {
    key: 2,
    nombre: "Litros",
    abreviatura: "L",
    descripcion: "Unidad de medida de volumen en el sistema métrico",
  },
] as const;

export default function UnidadesMaestros() {
  const [data, setData] = useState<UnidadMedida[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UnidadMedida | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter((item) =>
    Object.values(item).some((v) =>
      String(v).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: UnidadMedida) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(record: UnidadMedida) {
    setData(data.filter((item) => item.key !== record.key));
  }

  function handleSave(values: any) {
    if (editing) {
      setData(
        data.map((item) =>
          item.key === editing.key ? { ...values, key: item.key } : item
        )
      );
    } else {
      const newKey = Math.max(0, ...data.map((item) => item.key)) + 1;
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
      title: "Abreviatura",
      dataIndex: "abreviatura",
      key: "abreviatura",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: UnidadMedida) => (
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
          placeholder="Buscar unidad de medida..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Agregar Unidad de Medida
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredData} scroll={{ x: true }} />

      <Modal
        title={editing ? "Editar Unidad de Medida" : "Nueva Unidad de Medida"}
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
            name="abreviatura"
            label="Abreviatura"
            rules={[
              { required: true, message: "Por favor ingrese la abreviatura" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[
              { required: true, message: "Por favor ingrese la descripción" },
            ]}
          >
            <Input.TextArea rows={4} />
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