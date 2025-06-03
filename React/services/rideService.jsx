const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);
export const searchLocation = async (query) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `countrycodes=ph&` +
        `format=json&` +
        `limit=5&` +
        `addressdetails=1`,
        {
            headers: {
                'User-Agent': 'RidersHub/1.0'
            }
        }
    );

    return await response.json();
};

// Reverse geocode to get location name
export const reverseGeocode = async (lat, lon) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
        {
            headers: { 'User-Agent': 'RidersHub/1.0' }
        }
    );

    return await response.json();
};

// Fetch all riders


// Create a new ride
export const createRide = async (token, rideData) => {
    const response = await fetch(`${API_BASE_URL}/riders/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rideData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to create ride');
    }

    return result;
};
export const searchRiders = async (token, username = '') => {
    const url = username.trim()
        ? `${API_BASE_URL}/riders/search?username=${encodeURIComponent(username)}`
        : `${API_BASE_URL}/riders/search`;

    console.log('Searching riders with URL:', url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);

        if (!response.ok) {
            throw new Error(`Failed to search riders: ${response.status} ${responseText}`);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Network error details:', error);
        throw error;
    }
};


export const getCurrentRiderType = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/riders/current-rider-type`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message };
        }
    } catch (error) {
        console.error('API error:', error);
        return { success: false, message: 'Network error occurred' };
    }
};

