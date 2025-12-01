import { BASE_URL } from '@env';

const API_BASE_URL = BASE_URL || 'http://localhost:8080';


export const joinService = {

    joinRideByToken: async (inviteToken, username, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/${inviteToken}?username=${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error joining ride by token:', error);
            throw error;
        }
    },


    getJoinRequestsByRide: async (generatedRidesId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/${generatedRidesId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching join requests:', error);
            throw error;
        }
    },

    getJoinersByRide: async (generatedRidesId, token, status = null) => {
        try {
            let url = `${API_BASE_URL}/join/${generatedRidesId}/joiners`;

            if (status) {
                url += `?status=${status}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching joiners:', error);
            throw error;
        }
    },


    getPendingJoiners: async (generatedRidesId, token) => {
        return await joinService.getJoinersByRide(generatedRidesId, token, 'PENDING');
    },


    getApprovedJoiners: async (generatedRidesId, token) => {
        return await joinService.getJoinersByRide(generatedRidesId, token, 'APPROVED');
    },


    approveJoinRequest: async (joinId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/approve/${joinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error approving join request:', error);
            throw error;
        }
    },


    rejectJoinRequest: async (joinId, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/join/reject/${joinId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error rejecting join request:', error);
            throw error;
        }
    },





};