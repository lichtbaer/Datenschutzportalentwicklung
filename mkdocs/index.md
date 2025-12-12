# Datenschutzportal

Das Datenschutzportal ist eine webbasierte Anwendung zur sicheren Einreichung und Verwaltung von datenschutzrelevanten Dokumenten für Forschungsprojekte.

## System Überblick

```mermaid
C4Context
    title System Context Diagram for Data Protection Portal

    Person(researcher, "Researcher", "University/Clinic Staff submitting documents")
    Person(dpo, "Data Protection Officer", "Reviews submitted documents")
    
    System_Boundary(portal_boundary, "Data Protection Portal") {
        System(webapp, "Web Application", "React Frontend + FastAPI Backend")
    }

    System_Ext(nextcloud, "Nextcloud", "Document Storage (WebDAV)")
    System_Ext(smtp, "SMTP Server", "Email Notifications")

    Rel(researcher, webapp, "Uploads documents", "HTTPS")
    Rel(webapp, nextcloud, "Stores files", "WebDAV")
    Rel(webapp, smtp, "Sends emails", "SMTP")
    Rel(dpo, nextcloud, "Accesses documents", "WebDAV/Web Interface")
    Rel(smtp, researcher, "Sends confirmation", "Email")
    Rel(smtp, dpo, "Sends notification", "Email")
```

## Features

- **Intuitive Workflow**: Schritt-für-Schritt Prozess zur Projekteinreichung.
- **Sicherer Upload**: Dateien werden direkt in eine gesicherte Nextcloud-Instanz hochgeladen.
- **Validierung**: Automatische Prüfung auf Vollständigkeit und Dateiformate.
- **Benachrichtigungen**: Automatische E-Mail-Bestätigungen für Einreicher und das Datenschutz-Team.
- **Mehrsprachigkeit**: Vollständige Unterstützung für Deutsch und Englisch.

## Quick Links

- [Backend Setup](backend/setup.md)
- [API Dokumentation](backend/api.md)
- [Frontend Architektur](frontend/architecture.md)
- [Deployment Guide](deployment/index.md)
