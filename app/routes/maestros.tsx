
import { useState } from "react";
import { Layout, Menu, Card, Button, Table, Input, Space, Modal, Form } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ShopOutlined,
  AppstoreOutlined,
  BookOutlined,
  SolutionOutlined,
  HomeOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const maestros = [
  { key: "clientes", label: "Clientes", icon: <UserOutlined /> },
  { key: "proveedores", label: "Proveedores", icon: <TeamOutlined /> },
  { key: "productos", label: "Productos", icon: <ShopOutlined /> },
  { key: "materias", label: "Materias primas", icon: <AppstoreOutlined /> },
  { key: "recetas", label: "Recetas", icon: <BookOutlined /> },
  { key: "empleados", label: "Empleados", icon: <SolutionOutlined /> },
  { key: "direcciones", label: "Direcciones", icon: <HomeOutlined /> },
  { key: "unidades", label: "Unidades de medida", icon: <ApartmentOutlined /> },
];

type MaestroKey = keyof typeof dataEjemplo;
type Cliente = { key: number; nombre: string; telefono: string; email: string };
type Proveedor = { key: number; nombre: string; telefono: string; email: string };
type Producto = { key: number; nombre: string; categoria: string };
type Materia = { key: number; nombre: string; stock: number };
type Receta = { key: number; nombre: string };
type Empleado = { key: number; nombre: string; puesto: string };
type Direccion = { key: number; nombre: string; direccion: string };
type Unidad = { key: number; nombre: string; simbolo: string };

type MaestroData = {
  clientes: Cliente[];
  proveedores: Proveedor[];
  productos: Producto[];
  materias: Materia[];
  recetas: Receta[];
  empleados: Empleado[];
  direcciones: Direccion[];
  unidades: Unidad[];
};

const dataEjemplo: MaestroData = {
  clientes: [
    { key: 1, nombre: "Juan Pérez", telefono: "123456789", email: "juan@mail.com" },
    { key: 2, nombre: "Ana López", telefono: "987654321", email: "ana@mail.com" },
  ],
  proveedores: [
    { key: 1, nombre: "Molinos SA", telefono: "111222333", email: "ventas@molinos.com" },
  ],
  productos: [
    { key: 1, nombre: "Ravioles", categoria: "Pasta rellena" },
  ],
  materias: [
    { key: 1, nombre: "Harina 000", stock: 120 },
  ],
  recetas: [
    { key: 1, nombre: "Salsa fileto" },
  ],
  empleados: [
    { key: 1, nombre: "Carlos Díaz", puesto: "Producción" },
  ],
  direcciones: [
    { key: 1, nombre: "Sucursal Centro", direccion: "Av. Principal 123" },
  ],
  unidades: [
    { key: 1, nombre: "Kilogramo", simbolo: "kg" },
  ],
};

import React from "react";
type ColumnType<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key?: string;
  render?: (_: unknown, record: T, i: number) => React.ReactNode;
};

const columnas: { [K in MaestroKey]: ColumnType[] } = {
  clientes: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Email", dataIndex: "email" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="clientes" /> } },
  ],
  proveedores: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Teléfono", dataIndex: "telefono" },
    { title: "Email", dataIndex: "email" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="proveedores" /> } },
  ],
  productos: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Categoría", dataIndex: "categoria" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="productos" /> } },
  ],
  materias: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Stock", dataIndex: "stock" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="materias" /> } },
  ],
  recetas: [
    { title: "Nombre", dataIndex: "nombre" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="recetas" /> } },
  ],
  empleados: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Puesto", dataIndex: "puesto" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="empleados" /> } },
  ],
  direcciones: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Dirección", dataIndex: "direccion" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="direcciones" /> } },
  ],
  unidades: [
    { title: "Nombre", dataIndex: "nombre" },
    { title: "Símbolo", dataIndex: "simbolo" },
  { title: "Acciones", key: "acciones", render: function(_: unknown, record: any, i: number): React.ReactNode { return <AccionesTabla record={record} maestro="unidades" /> } },
  ],
};

function AccionesTabla({ record, maestro }: { record: unknown; maestro: MaestroKey }) {
  return (
    <Space>
      <Button size="small" type="link">Editar</Button>
      <Button size="small" type="link" danger>Eliminar</Button>
    </Space>
  );
}

export default function Maestros() {
  const [maestro, setMaestro] = useState<MaestroKey>("clientes");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const data = (dataEjemplo[maestro] as MaestroData[typeof maestro]).filter((item: MaestroData[typeof maestro][number]) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <Layout style={{ minHeight: "80vh", background: "#f4f6fa" }}>
      <Sider width={220} style={{ background: "#fff", borderRadius: 12, margin: 16, boxShadow: "0 2px 8px #e6e6e6" }}>
        <Menu
          mode="inline"
          selectedKeys={[maestro]}
          style={{ height: "100%", borderRight: 0, fontWeight: 500 }}
          items={maestros.map((m) => ({ ...m, label: <span style={{ fontSize: 16 }}>{m.label}</span> }))}
          onClick={({ key }) => setMaestro(key as MaestroKey)}
        />
      </Sider>
      <Content style={{ margin: 16, padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e6e6e6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {maestros.find((m) => m.key === maestro)?.icon}
            <span style={{ fontSize: 20, fontWeight: 600 }}>
              {maestros.find((m) => m.key === maestro)?.label}
            </span>
          </div>
          <Input.Search
            placeholder={`Buscar en ${maestros.find((m) => m.key === maestro)?.label}`}
            allowClear
            style={{ width: 260 }}
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <Button type="primary" onClick={() => setModalOpen(true)}>
            Nuevo {maestros.find((m) => m.key === maestro)?.label}
          </Button>
        </div>
        <Table
          columns={columnas[maestro]}
          dataSource={data}
          pagination={{ pageSize: 6 }}
          bordered
          size="middle"
          style={{ background: "#f9fafb", borderRadius: 8 }}
        />
        <Modal
          open={modalOpen}
          title={`Nuevo ${maestros.find((m) => m.key === maestro)?.label}`}
          onCancel={() => setModalOpen(false)}
          onOk={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item label="Nombre" name="nombre" required>
              <Input />
            </Form.Item>
            {/* Aquí podrías agregar más campos según el maestro */}
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
