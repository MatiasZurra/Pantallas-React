import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Presupuestos", path: "/presupuestos" },
  { label: "Órdenes de pedido", path: "/ordenes-pedido" },
  { label: "Comprobantes", path: "/comprobantes-ventas" },
  { label: "Remitos", path: "/remitos-clientes" },
  { label: "Pagos clientes", path: "/pagos-clientes" },
];

export default function Ventas() {
  const navigate = useNavigate();
  return (
    <Card title="Ventas" style={{ maxWidth: 500, margin: "32px auto" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {acciones.map((a) => (
          <Button key={a.label} type="primary" block size="large" onClick={() => navigate(a.path)}>
            {a.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
}
