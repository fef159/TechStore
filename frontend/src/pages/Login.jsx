import { useState } from "react";
import { login, verificarMFA } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [mfa, setMfa] = useState({ requerido: false, usuario_id: null, codigo: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      if (res.data.mfa_requerido) {
        setMfa({ requerido: true, usuario_id: res.data.usuario_id, codigo: "" });
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  const handleMFA = async (e) => {
    e.preventDefault();
    try {
      const res = await verificarMFA({ usuario_id: mfa.usuario_id, codigo: mfa.codigo });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Código MFA incorrecto");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏪 TechStore</h2>
        <h3 style={styles.subtitle}>Iniciar Sesión</h3>
        {error && <p style={styles.error}>{error}</p>}
        {!mfa.requerido ? (
          <form onSubmit={handleLogin}>
            <input style={styles.input} type="email" placeholder="Email"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <input style={styles.input} type="password" placeholder="Contraseña"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button style={styles.button} type="submit">Ingresar</button>
            <p style={styles.link} onClick={() => navigate("/registro")}>
              ¿No tienes cuenta? Regístrate
            </p>
          </form>
        ) : (
          <form onSubmit={handleMFA}>
            <p style={styles.info}>Ingresa el código MFA enviado</p>
            <input style={styles.input} type="text" placeholder="Código de 6 dígitos"
              value={mfa.codigo} onChange={e => setMfa({...mfa, codigo: e.target.value})} required />
            <button style={styles.button} type="submit">Verificar</button>
          </form>
        )}
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
  error: { color:"red", textAlign:"center", marginBottom:"10px" },
  info: { color:"#555", textAlign:"center", marginBottom:"10px" },
  link: { textAlign:"center", color:"#1a73e8", cursor:"pointer", marginTop:"12px" }
};
