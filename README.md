# Real-Time Ride Sharing System

## Current Progress
- Create and display rides
- Interactive **homepage** and **map interface**
- **Add locations** via **Nominatim API**
- **Rate limiting** with **Bucket4j** (1 request/sec, Redis-backed)
- **Mapbox integration**: capture and view map snapshots
- **Cloudinary integration**: upload and store map images
- **JWT-based authentication**: secure API access with token-based login
- **PSGC mapping**: match coordinates to barangays using PSA official codes
- **Redis cache**: stores API responses and manages rate limits for Nominatim, Mapbox, and Wikimedia APIs
- **Wikimedia API**: fetches location images and info, with Redis caching and rate limiting
- (Soon) **Redis**: for storing and managing real-time user locations
- (Soon) **WebSocket**: for live ride and location updates

## Features
- **React Native**: Mobile application interface
- **Spring Boot**: Backend REST API
- **PostgreSQL and PostGIS**: Database with spatial support
- **Spring Security and JWT**: Token-based authentication and role access control
- **Spring Hibernate & Hibernate Spatial**: ORM with spatial queries
- **Mapbox**: Interactive maps & snapshot functionality
- **Cloudinary**: Upload and manage map screenshots
- **Nominatim API**: Location search and reverse geocoding
- **Wikimedia API**: Location images and info, with Redis caching and rate limiting
- **Bucket4j**: Redis-backed rate limiter for API usage compliance (Nominatim, Mapbox, Wikimedia)
- **PSGC Data Integration**: Convert coordinates into barangay names and codes
- **Redis Cache**: Caches geocoding, map, and Wikimedia results for performance and API quota management

## Overview
This project focuses on building a real-time ride creation and discovery system. It integrates **Mapbox** for interactive maps, **Cloudinary** for storing map snapshots, and uses **Nominatim API** for geolocation. A **Bucket4j** rate limiter ensures compliance with Nominatim's usage policy (1 request per second). **JWT-based authentication** secures API access. It also uses official **PSGC data** from the [Philippine Statistics Authority](https://psa.gov.ph/classification/psgc) to convert coordinates into barangay-level locations. **Redis** integration for managing live user locations is planned.

## Project Setup Guide

### 1. Create a .env File
Create a .env file in the project root directory and add the following environment variables:

```env
# ==============================================
# DATABASE CONFIGURATION
# ==============================================
POSTGRES_DB_URL=your_database_host
POSTGRES_DB_USERNAME=your_database_user
POSTGRES_DB_PASSWORD=your_database_password

# ==============================================
# JWT AUTHENTICATION
# ==============================================
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=your_jwt_expiration_time

# ==============================================
# CLOUDINARY API CONFIGURATION
# ==============================================
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# ==============================================
# REDIS CACHE CONFIGURATION
# ==============================================
spring.cache.type=redis
spring.data.redis.host=${HOST}
spring.data.redis.port=${PORT}

# ==============================================
# NOMINATIM API CONFIGURATION
# ==============================================
NOMINATIM_API_KEY=your_nominatim_api_key
NOMINATIM_URL_REVERSE=your_api_url_for_geo_reverse
NOMINATIM_URL_SEARCH=your_api_to_search_location
NOMINATIM_USERAGENT=your_email_address

# ==============================================
# Agent for your api 
# Sample = WIKIMEDIA_API_USERAGENT=RidersHub/1.0 (add your email here)
# ==============================================
wikimedia.api.useragent=${WIKIMEDIA_API_USERAGENT}
USER_AGENT=${NOMINATIM_API_USERAGENT}

# ==============================================
# MAPBOX API CONFIGURATION
# ==============================================
MAPBOX_API_KEY=your_mapbox_api_key
```

> **Important:** Make sure your .env file is **not committed** to version control.

### 2. Import PSGC Data
There are two ways to import PSGC data into the database:

#### Option 1: Use the built-in import script
Run the following command:
```bash
python ./react/utils/import.py
```
Ensure your PostgreSQL server is running and credentials match those in your .env file.

#### Option 2: Manually download and import the official PSA dataset
1. Go to [https://psa.gov.ph/classification/psgc](https://psa.gov.ph/classification/psgc)
2. Look in the attachments section and download: **"PSGC 1Q 2025 Publication Datafile"**
3. Open the dataset in your spreadsheet editor or script and ensure the column names are renamed to:
   - `'10-digit PSGC'` → `psgc_code`
   - `'Name'` → `name`
   - `'Correspondence Code'` → `correspondence_code`
   - `'Geographic Level'` → `geographic_level`
4. Remove all other columns from the dataset.
5. Import the cleaned dataset into your PostgreSQL database.
6. Rename the file to `psgc_data`, also that is the need of the table in the database

### 3. Run Docker Desktop and Docker-compose.yml
- For redis cache

### 4. Run Spring Boot Backend
From the root project directory, run the backend:
```bash
./mvnw spring-boot:run
```
You can also run it using your IDE (e.g., IntelliJ, Eclipse).

### 5. Install Frontend Dependencies
Open a new terminal, navigate to the React Native folder, and run:
```bash
npm install
```

### 6. Start Metro Bundler
Still in the frontend folder, start the Metro bundler:
```bash
npx react-native start
```

### 7. Launch Android App
In a separate terminal, run the app on your Android emulator or physical device:
```bash
npx react-native run-android
```
> **Note:** Make sure your Android environment is properly set up and an emulator is running or a device is connected.

### 8. Import PostGIS Extension
Make sure your database has the PostGIS extension enabled. Run the following SQL inside your PostgreSQL client:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```
If you're using pgAdmin, go to the database, open the Query Tool, and paste the command above.

## Authentication
The backend uses **JWT (JSON Web Token)** for secure, stateless user authentication.
- Login returns a JWT token
- Protected endpoints require the token in the Authorization header (as Bearer <token>)
- Role-based access control is enforced using Spring Security filters

## PSGC Location Mapping
- Imported **PSGC (Philippine Standard Geographic Code)** data from [psa.gov.ph/classification/psgc](https://psa.gov.ph/classification/psgc)
- Enables conversion of latitude/longitude into:
  - Barangay
  - Municipality/City
  - Province
  - Region
- Coordinates are matched against the official administrative boundaries using **PostGIS spatial queries**
- Ensures local ride data is aligned with real-world barangay boundaries for accurate reporting and search

## Location Processing & Optimization
- **GeometryFactory & Hibernate Spatial** – Create and handle spatial objects
- **PostGIS with Haversine Formula** – Fast distance calculations
- **Barangay-level reverse geocoding** using PSGC
- **Threshold-based location updates** – Avoids unnecessary data processing
- **Map Snapshot Capture** – Capture using **Mapbox**, store via **Cloudinary**

## Future Enhancements
- Integrate **Redis** for real-time user location caching
- Add **WebSocket** support for live ride updates and messaging
- Improve mobile UX for ride discovery and navigation
- Write unit and integration tests for key modules

## Technologies Used
| Tech Stack      | Description                                         |
|-----------------|-----------------------------------------------------|
| React Native    | Cross-platform mobile frontend                     |
| Spring Boot     | Java backend framework                              |
| PostgreSQL      | Relational database                                 |
| PostGIS         | Spatial extension for PostgreSQL                    |
| Mapbox          | Interactive maps and snapshot tool                  |
| Cloudinary      | Cloud-based image hosting                           |
| Nominatim API   | Open-source geolocation service                     |
| PSGC            | Barangay and LGU-level mapping via official dataset |
| Bucket4j        | Java rate limiter library                           |
| JWT             | Secure token-based authentication                   |
| Redis (Planned) | In-memory data store for live data                  |

## Contributions
This is a personal learning project. Contributions are welcome as suggestions or feature ideas.

## Contact
Feel free to reach out if you're a fellow enthusiast or developer from Davao City!  
Or if you need help to set up, just email me: paninsorolean@gmail.com
