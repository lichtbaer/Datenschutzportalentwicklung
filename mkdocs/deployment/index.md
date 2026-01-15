# Deployment Guide

## Übersicht

Das Projekt wird aktuell **per Docker Compose** betrieben. Die Produktions-Variante nutzt **Traefik** als Reverse Proxy und TLS-Manager (Let's Encrypt). Eine einzelne `.env` im Projekt-Root ist die zentrale Konfiguration für Backend **und** Frontend-Build.

> Hinweis: Kubernetes/Manifeste sind derzeit nicht Teil des Repos und werden hier nicht dokumentiert.

## Voraussetzungen

- Docker 24+ und Docker Compose 2+
- Öffentliche DNS-Einträge für `FRONTEND_HOST` und `BACKEND_HOST`
- Ports **80/443** am Server offen
- Nextcloud- und SMTP-Zugangsdaten

## Projektstruktur (relevant für Deploy)

```
datenschutzportal/
├── frontend/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx.conf
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
└── env.example
```

## Konfiguration (.env)

Die `.env` liegt im Projekt-Root und wird von Compose gemountet. Startpunkt:

```bash
cp env.example .env
```

Pflichtwerte für Produktion (Auszug):

- `NEXTCLOUD_URL`, `NEXTCLOUD_USERNAME`, `NEXTCLOUD_PASSWORD`
- `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`
- `NOTIFICATION_EMAILS`
- `SECRET_KEY`, `LOG_REDACTION_SECRET`, `API_TOKEN`
- `VITE_API_URL` (z.B. `https://api.example.com/api`)
- `VITE_API_TOKEN` (muss dem `API_TOKEN` entsprechen)
- `FRONTEND_HOST`, `BACKEND_HOST` (Domains für Traefik-Router)
- `TRAEFIK_ACME_EMAIL`

Wichtig:
- **VITE_*** Variablen werden **zur Build-Zeit** ins Frontend eingebettet. Änderungen erfordern einen Rebuild des Frontend-Images.
- Die `.env` ist die **single source of truth** (siehe Kommentare in `env.example`).

## Deployment mit Docker Compose (Produktion)

```bash
# 1. Konfiguration anpassen
cp env.example .env
nano .env

# 2. Build & Start
docker compose up -d --build

# 3. Status prüfen
docker compose ps

# 4. Logs beobachten
docker compose logs -f

# 5. Health Check
curl https://<BACKEND_HOST>/api/health
```

### HTTPS mit Traefik

Traefik ist im `docker-compose.yml` bereits konfiguriert und holt sich Zertifikate automatisch via Let's Encrypt:

- `TRAEFIK_ACME_EMAIL` in `.env` setzen
- DNS für `FRONTEND_HOST` und `BACKEND_HOST` auf den Server zeigen lassen
- Ports 80/443 offen
- Zertifikate werden in `./letsencrypt` gespeichert

## Betriebshinweise

- **Frontend**: `VITE_API_URL` und `VITE_API_TOKEN` werden beim Build gesetzt. Wenn sich die API-URL ändert: `docker compose build frontend && docker compose up -d frontend`.
- **Backend**: Die `.env` wird in den Container gemountet (`/.env`); ein Neustart reicht, wenn sich Werte ändern.
- **Ports**: `frontend` ist zusätzlich auf `3000:80` gemappt (optional); der öffentliche Zugriff erfolgt über Traefik.
- **CORS**: in `.env` per `CORS_ORIGINS` konfigurieren (JSON-Array oder CSV).

## Development (optional)

Für lokale Entwicklung mit Hot-Reload:

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Standard-URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/api`

## Troubleshooting

**Issue**: TLS-Zertifikat wird nicht ausgestellt  
**Fix**: DNS prüfen, Ports 80/443 öffnen, `TRAEFIK_ACME_EMAIL` setzen, Logs von `traefik` ansehen.

**Issue**: Frontend spricht falsche API-URL an  
**Fix**: `VITE_API_URL` in `.env` ändern, Frontend neu bauen.

**Issue**: 401 bei API Calls  
**Fix**: `VITE_API_TOKEN` und `API_TOKEN` müssen identisch sein.
