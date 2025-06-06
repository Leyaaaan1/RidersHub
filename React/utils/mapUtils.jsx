// React/utils/mapUtils.js
import { reverseGeocode } from '../services/rideService';

export const handleWebViewMessage = async (event, state) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'mapClick') {
        const {
            mapMode, setLatitude, setLongitude,
            setStartingLatitude, setStartingLongitude,
            setEndingLatitude, setEndingLongitude,
            setLocationName, setStartingPoint, setEndingPoint, setSearchQuery
        } = state;

        // Update coordinates based on map mode
        if (mapMode === 'location') {
            setLatitude(data.lat.toString());
            setLongitude(data.lng.toString());
            setLocationName('Fetching location name...');
        } else if (mapMode === 'starting') {
            setStartingLatitude(data.lat.toString());
            setStartingLongitude(data.lng.toString());
            setStartingPoint('Fetching location name...');  // Add this line
        } else if (mapMode === 'ending') {
            setEndingLatitude(data.lat.toString());
            setEndingLongitude(data.lng.toString());
            setEndingPoint('Fetching location name...');  // Add this line
        }

        // Get location name from coordinates
        try {
            const geoData = await reverseGeocode(data.lat, data.lng);
            console.log("GeoData received:", geoData);

            if (geoData && geoData.display_name) {
                const name = geoData.address?.suburb ||
                    geoData.address?.village ||
                    geoData.address?.town ||
                    geoData.address?.city ||
                    geoData.display_name.split(',')[0];

                console.log("Resolved name:", name, "for mapMode:", mapMode);

                if (mapMode === 'location') {
                    setLocationName(name);
                    setSearchQuery(geoData.display_name);
                } else if (mapMode === 'starting') {
                    setStartingPoint(name);
                    setSearchQuery(geoData.display_name);
                } else if (mapMode === 'ending') {
                    setEndingPoint(name);
                    setSearchQuery(geoData.display_name);
                }
            } else {
                console.warn("GeoData did not contain a display_name.");
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    }
};