# Motorcycle Enthusiasts Project - Davao City

A project-based learning website for motorcycle enthusiasts in Davao City, developed with Spring Boot and PostgreSQL, following Spring documentation and best practices.

---

## Overview

This project implements a real-time location tracking system using Spring Boot, Apache Kafka (version 3.9+), and spatial calculations via PostGIS and Hibernate Spatial. It efficiently processes user location updates, determines movement significance using Haversine formula, and publishes relevant updates to Kafka for downstream processing.

---

## Features

- **Spring Web** – REST API endpoints  
- **Spring Kafka (3.9+)** – Kafka integration using KRaft mode
- **Spring Boot DevTools** – Fast reload during development  
- **Spring Security** – Role-based access control for different rider types  
- **Spring Hibernate & Hibernate Spatial** – ORM with advanced spatial data support  
- **Spring Boot WebSocket** – Real-time communication (in progress)

---

## Location Processing & Optimization

- **GeometryFactory & Hibernate Spatial** – Use GeometryFactory to create spatial objects  
- **Custom PostGIS Query with Haversine Formula** – Efficient distance calculation directly in PostgreSQL  
- **Threshold-based updates** – Avoids sending Kafka messages for insignificant movement  
- **Real-time tracking** – Sends updates only when movement exceeds threshold  

---

## Kafka Setup (KRaft mode, no Zookeeper)

Since Kafka 3.3+, you can run Kafka without Zookeeper using KRaft mode. This project uses Kafka 3.9+.

To start Kafka in KRaft mode:

```bash
# Format storage for Kafka controller (only needed once)
bin/kafka-storage.sh format -t <uuid> -c config/kraft/server.properties

# Start Kafka broker (no Zookeeper)
bin/kafka-server-start.sh config/kraft/server.properties
