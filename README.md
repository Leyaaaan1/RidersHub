# Motorcycle Enthusiasts Project - Davao City

A project-based learning platform for motorcycle enthusiasts in Davao City, developed with **React Native** for the mobile frontend and **Spring Boot** with **PostgreSQL** on the backend, following official Spring documentation and best practices.

---

## 🛠️ Overview

This project focuses on building a real-time ride creation and discovery system. It integrates **Mapbox** for interactive maps, **Cloudinary** for storing map snapshots, and uses **Nominatim API** for geolocation. A **Bucket4j** rate limiter ensures compliance with Nominatim's usage policy (1 request per second). **JWT-based authentication** secures API access. It also uses official **PSGC data** from the [Philippine Statistics Authority](https://psa.gov.ph/classification/psgc) to convert coordinates into barangay-level locations. **Redis** integration for managing live user locations is planned.

---

## 🚧 Current Progress

- ✅ Create and display rides  
- ✅ Interactive **homepage** and **map interface**  
- ✅ **Add locations** via **Nominatim API**  
- ✅ **Rate limiting** with **Bucket4j** (1 request/sec)  
- ✅ **Mapbox integration** – capture and view map snapshots  
- ✅ **Cloudinary integration** – upload and store map images  
- ✅ **JWT-based authentication** – secure API access with token-based login  
- ✅ **PSGC mapping** – match coordinates to barangays using PSA official codes  
- 🔜 **Redis** – for storing and managing real-time user locations  
- 🔜 **WebSocket** – for live ride and location updates

---

## ✨ Features

- **React Native** – Mobile application interface  
- **Spring Boot** – Backend REST API  
- **PostgreSQL + PostGIS** – Database with spatial support  
- **Spring Security + JWT** – Token-based authentication and role access control  
- **Spring Hibernate & Hibernate Spatial** – ORM with spatial queries  
- **Mapbox** – Interactive maps & snapshot functionality  
- **Cloudinary** – Upload and manage map screenshots  
- **Nominatim API** – Location search and reverse geocoding  
- **Bucket4j** – Rate limiter for API usage compliance  
- **PSGC Data Integration** – Convert coordinates into barangay names and codes  
- **Spring DevTools** – Hot reload during development

---

## 🔐 Authentication

The backend uses **JWT (JSON Web Token)** for secure, stateless user authentication.

- 🔒 Login returns a JWT token  
- 🔐 Protected endpoints require the token in the `Authorization` header (as `Bearer <token>`)  
- 🛡️ Role-based access control is enforced using Spring Security filters

---

## 🗺️ PSGC Location Mapping

- Imported **PSGC (Philippine Standard Geographic Code)** data from [psa.gov.ph/classification/psgc](https://psa.gov.ph/classification/psgc)
- Enables conversion of latitude/longitude into:
  - Barangay
  - Municipality/City
  - Province
  - Region
- Coordinates are matched against the official administrative boundaries using **PostGIS spatial queries**
- Ensures local ride data is aligned with real-world barangay boundaries for accurate reporting and search

---

## 🌍 Location Processing & Optimization

- 🧭 **GeometryFactory & Hibernate Spatial** – Create and handle spatial objects  
- 📏 **PostGIS with Haversine Formula** – Fast distance calculations  
- 📌 **Barangay-level reverse geocoding** using PSGC  
- ⚡ **Threshold-based location updates** – Avoids unnecessary data processing  
- 🖼️ **Map Snapshot Capture** – Capture using **Mapbox**, store via **Cloudinary**

---

## 📦 Future Enhancements

- 🔧 Integrate **Redis** for real-time user location caching  
- 🔗 Add **WebSocket** support for live ride updates and messaging  
- 📱 Improve mobile UX for ride discovery and navigation  
- 🧪 Write unit and integration tests for key modules  

---

## 📍 Technologies Used

| Tech Stack        | Description                                         |
|-------------------|-----------------------------------------------------|
| React Native      | Cross-platform mobile frontend                      |
| Spring Boot       | Java backend framework                              |
| PostgreSQL        | Relational database                                 |
| PostGIS           | Spatial extension for PostgreSQL                    |
| Mapbox            | Interactive maps and snapshot tool                  |
| Cloudinary        | Cloud-based image hosting                           |
| Nominatim API     | Open-source geolocation service                     |
| PSGC              | Barangay and LGU-level mapping via official dataset |
| Bucket4j          | Java rate limiter library                           |
| JWT               | Secure token-based authentication                   |
| Redis (Planned)   | In-memory data store for live data                  |

---

## 🤝 Contributions

This is a personal learning project. Contributions are welcome as suggestions or feature ideas.

---

## 📫 Contact

Feel free to reach out if you're a fellow enthusiast or developer from Davao City!
