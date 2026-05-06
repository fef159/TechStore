import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏪 TechStore</h2>
        <button style={styles.logout} onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <div style={styles.welcome}>
        <h3>Bienvenido, {usuario.nombre_completo} 👋</h3>
        <p style={styles.email}>{usuario.email}</p>
        <p style={styles.tienda}>Tienda ID: {usuario.tienda_id}</p>
      </div>
      <div style={styles.cards}>
        <div style={styles.card} onClick={() => navigate("/roles")}>
          <span style={styles.icon}>👥</span>
          <h4>Gestión de Roles</h4>
          <p>Ver, crear y eliminar roles</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/productos")}>
          <span style={styles.icon}>📦</span>
          <h4>Gestión de Productos</h4>
          <p>Ver, crear y administrar productos</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", background:"#f0f2f5", padding:"20px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", background:"white", padding:"16px 24px", borderRadius:"12px", marginBottom:"24px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  title: { color:"#1a73e8", margin:0 },
  logout: { background:"#e53935", color:"white", border:"none", padding:"8px 16px", borderRadius:"8px", cursor:"pointer" },
  welcome: { background:"white", padding:"24px", borderRadius:"12px", marginBottom:"24px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  email: { color:"#666", margin:"4px 0" },
  tienda: { color:"#1a73e8", fontWeight:"bold" },
  cards: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" },
  card: { background:"white", padding:"32px", borderRadius:"12px", textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.08)", transition:"transform 0.2s" },
  icon: { fontSize:"40px" }
};
