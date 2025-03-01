A project-based learning website for motorcycle enthusiasts in Davao City, developed with Spring and PostgreSQL, by following Spring documentation

Overview

This project is a real-time location tracking system built with Spring Boot, Apache Kafka, and Haversine Formula. 
It efficiently processes user location updates, determines movement significance, and publishes updates to Kafka for further processing.

 Features

Spring Web – REST API endpoints

Spring Kafka – Integration with Kafka for message publishing

Spring Boot DevTools – Fast reload during development

Spring Boot Actuator – Monitoring & health checks

Spring Security – Role-based access control for different rider types

Spring Hibernate & Hibernate-Spatial – Advanced ORM with spatial data support

Spring Boot WebSocket – Real-time communication


**Location Processing & Optimization**

Haversine Formula – Calculates movement distance

Threshold-based updates – Avoids unnecessary Kafka messages

Real-time tracking – Only sends updates when movement is significant

**Spatial & Kafka Enhancements**

GeoMesa-Kafka-Datastore – Advanced spatial data storage & querying

org.locationtech.jts – Geometry processing & spatial calculations

📡 Kafka Setup

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka Broker
bin/kafka-server-start.sh config/server.properties