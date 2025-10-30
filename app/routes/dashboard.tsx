

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
    <div style={{ padding: 16, }}>
      <h2 style={{ color: "#1677ff", fontWeight: 700, marginBottom: 16, fontSize: 28, letterSpacing: 1, textAlign: 'center' }}>
        Panel Principal
      </h2>
      <Row gutter={[12, 12]} justify="space-between" align="top" style={{ width: '100%', maxWidth: 1400, margin: '0 auto' }}>
        <Col flex="1 1 220px">
          <Card size="small" title={<span><ArrowDownOutlined /> Stock bajo</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }} style={{ boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)' }}>
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
        <Col flex="1 1 220px">
          <Card size="small" title={<span><CalendarOutlined /> Órdenes prod. pendientes</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }} style={{ boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)' }}>
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
        <Col flex="1 1 220px">
          <Card size="small" title={<span><ShoppingCartOutlined /> Pedidos por entregar</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }} style={{ boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)' }}>
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
        <Col flex="1 1 220px">
          <Card size="small" title={<span><DollarOutlined /> Cuentas por cobrar</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }} style={{ boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)' }}>
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
        <Col flex="1 1 220px">
          <Card size="small" title={<span><CreditCardOutlined /> Cuentas por pagar</span>} bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }} style={{ boxShadow: '0 3px 10px rgb(0 0 0 / 0.1)' }}>
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

      </Row>
    </div>
  );
}
