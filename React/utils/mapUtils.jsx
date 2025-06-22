// React/utils/mapUtils.js
import { reverseGeocode, reverseGeocodeLandmark } from '../services/rideService';

export const handleWebViewMessage = async (event, state) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'mapClick') {
        const {
            mapMode, setLatitude, setLongitude,
            setStartingLatitude, setStartingLongitude,
            setEndingLatitude, setEndingLongitude,
            setLocationName, setStartingPoint, setEndingPoint, setSearchQuery,
            token // Need to get token from state
        } = state;

        // Update coordinates based on map mode
        if (mapMode === 'location') {
            setLatitude(data.lat.toString());
            setLongitude(data.lng.toString());
            setLocationName('Fetching location name...');
        } else if (mapMode === 'starting') {
            setStartingLatitude(data.lat.toString());
            setStartingLongitude(data.lng.toString());
            setStartingPoint('Fetching location name...');
        } else if (mapMode === 'ending') {
            setEndingLatitude(data.lat.toString());
            setEndingLongitude(data.lng.toString());
            setEndingPoint('Fetching location name...');
        }

        // Get location name from coordinates
        try {
            let locationName;

            // Use different geocoding methods based on the mode
            if (mapMode === 'location') {
                // Use landmark geocoding for location mode
                locationName = await reverseGeocodeLandmark(token, data.lat, data.lng);
            } else {
                // Use regular geocoding for starting and ending points
                locationName = await reverseGeocode(token, data.lat, data.lng);
            }
            console.log("Location name received:", locationName);

            if (locationName) {
                console.log("Resolved name:", locationName, "for mapMode:", mapMode);

                if (mapMode === 'location') {
                    setLocationName(locationName);
                    setSearchQuery(locationName);
                } else if (mapMode === 'starting') {
                    setStartingPoint(locationName);
                    setSearchQuery(locationName);
                } else if (mapMode === 'ending') {
                    setEndingPoint(locationName);
                    setSearchQuery(locationName);
                }
            } else {
                console.warn("No location name returned from backend.");
                const fallbackName = `${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`;

                if (mapMode === 'location') {
                    setLocationName(fallbackName);
                } else if (mapMode === 'starting') {
                    setStartingPoint(fallbackName);
                } else if (mapMode === 'ending') {
                    setEndingPoint(fallbackName);
                }
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    }
};