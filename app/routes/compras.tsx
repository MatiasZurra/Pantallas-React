import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Órdenes de compra", path: "/ordenes-compra" },
  { label: "Remitos", path: "/remitos-proveedores" },
  { label: "Comprobantes", path: "/comprobantes-compras" },
  { label: "Pagos proveedores", path: "/pagos-proveedores" },
];

export default function Compras() {
  const navigate = useNavigate();
  return (
    <Card title="Compras" style={{ maxWidth: 500, margin: "32px auto" }}>
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
