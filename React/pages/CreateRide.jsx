import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import utilities from '../styles/utilities';
import { searchLocation, searchCityOrLandmark, createRide, searchRiders, reverseGeocodeLandmark } from '../services/rideService';
import RideStep1 from '../components/ride/RideStep1';
import RideStep2 from '../components/ride/RideStep2';
import RideStep3 from '../components/ride/RideStep3';
import { handleWebViewMessage } from '../utils/mapUtils';
import RideStep4 from "../components/ride/RideStep4";
import { getDirections } from '../services/mapService'; // Add this import
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

    const [startingPoint, setStartingPoint] = useState(locationName);
    const [startingLatitude, setStartingLatitude] = useState('7.0731');
    const [startingLongitude, setStartingLongitude] = useState('125.6128');

    const [endingPoint, setEndingPoint] = useState('');
    const [endingLatitude, setEndingLatitude] = useState(startingLatitude);
    const [endingLongitude, setEndingLongitude] = useState(startingLongitude);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [searchedRiders, setSearchedRiders] = useState([]);
    const [isRiderSearching, setIsRiderSearching] = useState(false);

    const [mapboxImageUrl, setMapboxImageUrl] = useState('');
    const [generatedRidesId, setGeneratedRidesId] = useState(null);
    const [showRideModal, setShowRideModal] = useState(false);

    const [mapMode, setMapMode] = useState('starting');
    const [mapRegion, setMapRegion] = useState({
        latitude: 7.0731,
        longitude: 125.6128,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // --- Stop Points State ---
    const [stopPoints, setStopPoints] = useState([]);

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
        handleWebViewMessage(event, {
            mapMode,
            setLatitude,
            setLongitude,
            setStartingLatitude,
            setStartingLongitude,
            setEndingLatitude,
            setEndingLongitude,
            setLocationName,
            setStartingPoint,
            setEndingPoint,
            setSearchQuery,
            stopPoints,
            setStopPoints,
            token
        });
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
            setEndingPoint(resolvedName || location.display_name.split(',')[0] || startingPoint);
        }

        setSearchQuery(resolvedName || location.display_name);
        setSearchResults([]);
        setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    const handleCreateRide = async () => {
        if (!rideName.trim()) { setError('Ride name is required'); return; }
        if (!startingPoint.trim()) { setError('Starting point is required'); return; }
        if (!endingPoint.trim()) { setError('Ending point is required'); return; }
        if (date < new Date()) { setError('Ride date must be in the future'); return; }

        setLoading(true);
        setError('');

        const participantsArray = Array.isArray(participants)
            ? participants
            : (typeof participants === 'string' && participants.trim()
                ? participants.split(',').map(p => p.trim())
                : []);

        // Prepare stopPoints for backend (lat, lng, name)
        const stopPointsPayload = stopPoints.map(sp => ({
            stopLatitude: sp.lat || sp.stopLatitude,
            stopLongitude: sp.lng || sp.stopLongitude,
            stopName: sp.name || sp.stopName
        }));

        try {
            let routeCoordinates = [];
            try {
                routeCoordinates = await getDirections(
                    token,
                    startingLongitude,
                    startingLatitude,
                    endingLongitude,
                    endingLatitude,
                    stopPointsPayload
                );
            } catch (routeErr) {
                console.error('Error fetching route:', routeErr);
                // Continue with ride creation even if route fetch fails
            }

            // Include routeCoordinates in the ride data
            const rideData = {
                ridesName: rideName,
                locationName: locationName,
                riderType: riderType || 'CAR',
                date: date.toISOString(),
                latitude: parseFloat(latitude) || 0,
                longitude: parseFloat(longitude) || 0,
                startLat: parseFloat(startingLatitude) || 0,
                startLng: parseFloat(startingLongitude) || 0,
                endLat: parseFloat(endingLatitude) || 0,
                endLng: parseFloat(endingLongitude) || 0,
                startingPoint: startingPoint,
                endingPoint: endingPoint,
                participants: participantsArray,
                description: description,
                mapboxImageUrl: mapboxImageUrl,
                stopPoints: stopPointsPayload,
                routeCoordinates: JSON.stringify(routeCoordinates) // Convert to string for API
            };

            // Make the API call to create the ride
            const result = await createRide(rideData, token);

            if (result && result.generatedRidesId) {
                setGeneratedRidesId(result.generatedRidesId);
                navigation.navigate('RideStep4', {
                    generatedRidesId: result.generatedRidesId,
                    rideName, locationName, riderType, date, startingPoint, endingPoint, participants, description, token, username
                });
            } else {
                setError('Created ride but no ID was returned. Please try again.');
                Alert.alert('Warning', 'Ride was created but ID is missing');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            Alert.alert('Error', err.message || 'Failed to create ride');
        } finally {
            setLoading(false);
        }
    };
    const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
        if (locationSelected) setLocationSelected(false);
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
                    startingLatitude={startingLatitude}
                    startingLongitude={startingLongitude}
                    endingLatitude={endingLatitude}
                    endingLongitude={endingLongitude}
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
            {currentStep === 4 && (
                <RideStep4
                    visible={showRideModal}
                    onClose={() => setShowRideModal(false)}
                    rideName={rideName}
                    locationName={locationName}
                    riderType={riderType}
                    date={date}
                    startingPoint={startingPoint}
                    endingPoint={endingPoint}
                    participants={participants}
                    description={description}
                    prevStep={() => { setShowRideModal(false); setCurrentStep(3); }}
                    loading={loading}
                    token={token}
                    generatedRidesId={generatedRidesId}
                    username={username}
                />
            )}
        </ScrollView>
    );
};

export default CreateRide;