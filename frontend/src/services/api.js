import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (data) => API.post("/auth/login", data);
export const registro = (data) => API.post("/auth/registro", data);
export const verificarMFA = (data) => API.post("/auth/verificar-mfa", data);

export const getRoles = () => API.get("/roles/");
export const crearRol = (data) => API.post("/roles/", data);
export const eliminarRol = (id) => API.delete(`/roles/${id}`);

export const getProductos = () => API.get("/products/");
export const crearProducto = (data) => API.post("/products/", data);
export const actualizarProducto = (id, data) => API.put(`/products/${id}`, data);
export const eliminarProducto = (id) => API.delete(`/products/${id}`);
