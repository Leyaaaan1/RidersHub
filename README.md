RidersHub 🚴‍♂️🚗🛵
🛠️ Current Progress
Create and display rides

Interactive homepage and map interface

Add locations via Nominatim API

Rate limiting with Bucket4j

Nominatim & Wikimedia: 1 request/sec

Mapbox: max 50,000 requests/month, blocked after limit

Redis caching for:

Nominatim reverse geocoding

Wikimedia image fetches

Mapbox responses (if within quota)

Mapbox integration: capture and view map snapshots

Cloudinary integration: upload and store map images

JWT-based authentication: secure API access with token-based login

PSGC mapping: match coordinates to barangays using PSA official codes

Redis: manage real-time user location data and external API response caching

(Soon) WebSocket: for live ride and location updates

✨ Features
React Native: Mobile application interface

Spring Boot: Backend REST API

PostgreSQL and PostGIS: Database with spatial support

Spring Security and JWT: Token-based authentication and role access control

Spring Hibernate & Hibernate Spatial: ORM with spatial queries

Mapbox: Interactive maps & snapshot functionality

Cloudinary: Upload and manage map screenshots

Nominatim API: Location search and reverse geocoding

Redis: In-memory cache for external API responses and user location data

Bucket4j: Java rate limiter for:

Per-second limit (Nominatim & Wikimedia)

Monthly limit (Mapbox: max 50,000 requests/month)

PSGC Data Integration: Convert coordinates into barangay names and codes

Spring DevTools: Hot reload during development

📌 Overview
This project focuses on building a real-time ride creation and discovery system. It integrates Mapbox for interactive maps, Cloudinary for storing map snapshots, and uses Nominatim API for geolocation. A Bucket4j rate limiter ensures compliance with Nominatim and Wikimedia's usage policy (1 request per second). Mapbox is protected by a custom monthly request limit (50,000/month) using Bucket4j. To reduce redundant API calls, Redis caches responses from Nominatim, Wikimedia, and Mapbox with a time-to-live (TTL). JWT-based authentication secures API access. The system uses official PSGC data from the Philippine Statistics Authority to convert coordinates into barangay-level locations.

🚀 Project Setup Guide
1. Create a .env File
Create a .env file in the project root directory and add the following environment variables:

makefile
Copy
Edit
# PostgreSQL Database Configuration
POSTGRES_DB_URL=your_database_host  
POSTGRES_DB_USERNAME=your_database_user  
POSTGRES_DB_PASSWORD=your_database_password  

# JWT Secret
JWT_SECRET=  
JWT_EXPIRATION=  

# Cloudinary API
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  

# Nominatim API
NOMINATIM_API_KEY=your_nominatim_api_key  

# Mapbox API
MAPBOX_API_KEY=your_mapbox_api_key  

NOMINATIM_URL_REVERSE=your api url for geo reverse  
NOMINATIM_URL_SEARCH=your api to search location  
NOMINATIM_USERAGENT=your_email@example.com  

NOMINATIM_VIEWBOX_LEFT=120.0  
NOMINATIM_VIEWBOX_BOTTOM=10.0  
NOMINATIM_VIEWBOX_RIGHT=122.0  
NOMINATIM_VIEWBOX_TOP=12.0  
❗ Make sure your .env file is not committed to version control.

2. Import PSGC Data
Option 1: Use the built-in import script
swift
Copy
Edit
python ./react/utils/import.py
Option 2: Manual Import
Download the dataset from https://psa.gov.ph/classification/psgc

Rename columns:
'10-digit PSGC' -> psgc_code
'Name' -> name
'Correspondence Code' -> correspondence_code
'Geographic Level' -> geographic_level

Remove extra columns and import to PostgreSQL

3. Run Spring Boot Backend
arduino
Copy
Edit
./mvnw spring-boot:run
4. Install Frontend Dependencies
nginx
Copy
Edit
npm install
5. Start Metro Bundler
java
Copy
Edit
npx react-native start
6. Launch Android App
arduino
Copy
Edit
npx react-native run-android
📱 Ensure an emulator is running or a device is connected.

7. Import PostGIS Extension
Run this inside your PostgreSQL client or pgAdmin:

pgsql
Copy
Edit
CREATE EXTENSION IF NOT EXISTS postgis;
🔐 Authentication
JWT token is returned on login

Protected endpoints require:
Authorization: Bearer <your_token>

Role-based access enforced via Spring Security

🗺️ PSGC Location Mapping
Converts coordinates into:

Barangay

Municipality/City

Province

Region

Uses PostGIS spatial queries and official PSGC data

🧠 Location Processing & Optimization
GeometryFactory & Hibernate Spatial – Create and handle spatial objects

PostGIS with Haversine Formula – Fast distance calculations

Barangay-level reverse geocoding using PSGC

Threshold-based location updates – Avoids unnecessary data processing

Map Snapshot Capture – Capture using Mapbox, store via Cloudinary

Redis-backed geocoding – Caches location queries to avoid repetitive API calls

Monthly-limited Mapbox access – Prevents exceeding free tier using Bucket4j

🔮 Future Enhancements
Add WebSocket support for live ride updates and messaging

Improve mobile UX for ride discovery and navigation

Write unit and integration tests for key modules

🧰 Technologies Used
Tech Stack	Description
React Native	Cross-platform mobile frontend
Spring Boot	Java backend framework
PostgreSQL	Relational database
PostGIS	Spatial extension for PostgreSQL
Mapbox	Interactive maps and snapshot tool
Cloudinary	Cloud-based image hosting
Nominatim API	Open-source geolocation service
PSGC	Barangay and LGU-level mapping via official dataset
Bucket4j	Java rate limiter for per-second & monthly usage
JWT	Secure token-based authentication
Redis	In-memory caching for API responses & location data

🤝 Contributions
This is a personal learning project. Contributions are welcome as suggestions or feature ideas.

📬 Contact
Feel free to reach out if you're a fellow enthusiast or developer from Davao City!
✅ You can now paste this whole thing into your README.md file without needing to modify or reformat. Let me know if you need a downloadable .md version or GitHub-optimized enhancements!
