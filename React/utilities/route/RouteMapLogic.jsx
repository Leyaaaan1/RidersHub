import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getRouteCoordinates } from "../../services/RouteService";

export const useRouteMapLogic = (generatedRidesId, token) => {
    const [isLoading, setIsLoading] = useState(true);
    const [routeData, setRouteData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (generatedRidesId) {
            fetchRouteData();
        } else {
            console.warn('No generatedRidesId provided');
            setIsLoading(false);
            setError('No route ID provided');
        }
    }, [generatedRidesId, token]);

    const fetchRouteData = async () => {
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

    const handleWebViewLoad = (webViewRef, routeData, startingPoint, endingPoint, stopPoints) => {
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
                        ${JSON.stringify(stopPoints)}
                    );
                } else {
                    console.error('loadRouteData function not available');
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
                // Inject route data if available
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
        fetchRouteData,
        handleWebViewLoad,
        handleWebViewMessage,
        handleWebViewError
    };
};