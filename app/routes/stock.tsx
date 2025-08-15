import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Productos terminados", path: "/stock-productos" },
  { label: "Materias primas", path: "/stock-materias-primas" },
  { label: "Ajustes", path: "/ajustes-stock" },
];

export default function Stock() {
  const navigate = useNavigate();
  return (
    <Card title="Stock" style={{ maxWidth: 500, margin: "32px auto" }}>
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
