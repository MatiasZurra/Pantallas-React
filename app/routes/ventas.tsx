import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";

const acciones = [
  { label: "Presupuestos", path: "/presupuestos" },
  { label: "Órdenes de pedido", path: "/ordenes-pedido" },
  { label: "Comprobantes", path: "/comprobantes-ventas" },
  { label: "Remitos", path: "/remitos-clientes" },
  { label: "Pagos clientes", path: "/pagos-clientes" },
  {label: "Clientes", path: "/ventas/clientes"},
];

export default function Ventas() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "2rem" }}>
      <Outlet />
    </div>
  );
}
