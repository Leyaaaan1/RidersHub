const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

// Join request services
export const joinService = {
    createJoinRequest: async (generatedRidesId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/${generatedRidesId}/join-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating join request:', error);
            throw error;
        }
    },

    acceptJoinRequest: async (generatedRidesId, username, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/${generatedRidesId}/${username}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error accepting join request:', error);
            throw error;
        }
    },

    // Get all join requests for a specific ride
    getJoinRequestsByRideId: async (generatedRidesId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/${generatedRidesId}/list-requests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching join requests:', error);
            throw error;
        }
    }
};