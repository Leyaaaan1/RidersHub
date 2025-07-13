// src/components/CreateRide.jsx

import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import utilities from '../styles/utilities';
import {
    searchLocation,
    searchCityOrLandmark,
    createRide,
    searchRiders,
    reverseGeocodeLandmark
} from '../services/rideService';
import RideStep1 from '../components/ride/RideStep1';
import RideStep2 from '../components/ride/RideStep2';
import RideStep3 from '../components/ride/RideStep3';
import RideStep4 from '../components/ride/RideStep4';
import { handleWebViewMessage } from '../utils/mapUtils';

const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;
    const webViewRef = useRef(null);

    // Step & loading state
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState('');

    // Ride basic details
    const [rideName, setRideName]       = useState('');
    const [locationName, setLocationName] = useState('');
    const [riderType, setRiderType]     = useState('CAR');
    const [date, setDate]               = useState(new Date());

    // Map & search state
    const [latitude, setLatitude]       = useState('7.0731');
    const [longitude, setLongitude]     = useState('125.6128');
    const [locationSelected, setLocationSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Participants
    const [participants, setParticipants]     = useState('');
    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [searchedRiders, setSearchedRiders] = useState([]);
    const [isRiderSearching, setIsRiderSearching] = useState(false);

    const [description, setDescription] = useState('');


    // Start / End / Stops for Step 3
    const [startingPoint, setStartingPoint]     = useState(locationName);
    const [startingLatitude, setStartingLatitude] = useState('7.0731');
    const [startingLongitude, setStartingLongitude] = useState('125.6128');
    const [endingPoint, setEndingPoint]         = useState('');
    const [endingLatitude, setEndingLatitude]   = useState('7.0731');
    const [endingLongitude, setEndingLongitude] = useState('125.6128');
    const [stopPoints, setStopPoints]           = useState([]);

    // Modal & result
    const [generatedRidesId, setGeneratedRidesId] = useState(null);
    const [showRideModal, setShowRideModal]       = useState(false);

    // Map mode (used by Step 2 & 3)
    const [mapMode, setMapMode] = useState('starting');

    // Effects to switch mapMode when entering steps 2 & 3
    useEffect(() => {
        if (currentStep === 2) setMapMode('location');
        else if (currentStep === 3) setMapMode('starting');
    }, [currentStep]);

    // Debounced search for locations
    useEffect(() => {
        const handle = setTimeout(() => {
            if (!locationSelected && searchQuery.length >= 3) {
                setIsSearching(true);
                const fn = mapMode === 'location' ? searchCityOrLandmark : searchLocation;
                fn(token, searchQuery)
                    .then(setSearchResults)
                    .catch(() => Alert.alert('Error', 'Location search failed'))
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(handle);
    }, [searchQuery, locationSelected, mapMode, token]);

    // Rider search
    const handleSearchRiders = (q) => {
        if (q.trim().length >= 2) {
            setIsRiderSearching(true);
            searchRiders(token, q)
                .then(arr => setSearchedRiders(Array.isArray(arr) ? arr : []))
                .catch(() => setSearchedRiders([]))
                .finally(() => setIsRiderSearching(false));
        } else {
            setSearchedRiders([]);
        }
    };

    // Common message handler for WebView
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

    // When user selects a location from the search results
    const handleLocationSelect = async (location) => {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        setLocationSelected(true);

        const resolved = await reverseGeocodeLandmark(token, lat, lon);

        if (mapMode === 'location') {
            setLatitude(lat.toString());
            setLongitude(lon.toString());
            setLocationName(resolved || location.display_name.split(',')[0]);
        }
        else if (mapMode === 'starting') {
            setStartingLatitude(lat.toString());
            setStartingLongitude(lon.toString());
            setStartingPoint(resolved || location.display_name.split(',')[0]);
            setMapMode('ending');
        }
        else if (mapMode === 'ending') {
            setEndingLatitude(lat.toString());
            setEndingLongitude(lon.toString());
            setEndingPoint(resolved || location.display_name.split(',')[0]);
        }

        setSearchQuery(resolved || location.display_name);
        setSearchResults([]);
    };

    // Create Ride: POST + inject final route + navigate
    const handleCreateRide = async () => {
        // Basic validation
        if (!rideName.trim())    { setError('Ride name is required'); return; }
        if (!startingPoint.trim()){ setError('Starting point is required'); return; }
        if (!endingPoint.trim())  { setError('Ending point is required'); return; }
        if (date < new Date())    { setError('Ride date must be in the future'); return; }

        setLoading(true);
        setError('');

        // Build stopPoints payload
        const stopPointsPayload = stopPoints.map(sp => ({
            stopLatitude:  sp.lat,
            stopLongitude: sp.lng,
            stopName:      sp.name
        }));

        // Build full rideData
        const rideData = {
            ridesName:      rideName,
            locationName,
            riderType,
            date:           date.toISOString(),
            latitude:       parseFloat(latitude),
            longitude:      parseFloat(longitude),
            startLat:       parseFloat(startingLatitude),
            startLng:       parseFloat(startingLongitude),
            endLat:         parseFloat(endingLatitude),
            endLng:         parseFloat(endingLongitude),
            startingPoint,
            endingPoint,
            participants:   Array.isArray(participants)
                ? participants
                : participants.split(',').map(p => p.trim()).filter(p => p),
            description,
            stopPoints:     stopPointsPayload
        };

        try {
            // 1) call backend
            const result = await createRide(token, rideData);

            // 2) immediately post the saved route to WebView
            const routeMsg = {
                type: 'updateRoute',
                start: {
                    lat: result.startLat,
                    lng: result.startLng,
                    name: result.startingPoint
                },
                stops: result.stopPoints.map(sp => ({
                    lat: sp.stopLatitude,
                    lng: sp.stopLongitude,
                    name: sp.stopName
                })),
                end: {
                    lat: result.endLat,
                    lng: result.endLng,
                    name: result.endingPoint
                }
            };
            webViewRef.current?.postMessage(JSON.stringify(routeMsg));

            // 3) navigate to Step 4
            setGeneratedRidesId(result.generatedRidesId);
            navigation.navigate('RideStep4', {
                generatedRidesId: result.generatedRidesId,
                rideName,
                locationName,
                riderType,
                date,
                startingPoint,
                endingPoint,
                participants: Array.isArray(participants) ? participants : participants.split(',').map(p=>p.trim()),
                description,
                token,
                username
            });
        } catch (err) {
            setError(err.message);
            Alert.alert('Error', err.message || 'Failed to create ride');
        } finally {
            setLoading(false);
        }
    };

    // Step control
    const nextStep = () => currentStep < 4 && setCurrentStep(currentStep + 1);
    const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

    // Render Step components
    return (
        <ScrollView contentContainerStyle={utilities.container}>
            {currentStep === 1 && (
                <RideStep1
                    error={error}
                    rideName={rideName} setRideName={setRideName}
                    riderType={riderType} setRiderType={setRiderType}
                    participants={participants} setParticipants={setParticipants}
                    riderSearchQuery={riderSearchQuery} setRiderSearchQuery={setRiderSearchQuery}
                    searchedRiders={searchedRiders} isRiderSearching={isRiderSearching}
                    handleSearchRiders={handleSearchRiders}
                    description={description} setDescription={setDescription}
                    date={date} setDate={setDate}
                    nextStep={nextStep}
                />
            )}
            {currentStep === 2 && (
                <RideStep2
                    isSearching={isSearching}
                    searchResults={searchResults}
                    searchQuery={searchQuery}
                    handleSearchInputChange={setSearchQuery}
                    handleLocationSelect={handleLocationSelect}
                    webViewRef={webViewRef}
                    latitude={latitude} longitude={longitude}
                    handleMessage={handleMessage}
                    locationName={locationName}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    token={token}
                />
            )}
            {currentStep === 3 && (
                <RideStep3
                    mapMode={mapMode} setMapMode={setMapMode}
                    isSearching={isSearching} searchResults={searchResults}
                    handleLocationSelect={handleLocationSelect}
                    webViewRef={webViewRef}
                    startingLatitude={startingLatitude} startingLongitude={startingLongitude}
                    endingLatitude={endingLatitude} endingLongitude={endingLongitude}
                    startingPoint={startingPoint} setStartingPoint={setStartingPoint}
                    endingPoint={endingPoint} setEndingPoint={setEndingPoint}
                    stopPoints={stopPoints} setStopPoints={setStopPoints}
                    handleSearchInputChange={setSearchQuery}
                    handleMessage={handleMessage}
                    prevStep={prevStep} handleCreateRide={handleCreateRide}
                    loading={loading} nextStep={nextStep}
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
                    participants={Array.isArray(participants) ? participants : participants.split(',').map(p=>p.trim())}
                    description={description}
                    prevStep={() => { setShowRideModal(false); setCurrentStep(3); }}
                    loading={loading}
                    generatedRidesId={generatedRidesId}
                    token={token}
                    username={username}
                />
            )}
        </ScrollView>
    );
};

export default CreateRide;
