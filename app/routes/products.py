from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.product import Producto
from app.models.user import Usuario, UsuarioRol
from app.models.role import Role

products_bp = Blueprint("products", __name__)

def get_usuario_y_rol(usuario_id):
    usuario = Usuario.query.get(int(usuario_id))
    asignacion = UsuarioRol.query.filter_by(usuario_id=int(usuario_id)).first()
    rol = Role.query.get(asignacion.rol_id).nombre if asignacion else None
    return usuario, rol

@products_bp.route("/", methods=["GET"])
@jwt_required()
def listar_productos():
    usuario_id = get_jwt_identity()
    usuario, rol = get_usuario_y_rol(usuario_id)

    if rol in ["Admin", "Auditor"]:
        productos = Producto.query.all()
    else:
        productos = Producto.query.filter_by(tienda_id=usuario.tienda_id).all()

    return jsonify([p.to_dict() for p in productos]), 200

@products_bp.route("/", methods=["POST"])
@jwt_required()
def crear_producto():
    usuario_id = get_jwt_identity()
    usuario, rol = get_usuario_y_rol(usuario_id)
    data = request.get_json()

    if rol == "Auditor":
        return jsonify({"error": "Auditores no pueden crear productos"}), 403
    if rol == "Empleado" and data.get("es_premium", False):
        return jsonify({"error": "Empleados no pueden crear productos premium"}), 403
    if rol in ["Gerente", "Empleado"] and data.get("tienda_id") != usuario.tienda_id:
        return jsonify({"error": "Solo puedes crear productos en tu tienda"}), 403

    producto = Producto(
        nombre=data["nombre"],
        descripcion=data.get("descripcion", ""),
        precio=data["precio"],
        stock=data.get("stock", 0),
        categoria=data.get("categoria", ""),
        tienda_id=data["tienda_id"],
        es_premium=data.get("es_premium", False),
        creado_por=int(usuario_id)
    )
    db.session.add(producto)
    db.session.commit()
    return jsonify(producto.to_dict()), 201

@products_bp.route("/<int:producto_id>", methods=["PUT"])
@jwt_required()
def actualizar_producto(producto_id):
    usuario_id = get_jwt_identity()
    usuario, rol = get_usuario_y_rol(usuario_id)
    producto = Producto.query.get_or_404(producto_id)
    data = request.get_json()

    if rol == "Auditor":
        return jsonify({"error": "Auditores no pueden modificar productos"}), 403
    if rol == "Empleado":
        if producto.tienda_id != usuario.tienda_id:
            return jsonify({"error": "Solo puedes modificar productos de tu tienda"}), 403
        producto.stock = data.get("stock", producto.stock)
        db.session.commit()
        return jsonify(producto.to_dict()), 200
    if rol == "Gerente":
        if producto.tienda_id != usuario.tienda_id:
            return jsonify({"error": "Solo puedes modificar productos de tu tienda"}), 403
        producto.nombre = data.get("nombre", producto.nombre)
        producto.descripcion = data.get("descripcion", producto.descripcion)
        producto.precio = data.get("precio", producto.precio)
        producto.stock = data.get("stock", producto.stock)
        producto.es_premium = data.get("es_premium", producto.es_premium)
        db.session.commit()
        return jsonify(producto.to_dict()), 200

    # Admin puede todo
    for campo in ["nombre", "descripcion", "precio", "stock", "categoria", "tienda_id", "es_premium"]:
        if campo in data:
            setattr(producto, campo, data[campo])
    db.session.commit()
    return jsonify(producto.to_dict()), 200

@products_bp.route("/<int:producto_id>", methods=["DELETE"])
@jwt_required()
def eliminar_producto(producto_id):
    usuario_id = get_jwt_identity()
    usuario, rol = get_usuario_y_rol(usuario_id)
    producto = Producto.query.get_or_404(producto_id)

    if rol in ["Empleado", "Auditor"]:
        return jsonify({"error": f"{rol}s no pueden eliminar productos"}), 403
    if rol == "Gerente":
        if producto.tienda_id != usuario.tienda_id:
            return jsonify({"error": "Solo puedes eliminar productos de tu tienda"}), 403
        if producto.es_premium:
            return jsonify({"error": "Gerentes no pueden eliminar productos premium"}), 403

    db.session.delete(producto)
    db.session.commit()
    return jsonify({"mensaje": "Producto eliminado"}), 200
