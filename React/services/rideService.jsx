const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

export const searchLocation = async (token, query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch location: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('searchLocation error:', error);
        throw error;
    }
};

export const searchCityOrLandmark = async (token, query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/search-landmark?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch landmarks: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('searchCityOrLandmark error:', error);
        throw error;
    }
};

export const reverseGeocode = async (token, lat, lon) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/reverse?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to reverse geocode: ${response.status} ${errorText}`);
        }

        // Since the backend returns a String for reverse geocoding
        const result = await response.text();
        return result;
    } catch (err) {
        console.error("Reverse geocode fetch failed:", err);
        return null;
    }
};


export const reverseGeocodeLandmark = async (token, lat, lon) => {
    try {
        const response = await fetch(`${API_BASE_URL}/location/landmark?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to reverse geocode: ${response.status} ${errorText}`);
        }

        // Since the backend returns a String for reverse geocoding
        const result = await response.text();
        return result;
    } catch (err) {
        console.error("Reverse geocode fetch failed:", err);
        return null;
    }
};


// Fixed createRide service function with proper error handling
export const createRide = async (rideData, token) => {
    try {
        console.log('=== CREATE RIDE DEBUG ===');
        console.log('API URL:', `${API_BASE_URL}/riders/create`);
        console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'No token');
        console.log('Request data:', JSON.stringify(rideData, null, 2));

        // Check if token exists and is valid
        if (!token) {
            throw new Error('No authentication token provided. Please log in again.');
        }

        if (typeof token !== 'string') {
            console.error('Invalid token type:', typeof token, token);
            throw new Error('Invalid token format. Please log in again.');
        }

        // Ensure token doesn't already have Bearer prefix
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        console.log('Clean token (first 20 chars):', cleanToken ? cleanToken.substring(0, 20) + '...' : 'No clean token');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanToken}`
        };

        console.log('Request headers:', headers);

        const response = await fetch(`${API_BASE_URL}/riders/create`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(rideData)
        });

        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (!response.ok) {
            console.error('HTTP Error:', response.status, responseText);
            throw new Error(`HTTP ${response.status}: ${responseText || response.statusText}`);
        }

        if (!responseText || responseText.trim() === '') {
            console.log('Empty response - assuming success');
            return { success: true, message: 'Ride created successfully' };
        }

        let result;
        try {
            result = JSON.parse(responseText);
            console.log('Parsed JSON result:', result);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Response that failed to parse:', responseText);
            // If response is successful but not JSON, return success
            return { success: true, message: 'Ride created successfully', rawResponse: responseText };
        }

        return result;

    } catch (error) {
        console.error('=== CREATE RIDE ERROR ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);

        // Handle specific error cases
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network connection failed. Please check your internet connection.');
        }

        if (error.message.includes('403')) {
            throw new Error('Authentication failed. Please try logging in again.');
        }

        if (error.message.includes('401')) {
            throw new Error('Access denied. Please log in again.');
        }

        if (error.message.includes('500')) {
            throw new Error('Server error. Please try again later.');
        }

        // Re-throw original error if we can't handle it
        throw error;
    }
};// Alternative version using axios (if you're using axios instead of fetch)
export const searchRiders = async (token, username = '') => {
    const url = `${API_BASE_URL}/riders/search${username.trim() ? `?username=${encodeURIComponent(username.trim())}` : ''}`;

    console.log('Searching riders with URL:', url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to search riders: ${response.status} ${errorText}`);
        }

        return await response.json();
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



export const fetchRideMapImage = async (generatedRidesId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/riders/${generatedRidesId}/map-image`, {
            headers: token ? {
                'Authorization': `Bearer ${token}`
            } : {}
        });

        if (!response.ok) {
            throw new Error('Failed to fetch map image');
        }

        const imageUrl = await response.text();
        console.log("Map image URL fetched from backend:", imageUrl);
        return imageUrl;
    } catch (error) {
        console.error("Error fetching ride map image:", error);
        throw error;
    }
};


export const getRideDetails = async (generatedRidesId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/riders/${generatedRidesId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('No ride found');
            }
            const errorText = await response.text();
            console.log(`Error fetching ride details: ${response.status} ${errorText}`);
            throw new Error(`Failed to fetch ride details: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.log('Failed to get ride details:', error);
        throw error;
    }
};

export const fetchRides = async (token, page = 0, size = 5) => {
    try {
        const response = await fetch(`${API_BASE_URL}/riders/rides?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching rides: ${response.status} ${errorText}`);
            throw new Error(`Failed to fetch rides: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch rides:', error);
        throw error;
    }
};

export const fetchMyRides = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/riders/my-rides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching my rides: ${response.status} ${errorText}`);
            throw new Error(`Failed to fetch my rides: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch my rides:', error);
        throw error;
    }
};


export const getLocationImage = async (rideName, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/wikimedia/location?locationName=${encodeURIComponent(rideName)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return []; // No images found
            }
            const errorText = await response.text();
            throw new Error(`Failed to fetch location images: ${response.status} ${errorText}`);
        }

        return await response.json(); // Returns an array of LocationImageDto objects
    } catch (error) {
        console.error('Error fetching location images:', error);
        throw error;
    }
};




