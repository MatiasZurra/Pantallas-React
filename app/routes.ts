

import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("/", "./routes/admin-layout.tsx", [
		route("/", "./routes/dashboard.tsx"),
			route("/ventas", "./routes/ventas.tsx", [
				   route("presupuesto", "./routes/ventas/presupuesto.tsx"),
				   route("orden-pedido", "./routes/ventas/orden-pedido.tsx"),
				   route("comprobantes", "./routes/ventas/comprobantes.tsx"),
				   route("remitos", "./routes/ventas/remitos.tsx"),
				   route("pagos-cliente", "./routes/ventas/pagos-cliente.tsx"),
				   route("clientes", "./routes/ventas/clientes.tsx"),
			]),
			route("/compras", "./routes/compras.tsx", [
				route("orden-compra", "./routes/compras/orden-compra.tsx"),
				route("comprobantes", "./routes/compras/comprobantes.tsx"),
				route("remitos", "./routes/compras/remitos.tsx"),
				   route("pagos-proveedor", "./routes/compras/pagos-proveedor.tsx"),
				   route("proveedores", "./routes/compras/proveedores.tsx"),
			]),
		route("/produccion", "./routes/produccion.tsx", [
			route("ordenes-produccion", "./routes/ordenes-produccion.tsx"),
			route("recetas", "./routes/maestros/recetas.tsx"),
		]),
		route("/mantenimiento", "./routes/mantenimiento.tsx",[
			route("ordenes-mantenimiento", "./routes/mantenimiento/ordenes-mantenimiento.tsx"),
			route("maquinas", "./routes/mantenimiento/maquinas.tsx"),
		]),
		route("/stock", "./routes/stock.tsx", [
			route("materia-prima", "./routes/stock/materia-prima.tsx"),
			route("productos", "./routes/stock/productos.tsx"),
		]),
		
		route("/maestros", "./routes/maestros.tsx", [
			route("empleados", "./routes/maestros/empleados.tsx"),
			route("unidades", "./routes/maestros/unidades.tsx"),
		]),
	]),
] satisfies RouteConfig;
