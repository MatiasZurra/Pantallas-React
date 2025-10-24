

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

type Receta = { key: number; nombre: string };
type Empleado = { key: number; nombre: string; puesto: string };
type Direccion = { key: number; nombre: string; direccion: string };
type Unidad = { key: number; nombre: string; simbolo: string };

type MaestroData = {
  recetas: Receta[];
  empleados: Empleado[];
  direcciones: Direccion[];
  unidades: Unidad[];
};

type MaestroKey = keyof MaestroData;

const { Sider, Content } = Layout;

const maestros = [
  { key: "recetas", label: "Recetas", icon: <BookOutlined /> },
  { key: "empleados", label: "Empleados", icon: <SolutionOutlined /> },
  { key: "direcciones", label: "Direcciones", icon: <HomeOutlined /> },
  { key: "unidades", label: "Unidades de medida", icon: <ApartmentOutlined /> },
];

const dataEjemplo: MaestroData = {
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
  const [maestro, setMaestro] = useState<MaestroKey>("recetas");
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const data = (dataEjemplo[maestro] as MaestroData[typeof maestro]).filter((item: MaestroData[typeof maestro][number]) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f4f6fa" }}>
      <Sider width={220} style={{ background: "#fff", borderRadius: 12, margin: 16, boxShadow: "0 2px 8px #e6e6e6" }}>
        <Menu
          mode="inline"
          selectedKeys={[maestro]}
          style={{ height: "100%", borderRight: 0, fontWeight: 500, borderRadius: 12 }}
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
            Añadir {maestros.find((m) => m.key === maestro)?.label}
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
          title={`Añadir ${maestros.find((m) => m.key === maestro)?.label}`}
          onCancel={() => setModalOpen(false)}
          onOk={() => setModalOpen(false)}
        >
          <Form form={form} layout="vertical">


            {maestro === "empleados" && (
              <>
                <Form.Item label="Nombre" name="nombre" required>
                  <Input />
                </Form.Item>
                <Form.Item label="Apellido" name="apellido" required>
                  <Input />
                </Form.Item>
                <Form.Item label="CUIL" name="cuil" required>
                  <Input />
                </Form.Item>
                <Form.Item label="Fecha de nacimiento" name="fechaNacimiento" required>
                  <Input type="date" />
                </Form.Item>
                <Form.Item label="Teléfono" name="telefono" required>
                  <Input />
                </Form.Item>
                <Form.Item label="Hora de entrada" name="horaEntrada" required>
                  <Input type="time" />
                </Form.Item>
                <Form.Item label="Hora de salida" name="horaSalida" required>
                  <Input type="time" />
                </Form.Item>
                <Form.Item label="Dirección" name="direccion" required>
                  <Input />
                </Form.Item>
              </>
            )}
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
