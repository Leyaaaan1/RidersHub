import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import utilities from '../styles/utilities';
import { searchLocation, searchCityOrLandmark, createRide, searchRiders, reverseGeocodeLandmark } from '../services/rideService';
import RideStep1 from '../components/ride/RideStep1';
import RideStep2 from '../components/ride/RideStep2';
import RideStep3 from '../components/ride/RideStep3';
import { handleWebViewMessage } from '../utils/mapUtils';
import RideStep4 from "../components/ride/RideStep4";

const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;
    const webViewRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const [rideName, setRideName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [riderType, setRiderType] = useState('CAR');
    const [date, setDate] = useState(new Date());
    const [latitude, setLatitude] = useState('7.0731');
    const [longitude, setLongitude] = useState('125.6128');
    const [locationSelected, setLocationSelected] = useState(false);

    const [participants, setParticipants] = useState('');
    const [description, setDescription] = useState('');

    const [startingPoint, setStartingPoint] = useState('');
    const [startingLatitude, setStartingLatitude] = useState('7.0731');
    const [startingLongitude, setStartingLongitude] = useState('125.6128');

    const [endingPoint, setEndingPoint] = useState('');
    const [endingLatitude, setEndingLatitude] = useState('7.0731');
    const [endingLongitude, setEndingLongitude] = useState('125.6128');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [searchedRiders, setSearchedRiders] = useState([]);
    const [isRiderSearching, setIsRiderSearching] = useState(false);

    const [generatedRidesId, setGeneratedRidesId] = useState(null);
    const [showRideModal, setShowRideModal] = useState(false);

    const [mapMode, setMapMode] = useState('starting');
    const [mapRegion, setMapRegion] = useState({
        latitude: 7.0731,
        longitude: 125.6128,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // Stop Points State
    const [stopPoints, setStopPoints] = useState([]);

    // Route Information State (for better integration with GeoJSON)
    const [routeInfo, setRouteInfo] = useState(null);

    const handleSearchRiders = (query) => {
        if (query.trim().length >= 2) {
            setIsRiderSearching(true);
            searchRiders(token, query)
                .then(data => {
                    if (Array.isArray(data)) setSearchedRiders(data);
                    else setSearchedRiders([]);
                })
                .catch(() => setSearchedRiders([]))
                .finally(() => setIsRiderSearching(false));
        } else {
            setSearchedRiders([]);
        }
    };

    useEffect(() => {
        if (currentStep === 2) setMapMode('location');
        else if (currentStep === 3) setMapMode('starting');
    }, [currentStep]);

    const handleMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'mapClick' || data.type === 'markerDrag') {
                const lat = data.lat;
                const lng = data.lng;

                if (mapMode === 'location') {
                    setLatitude(lat.toString());
                    setLongitude(lng.toString());
                    // Reverse geocode to get location name
                    reverseGeocodeLandmark(token, lat, lng)
                        .then(name => {
                            if (name) setLocationName(name);
                        })
                        .catch(err => console.log('Error reverse geocoding:', err));
                } else if (mapMode === 'starting') {
                    setStartingLatitude(lat.toString());
                    setStartingLongitude(lng.toString());
                    // Reverse geocode to get starting point name
                    reverseGeocodeLandmark(token, lat, lng)
                        .then(name => {
                            if (name) setStartingPoint(name);
                        })
                        .catch(err => console.log('Error reverse geocoding:', err));
                } else if (mapMode === 'ending') {
                    setEndingLatitude(lat.toString());
                    setEndingLongitude(lng.toString());
                    // Reverse geocode to get ending point name
                    reverseGeocodeLandmark(token, lat, lng)
                        .then(name => {
                            if (name) setEndingPoint(name);
                        })
                        .catch(err => console.log('Error reverse geocoding:', err));
                }
            }
            // Handle route drawing success/error messages from RideStep3
            else if (data.type === 'routeDrawSuccess' && data.routeInfo) {
                setRouteInfo(data.routeInfo);
                console.log('Route info received in CreateRide:', data.routeInfo);
            } else if (data.type === 'routeDrawError') {
                console.error('Route drawing failed:', data.error);
                setError('Failed to calculate route. Please check your points and try again.');
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    };

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (!locationSelected && searchQuery && searchQuery.trim() && searchQuery.length >= 3) {
                setIsSearching(true);
                const searchFunc = mapMode === 'location'
                    ? searchCityOrLandmark
                    : searchLocation;
                searchFunc(token, searchQuery)
                    .then(data => setSearchResults(data))
                    .catch(() => Alert.alert('Error', 'Failed to search locations'))
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delayedSearch);
    }, [searchQuery, locationSelected, mapMode, token]);

    const handleLocationSelect = async (location) => {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        setLocationSelected(true);

        try {
            // Always resolve landmark/famous name
            const resolvedName = await reverseGeocodeLandmark(token, lat, lon);

            if (mapMode === 'location') {
                setLatitude(lat.toString());
                setLongitude(lon.toString());
                setLocationName(resolvedName || location.display_name.split(',')[0]);
            } else if (mapMode === 'starting') {
                setStartingLatitude(lat.toString());
                setStartingLongitude(lon.toString());
                setStartingPoint(resolvedName || location.display_name.split(',')[0]);
                setMapMode('ending');
            } else if (mapMode === 'ending') {
                setEndingLatitude(lat.toString());
                setEndingLongitude(lon.toString());
                setEndingPoint(resolvedName || location.display_name.split(',')[0]);
            }

            setSearchQuery(resolvedName || location.display_name);
            setSearchResults([]);
            setMapRegion({
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        } catch (error) {
            console.error('Error in handleLocationSelect:', error);
            // Fallback to display_name if reverse geocoding fails
            const fallbackName = location.display_name.split(',')[0];

            if (mapMode === 'location') {
                setLatitude(lat.toString());
                setLongitude(lon.toString());
                setLocationName(fallbackName);
            } else if (mapMode === 'starting') {
                setStartingLatitude(lat.toString());
                setStartingLongitude(lon.toString());
                setStartingPoint(fallbackName);
                setMapMode('ending');
            } else if (mapMode === 'ending') {
                setEndingLatitude(lat.toString());
                setEndingLongitude(lon.toString());
                setEndingPoint(fallbackName);
            }

            setSearchQuery(fallbackName);
            setSearchResults([]);
        }
    };

    const validateRideData = () => {
        const errors = [];

        if (!rideName.trim()) errors.push('Ride name is required');
        if (!startingPoint.trim()) errors.push('Starting point is required');
        if (!endingPoint.trim()) errors.push('Ending point is required');
        if (date < new Date()) errors.push('Ride date must be in the future');

        // Validate coordinates
        const startLat = parseFloat(startingLatitude);
        const startLng = parseFloat(startingLongitude);
        const endLat = parseFloat(endingLatitude);
        const endLng = parseFloat(endingLongitude);

        if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
            errors.push('Invalid coordinates for starting or ending points');
        }

        // Validate stop points if any
        if (stopPoints.length > 0) {
            stopPoints.forEach((stop, index) => {
                if (isNaN(parseFloat(stop.lat)) || isNaN(parseFloat(stop.lng))) {
                    errors.push(`Invalid coordinates for stop point ${index + 1}`);
                }
                if (!stop.name || !stop.name.trim()) {
                    errors.push(`Stop point ${index + 1} must have a name`);
                }
            });
        }

        return errors;
    };

    const handleCreateRide = async () => {
        // Clear previous errors
        setError('');

        // Validate form data
        const validationErrors = validateRideData();
        if (validationErrors.length > 0) {
            const errorMessage = validationErrors.join('\n');
            setError(errorMessage);
            Alert.alert('Validation Error', errorMessage);
            return;
        }

        setLoading(true);

        const participantsArray = Array.isArray(participants)
            ? participants
            : (typeof participants === 'string' && participants.trim()
                ? participants.split(',').map(p => p.trim())
                : []);

        // Prepare stopPoints for backend with better validation
        const stopPointsPayload = stopPoints.map((sp, index) => {
            const stopLat = parseFloat(sp.lat || sp.stopLatitude);
            const stopLng = parseFloat(sp.lng || sp.stopLongitude);
            const stopName = sp.name || sp.stopName || `Stop Point ${index + 1}`;

            return {
                stopLatitude: stopLat,
                stopLongitude: stopLng,
                stopName: stopName.trim()
            };
        });

        try {
            if (!token) {
                throw new Error('No authentication token available. Please log in again.');
            }

            const rideData = {
                ridesName: rideName.trim(),
                locationName: locationName.trim() || 'Custom Location',
                riderType: riderType || 'CAR',
                date: date.toISOString(),
                latitude: parseFloat(latitude) || 7.0731,
                longitude: parseFloat(longitude) || 125.6128,
                startLat: parseFloat(startingLatitude),
                startLng: parseFloat(startingLongitude),
                endLat: parseFloat(endingLatitude),
                endLng: parseFloat(endingLongitude),
                startingPoint: startingPoint.trim(),
                endingPoint: endingPoint.trim(),
                participants: participantsArray,
                description: description.trim(),
                stopPoints: stopPointsPayload,
                // Include route information if available
                ...(routeInfo && {
                    routeDistance: routeInfo.distance,
                    routeDuration: routeInfo.duration,
                    routeProvider: routeInfo.provider
                })
            };

            console.log('Creating ride with data:', rideData);

            // Make the API call to create the ride
            const result = await createRide(rideData, token);
            console.log('CreateRide API response:', result);

            // Handle different possible response formats
            let generatedId = null;

            if (result && typeof result === 'object') {
                // Check different possible property names
                generatedId = result.generatedRidesId ||
                    result.ridesId ||
                    result.rideId ||
                    result.id ||
                    result.generatedId;
            } else if (typeof result === 'string') {
                // Sometimes the ID might be returned as a string
                generatedId = result;
            }

            console.log('Extracted generated ID:', generatedId);

            if (generatedId) {
                setGeneratedRidesId(generatedId);
                console.log('Navigating to RideStep4 with ID:', generatedId);

                // Navigate to step 4
                setCurrentStep(4);

                // Clear any route errors since we succeeded
                setError('');
            } else {
                console.error('No valid ride ID found in response:', result);
                const errorMsg = 'Ride was created but no ID was returned. Please contact support.';
                setError(errorMsg);
                Alert.alert('Warning', errorMsg);
            }
        } catch (err) {
            console.error('Error creating ride:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });

            let errorMessage = 'An error occurred while creating the ride.';

            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        // Clear errors when moving to next step
        setError('');
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        // Clear errors when moving to previous step
        setError('');
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
        if (locationSelected) setLocationSelected(false);
        // Clear search-related errors
        if (error.includes('search') || error.includes('location')) {
            setError('');
        }
    };

    return (
        <ScrollView contentContainerStyle={utilities.container}>
            {currentStep === 1 && (
                <RideStep1
                    error={error}
                    rideName={rideName}
                    setRideName={setRideName}
                    riderType={riderType}
                    setRiderType={setRiderType}
                    participants={participants}
                    setParticipants={setParticipants}
                    riderSearchQuery={riderSearchQuery}
                    setRiderSearchQuery={setRiderSearchQuery}
                    searchedRiders={searchedRiders}
                    isRiderSearching={isRiderSearching}
                    handleSearchRiders={handleSearchRiders}
                    description={description}
                    setDescription={setDescription}
                    setDate={setDate}
                    date={date}
                    nextStep={nextStep}
                />
            )}
            {currentStep === 2 && (
                <RideStep2
                    isSearching={isSearching}
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleLocationSelect={handleLocationSelect}
                    handleSearchInputChange={handleSearchInputChange}
                    webViewRef={webViewRef}
                    latitude={latitude}
                    longitude={longitude}
                    handleMessage={handleMessage}
                    locationName={locationName}
                    setLocationName={setLocationName}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    token={token}
                />
            )}
            {currentStep === 3 && (
                <RideStep3
                    stopPoints={stopPoints}
                    setStopPoints={setStopPoints}
                    mapMode={mapMode}
                    setMapMode={setMapMode}
                    isSearching={isSearching}
                    searchResults={searchResults}
                    handleLocationSelect={handleLocationSelect}
                    webViewRef={webViewRef}
                    startingLatitude={parseFloat(startingLatitude)}
                    startingLongitude={parseFloat(startingLongitude)}
                    endingLatitude={parseFloat(endingLatitude)}
                    endingLongitude={parseFloat(endingLongitude)}
                    handleMessage={handleMessage}
                    startingPoint={startingPoint}
                    setStartingPoint={setStartingPoint}
                    endingPoint={endingPoint}
                    setEndingPoint={setEndingPoint}
                    handleSearchInputChange={handleSearchInputChange}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    handleCreateRide={handleCreateRide}
                    loading={loading}
                    searchQuery={searchQuery}
                    token={token}
                />
            )}
            {currentStep === 4 && generatedRidesId && (
                <RideStep4
                    generatedRidesId={generatedRidesId}
                    rideName={rideName}
                    locationName={locationName}
                    riderType={riderType}
                    date={date}
                    startingPoint={startingPoint}
                    endingPoint={endingPoint}
                    participants={participants}
                    description={description}
                    token={token}
                    username={username}
                    stopPoints={stopPoints}
                    currentUsername={username}
                    routeInfo={routeInfo} // Pass route info to step 4
                />
            )}
        </ScrollView>
    );
};

export default CreateRide;