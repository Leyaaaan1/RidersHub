const API_BASE_URL = 'http://192.168.1.51:8080';

class RouteService {

    static async getRoutePreview(routeData, token) {
        try {
            console.log('Calling route preview API with data:', routeData);

            // Format stop points to match backend DTO structure
            const formattedStopPoints = this.formatStopPoints(routeData.stopPoints || []);

            const requestData = {
                startLng: routeData.startLng,
                startLat: routeData.startLat,
                endLng: routeData.endLng,
                endLat: routeData.endLat,
                stopPoints: formattedStopPoints
            };

            console.log('Formatted request data:', requestData);

            const response = await fetch(`${API_BASE_URL}/route/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Route preview API error:', response.status, errorText);
                throw new Error(`Route preview failed: ${response.status} - ${errorText}`);
            }

            const responseText = await response.text();
            console.log('Route preview API response length:', responseText.length);

            // Parse and validate the JSON response
            const parsedResponse = JSON.parse(responseText);
            console.log('Parsed response structure:', {
                hasRoutes: !!parsedResponse.routes,
                routesCount: parsedResponse.routes?.length,
                firstRouteKeys: parsedResponse.routes?.[0] ? Object.keys(parsedResponse.routes[0]) : null
            });

            return parsedResponse;
        } catch (error) {
            console.error('Error getting route preview:', error);
            throw error;
        }
    }

    static formatStopPoints(stopPoints) {
        if (!Array.isArray(stopPoints)) return [];

        console.log('Formatting stop points:', stopPoints);

        return stopPoints.map((stop, index) => {
            const formatted = {
                stopLongitude: stop.lng || stop.stopLongitude || 0,
                stopLatitude: stop.lat || stop.stopLatitude || 0,
                stopName: stop.name || stop.stopName || `Stop ${index + 1}`
            };

            console.log(`Stop ${index + 1} formatted:`, formatted);
            return formatted;
        });
    }

    // Add method for getting detailed route directions (for actual navigation)
    static async getRouteDirections(routeData, token) {
        try {
            console.log('Calling route directions API with data:', routeData);

            const formattedStopPoints = this.formatStopPoints(routeData.stopPoints || []);

            const requestData = {
                startLng: routeData.startLng,
                startLat: routeData.startLat,
                endLng: routeData.endLng,
                endLat: routeData.endLat,
                stopPoints: formattedStopPoints
            };

            const response = await fetch(`${API_BASE_URL}/route/directions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Route directions API error:', response.status, errorText);
                throw new Error(`Route directions failed: ${response.status} - ${errorText}`);
            }

            const responseText = await response.text();
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error getting route directions:', error);
            throw error;
        }
    }
}

export default RouteService;