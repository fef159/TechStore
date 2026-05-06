from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.role import Role
from app.models.user import UsuarioRol

roles_bp = Blueprint("roles", __name__)

def get_rol_usuario(usuario_id):
    asignacion = UsuarioRol.query.filter_by(usuario_id=usuario_id).first()
    if not asignacion:
        return None
    rol = Role.query.get(asignacion.rol_id)
    return rol.nombre if rol else None

@roles_bp.route("/", methods=["GET"])
@jwt_required()
def listar_roles():
    roles = Role.query.all()
    return jsonify([r.to_dict() for r in roles]), 200

@roles_bp.route("/", methods=["POST"])
@jwt_required()
def crear_rol():
    usuario_id = get_jwt_identity()
    rol_usuario = get_rol_usuario(int(usuario_id))

    if rol_usuario != "Admin":
        return jsonify({"error": "No tienes permisos de Administrador"}), 403

    data = request.get_json()
    if Role.query.filter_by(nombre=data.get("nombre")).first():
        return jsonify({"error": "El rol ya existe"}), 400

    rol = Role(nombre=data["nombre"], descripcion=data.get("descripcion", ""))
    db.session.add(rol)
    db.session.commit()
    return jsonify(rol.to_dict()), 201

@roles_bp.route("/<int:rol_id>", methods=["PUT"])
@jwt_required()
def actualizar_rol(rol_id):
    usuario_id = get_jwt_identity()
    rol_usuario = get_rol_usuario(int(usuario_id))

    if rol_usuario != "Admin":
        return jsonify({"error": "No tienes permisos de Administrador"}), 403

    rol = Role.query.get_or_404(rol_id)
    data = request.get_json()
    rol.nombre = data.get("nombre", rol.nombre)
    rol.descripcion = data.get("descripcion", rol.descripcion)
    db.session.commit()
    return jsonify(rol.to_dict()), 200

@roles_bp.route("/<int:rol_id>", methods=["DELETE"])
@jwt_required()
def eliminar_rol(rol_id):
    usuario_id = get_jwt_identity()
    rol_usuario = get_rol_usuario(int(usuario_id))

    if rol_usuario != "Admin":
        return jsonify({"error": "No tienes permisos de Administrador"}), 403

    if UsuarioRol.query.filter_by(rol_id=rol_id).first():
        return jsonify({"error": "No se puede eliminar un rol con usuarios asignados"}), 400

    rol = Role.query.get_or_404(rol_id)
    db.session.delete(rol)
    db.session.commit()
    return jsonify({"mensaje": "Rol eliminado"}), 200
