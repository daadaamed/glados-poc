from sqlalchemy.orm import joinedload
from glados.models import Entity, Room
from glados import transaction
from glados import db

def get_entities(filters):
    query = Entity.query

    type = filters.get("type")
    if type:
        query = query.filter(Entity.type == type)

    status = filters.get("status")
    if status:
        query = query.filter(Entity.status == status)

    room = filters.get("room")
    if room:
        query = query.join(Entity.room).filter(Room.name == room)

    return query

def get_entity_by_id(entity_id):
    return Entity.query.options(joinedload(Entity.room)).get(entity_id)

def _get_room_by_name(name):
    if not name:
        return None
    return Room.query.filter(Room.name == name).first()

def create_entity(data):
    room = _get_room_by_name(data.get("room"))
    if data.get("room") and not room:
        raise ValueError("room_not_found")

    entity = Entity(
        name=data["name"],
        type=data["type"],
        status=data["status"],
        value=data.get("value"),
        room_id=room.id if room else None,
    )
    with transaction():
        db.session.add(entity)
    return entity