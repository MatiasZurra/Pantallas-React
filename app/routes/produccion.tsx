import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Órdenes de producción", path: "/ordenes-produccion" },
  { label: "Lista de productos a fabricar", path: "/productos-a-fabricar" },
];

export default function Produccion() {
  const navigate = useNavigate();
  return (
    <Card title="Producción" style={{ maxWidth: 500, margin: "32px auto" }}>
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
