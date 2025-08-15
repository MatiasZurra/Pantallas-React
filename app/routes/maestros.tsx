import { Card, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const acciones = [
  { label: "Clientes", path: "/clientes" },
  { label: "Proveedores", path: "/proveedores" },
  { label: "Productos", path: "/productos" },
  { label: "Materias primas", path: "/materias-primas" },
  { label: "Recetas", path: "/recetas" },
  { label: "Empleados", path: "/empleados" },
  { label: "Direcciones", path: "/direcciones" },
];

export default function Maestros() {
  const navigate = useNavigate();
  return (
    <Card title="Maestros" style={{ maxWidth: 500, margin: "32px auto" }}>
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
