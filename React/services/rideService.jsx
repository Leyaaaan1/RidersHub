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
                return null; // No image found
            }
            const errorText = await response.text();
            throw new Error(`Failed to fetch location image: ${response.status} ${errorText}`);
        }

        return await response.json(); // Returns LocationImageDto with imageUrl, author, and license
    } catch (error) {
        console.error('Error fetching location image:', error);
        throw error;
    }
};





