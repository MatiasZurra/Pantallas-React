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
    key: "nuevo-pedido",
    icon: <ShopOutlined style={{ color: '#faad14' }} />,
    label: "Nuevo Pedido",
  },
  {
    key: "productos",
    icon: <ShopOutlined />,
    label: "Productos",
  },
  {
    key: "clientes",
    icon: <UserOutlined style={{ color: '#1677ff' }} />,
    label: "Clientes",
  },
  {
    key: "proveedores",
    icon: <UserOutlined style={{ color: '#13c2c2' }} />,
    label: "Proveedores",
  },
  {
    key: "reportes",
    icon: <BarChartOutlined />,
    label: "Reportes",
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
