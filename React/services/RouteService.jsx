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

    async getSavedRouteCoordinates(generatedRidesId) {
        try {
            const response = await fetch(`${this.baseURL}/routes/coordinate/${generatedRidesId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No route found for ride ID:', generatedRidesId);
                    return null;
                }
                const errorText = await response.text();
                console.error('Backend route error:', response.status, errorText);
                throw new Error(`Failed to get saved route: ${response.status} - ${errorText}`);
            }

            const geoJsonData = await response.json();

            if (!geoJsonData || !geoJsonData.type) {
                console.log('Invalid GeoJSON for ride ID:', generatedRidesId);
                return null;
            }

            console.log('GeoJSON loaded for ride ID:', generatedRidesId, geoJsonData);

            // Extract coordinates from GeoJSON
            const coordinates = this.extractCoordinatesFromGeoJSON(geoJsonData);
            console.log('Extracted coordinates:', coordinates?.length || 0, 'points');

            return coordinates;

        } catch (error) {
            console.error('Error fetching saved route GeoJSON:', error);
            return null;
        }
    }

    /**
     * Extract coordinates from GeoJSON - handles different GeoJSON structures
     */
    extractCoordinatesFromGeoJSON(geoJsonData) {
        try {
            if (!geoJsonData || !geoJsonData.type) {
                console.error('Invalid GeoJSON data');
                return [];
            }

            let coordinates = [];

            // Handle different GeoJSON types
            switch (geoJsonData.type) {
                case 'FeatureCollection':
                    // Look for LineString features in the collection
                    const features = geoJsonData.features || [];
                    for (const feature of features) {
                        if (feature.geometry && feature.geometry.type === 'LineString') {
                            const coords = feature.geometry.coordinates;
                            if (Array.isArray(coords) && coords.length > 0) {
                                coordinates = coords;
                                break; // Use the first LineString found
                            }
                        }
                    }
                    break;

                case 'Feature':
                    // Single feature
                    if (geoJsonData.geometry && geoJsonData.geometry.type === 'LineString') {
                        coordinates = geoJsonData.geometry.coordinates || [];
                    }
                    break;

                case 'LineString':
                    // Direct LineString geometry
                    coordinates = geoJsonData.coordinates || [];
                    break;

                case 'GeometryCollection':
                    // Look for LineString in geometry collection
                    const geometries = geoJsonData.geometries || [];
                    for (const geom of geometries) {
                        if (geom.type === 'LineString') {
                            coordinates = geom.coordinates || [];
                            break;
                        }
                    }
                    break;

                default:
                    console.warn('Unsupported GeoJSON type:', geoJsonData.type);
                    return [];
            }

            // Validate coordinates
            if (!Array.isArray(coordinates) || coordinates.length === 0) {
                console.warn('No coordinates found in GeoJSON');
                return [];
            }

            // Validate each coordinate pair
            const validCoordinates = coordinates.filter(coord => {
                return Array.isArray(coord) &&
                    coord.length >= 2 &&
                    typeof coord[0] === 'number' &&
                    typeof coord[1] === 'number' &&
                    !isNaN(coord[0]) && !isNaN(coord[1]);
            });

            if (validCoordinates.length === 0) {
                console.warn('No valid coordinates found');
                return [];
            }

            console.log(`Extracted ${validCoordinates.length} valid coordinates from GeoJSON`);
            return validCoordinates;

        } catch (error) {
            console.error('Error extracting coordinates from GeoJSON:', error);
            return [];
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