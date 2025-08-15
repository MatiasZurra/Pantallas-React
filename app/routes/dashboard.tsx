

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
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <h2 style={{ color: "#1677ff", fontWeight: 700, marginBottom: 32, fontSize: 32, letterSpacing: 1 }}>
        Panel Principal
      </h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Card title={<span><ArrowDownOutlined /> Stock bajo</span>}>
            <List
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
        <Col xs={24} md={12} lg={8}>
          <Card title={<span><CalendarOutlined /> Órdenes de producción pendientes</span>}>
            <List
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
        <Col xs={24} md={12} lg={8}>
          <Card title={<span><ShoppingCartOutlined /> Pedidos de clientes por entregar</span>}>
            <List
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
        <Col xs={24} md={12} lg={8}>
          <Card title={<span><DollarOutlined /> Cuentas por cobrar</span>}>
            <List
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
        <Col xs={24} md={12} lg={8}>
          <Card title={<span><CreditCardOutlined /> Cuentas por pagar</span>}>
            <List
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
        <Col xs={24} md={24} lg={16}>
          <Card title={<span><BarChartOutlined /> Ventas y producción del mes</span>}>
            <div style={{ height: 220, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Gráfico simple con barras usando solo divs, para no agregar librerías */}
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, width: '100%', gap: 4 }}>
                {ventasMes.map((v, i) => (
                  <div key={i} style={{ width: 12, height: v * 3, background: '#1677ff', opacity: 0.7, borderRadius: 2, marginBottom: 2 }} title={`Ventas: ${v}`}></div>
                ))}
                {produccionMes.map((p, i) => (
                  <div key={i+100} style={{ width: 12, height: p * 3, background: '#faad14', opacity: 0.7, borderRadius: 2, marginBottom: 2, marginLeft: -12 }} title={`Producción: ${p}`}></div>
                ))}
              </div>
              <div style={{ position: 'absolute', right: 24, top: 24, fontSize: 12, color: '#1677ff' }}>Azul: Ventas</div>
              <div style={{ position: 'absolute', right: 24, top: 44, fontSize: 12, color: '#faad14' }}>Amarillo: Producción</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
