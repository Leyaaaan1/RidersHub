const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

// Start ride services
export const startService = {
    startRide: async (generatedRidesId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/ready/${generatedRidesId}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const status = response.status;
                let errorMessage = '';

                switch (status) {
                    case 403:
                        errorMessage = 'You are not authorized to start this ride.';
                        break;
                    case 404:
                        errorMessage = 'Ride not found.';
                        break;
                    case 409:
                        errorMessage = 'This ride has already been started.';
                        break;
                    default:
                        errorMessage = 'An error occurred while starting the ride.';
                }

                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('Error starting ride:', error);
            throw error;
        }
    }
};