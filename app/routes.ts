

import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("/", "./routes/admin-layout.tsx", [
		route("/", "./routes/dashboard.tsx"),
		route("/nuevo-pedido", "./routes/nuevo-pedido.tsx"),
		route("/productos", "./routes/productos.tsx"),
		route("/clientes", "./routes/clientes.tsx"),
		route("/proveedores", "./routes/proveedores.tsx"),
		route("/reportes", "./routes/reportes.tsx"),
	]),
] satisfies RouteConfig;
