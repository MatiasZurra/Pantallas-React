import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Órdenes de mantenimiento", path: "/ordenes-mantenimiento" },
];

export default function Mantenimiento() {
  const navigate = useNavigate();
  return (
    <Card title="Mantenimiento" style={{ maxWidth: 500, margin: "32px auto" }}>
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
