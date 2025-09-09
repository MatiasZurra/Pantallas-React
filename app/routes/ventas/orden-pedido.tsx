import React from "react";

export default function OrdenPedidoVentas() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Orden de pedido</h2>
      <ul style={{ listStyle: "none", padding: 0, width: "250px" }}>
        <li><button style={{ width: "100%", marginBottom: "0.75rem", padding: "0.75rem", fontSize: "1rem", background: "#1b3cd1ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Crear</button></li>
        <li><button style={{ width: "100%", marginBottom: "0.75rem", padding: "0.75rem", fontSize: "1rem", background: "#1b3cd1ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Ver</button></li>
        <li><button style={{ width: "100%", marginBottom: "0.75rem", padding: "0.75rem", fontSize: "1rem", background:"#1b3cd1ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Editar</button></li>
        <li><button style={{ width: "100%", marginBottom: "0.75rem", padding: "0.75rem", fontSize: "1rem", background: "#1b3cd1ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>Eliminar</button></li>
      </ul>
    </div>
  );
}
