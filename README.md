[![Dev Build](https://github.com/e2rabi/autoecole-platform/actions/workflows/gradle.yml/badge.svg)](https://github.com/e2rabi/autoecole-platform/actions/workflows/gradle.yml) [![Release](https://img.shields.io/badge/release-v1.1.0-blue)](https://github.com/e2rabi/autoecole-platform/releases/tag/v1.1.0) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fe2rabi%2Fautoecole-platform.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fe2rabi%2Fautoecole-platform?ref=badge_shield&issueType=security)

# Auto Ecole Platform μServices

## Introduction
A driving school management (Software as a Service) is a web-based platform designed to digitize and streamline all administrative, educational, and financial operations of a driving school.

It enables administrators, instructors, and students to efficiently manage daily activities through a centralized online system accessible from any device.

### Key Features
- Student management: registration, file tracking, learning progress, and training history.
- Lesson scheduling: smart planning of theory and driving lessons using a calendar system.
- Instructor and vehicle management: assignment of instructors, availability tracking, and vehicle maintenance monitoring.
- Online booking: students can schedule driving or theory sessions easily.
- Learning progress tracking: monitoring driving hours, skill evaluation, and exam preparation.
- Administrative & financial management: payments, invoices, subscriptions, reminders, and reporting tools.
- Automated notifications: reminders for lessons, payment deadlines, and student communication.
- Analytics dashboard: insights into performance, pass rates, revenue, and overall driving school activity.

The project follows [**CloudNative**](https://www.cncf.io/) recommendations and The [**twelve-factor app**](https://12factor.net/) methodology for building *software-as-a-service apps* to show how μServices should be developed and deployed.

---
## Getting started
This project uses the following frameworks and libraries :
- Development Java 25 and Springboot 4 and gradle for build
- Spring Framework 7 new features (resilience features,@ConcurrencyLimit,@Retryable...)
- Spring cloud gateway as an API Gateway
- Keycloak and OAuth2 for authentication and authorization (istio in the staging env )
- Eureka as a discovery service ( kubernetes service in the staging env)
- Spring config server and profile for config management (Configmap and secret in the staging env)
- Opentelemetry  with Jaeguer and prometheus for observability
- Database migration with flyway and Postgres and Redis for cache management
- Deployment docker and docker-compose and kubernetes with helm charts
- ArgoCd for deployment as a Gitops operator
### System components Structure
Let's explain first the system structure to understand its components:

### System Boundary - μServices Landscape
<img width="5340" height="2596" alt="image" src="https://github.com/user-attachments/assets/104d3d2c-835c-4543-ace0-d78b844b1bd0" />

## Staging Environment Access

| Service | Description | Staging URL |
| :--- | :--- | :--- |
| **Prometheus** | Metrics & Monitoring | [http://194.163.129.95:9090](http://194.163.129.95:9090) |
| **Jaeger** | Distributed Tracing | [http://194.163.129.95:16686](http://194.163.129.95:16686) |
| **Kibana (ELK)** | Log Management & Analysis | [http://194.163.129.95:5601](http://194.163.129.95:5601) |
| **Document Swagger UI** | API Documentation & Testing | [http://194.163.129.95:8009/swagger-ui/swagger-ui/index.html](http://194.163.129.95:8009/swagger-ui/swagger-ui/index.html) |
| **School  Swagger UI** | API Documentation & Testing | [http://194.163.129.95:8010/swagger-ui/swagger-ui/index.html](http://194.163.129.95:8010/swagger-ui/swagger-ui/index.html) |
| **Keycloak** | Identity & Access Management | [http://194.163.129.95:8080](http://194.163.129.95:8080) |
| **Minio** | Object store | [http://194.163.129.95:9001](http://194.163.129.95:9001) |
