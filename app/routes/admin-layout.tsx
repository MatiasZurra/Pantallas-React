import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  PieChartOutlined,
  ShopOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;

const menuItems = [
  {
    key: "dashboard",
    icon: <PieChartOutlined />,
    label: "Dashboard",
  },
  {
    key: "ventas",
    icon: <ShopOutlined style={{ color: '#1677ff' }} />,
    label: "Ventas",
    children: [
      {
        key: "ventas/presupuesto",
        label: "Presupuesto",
      },
      {
        key: "ventas/orden-pedido",
        label: "Orden de pedido",
      },
      {
        key: "ventas/comprobantes",
        label: "Comprobantes",
      },
      {
        key: "ventas/remitos",
        label: "Remitos",
      },
      {
        key: "ventas/clientes",
        label:"Clientes",
      },
      {
        key: "ventas/pagos-cliente",
        label: "Pagos de cliente",
      },
    ],
  },
  {
    key: "compras",
    icon: <ShopOutlined style={{ color: '#13c2c2' }} />,
    label: "Compras",
    children: [
      {
        key: "compras/orden-compra",
        label: "Orden de compra",
      },
      {
        key: "compras/comprobantes",
        label: "Comprobantes",
      },
      {
        key: "compras/remitos",
        label: "Remitos",
      },
      {
        key: "compras/proveedores",
        label: "Proveedores",
      },
      {
        key: "compras/pagos-proveedor",
        label: "Pagos a proveedor",
      },
    ],
  },
  {
    key: "produccion",
    icon: <ShopOutlined style={{ color: '#faad14' }} />,
    label: "Producción",
  },
  {
    key: "mantenimiento",
    icon: <ShopOutlined style={{ color: '#eb2f96' }} />,
    label: "Mantenimiento",
  },
  {
    key: "stock",
    icon: <ShopOutlined style={{ color: '#722ed1' }} />,
    label: "Stock",
    children: [
      {
        key: "stock/materia-prima",
        label: "Materia Prima",
      },
      {
        key: "stock/productos",
        label: "Productos",
      },
    ],
  },
  {
    key: "reportes",
    icon: <BarChartOutlined />,
    label: "Reportes",
  },
  {
    key: "maestros",
    icon: <UserOutlined style={{ color: '#52c41a' }} />,
    label: "Maestros",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" breakpoint="lg" collapsedWidth="80">
        <div style={{ height: 64, margin: 16, fontWeight: 700, fontSize: 24, color: "#d48806", textAlign: "center" }}>
          Fábrica Admin
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
          onClick={({ key }) => navigate(key === "dashboard" ? "/" : `/${key}`)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fffbe6", padding: 0, fontSize: 20, fontWeight: 600, color: "#d48806", textAlign: "center" }}>
          Panel de Administración
        </Header>
        <Content style={{ margin: 24, background: "#fff", borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
