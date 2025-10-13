from sqlalchemy.orm import joinedload
from glados.models import Entity, Room


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