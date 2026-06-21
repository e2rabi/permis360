[![Dev Build](https://github.com/e2rabi/autoecole-platform/actions/workflows/gradle.yml/badge.svg)](https://github.com/e2rabi/autoecole-platform/actions/workflows/gradle.yml) [![Release](https://img.shields.io/badge/release-v1.3.4-blue)](https://github.com/e2rabi/autoecole-platform/releases/tag/v1.3.4) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fe2rabi%2Fautoecole-platform.svg?type=shield&issueType=security)](https://app.fossa.com/projects/git%2Bgithub.com%2Fe2rabi%2Fautoecole-platform?ref=badge_shield&issueType=security)

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
- Testing using ArchUnit to verify the respect of architectural rules
- Security using Spring security, OAuth2,mTls,Istio,PSS,RBAC,trivy,AppArmor,Seccomp,falco 
### System components Structure
Let's explain first the system structure to understand its components:
```
------------------------------------------------------------
Root project 'autoecole-platform'
------------------------------------------------------------
Project hierarchy:

Root project 'autoecole-platform'
+--- Project ':infrastructures'
|    \--- Project ':infrastructures:eureka-server'
+--- Project ':modules'
|    +--- Project ':modules:document-service'
|    \--- Project ':modules:school-service'
|    \--- Project ':modules:api-gateway'
+--- Project ':plugins'
|    +--- Project ':plugins:custom-gradle-bom'
|    \--- Project ':plugins:custom-gradle-plugin'
\--- Project ':sdk'
     \--- Project ':sdk:sdk-common'

Project locations:

project ':infrastructures' - /infrastructures
project ':infrastructures:eureka-server' - /infrastructures/eureka-server
project ':modules' - /modules
project ':modules:document-service' - /modules/document-service
project ':modules:school-service' - /modules/school-service
project ':modules:api-gateway' - /modules/api-gateway
project ':plugins' - /plugins
project ':plugins:custom-gradle-bom' - /plugins/custom-gradle-bom
project ':plugins:custom-gradle-plugin' - /plugins/custom-gradle-plugin
project ':sdk' - /sdk
project ':sdk:sdk-common' - /sdk/sdk-common
```
### The custom-gradle-plugin : 
The custom-gradle-plugin is a centralized convention plugin designed specifically for the Auto Ecole Platform μServices. It standardizes build configurations, dependency management, and deployment settings across all internal microservices (School Service, Document Service, API Gateway, etc.).

By applying this plugin, we adhere to the DRY (Don't Repeat Yourself) principle, ensuring that all modules share consistent versions and build logic without duplicating configuration code across multiple build.gradle files.
### The custom-gradle-bom : 
The custom-gradle-bom module is a centralized dependency version management system for the Auto Ecole Platform.

In a multi-module microservice architecture, managing dependency versions across various services (like school-service, document-service, api-gateway, etc.) can quickly lead to version conflicts and maintenance nightmares. This BOM solves that problem by providing a single source of truth for all external libraries and SDK versions used across the platform.
### The sdk-common : 

The sdk-common module is a shared library within the Auto Ecole Platform microservices ecosystem.

In a distributed microservice architecture, there is often a need to share code between services (e.g., when the API Gateway or school-service needs to communicate with the document-service). Instead of duplicating DTOs, error handling logic, and utilities across multiple repositories or modules, we centralize them here.

Now, as we have learned about different system components, then let's start.
### System Boundary - μServices Landscape
#### Dev environment (deployment using Docker compose) :  
To run the microservices using the dev profile use following command:
```
docker compose up -d
```

<img width="5340" height="2596" alt="image" src="https://github.com/user-attachments/assets/b22002c7-4ddd-4336-94de-60b5a1188b0b" />


| Service | Description | Dev URL |
| :--- | :--- | :--- |
| **Prometheus** | Metrics & Monitoring | [http://194.163.129.95:9090](http://194.163.129.95:9090/targets) |
| **Jaeger** | Distributed Tracing | [http://194.163.129.95:16686](http://194.163.129.95:16686) |
| **Kibana (ELK)** | Log Management & Analysis | [http://194.163.129.95:5601](http://194.163.129.95:5601) |
| **Document Swagger UI** | OpenAPI Documentation & Testing | [http://194.163.129.95:8009/swagger-ui/swagger-ui/index.html](http://194.163.129.95:8009/swagger-ui/swagger-ui/index.html) |
| **School  Swagger UI** | OpenAPI Documentation & Testing | [http://194.163.129.95:8010/swagger-ui/swagger-ui/index.html](http://194.163.129.95:8010/swagger-ui/swagger-ui/index.html) |
| **API Gateway Swagger UI** | OpenAPI Documentation & Testing | [http://194.163.129.95:8443/swagger-ui/index.html](http://194.163.129.95:8443/swagger-ui/index.html) |
| **Keycloak** | Identity & Access Management | [http://194.163.129.95:8080](http://194.163.129.95:8080) |
| **Minio** | Object store | [http://194.163.129.95:9001](http://194.163.129.95:9001) |
| **Eureka Server** | Discovery Service | [http://194.163.129.95:8761](http://194.163.129.95:8761) |

#### Staging environment (deployment using kubernetes) :  
To run the microservices using the staging profile use following command:
```
kubectl create ns staging
kubectl apply -f infrastructures/k8s/manifests
```

<img width="5340" height="2596" alt="image" src="https://github.com/user-attachments/assets/ad31ce7e-bc9a-44ec-a25f-1d38e8062148" />

| Service | Description | Staging URL |
| :--- | :--- | :--- |
| **Prometheus** | Metrics & Monitoring | [http://13.140.173.47/prometheus/targets](http://13.140.173.47/prometheus/targets) |
| **Jaeger** | Distributed Tracing | [http://13.140.173.47/jaeger](http://13.140.173.47/jaeger) |
| **Kibana (ELK)** | Log Management & Analysis | [http://13.140.173.47/kibana](http://13.140.173.47/kibana) |
| **Document Swagger UI** | OpenAPI Documentation & Testing | [http://13.140.173.47/document-service/swagger-ui/swagger-ui/index.html](http://13.140.173.47/document-service/swagger-ui/swagger-ui/index.html) |
| **School  Swagger UI** | OpenAPI Documentation & Testing | [http://13.140.173.47/school-service/swagger-ui/swagger-ui/index.html](http://13.140.173.47/school-service/swagger-ui/swagger-ui/index.html) |
| **API Gateway Swagger UI** | OpenAPI Documentation & Testing | [http://13.140.173.47/api/swagger-ui/index.html](http://13.140.173.47/api/swagger-ui/index.html) |
| **Keycloak** | Identity & Access Management | [http://13.140.173.47/auth](http://13.140.173.47/auth) |
| **Minio** | Object store | [http://13.140.173.47/minio-console](http://13.140.173.47/minio-console/) |
| **ArgoCD** | Gitops Operator | [http://13.140.173.47/argocd](http://13.140.173.47/argocd) |
| **Falco** | A cloud-native runtime security tool | [http://falco.13.140.173.47.nip.io](http://falco.13.140.173.47.nip.io) |
| **Kiali** | Console for Istio service mesh | [http://kiali.13.140.173.47.nip.io](http://kiali.13.140.173.47.nip.io) |

