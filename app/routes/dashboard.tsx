import { Card, Statistic, Row, Col } from "antd";

export default function Dashboard() {
  // Simulación de datos actuales de la empresa
  const data = [
    { title: "Ventas Hoy", value: 124, suffix: "kg", color: "#1677ff" },
    { title: "Pedidos Pendientes", value: 8, color: "#13c2c2" },
    { title: "Clientes Activos", value: 56, color: "#52c41a" },
    { title: "Stock Harina", value: 320, suffix: "kg", color: "#faad14" },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#1677ff", fontWeight: 700, marginBottom: 24, fontSize: 32, letterSpacing: 1 }}>
        Dashboard de la Empresa
      </h2>
      <Row gutter={[24, 24]}>
        {data.map((item) => (
          <Col xs={24} sm={12} md={12} lg={6} key={item.title}>
            <Card variant="outlined" style={{ borderRadius: 16, boxShadow: "0 4px 16px #e6f4ff" }}>
              <Statistic
                title={<span style={{ color: "#595959" }}>{item.title}</span>}
                value={item.value}
                valueStyle={{ color: item.color, fontWeight: 700 }}
                suffix={item.suffix}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
