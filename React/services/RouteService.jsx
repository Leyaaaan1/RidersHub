const DEFAULT_API_URL = 'http://192.168.1.51:8080';

class RouteService {
    constructor(baseURL, token) {
        this.baseURL = baseURL || DEFAULT_API_URL;
        this.token = token;
    }
    /**
     * Get route preview coordinates from backend
     * @param {Object} routeData - Route request data
     * @param {number} routeData.startLat - Starting latitude
     * @param {number} routeData.startLng - Starting longitude
     * @param {number} routeData.endLat - Ending latitude
     * @param {number} routeData.endLng - Ending longitude
     * @param {Array} routeData.stopPoints - Array of stop points {lat, lng}
     * @returns {Promise<Array>} Array of coordinates [[lat, lng], ...]
     */
    async getRoutePreview(routeData) {
        try {
            console.log('=== FRONTEND ROUTE REQUEST ===');
            console.log('Route data:', routeData);

            // Transform stop points to match backend DTO format
            const stopPoints = routeData.stopPoints?.map(stop => ({
                stopLatitude: parseFloat(stop.lat),
                stopLongitude: parseFloat(stop.lng)
            })) || [];

            const requestBody = {
                startLat: parseFloat(routeData.startLat),
                startLng: parseFloat(routeData.startLng),
                endLat: parseFloat(routeData.endLat),
                endLng: parseFloat(routeData.endLng),
                stopPoints: stopPoints
            };

            console.log('Sending request to backend:', requestBody);

            const response = await fetch(`${this.baseURL}/routes/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend route error:', response.status, errorText);
                throw new Error(`Route request failed: ${response.status} - ${errorText}`);
            }

            const coordinatesText = await response.text();
            console.log('Raw coordinates response:', coordinatesText.substring(0, 200) + '...');

            // Parse the JSON array of coordinates
            const coordinates = JSON.parse(coordinatesText);

            if (!Array.isArray(coordinates) || coordinates.length === 0) {
                console.warn('No route coordinates returned from backend');
                return [];
            }

            console.log(`Route preview loaded: ${coordinates.length} coordinates`);
            return coordinates;

        } catch (error) {
            console.error('Error fetching route preview:', error);
            throw error;
        }
    }


    static createRouteData(startingLatitude, startingLongitude, endingLatitude, endingLongitude, stopPoints = []) {
        return {
            startLat: startingLatitude,
            startLng: startingLongitude,
            endLat: endingLatitude,
            endLng: endingLongitude,
            stopPoints: stopPoints.map(stop => ({
                lat: stop.lat,
                lng: stop.lng
            }))
        };
    }


    async getRouteCoordinates(generatedRidesId) {
        try {
            console.log('=== FETCHING ROUTE COORDINATES ===');
            console.log('Generated Rides ID:', generatedRidesId);
            console.log('Base URL:', this.baseURL);
            console.log('Token present:', !!this.token);

            if (!generatedRidesId) {
                throw new Error('Generated rides ID is required');
            }

            const url = `${this.baseURL}/routes/coordinate/${generatedRidesId}`;
            console.log('Request URL:', url);

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            // Only add Authorization header if token exists
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                timeout: 30000, // 30 seconds timeout
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error response:', errorText);
                throw new Error(`Failed to fetch route coordinates: ${response.status} - ${errorText}`);
            }

            const routeData = await response.json();
            console.log('Route coordinates fetched successfully');
            console.log('Route data type:', typeof routeData);
            console.log('Route data structure:', Array.isArray(routeData) ? `Array with ${routeData.length} items` : Object.keys(routeData));

            return routeData;

        } catch (error) {
            console.error('=== ERROR FETCHING ROUTE COORDINATES ===');
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Full error:', error);

            // Provide more specific error information
            if (error.message.includes('Network request failed')) {
                throw new Error(`Network connection failed. Please check:\n1. Server is running at ${this.baseURL}\n2. Device can reach the server\n3. CORS is configured properly`);
            } else if (error.message.includes('timeout')) {
                throw new Error('Request timed out. Server may be slow or unreachable.');
            } else {
                throw error;
            }
        }
    }}

export default RouteService;