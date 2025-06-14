
const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

export const createJoinRequest = async (token, rideId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/join/${rideId}/join-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });
//1644
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create join request: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating join request:', error);
        throw error;
    }
};

export const acceptJoinRequest = async (token, rideId, username) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/rides/${rideId}/join-requests/${username}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to accept join request: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error accepting join request:', error);
        throw error;
    }
};