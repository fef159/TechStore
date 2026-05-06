import { useState, useEffect } from "react";
import { getRoles, crearRol, eliminarRol } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ nombre:"", descripcion:"" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();

  useEffect(() => { cargarRoles(); }, []);

  const cargarRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (err) {
      setError("Error al cargar roles");
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(""); setExito("");
    try {
      await crearRol(form);
      setExito("Rol creado correctamente");
      setForm({ nombre:"", descripcion:"" });
      cargarRoles();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear rol");
    }
  };

  const handleEliminar = async (id) => {
    setError(""); setExito("");
    try {
      await eliminarRol(id);
      setExito("Rol eliminado");
      cargarRoles();
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar rol");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 Gestión de Roles</h2>
        <button style={styles.back} onClick={() => navigate("/dashboard")}>← Volver</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {exito && <p style={styles.exito}>{exito}</p>}
      <div style={styles.form}>
        <h3>Crear nuevo rol</h3>
        <form onSubmit={handleCrear} style={styles.formRow}>
          <input style={styles.input} placeholder="Nombre del rol"
            value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input style={styles.input} placeholder="Descripción"
            value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          <button style={styles.button} type="submit">Crear</button>
        </form>
      </div>
      <div style={styles.tabla}>
        <h3>Roles existentes</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>ID</th><th>Nombre</th><th>Descripción</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id} style={styles.tr}>
                <td style={styles.td}>{r.id}</td>
                <td style={styles.td}>{r.nombre}</td>
                <td style={styles.td}>{r.descripcion}</td>
                <td style={styles.td}>
                  <button style={styles.btnEliminar} onClick={() => handleEliminar(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"100vh", background:"#f0f2f5", padding:"20px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", background:"white", padding:"16px 24px", borderRadius:"12px", marginBottom:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  title: { color:"#1a73e8", margin:0 },
  back: { background:"#666", color:"white", border:"none", padding:"8px 16px", borderRadius:"8px", cursor:"pointer" },
  error: { color:"red", background:"#ffeaea", padding:"10px", borderRadius:"8px", marginBottom:"10px" },
  exito: { color:"green", background:"#eaffea", padding:"10px", borderRadius:"8px", marginBottom:"10px" },
  form: { background:"white", padding:"20px", borderRadius:"12px", marginBottom:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  formRow: { display:"flex", gap:"10px", flexWrap:"wrap" },
  input: { padding:"10px", borderRadius:"8px", border:"1px solid #ddd", flex:1 },
  button: { padding:"10px 20px", background:"#1a73e8", color:"white", border:"none", borderRadius:"8px", cursor:"pointer" },
  tabla: { background:"white", padding:"20px", borderRadius:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  table: { width:"100%", borderCollapse:"collapse" },
  thead: { background:"#1a73e8", color:"white" },
  tr: { borderBottom:"1px solid #eee" },
  td: { padding:"12px", textAlign:"left" },
  btnEliminar: { background:"#e53935", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer" }
};
