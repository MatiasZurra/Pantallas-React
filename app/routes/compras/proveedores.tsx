import React, { useState } from "react";
import { Table, Button, Input, Space, Modal, Form } from "antd";

type Proveedor = { key: number; nombre: string; telefono: string; email: string; cuit: string; direccion: string };

const datosEjemplo: Proveedor[] = [
  { key: 1, nombre: "Distribuidora Norte", telefono: "1122334455", cuit: '30-12345678-9', email: "norte@proveedor.com", direccion: "Av. Central 100" },
  { key: 2, nombre: "Materias Primas SA", telefono: "2233445566", cuit: '30-87654321-0', email: "mp@proveedor.com", direccion: "Ruta 8 Km 45" },
];

export default function ProveedoresCompras() {
  const [data, setData] = useState<Proveedor[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  }

  function handleEdit(record: Proveedor) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(key: number) {
    setData(data.filter(item => item.key !== key));
  }

  function handleOk() {
    form.validateFields().then((values: Omit<Proveedor, "key">) => {
      if (editing) {
        setData(data.map(item => (item.key === editing.key ? { ...editing, ...values } : item)));
      } else {
        setData([...data, { ...values, key: Date.now() }]);
      }
      setModalOpen(false);
    });
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar proveedores"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={handleAdd}>Nuevo Proveedor</Button>
      </Space>
      <Table
        columns={[
          { title: "Nombre", dataIndex: "nombre" },
          { title: "Teléfono", dataIndex: "telefono" },
          { title: "CUIT", dataIndex: "cuit" },
          { title: "Email", dataIndex: "email" },
          { title: "Dirección", dataIndex: "direccion" },
          {
            title: "Acciones",
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Editar</Button>
                <Button danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
              </Space>
            )
          }
        ]}
        dataSource={filteredData}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalOpen}
        title={editing ? "Editar Proveedor" : "Nuevo Proveedor"}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: "Ingrese el nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: "Ingrese el teléfono" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cuit" label="CUIT" rules={[{ required: true, message: "Ingrese el CUIT" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Ingrese el email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="direccion" label="Dirección" rules={[{ required: true, message: "Ingrese la dirección" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
