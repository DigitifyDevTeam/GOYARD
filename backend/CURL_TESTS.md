# Curl commands to test the backend API

Run these **on the server** from any directory (or from `~/GOYARD/backend`).  
**Note:** Backend runs on port **8002** (not 8000). Replace `127.0.0.1:8002` with your server IP or domain if testing from another machine.

---

## 1. Quick health check (no DB)

```bash
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8002/api/demenagement/clients/
```

Expected: `200` (or `301`/`302` if redirect). If you get `000` or connection refused, Gunicorn is not reachable.

---

## 2. List clients (GET)

```bash
curl -s http://127.0.0.1:8002/api/demenagement/clients/
```

Expected: JSON with `"success": true` and a `data` array.

---

## 3. Submit client information (POST)

This is the endpoint used when the user submits “mes coordonnées”. Use it to see if the API accepts the request and what it returns.

**Minimal (6 fields, like the frontend):**
```bash
curl -s -w "\nHTTP_CODE:%{http_code}\n" -X POST http://127.0.0.1:8002/api/demenagement/client-info/ \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Jean","nom":"Dupont","email":"jean@example.com","phone":"0123456789","date_demenagement":"2025-12-01","adresse_depart":"10 Rue de la Paix, Paris"}'
```

**Full payload:**
```bash
curl -s -w "\nHTTP_CODE:%{http_code}\n" -X POST http://127.0.0.1:8002/api/demenagement/client-info/ \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com",
    "phone": "0123456789",
    "date_demenagement": "2025-12-01",
    "adresse_depart": "10 Rue de la Paix, Paris",
    "etage_depart": "RDC",
    "ascenseur_depart": "Non",
    "options_depart": {},
    "has_stopover": false,
    "adresse_arrivee": "20 Avenue Victor Hugo, Paris",
    "etage_arrivee": "RDC",
    "ascenseur_arrivee": "Non",
    "options_arrivee": {}
  }'
```

- Success: HTTP 201 and JSON with `"success": true` and `"data": { "id": 1, ... }`.
- Validation error: HTTP 400 and JSON with `"success": false`, `"errors": { ... }` (e.g. phone format, date in the past).

---

## 4. If the frontend calls the API on another host (e.g. domain vs :8002)

From your **local machine** (replace `YOUR_SERVER_IP` or use the domain):

```bash
curl -s -X POST http://YOUR_SERVER_IP:8002/api/demenagement/client-info/ \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Jean","nom":"Dupont","email":"j@example.com","phone":"0123456789","date_demenagement":"2025-12-01","adresse_depart":"10 Rue Paris","etage_depart":"RDC","ascenseur_depart":"Non","options_depart":{},"has_stopover":false,"adresse_arrivee":"20 Ave Paris","etage_arrivee":"RDC","ascenseur_arrivee":"Non","options_arrivee":{}}'
```

If this works but the browser app still shows “Erreur lors de l'enregistrement de vos informations”, the problem is likely:

- **Wrong URL in the app**: frontend must call the same host/port as the backend (e.g. both on `goyard-demenagement.fr` with `/api/` or both on `IP:8002`).
- **CORS**: backend must allow the origin the frontend is served from (see `CORS_ALLOWED_ORIGINS` in production settings).

---

## 5. Check Gunicorn log

```bash
tail -50 ~/GOYARD/backend/gunicorn.log
```

Look for tracebacks or 4xx/5xx responses when you submit the form.
