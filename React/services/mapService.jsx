const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

export const getMapHtml = async (lat, lon, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/map?lat=${lat}&lon=${lon}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get map HTML: ${response.status} ${errorText}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error getting map HTML:', error);
        throw error;
    }
};


export const searchCityOrLandmark = async (token, query, limit = 5) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/search-city-landmark?query=${encodeURIComponent(query)}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch city or landmark: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('searchCityOrLandmark error:', error);
        throw error;
    }
};


export const getLandmarkFromCoordinates = async (token, lat, lon) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/reverse-landmark?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get landmark: ${response.status} ${errorText}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error getting landmark:', error);
        throw error;
    }
};
