import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { Menu, Layout } from "antd";
import {
  FileDoneOutlined,
  FileTextOutlined,
  CarOutlined,
  DollarOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const items = [
  { key: "orden-compra", icon: <FileDoneOutlined />, label: "Órdenes de compra", path: "orden-compra" },
  { key: "comprobantes", icon: <FileTextOutlined />, label: "Comprobantes", path: "comprobantes" },
  { key: "remitos", icon: <CarOutlined />, label: "Remitos", path: "remitos" },
  { key: "pagos-proveedor", icon: <DollarOutlined />, label: "Pagos a proveedores", path: "pagos-proveedor" },
  { key: "proveedores", icon: <TeamOutlined />, label: "Proveedores", path: "proveedores" },
];

export default function Compras() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = items.find(i => location.pathname.includes(i.path))?.key;
  return (
    <Layout style={{ minHeight: "60vh", background: "#f4f6fa" }}>
      <Sider width={220} style={{ background: "#fff", borderRadius: 12, margin: 16, boxShadow: "0 2px 8px #e6e6e6" }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          style={{ height: "100%", borderRight: 0, fontWeight: 500 }}
          items={items.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => navigate(item.path),
          }))}
        />
      </Sider>
      <Content style={{ margin: 16, padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #e6e6e6" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}
