import { useState, useEffect } from "react";
import { getProductos, crearProducto, eliminarProducto } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre:"", descripcion:"", precio:"", stock:"", categoria:"", tienda_id:"", es_premium:false });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const navigate = useNavigate();

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      setError("Error al cargar productos");
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(""); setExito("");
    try {
      await crearProducto({...form, precio: parseFloat(form.precio), stock: parseInt(form.stock), tienda_id: parseInt(form.tienda_id)});
      setExito("Producto creado correctamente");
      setForm({ nombre:"", descripcion:"", precio:"", stock:"", categoria:"", tienda_id:"", es_premium:false });
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear producto");
    }
  };

  const handleEliminar = async (id) => {
    setError(""); setExito("");
    try {
      await eliminarProducto(id);
      setExito("Producto eliminado");
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar producto");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Gestión de Productos</h2>
        <button style={styles.back} onClick={() => navigate("/dashboard")}>← Volver</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {exito && <p style={styles.exito}>{exito}</p>}
      <div style={styles.form}>
        <h3>Crear nuevo producto</h3>
        <form onSubmit={handleCrear} style={styles.formGrid}>
          <input style={styles.input} placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          <input style={styles.input} placeholder="Descripción" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          <input style={styles.input} placeholder="Precio" type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
          <input style={styles.input} placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input style={styles.input} placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
          <input style={styles.input} placeholder="ID Tienda" type="number" value={form.tienda_id} onChange={e => setForm({...form, tienda_id: e.target.value})} required />
          <label style={styles.check}>
            <input type="checkbox" checked={form.es_premium} onChange={e => setForm({...form, es_premium: e.target.checked})} />
            {" "}Es Premium
          </label>
          <button style={styles.button} type="submit">Crear Producto</button>
        </form>
      </div>
      <div style={styles.tabla}>
        <h3>Productos ({productos.length})</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Nombre</th><th>Precio</th><th>Stock</th><th>Tienda</th><th>Premium</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.nombre}</td>
                <td style={styles.td}>S/. {p.precio}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>{p.tienda_id}</td>
                <td style={styles.td}>{p.es_premium ? "⭐ Sí" : "No"}</td>
                <td style={styles.td}>
                  <button style={styles.btnEliminar} onClick={() => handleEliminar(p.id)}>Eliminar</button>
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
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" },
  input: { padding:"10px", borderRadius:"8px", border:"1px solid #ddd" },
  button: { padding:"10px 20px", background:"#1a73e8", color:"white", border:"none", borderRadius:"8px", cursor:"pointer", gridColumn:"span 2" },
  check: { display:"flex", alignItems:"center", gap:"8px" },
  tabla: { background:"white", padding:"20px", borderRadius:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  table: { width:"100%", borderCollapse:"collapse" },
  thead: { background:"#1a73e8", color:"white" },
  tr: { borderBottom:"1px solid #eee" },
  td: { padding:"12px", textAlign:"left" },
  btnEliminar: { background:"#e53935", color:"white", border:"none", padding:"6px 12px", borderRadius:"6px", cursor:"pointer" }
};
