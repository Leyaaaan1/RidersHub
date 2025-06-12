// React/pages/CreateRide.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import utilities from '../styles/utilities';
import { WebView } from 'react-native-webview';
import {searchLocation, createRide, searchRiders} from '../services/rideService';
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

    const [startingPoint, setStartingPoint] = useState(locationName);
    const [startingLatitude, setStartingLatitude] = useState('7.0731');
    const [startingLongitude, setStartingLongitude] = useState('125.6128');

    const [endingPoint, setEndingPoint] = useState('');
    const [endingLatitude, setEndingLatitude] = useState(startingLatitude);
    const [endingLongitude, setEndingLongitude] = useState(startingLongitude);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [searchedRiders, setSearchedRiders] = useState([]);
    const [isRiderSearching, setIsRiderSearching] = useState(false);

    const [mapboxImageUrl, setMapboxImageUrl] = useState('');

    const [generatedRidesId, setgeneratedRidesId] = useState(null);

    const [showRideModal, setShowRideModal] = useState(false);


    const [mapMode, setMapMode] = useState('starting');
    const [mapRegion, setMapRegion] = useState({
        latitude: 7.0731,
        longitude: 125.6128,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });


    const handleSearchRiders = (query) => {
        if (query.trim().length >= 2) {
            setIsRiderSearching(true);
            searchRiders(token, query)
                .then(data => {
                    console.log('Search data received:', data);
                    // Check if data is valid before setting state
                    if (Array.isArray(data)) {
                        setSearchedRiders(data);
                    } else {
                        console.warn('Received invalid data format:', data);
                        setSearchedRiders([]);
                    }
                })
                .catch(error => {
                    console.error('Error searching riders:', error);
                    setSearchedRiders([]);
                    Alert.alert('Error', `Failed to search riders: ${error.message || 'Unknown error'}`);
                })
                .finally(() => {
                    setIsRiderSearching(false);
                });
        } else {
            setSearchedRiders([]);
        }
    };

    const updateMapLocation = () => {
        let lat, lon;
        if (mapMode === 'location') {
            lat = parseFloat(latitude) || 7.0731;
            lon = parseFloat(longitude) || 125.6128;
        } else if (mapMode === 'starting') {
            lat = parseFloat(startingLatitude) || 7.0731;
            lon = parseFloat(startingLongitude) || 125.6128;
        } else if (mapMode === 'ending') {
            lat = parseFloat(endingLatitude) || parseFloat(startingLatitude) || 7.0731;
            lon = parseFloat(endingLongitude) || parseFloat(startingLongitude) || 125.6128;
        }

        webViewRef.current?.injectJavaScript(`
            map.setView([${lat}, ${lon}], 15);
            marker.setLatLng([${lat}, ${lon}]);
        `);
    };

    useEffect(() => {
        if (currentStep === 2) {
            setMapMode('location');
        } else if (currentStep === 3) {
            setMapMode('starting');
        }
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
            token
        });
    };

    // Debounce search
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchQuery && searchQuery.trim() && searchQuery.length >= 3) {
                setIsSearching(true);
                searchLocation(token, searchQuery)
                    .then(data => setSearchResults(data))
                    .catch(error => {
                        console.error('Error searching location:', error);
                        Alert.alert('Error', 'Failed to search locations');
                    })
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchQuery]);




    const handleLocationSelect = (location) => {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        // Set location selected flag
        setLocationSelected(true);

        if (mapMode === 'location') {
            setLatitude(lat.toString());
            setLongitude(lon.toString());
            setLocationName(location.display_name.split(',')[0]);
        } else if (mapMode === 'starting') {
            setStartingLatitude(lat.toString());
            setStartingLongitude(lon.toString());
            setStartingPoint(location.display_name.split(',')[0]);
            setMapMode('ending');
        } else if (mapMode === 'ending') {
            setEndingLatitude(lat.toString());
            setEndingLongitude(lon.toString());
            setEndingPoint(location.display_name.split(',')[0] || startingPoint);
        }

        // Set the display name as search query without triggering a new search
        setSearchQuery(location.display_name);
        setSearchResults([]);
        setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

// Modify the search useEffect to respect the selection flag
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            // Only search if not manually selected and query is valid
            if (!locationSelected && searchQuery && searchQuery.trim() && searchQuery.length >= 3) {
                setIsSearching(true);
                searchLocation(token, searchQuery)
                    .then(data => setSearchResults(data))
                    .catch(error => {
                        console.error('Error searching location:', error);
                        Alert.alert('Error', 'Failed to search locations');
                    })
                    .finally(() => setIsSearching(false));
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchQuery, locationSelected]);;

    useEffect(() => {
        const handleSearchQueryChange = (text) => {
            setSearchQuery(text);
            if (locationSelected) {
                setLocationSelected(false);
            }
        };

        return handleSearchQueryChange;
    }, [locationSelected]);

    const handleCreateRide = async () => {
        if (!rideName.trim()) {
            setError('Ride name is required');
            return;
        }
        if (!startingPoint.trim()) {
            setError('Starting point is required');
            return;
        }
        if (!endingPoint.trim()) {
            setError('Ending point is required');
            return;
        }


        const now = new Date();
        if (date < now) {
            setError('Ride date must be in the future');
            return;
        }

        setLoading(true);
        setError('');

        const participantsArray = participants ? participants.split(',').map(p => p.trim()) : [];

        const rideData = {
            ridesName: rideName,
            locationName: locationName,
            riderType: riderType || 'CAR',  // Make sure to use uppercase as in your backend
            // distance: parseFloat(distance),
            date: date.toISOString(),
            latitude: parseFloat(latitude) || 0,
            longitude: parseFloat(longitude) || 0,
            startLat: parseFloat(startingLatitude) || 0,  // Add these fields
            startLng: parseFloat(startingLongitude) || 0, // that match your backend
            endLat: parseFloat(endingLatitude) || 0,      // controller parameter names
            endLng: parseFloat(endingLongitude) || 0,     //
            startingPoint: startingPoint,                 // Keep these for UI display
            endingPoint: endingPoint,                     // purposes
            participants: participantsArray,
            description: description,
            mapboxImageUrl: mapboxImageUrl



        };

        try {
            const result = await createRide(token, rideData);
            console.log('Ride creation response:', result);

            if (result && result.generatedRidesId) {
                setgeneratedRidesId(result.generatedRidesId);
                console.log('Ride ID set:', result.generatedRidesId);

                // Navigate to RideStep4 instead of showing modal
                navigation.navigate('RideStep4', {
                    generatedRidesId: result.generatedRidesId,
                    rideName: rideName,
                    locationName: locationName,
                    riderType: riderType,
                    date: date,
                    startingPoint: startingPoint,
                    endingPoint: endingPoint,
                    participants: participants,
                    description: description,
                    token: token,
                    username: username
                });
            } else {
                console.error('API returned success but no ride ID:', result);
                setError('Created ride but no ID was returned. Please try again.');
                Alert.alert('Warning', 'Ride was created but ID is missing');
            }
        } catch (err) {
            console.error('Ride creation error:', err);
            setError(err.message || 'An error occurred');
            Alert.alert('Error', err.message || 'Failed to create ride');
        } finally {
            setLoading(false);
        }
    };

    // Step navigation
    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleModalClose = () => {
        setShowRideModal(false);
    };

    const handleModalBack = () => {
        setShowRideModal(false);
        setCurrentStep(3);
    };

    const handleSearchInputChange = (text) => {
        setSearchQuery(text);
        if (locationSelected) {
            setLocationSelected(false);
        }
    }

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
                    // setMapboxImageUrl={setMapboxImageUrl}
                />
            )}

            {currentStep === 3 && (
                <RideStep3
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
                    prevStep={prevStep}
                    nextStep={nextStep}
                    handleCreateRide={handleCreateRide}
                    loading={loading}
                />
            )}

            {currentStep === 4 && (
                <RideStep4
                    visible={showRideModal}
                    onClose={handleModalClose}
                    rideName={rideName}
                    locationName={locationName}
                    riderType={riderType}
                    date={date}
                    startingPoint={startingPoint}
                    endingPoint={endingPoint}
                    participants={participants}
                    description={description}
                    prevStep={handleModalBack}
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