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

const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;
    const webViewRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const [rideName, setRideName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [riderType, setRiderType] = useState('CAR');
    const [distance, setDistance] = useState('');
    const [date, setDate] = useState(new Date());
    const [latitude, setLatitude] = useState('7.0731');
    const [longitude, setLongitude] = useState('125.6128');

    const [participants, setParticipants] = useState('');
    const [description, setDescription] = useState('');

    const [startingPoint, setStartingPoint] = useState('');
    const [startingLatitude, setStartingLatitude] = useState('7.0731');
    const [startingLongitude, setStartingLongitude] = useState('125.6128');

    const [endingPoint, setEndingPoint] = useState('');
    const [endingLatitude, setEndingLatitude] = useState('7.0731');
    const [endingLongitude, setEndingLongitude] = useState('125.6128');

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [searchedRiders, setSearchedRiders] = useState([]);
    const [isRiderSearching, setIsRiderSearching] = useState(false);




    const [mapMode, setMapMode] = useState('location');
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
                    // Always set empty array on error to prevent undefined
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
            lat = parseFloat(endingLatitude) || 7.0731;
            lon = parseFloat(endingLongitude) || 125.6128;
        }

        webViewRef.current?.injectJavaScript(`
            map.setView([${lat}, ${lon}], 15);
            marker.setLatLng([${lat}, ${lon}]);
        `);
    };

    useEffect(() => {
        if (webViewRef.current) {
            updateMapLocation();
        }
    }, [latitude, longitude, startingLatitude, startingLongitude, endingLatitude, endingLongitude, mapMode]);

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
            setSearchQuery
        });
    };

    // Debounce search
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchQuery.trim() && searchQuery.length >= 3) {
                setIsSearching(true);
                searchLocation(searchQuery)
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

        if (mapMode === 'location') {
            setLatitude(lat.toString());
            setLongitude(lon.toString());
            setLocationName(location.display_name.split(',')[0]);
        } else if (mapMode === 'starting') {
            setStartingLatitude(lat.toString());
            setStartingLongitude(lon.toString());
            setStartingPoint(location.display_name.split(',')[0]);
        } else if (mapMode === 'ending') {
            setEndingLatitude(lat.toString());
            setEndingLongitude(lon.toString());
            setEndingPoint(location.display_name.split(',')[0]);
        }

        setSearchQuery(location.display_name);
        setSearchResults([]);
        setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };



    // Create ride handler
    const handleCreateRide = async () => {
        // Form validation
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
        if (!distance || isNaN(parseFloat(distance))) {
            setError('Please enter a valid distance');
            return;
        }

        setLoading(true);
        setError('');

        const participantsArray = participants ? participants.split(',').map(p => p.trim()) : [];

        const rideData = {
            ridesName: rideName,
            locationName: locationName,
            riderType: riderType || 'CAR',  // Make sure to use uppercase as in your backend
            distance: parseFloat(distance),
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
            description: description
        };

        createRide(token, rideData)
            .then(() => {
                Alert.alert(
                    'Success',
                    'Ride created successfully!',
                    [{ text: 'OK', onPress: () => navigation.navigate('RiderPage', { token, username }) }]
                );
            })
            .catch(err => {
                setError(err.message || 'An error occurred');
                Alert.alert('Error', err.message || 'Failed to create ride');
            })
            .finally(() => setLoading(false));
    };

    // Step navigation
    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
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
                    distance={distance}
                    setDistance={setDistance}
                    participants={participants}
                    setParticipants={setParticipants}
                    riderSearchQuery={riderSearchQuery}
                    setRiderSearchQuery={setRiderSearchQuery}
                    searchedRiders={searchedRiders}
                    isRiderSearching={isRiderSearching}
                    handleSearchRiders={handleSearchRiders}
                    description={description}
                    setDescription={setDescription}
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
                    webViewRef={webViewRef}
                    latitude={latitude}
                    longitude={longitude}
                    handleMessage={handleMessage}
                    locationName={locationName}
                    setLocationName={setLocationName}
                    prevStep={prevStep}
                    nextStep={nextStep}
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
                    handleCreateRide={handleCreateRide}
                    loading={loading}
                />
            )}
        </ScrollView>
    );
};

export default CreateRide;