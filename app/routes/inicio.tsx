import { Button } from "antd";

export default function FabricaDePastasInicio() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#fffbe6" }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, color: "#d48806", marginBottom: 16 }}>Fábrica de Pastas Artesanales</h1>
      <p style={{ fontSize: 20, color: "#595959", marginBottom: 32, maxWidth: 500, textAlign: "center" }}>
        Bienvenido a la mejor fábrica de pastas frescas. Disfrutá de nuestros productos artesanales, hechos con pasión y tradición italiana.
      </p>
      <Button type="primary" size="large" style={{ background: "#d48806", borderColor: "#d48806" }}>
        Ver productos
      </Button>
    </div>
  );
}
