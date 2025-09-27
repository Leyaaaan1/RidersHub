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

    /**
     * Get full route directions with all details
     * @param {Object} routeData - Route request data
     * @returns {Promise<Object>} Full GeoJSON route data
     */
    async getRouteDirections(routeData) {
        try {
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

            const response = await fetch(`${this.baseURL}/routes/directions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Route directions request failed: ${response.status}`);
            }

            const geoJsonData = await response.json();
            return geoJsonData;

        } catch (error) {
            console.error('Error fetching route directions:', error);
            throw error;
        }
    }

    /**
     * Validate route coordinates
     * @param {Array} coordinates - Array of coordinate pairs
     * @returns {boolean} True if coordinates are valid
     */
    validateCoordinates(coordinates) {
        if (!Array.isArray(coordinates) || coordinates.length < 2) {
            return false;
        }

        return coordinates.every(coord =>
            Array.isArray(coord) &&
            coord.length >= 2 &&
            typeof coord[0] === 'number' &&
            typeof coord[1] === 'number' &&
            coord[0] >= -90 && coord[0] <= 90 && // latitude bounds
            coord[1] >= -180 && coord[1] <= 180 // longitude bounds
        );
    }

    /**
     * Create route data object from component state
     * @param {Object} state - Component state with route points
     * @returns {Object} Route data object
     */
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
}

export default RouteService;