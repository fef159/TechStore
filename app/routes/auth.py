from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import Usuario, UsuarioRol
from app.models.role import Role
import bcrypt
import re
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

def validar_password(password):
    if len(password) < 8:
        return False, "Mínimo 8 caracteres"
    if not re.search(r'[A-Z]', password):
        return False, "Debe tener al menos una mayúscula"
    if not re.search(r'[0-9]', password):
        return False, "Debe tener al menos un número"
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return False, "Debe tener al menos un carácter especial"
    return True, "OK"

@auth_bp.route("/registro", methods=["POST"])
def registro():
    data = request.get_json()

    campos = ["email", "password", "nombre_completo", "tienda_id"]
    for campo in campos:
        if campo not in data:
            return jsonify({"error": f"Campo requerido: {campo}"}), 400

    if Usuario.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    valido, mensaje = validar_password(data["password"])
    if not valido:
        return jsonify({"error": mensaje}), 400

    password_hash = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    usuario = Usuario(
        email=data["email"],
        password_hash=password_hash.decode(),
        nombre_completo=data["nombre_completo"],
        tienda_id=data["tienda_id"]
    )
    db.session.add(usuario)
    db.session.flush()

    rol_empleado = Role.query.filter_by(nombre="Empleado").first()
    if rol_empleado:
        asignacion = UsuarioRol(usuario_id=usuario.id, rol_id=rol_empleado.id)
        db.session.add(asignacion)

    db.session.commit()
    return jsonify({"mensaje": "Usuario registrado correctamente", "usuario": usuario.to_dict()}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    usuario = Usuario.query.filter_by(email=data.get("email")).first()

    if not usuario or not usuario.activo:
        return jsonify({"error": "Credenciales inválidas"}), 401

    if usuario.intentos_fallidos >= 5:
        return jsonify({"error": "Cuenta bloqueada por demasiados intentos fallidos"}), 403

    if not bcrypt.checkpw(data["password"].encode(), usuario.password_hash.encode()):
        usuario.intentos_fallidos += 1
        db.session.commit()
        restantes = 5 - usuario.intentos_fallidos
        return jsonify({"error": f"Contraseña incorrecta. Intentos restantes: {restantes}"}), 401

    usuario.intentos_fallidos = 0

    if usuario.mfa_habilitado:
        import random
        codigo = str(random.randint(100000, 999999))
        usuario.mfa_codigo_temporal = codigo
        usuario.mfa_codigo_expira = datetime.utcnow() + timedelta(minutes=5)
        db.session.commit()
        return jsonify({
            "mensaje": "Código MFA requerido",
            "mfa_requerido": True,
            "usuario_id": usuario.id,
            "codigo_mfa": codigo
        }), 200

    db.session.commit()
    token = create_access_token(identity=str(usuario.id))
    return jsonify({"token": token, "usuario": usuario.to_dict()}), 200

@auth_bp.route("/verificar-mfa", methods=["POST"])
def verificar_mfa():
    data = request.get_json()
    usuario = Usuario.query.get(data.get("usuario_id"))

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if datetime.utcnow() > usuario.mfa_codigo_expira:
        return jsonify({"error": "Código MFA expirado"}), 401

    if usuario.mfa_codigo_temporal != data.get("codigo"):
        return jsonify({"error": "Código MFA incorrecto"}), 401

    usuario.mfa_codigo_temporal = None
    usuario.mfa_codigo_expira = None
    db.session.commit()

    token = create_access_token(identity=str(usuario.id))
    return jsonify({"token": token, "usuario": usuario.to_dict()}), 200

@auth_bp.route("/activar-mfa", methods=["POST"])
@jwt_required()
def activar_mfa():
    usuario_id = get_jwt_identity()
    usuario = Usuario.query.get(int(usuario_id))

    usuario.mfa_habilitado = True
    db.session.commit()
    return jsonify({"mensaje": "MFA activado correctamente"}), 200
