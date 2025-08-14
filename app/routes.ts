

import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("/", "./routes/admin-layout.tsx", [
		route("/", "./routes/dashboard.tsx"),
		route("/productos", "./routes/productos.tsx"),
		route("/usuarios", "./routes/usuarios.tsx"),
		route("/reportes", "./routes/reportes.tsx"),
	]),
] satisfies RouteConfig;
