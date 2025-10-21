import React, { useState } from "react";
import "./App.css";
import { jsPDF } from "jspdf";

function App() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const reservar = async () => {
    if (!nombre.trim() || !fecha) {
      alert("Por favor ingresa tu nombre y selecciona la fecha.");
      return;
    }

    const folio = `AEM-${Date.now()}`;
    const reserva = { nombre, fecha, folio };

    try {
      const res = await fetch("http://localhost:5000/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
      });

      if (res.ok) {
        setMensaje(`✅ Reserva realizada. Folio: ${folio}`);
        generarPDF(reserva); // <-- Genera el ticket
        setNombre("");
        setFecha("");
      } else {
        setMensaje("❌ Error al hacer la reserva.");
      }
    } catch (error) {
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  // Función para generar PDF
  const generarPDF = ({ nombre, fecha, folio }) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Auto Eléctrico Maldonado ⚡", 20, 20);
    doc.setFontSize(14);
    doc.text(`Folio: ${folio}`, 20, 40);
    doc.text(`Nombre: ${nombre}`, 20, 50);
    doc.text(`Fecha de reparación: ${fecha}`, 20, 60);
    doc.text("¡Gracias por tu reserva!", 20, 80);
    doc.save(`ticket-${folio}.pdf`);
  };

  return (
    <div className="app">
      <h1>Auto Eléctrico Maldonado ⚡</h1>
      <h2>Reservación de reparación</h2>

      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label>Fecha de la reparación:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <button onClick={reservar}>Reservar</button>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default App;
