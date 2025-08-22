
import { Form, Input, InputNumber, Button, Card, message, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function NuevoPedido() {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("¡Pedido cargado exitosamente!");
    }, 1200);
  };

  return (
    <Card title="Cargar Nuevo Pedido" style={{ maxWidth: 600, margin: "32px auto" }}>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Nombre del Cliente" name="cliente" rules={[{ required: true, message: "Ingrese el nombre del cliente" }]}> 
          <Input placeholder="Ej: Juan Pérez" />
        </Form.Item>
        <Form.List name="productos" rules={[{ validator: async(_, productos) => { if (!productos || productos.length < 1) throw new Error('Agregue al menos un producto'); } }]}> 
          {(fields, { add, remove }, { errors }) => (
            <>
              <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Productos</label>
              {fields.map((field, idx) => (
                <Space key={String(field.key)} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'nombre']}
                    fieldKey={[field.fieldKey, 'nombre']}
                    rules={[{ required: true, message: 'Ingrese el producto' }]}
                    style={{ margin: 0 }}
                  >
                    <Input placeholder="Producto" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'cantidad']}
                    fieldKey={[field.fieldKey, 'cantidad']}
                    rules={[{ required: true, message: 'Ingrese la cantidad' }]}
                    style={{ margin: 0 }}
                  >
                    <InputNumber min={0.1} step={0.1} placeholder="Cantidad (kg)" />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: '#ff4d4f' }} />
                  ) : null}
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  Agregar producto
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item label="Observaciones" name="observaciones">
          <Input.TextArea rows={2} placeholder="Opcional" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Cargar Pedido
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
