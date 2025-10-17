# GLADOS — Smart Home (Back + Front)

### A minimal full-stack app to visualize, control, and narrate smart-home entities.

## Features
#### Backend (Flask)

- Entities API (/entities)

- List with filters: ?type=, ?room=, ?status=

- CRUD operation ( Post, GetById, Update, Delete)

- Validate bad datas

- DB indexes on type, status, room_id ( for better performance)

#### Frontend (Vue)

- Dashboard interface

- Cards for each entity (type, status, value, room, last updated)

- Group entities by room in the UI

- Filters: Type • Room • Status

- Responsive, mobile-friendly filter bar

- Guide user on empty states

- CRUD UI: Add / Edit / Delete (modal forms)

- Toasts notifications (top-right) for success & error

- Glados Assistant as a chatbot that takes order (using TTS); For now, it has a feature “List all entities” that speaks filtered items grouped by room with a stop control

- Floating chat-style button

