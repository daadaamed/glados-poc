import uuid
import pytest

from glados import constants
from glados.models import Entity, Room


@pytest.fixture
def entities():
    kitchen = Room(id=uuid.UUID(int=1), name="Kitchen")
    kitchen.save(commit=False)

    living_room = Room(id=uuid.UUID(int=2), name="Living Room")
    living_room.save(commit=False)

    entity = Entity(
        id=uuid.UUID(int=1),
        name="Ceiling Light",
        type=constants.EntityType.light.name,
        status=constants.EntityStatus.off.name,
        value=None,
        room_id=kitchen.id)
    entity.save(commit=False)

    entity = Entity(
        id=uuid.UUID(int=2),
        name="Lamp",
        type=constants.EntityType.light.name,
        status=constants.EntityStatus.on.name,
        value=200,
        room_id=living_room.id)
    entity.save(commit=False)

    entity = Entity(
        id=uuid.UUID(int=3),
        name="Thermometer",
        type=constants.EntityType.sensor.name,
        status=constants.EntityStatus.on.name,
        value=28,
        room_id=living_room.id)
    entity.save(commit=False)


def test_get_entities_with_invalid_data(client):
    response = client.get("/entities?type=invalid")

    assert response.status_code == 422
    assert response.json == {"errors": {
        "type": ["Must be one of: sensor, light, switch, multimedia, air_conditioner."]
    }}


def test_get_entities(client, entities, mocker):
    response = client.get("/entities")

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "00000000-0000-0000-0000-000000000001",
            "name": "Ceiling Light",
            "type": "light",
            "status": "off",
            "value": None,
            "created_at": mocker.ANY,
            "room": "Kitchen"
        },
        {
            "id": "00000000-0000-0000-0000-000000000002",
            "name": "Lamp",
            "type": "light",
            "status": "on",
            "value": "200",
            "created_at": mocker.ANY,
            "room": "Living Room"
        },
        {
            "id": "00000000-0000-0000-0000-000000000003",
            "name": "Thermometer",
            "type": "sensor",
            "status": "on",
            "value": "28",
            "created_at": mocker.ANY,
            "room": "Living Room"
        }
    ]


def test_get_entities_with_type_filter(client, entities, mocker):
    response = client.get("/entities?type=sensor")

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "00000000-0000-0000-0000-000000000003",
            "name": "Thermometer",
            "type": "sensor",
            "status": "on",
            "value": "28",
            "created_at": mocker.ANY,
            "room": "Living Room"
        }
    ]


def test_get_entities_with_status_filter(client, entities, mocker):
    response = client.get("/entities?status=on")

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "00000000-0000-0000-0000-000000000002",
            "name": "Lamp",
            "type": "light",
            "status": "on",
            "value": "200",
            "created_at": mocker.ANY,
            "room": "Living Room"
        },
        {
            "id": "00000000-0000-0000-0000-000000000003",
            "name": "Thermometer",
            "type": "sensor",
            "status": "on",
            "value": "28",
            "created_at": mocker.ANY,
            "room": "Living Room"
        }
    ]


def test_get_entities_with_room_filter(client, entities, mocker):
    response = client.get("/entities?room=Kitchen")

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "00000000-0000-0000-0000-000000000001",
            "name": "Ceiling Light",
            "type": "light",
            "status": "off",
            "value": None,
            "created_at": mocker.ANY,
            "room": "Kitchen"
        }
    ]


def test_get_entities_with_room_and_status_filters(client, entities, mocker):
    response = client.get("/entities?room=Living%20Room&status=on")

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "00000000-0000-0000-0000-000000000002",
            "name": "Lamp",
            "type": "light",
            "status": "on",
            "value": "200",
            "created_at": mocker.ANY,
            "room": "Living Room"
        },
        {
            "id": "00000000-0000-0000-0000-000000000003",
            "name": "Thermometer",
            "type": "sensor",
            "status": "on",
            "value": "28",
            "created_at": mocker.ANY,
            "room": "Living Room"
        }
    ]


def test_get_entities_with_invalid_status(client):
    response = client.get("/entities?status=invalid")

    assert response.status_code == 422
    assert response.json == {"errors": {
        "status": ["Must be one of: on, off, unavailable."]
    }}


def test_get_entity_by_id(client, entities, mocker):
    # Known entity id=1 from fixture
    resp = client.get("/entities/00000000-0000-0000-0000-000000000001")
    assert resp.status_code == 200
    assert resp.json == {
        "id": "00000000-0000-0000-0000-000000000001",
        "name": "Ceiling Light",
        "type": "light",
        "status": "off",
        "value": None,
        "created_at": mocker.ANY,
        "room": "Kitchen"
    }


def test_get_entity_by_id_not_found(client):
    resp = client.get("/entities/00000000-0000-0000-0000-0000000000aa")
    assert resp.status_code == 404
    assert resp.json == {"error": "not_found", "message": "Resource not found."}


def test_create_entity(client, entities, mocker):
    payload = {
        "name": "Desk Switch",
        "type": "switch",
        "status": "off",
        "value": None,
        "room": "Living Room"  # existing from fixture
    }
    resp = client.post("/entities", json=payload)
    assert resp.status_code == 201
    body = resp.json
    assert body["name"] == "Desk Switch"
    assert body["type"] == "switch"
    assert body["status"] == "off"
    assert body["room"] == "Living Room"
    assert body["id"] is not None
    assert body["created_at"] == mocker.ANY

def test_create_entity_invalid_status(client):
    payload = {"name": "Bad One", "type": "light", "status": "nope"}
    resp = client.post("/entities", json=payload)
    assert resp.status_code == 422
    assert resp.json == {"errors": {"status": ["Must be one of: on, off, unavailable."]}}

def test_create_entity_room_not_found(client):
    payload = {"name": "Unknown Room Device", "type": "light", "status": "on", "room": "Garage"}
    resp = client.post("/entities", json=payload)
    assert resp.status_code == 422
    assert resp.json == {"errors": {"room": ["Unknown room."]}}

def test_update_entity(client, entities):
    eid = "00000000-0000-0000-0000-000000000002"  # Lamp
    payload = {"status": "off", "value": "150", "room": "Kitchen"}
    resp = client.put(f"/entities/{eid}", json=payload)
    assert resp.status_code == 200
    assert resp.json["status"] == "off"
    assert resp.json["value"] == "150"
    assert resp.json["room"] == "Kitchen"

def test_update_entity_not_found(client):
    resp = client.put("/entities/00000000-0000-0000-0000-0000000000aa", json={"name": "X"})
    assert resp.status_code == 404
    assert resp.json == {"error": "not_found", "message": "Resource not found."}

def test_update_entity_invalid_type(client, entities):
    eid = "00000000-0000-0000-0000-000000000001"
    resp = client.put(f"/entities/{eid}", json={"type": "nope"})
    assert resp.status_code == 422
    assert resp.json == {"errors": {"type": ["Must be one of: sensor, light, switch, multimedia, air_conditioner."]}}

def test_delete_entity(client, entities):
    eid = "00000000-0000-0000-0000-000000000003"  # Thermometer
    resp = client.delete(f"/entities/{eid}")
    assert resp.status_code == 204
    # ensure gone
    resp2 = client.get(f"/entities/{eid}")
    assert resp2.status_code == 404

def test_delete_entity_not_found(client):
    resp = client.delete("/entities/00000000-0000-0000-0000-0000000000aa")
    assert resp.status_code == 404
