from app import db
from datetime import datetime

class Producto(db.Model):
    __tablename__ = "productos"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(300))
    precio = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    categoria = db.Column(db.String(50))
    tienda_id = db.Column(db.Integer, nullable=False)
    es_premium = db.Column(db.Boolean, default=False)
    creado_por = db.Column(db.Integer)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "stock": self.stock,
            "categoria": self.categoria,
            "tienda_id": self.tienda_id,
            "es_premium": self.es_premium,
            "creado_por": self.creado_por,
            "fecha_creacion": str(self.fecha_creacion)
        }
