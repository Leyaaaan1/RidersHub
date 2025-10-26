import { useState, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { getRouteCoordinates } from "../../services/RouteService";

export const useRouteMapLogic = (generatedRidesId, token) => {
    const [isLoading, setIsLoading] = useState(true);
    const [routeData, setRouteData] = useState(null);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [watchId, setWatchId] = useState(null);

    useEffect(() => {
        if (generatedRidesId) {
            fetchRouteData();
        } else {
            console.warn('No generatedRidesId provided');
            setIsLoading(false);
            setError('No route ID provided');
        }

        // Start tracking user location
        requestLocationPermission();

        // Cleanup on unmount
        return () => {
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
            }
        };
    }, [generatedRidesId, token]);

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to show your position on the map.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    startLocationTracking();
                } else {
                    console.log('Location permission denied');
                }
            } else {
                // iOS - permissions handled via Info.plist
                startLocationTracking();
            }
        } catch (err) {
            console.warn('Error requesting location permission:', err);
        }
    };

// javascript
    const startLocationTracking = () => {
        const locationOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
        };

        const handleLocationError = (error, type = 'current') => {
            console.error(`Error ${type} location:`, error);

            // Suppress TIMEOUT errors if we already have a valid userLocation or a watch running
            if (error.code === 3) { // TIMEOUT
                if (userLocation || watchId !== null) {
                    console.warn('Location request timed out but a location is already available or watch is active. Ignoring timeout.');
                    return;
                }
                // Otherwise log and return without an immediate alert to avoid spamming the user
                console.warn('Location request timed out. Will rely on watchPosition or retry.');
                return;
            }

            // Map other error codes to friendly messages
            const message =
                error.code === 1
                    ? 'Location permission denied. Please allow location access.'
                    : error.code === 2
                        ? 'Location service is disabled. Please enable GPS.'
                        : 'Unable to get your location. Please try again.';
            Alert.alert('Location Error', message);
        };

        const updateUserLocationState = (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            if (accuracy <= 100) { // Only update if accuracy is within 100 meters
                setUserLocation({ lat: latitude, lng: longitude });
                console.log(`User location ${watchId ? 'updated' : 'initialized'}:`, latitude, longitude);
            } else {
                console.warn(`Received location with low accuracy (${accuracy}m), ignoring.`);
            }
        };

        // Get initial position (may timeout; that's ok if watchPosition provides a fix)
        Geolocation.getCurrentPosition(
            updateUserLocationState,
            (error) => handleLocationError(error, 'initial'),
            { ...locationOptions, timeout: 20000, maximumAge: 30000 } // slightly longer timeout and allow cached pos
        );

        // Watch position for real-time updates with battery-efficient settings
        const id = Geolocation.watchPosition(
            updateUserLocationState,
            (error) => handleLocationError(error, 'watching'),
            {
                ...locationOptions,
                distanceFilter: 20,
                interval: 10000,
                fastestInterval: 5000,
                forceRequestLocation: false
            }
        );

        setWatchId(id);
    };    const fetchRouteData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getRouteCoordinates(token, generatedRidesId);

            if (!data) {
                throw new Error('No route data received from server');
            }

            setRouteData(data);
            console.log('Route data loaded successfully:', data);

        } catch (error) {
            const errorMessage = error.message || 'Failed to load route data';
            setError(errorMessage);
            Alert.alert(
                'Route Loading Error',
                errorMessage,
                [
                    { text: 'Retry', onPress: () => fetchRouteData() },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleWebViewLoad = (webViewRef, routeData, startingPoint, endingPoint, stopPoints, userLocation) => {
        console.log('WebView loaded');

        if (webViewRef.current && routeData) {
            console.log('Injecting route data into WebView');

            const script = `
                console.log('Injecting route data...');
                if (typeof window.loadRouteData === 'function') {
                    window.loadRouteData(
                        ${JSON.stringify(routeData)},
                        ${JSON.stringify(startingPoint)},
                        ${JSON.stringify(endingPoint)},
                        ${JSON.stringify(stopPoints)},
                        ${JSON.stringify(userLocation)}
                    );
                } else {
                    console.error('loadRouteData function not available');
                }
                true;
            `;

            webViewRef.current.injectJavaScript(script);
        }
    };

    const updateUserLocationOnMap = (webViewRef, userLocation) => {
        if (webViewRef.current && userLocation) {
            const script = `
                if (typeof window.updateUserLocation === 'function') {
                    window.updateUserLocation(${JSON.stringify(userLocation)});
                }
                true;
            `;
            webViewRef.current.injectJavaScript(script);
        }
    };

    const handleWebViewMessage = (event, setError, handleWebViewLoad) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            console.log('WebView message:', message);

            if (message.type === 'error') {
                console.error('Map error:', message.message);
                setError(message.message);
            } else if (message.type === 'mapReady') {
                console.log('Map is ready');
                if (routeData) {
                    handleWebViewLoad();
                }
            } else if (message.type === 'routeLoaded') {
                console.log('Route loaded successfully:', message);
            }
        } catch (error) {
            console.log('Non-JSON WebView message:', event.nativeEvent.data);
        }
    };

    const handleWebViewError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
    };

    return {
        isLoading,
        routeData,
        error,
        userLocation,
        fetchRouteData,
        handleWebViewLoad,
        handleWebViewMessage,
        handleWebViewError,
        updateUserLocationOnMap
    };
};