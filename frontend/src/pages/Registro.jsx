import { useState } from "react";
import { registro } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [form, setForm] = useState({ email:"", password:"", nombre_completo:"", tienda_id:"" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registro({...form, tienda_id: parseInt(form.tienda_id)});
      setExito("Usuario registrado correctamente");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Error al registrar");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏪 TechStore</h2>
        <h3 style={styles.subtitle}>Registro</h3>
        {error && <p style={styles.error}>{error}</p>}
        {exito && <p style={styles.exito}>{exito}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="text" placeholder="Nombre completo"
            value={form.nombre_completo} onChange={e => setForm({...form, nombre_completo: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Contraseña (8+, mayúscula, número, especial)"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input style={styles.input} type="number" placeholder="ID de tienda"
            value={form.tienda_id} onChange={e => setForm({...form, tienda_id: e.target.value})} required />
          <button style={styles.button} type="submit">Registrarse</button>
          <p style={styles.link} onClick={() => navigate("/")}>¿Ya tienes cuenta? Inicia sesión</p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", background:"#f0f2f5" },
  card: { background:"white", padding:"40px", borderRadius:"12px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", width:"360px" },
  title: { textAlign:"center", color:"#1a73e8", marginBottom:"4px" },
  subtitle: { textAlign:"center", color:"#555", marginBottom:"20px" },
  input: { width:"100%", padding:"10px", marginBottom:"12px", borderRadius:"8px", border:"1px solid #ddd", boxSizing:"border-box" },
  button: { width:"100%", padding:"12px", background:"#1a73e8", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:"bold" },
  error: { color:"red", textAlign:"center" },
  exito: { color:"green", textAlign:"center" },
  link: { textAlign:"center", color:"#1a73e8", cursor:"pointer", marginTop:"12px" }
};
