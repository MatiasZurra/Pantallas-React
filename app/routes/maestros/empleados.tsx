import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Space, DatePicker, Typography, message } from "antd";

const { Title } = Typography;

interface Empleado {
  key: number;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  puesto: string;
}

const datosEjemplo: Array<Empleado> = [
  {
    key: 1,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "25789456",
    fecha_nacimiento: "1980-05-15",
    direccion: "Calle 123",
    telefono: "11-2345-6789",
    email: "juan.perez@empresa.com",
    puesto: "Vendedor",
  },
  {
    key: 2,
    nombre: "María",
    apellido: "González",
    dni: "30159753",
    fecha_nacimiento: "1985-08-22",
    direccion: "Avenida 456",
    telefono: "11-9876-5432",
    email: "maria.gonzalez@empresa.com",
    puesto: "Supervisor",
  },
];

export default function EmpleadosMaestros() {
  const [data, setData] = useState<Empleado[]>(datosEjemplo);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Empleado | null>(null);
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

  function handleEdit(record: Empleado) {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  }

  function handleDelete(record: Empleado) {
    Modal.confirm({
      title: '¿Está seguro de eliminar este empleado?',
      content: `Se eliminará el empleado ${record.nombre} ${record.apellido}`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'No, cancelar',
      onOk() {
        setData(data.filter((item) => item.key !== record.key));
        message.success('Empleado eliminado correctamente');
      },
    });
  }

  function handleSave(values: any) {
    try {
      if (editing) {
        setData(
          data.map((item) =>
            item.key === editing.key ? { ...values, key: item.key } : item
          )
        );
        message.success('Empleado actualizado correctamente');
      } else {
        const newKey = Math.max(0, ...data.map((item) => item.key)) + 1;
        setData([...data, { ...values, key: newKey }]);
        message.success('Empleado agregado correctamente');
      }
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Ocurrió un error al guardar los datos');
    }
  }

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
    },
    {
      title: "DNI",
      dataIndex: "dni",
      key: "dni",
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "fecha_nacimiento",
      key: "fecha_nacimiento",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Puesto",
      dataIndex: "puesto",
      key: "puesto",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Empleado) => (
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
    <div style={{ padding: 24, width: '100%' }}>
        <Title level={2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>Empleados</Title>
      
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Buscar empleado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
          Nuevo Empleado
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        pagination={{ 
          defaultPageSize: 10
        }}
      />

      <Modal
        title={editing ? "Editar Empleado" : "Nuevo Empleado"}
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
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: "Por favor ingrese el apellido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dni"
            label="DNI"
            rules={[
              { required: true, message: "Por favor ingrese el DNI" },
              { pattern: /^\d{8}$/, message: "El DNI debe tener 8 dígitos" },
            ]}
          >
            <Input maxLength={8} />
          </Form.Item>
          <Form.Item
            name="fecha_nacimiento"
            label="Fecha de Nacimiento"
            rules={[
              { required: true, message: "Por favor ingrese la fecha de nacimiento" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: "Por favor ingrese la dirección" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[
              { required: true, message: "Por favor ingrese el teléfono" },
              { pattern: /^[0-9\-]+$/, message: "Formato inválido. Use solo números y guiones" }
            ]}
          >
            <Input placeholder="11-1234-5678" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Por favor ingrese el email" },
              { type: "email", message: "Por favor ingrese un email válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="puesto"
            label="Puesto"
            rules={[{ required: true, message: "Por favor ingrese el puesto" }]}
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