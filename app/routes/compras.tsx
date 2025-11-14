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
];

export default function Compras() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = items.find(i => location.pathname.includes(i.path))?.key;
  return (
     <div style={{ padding: "2rem" }}>
      <Outlet />
    </div>
  );
}
