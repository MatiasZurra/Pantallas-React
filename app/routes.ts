

import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("/", "./routes/admin-layout.tsx", [
		route("/", "./routes/dashboard.tsx"),
		route("/ventas", "./routes/ventas.tsx"),
		route("/compras", "./routes/compras.tsx"),
		route("/produccion", "./routes/produccion.tsx"),
		route("/mantenimiento", "./routes/mantenimiento.tsx"),
		route("/stock", "./routes/stock.tsx"),
		route("/reportes", "./routes/reportes.tsx"),
		route("/maestros", "./routes/maestros.tsx"),
	]),
] satisfies RouteConfig;
