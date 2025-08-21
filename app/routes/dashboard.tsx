

import { Card, Row, Col, List, Typography, Progress } from "antd";
import { ArrowDownOutlined, CalendarOutlined, ShoppingCartOutlined, DollarOutlined, CreditCardOutlined, BarChartOutlined } from "@ant-design/icons";

const stockBajo = [
  { nombre: "Harina 000", cantidad: 8, unidad: "kg" },
  { nombre: "Queso rallado", cantidad: 2, unidad: "kg" },
  { nombre: "Caja ravioles", cantidad: 5, unidad: "un" },
];
const ordenesProduccion = [
  { producto: "Tallarines", fecha: "2025-08-16" },
  { producto: "Ravioles", fecha: "2025-08-17" },
];
const pedidosPendientes = [
  { cliente: "Juan Pérez", producto: "Ravioles", fecha: "2025-08-15" },
  { cliente: "Ana López", producto: "Tallarines", fecha: "2025-08-15" },
];
const cuentasCobrar = [
  { cliente: "Juan Pérez", monto: 12000 },
  { cliente: "Carlos Díaz", monto: 8000 },
];
const cuentasPagar = [
  { proveedor: "Molinos SA", monto: 15000 },
  { proveedor: "Lácteos SRL", monto: 6000 },
];
const ventasMes = [12, 18, 22, 15, 30, 25, 28, 32, 27, 35, 40, 38, 45, 50];
const produccionMes = [10, 15, 20, 13, 28, 22, 25, 30, 24, 32, 38, 36, 42, 48];


export default function Dashboard() {
  return (
    <div style={{ padding: 16, background: "#f0f2f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#1677ff", fontWeight: 700, marginBottom: 16, fontSize: 28, letterSpacing: 1, textAlign: 'center' }}>
        Panel Principal
      </h2>
      <Row gutter={[12, 12]} justify="center" align="middle" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card size="small" title={<span><ArrowDownOutlined /> Stock bajo</span>} style={{ minHeight: 180 }}>
            <List
              size="small"
              dataSource={stockBajo}
              renderItem={item => (
                <List.Item>
                  <Typography.Text>{item.nombre}</Typography.Text>
                  <span style={{ color: '#faad14', fontWeight: 600 }}>{item.cantidad} {item.unidad}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card size="small" title={<span><CalendarOutlined /> Órdenes prod. pendientes</span>} style={{ minHeight: 180 }}>
            <List
              size="small"
              dataSource={ordenesProduccion}
              renderItem={item => (
                <List.Item>
                  <Typography.Text>{item.producto}</Typography.Text>
                  <span style={{ color: '#1677ff' }}>{item.fecha}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card size="small" title={<span><ShoppingCartOutlined /> Pedidos por entregar</span>} style={{ minHeight: 180 }}>
            <List
              size="small"
              dataSource={pedidosPendientes}
              renderItem={item => (
                <List.Item>
                  <Typography.Text>{item.cliente} - {item.producto}</Typography.Text>
                  <span style={{ color: '#13c2c2' }}>{item.fecha}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card size="small" title={<span><DollarOutlined /> Cuentas por cobrar</span>} style={{ minHeight: 180 }}>
            <List
              size="small"
              dataSource={cuentasCobrar}
              renderItem={item => (
                <List.Item>
                  <Typography.Text>{item.cliente}</Typography.Text>
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>${item.monto.toLocaleString()}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card size="small" title={<span><CreditCardOutlined /> Cuentas por pagar</span>} style={{ minHeight: 180 }}>
            <List
              size="small"
              dataSource={cuentasPagar}
              renderItem={item => (
                <List.Item>
                  <Typography.Text>{item.proveedor}</Typography.Text>
                  <span style={{ color: '#eb2f96', fontWeight: 600 }}>${item.monto.toLocaleString()}</span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={4}>
          <Card size="small" title={<span><BarChartOutlined /> Ventas y producción</span>} style={{ minHeight: 180 }}>
            <div style={{ height: 120, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 100, width: '100%', gap: 2 }}>
                {ventasMes.map((v, i) => (
                  <div key={i} style={{ width: 6, height: v * 2, background: '#1677ff', opacity: 0.7, borderRadius: 2, marginBottom: 2 }} title={`Ventas: ${v}`}></div>
                ))}
                {produccionMes.map((p, i) => (
                  <div key={i+100} style={{ width: 6, height: p * 2, background: '#faad14', opacity: 0.7, borderRadius: 2, marginBottom: 2, marginLeft: -6 }} title={`Producción: ${p}`}></div>
                ))}
              </div>
              <div style={{ position: 'absolute', right: 12, top: 12, fontSize: 10, color: '#1677ff' }}>Azul: Ventas</div>
              <div style={{ position: 'absolute', right: 12, top: 28, fontSize: 10, color: '#faad14' }}>Amarillo: Producción</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
