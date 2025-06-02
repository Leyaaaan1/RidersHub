// React/services/rideService.js
const API_BASE_URL = 'http://192.168.1.51:8080';

// Search for locations using OpenStreetMap
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
export const fetchAllRiders = async (token) => {
    const response = await fetch(`${API_BASE_URL}/riders/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch riders');
    }

    return await response.json();
};

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