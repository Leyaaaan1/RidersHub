const API_BASE_URL = 'http://192.168.1.51:8080';
console.log('Using API URL:', API_BASE_URL);

// Start ride services
export const startService = {
    startRide: async (generatedRidesId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/start/${generatedRidesId}`, {
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
                    case 410:
                        errorMessage = 'You have currently rides ongoing.';
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
    },


};

export async function currentRide(generatedRidesId, token) {
    const response = await fetch(`${API_BASE_URL}/start/view/${generatedRidesId}`, {

        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch ride details');
    }
    return await response.json();
}


// export const currentRide = async (generatedRidesId, token) => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/ready/${generatedRidesId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });
//
//         if (!response.ok) {
//             const status = response.status;
//             let errorMessage = '';
//
//             switch (status) {
//                 case 403:
//                     errorMessage = 'You are not authorized to view this ride.';
//                     break;
//                 case 404:
//                     errorMessage = 'Started ride not found.';
//                     break;
//                 case 409:
//                     errorMessage = 'Ride is already in progress.';
//                     break;
//                 default:
//                     errorMessage = 'An error occurred while fetching the started ride.';
//             }
//
//             throw new Error(errorMessage);
//         }
//
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching started ride:', error);
//         throw error;
//     }
// };