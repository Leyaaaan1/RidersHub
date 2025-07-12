const API_BASE_URL = 'http://192.168.1.51:8080';

export const getDirections = async (token, startLon, startLat, endLon, endLat, stops = []) => {
    try {
        // Validate coordinates
        if (!startLon || !startLat || !endLon || !endLat) {
            console.error('Invalid coordinates', { startLon, startLat, endLon, endLat });
            throw new Error('Invalid coordinates');
        }

        // Format stop points for the backend - "lat1,lng1;lat2,lng2"
        let stopsParam = '';
        if (stops && stops.length > 0) {
            stopsParam = stops
                .map(stop => {
                    const lat = parseFloat(stop.lat || stop.stopLatitude);
                    const lng = parseFloat(stop.lng || stop.stopLongitude || stop.lon);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        return `${lat},${lng}`;
                    }
                    return null;
                })
                .filter(stop => stop !== null)
                .join(';');
        }

        console.log('Sending request with coordinates:', {
            startLon, startLat, endLon, endLat,
            stops: stopsParam
        });

        // Build URL with all parameters as query params
        let url = `${API_BASE_URL}/location/directions?startLat=${startLat}&startLng=${startLon}&endLat=${endLat}&endLng=${endLon}`;

        if (stopsParam) {
            url += `&stops=${encodeURIComponent(stopsParam)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', response.status, errorText);
            throw new Error(`Server error: ${response.status} - ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);

        // Extract coordinates from the new response format
        if (responseData && responseData.coordinates) {
            console.log(`Route fetched successfully with ${responseData.coordinates.length} points`);

            // Return both coordinates and geoJson if needed
            return {
                coordinates: responseData.coordinates,
                geoJson: responseData.geoJson
            };
        } else {
            console.warn('No coordinates in response');
            return { coordinates: [], geoJson: null };
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        throw error;
    }
};