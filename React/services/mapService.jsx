const API_BASE_URL = 'http://192.168.1.51:8080';

export const getDirections = async (token, startLon, startLat, endLon, endLat, stops = []) => {
    try {
        // Validate coordinates
        if (!startLon || !startLat || !endLon || !endLat) {
            console.error('Invalid coordinates', { startLon, startLat, endLon, endLat });
            throw new Error('Invalid coordinates');
        }

        // Format stop points for the backend
        const stopPointsPayload = stops && stops.length > 0
            ? stops.map(stop => ({
                stopName: stop.stopName || stop.name || null,
                stopLongitude: parseFloat(stop.lng || stop.stopLongitude || stop.lon),
                stopLatitude: parseFloat(stop.lat || stop.stopLatitude)
            })).filter(stop =>
                !isNaN(stop.stopLongitude) && !isNaN(stop.stopLatitude)
            )
            : [];

        console.log('Sending request with coordinates:', {
            startLon, startLat, endLon, endLat,
            stopPoints: stopPointsPayload
        });

        const url = `${API_BASE_URL}/location/route-directions?startLon=${startLon}&startLat=${startLat}&endLon=${endLon}&endLat=${endLat}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(stopPointsPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', response.status, errorText);
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const responseData = await response.text();
        console.log('Raw response:', responseData);

        try {
            // Parse the coordinate array
            const coordinates = JSON.parse(responseData);

            if (!Array.isArray(coordinates)) {
                console.error('Expected array, got:', typeof coordinates);
                return [];
            }

            console.log(`Route fetched successfully with ${coordinates.length} points`);
            return coordinates;
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            console.error('Raw response was:', responseData);
            return [];
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
};