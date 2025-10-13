from flask import request
from flask_restful import Resource
from glados.repositories.entities import get_entities, get_entity_by_id, update_entity, create_entity
from marshmallow import ValidationError

from glados.api.entity.serializers import EntitiesRequestSerializer, EntityResponseSerializer
from glados.api.entity.serializers import (
    EntitiesRequestSerializer, EntityResponseSerializer,
    EntityCreateRequestSerializer, EntityUpdateRequestSerializer
)

class EntitiesAPI(Resource):
    def get(self):
        request_serializer = EntitiesRequestSerializer()
        data = request_serializer.load(request.args)

        entities = get_entities(data)

        serializer = EntityResponseSerializer(many=True)
        return serializer.dump(entities), 200
    
    def post(self):
        data = EntityCreateRequestSerializer().load(request.get_json() or {})
        try:
            entity = create_entity(data)
        except ValueError as e:
            if str(e) == "room_not_found":
                raise ValidationError({"room": ["Unknown room."]})
            raise
        return EntityResponseSerializer().dump(entity), 201

class EntityAPI(Resource):
    def get(self, entity_id):
        entity = get_entity_by_id(entity_id)
        if not entity:
            return {"message": "Resource not found.", "error": "not_found"}, 404
        return EntityResponseSerializer().dump(entity), 200
    
    def put(self, entity_id):
        entity = get_entity_by_id(entity_id)
        if not entity:
            return {"message": "Resource not found.", "error": "not_found"}, 404

        data = EntityUpdateRequestSerializer().load(request.get_json() or {})
        try:
            entity = update_entity(entity, data)
        except ValueError as e:
            if str(e) == "room_not_found":
                raise ValidationError({"room": ["Unknown room."]})
            raise
        return EntityResponseSerializer().dump(entity), 200
