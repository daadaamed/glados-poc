from marshmallow import fields, validate

from glados import ma, constants
from glados.models import Entity


class EntitiesRequestSerializer(ma.Schema):
    type = fields.String(required=False, validate=validate.OneOf([x.name for x in constants.EntityType]))
    status = fields.String(required=False, validate=validate.OneOf([x.name for x in constants.EntityStatus]))
    room = fields.String(required=False)


class EntitySerializer(ma.Schema):
    created_at = fields.DateTime("%Y-%m-%dT%H:%M:%S")
    room = fields.Function(lambda obj: obj.room.name if getattr(obj, "room", None) else None)

    class Meta:
        model = Entity
        ordered = True
        fields = [
            "id",
            "name",
            "type",
            "status",
            "value",
            "created_at",
            "room"
        ]

class EntityCreateRequestSerializer(ma.Schema):
    name = fields.String(required=True)
    type = fields.String(required=True, validate=validate.OneOf([x.name for x in constants.EntityType]))
    status = fields.String(required=True, validate=validate.OneOf([x.name for x in constants.EntityStatus]))
    value = fields.String(required=False, allow_none=True)
    room = fields.String(required=False)  # by name

class EntityUpdateRequestSerializer(ma.Schema):
    name = fields.String(required=False)
    type = fields.String(required=False, validate=validate.OneOf([x.name for x in constants.EntityType]))
    status = fields.String(required=False, validate=validate.OneOf([x.name for x in constants.EntityStatus]))
    value = fields.String(required=False, allow_none=True)
    room = fields.String(required=False)

    
class EntityResponseSerializer(EntitySerializer):
    pass
