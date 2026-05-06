from app import db
from datetime import datetime

class UsuarioRol(db.Model):
    __tablename__ = "usuario_roles"

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"))
    rol_id = db.Column(db.Integer, db.ForeignKey("roles.id"))
    asignado_por = db.Column(db.Integer)
    fecha_asignacion = db.Column(db.DateTime, default=datetime.utcnow)

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nombre_completo = db.Column(db.String(100), nullable=False)
    tienda_id = db.Column(db.Integer)
    mfa_habilitado = db.Column(db.Boolean, default=False)
    mfa_secret = db.Column(db.String(32))
    mfa_codigo_temporal = db.Column(db.String(10))
    mfa_codigo_expira = db.Column(db.DateTime)
    intentos_fallidos = db.Column(db.Integer, default=0)
    activo = db.Column(db.Boolean, default=True)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    roles = db.relationship("UsuarioRol", backref="usuario", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre_completo": self.nombre_completo,
            "tienda_id": self.tienda_id,
            "mfa_habilitado": self.mfa_habilitado,
            "activo": self.activo,
            "fecha_creacion": str(self.fecha_creacion)
        }
