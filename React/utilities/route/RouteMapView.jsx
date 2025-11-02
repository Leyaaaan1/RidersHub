import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import InputUtilities from "../../styles/InputUtilities";
import { useRouteMapLogic } from './RouteMapLogic';
import { createMapHTML } from './RouteMapHTML';

const RouteMapView = ({
                          generatedRidesId,
                          token,
                          startingPoint,
                          endingPoint,
                          stopPoints = [],
                          style,
                          isDark = false,
                          ...restProps
                      }) => {
    const webViewRef = useRef(null);

    const {
        isLoading,
        routeData,
        error,
        userLocation,
        fetchRouteData,
        handleWebViewLoad,
        handleWebViewMessage,
        handleWebViewError,
        updateUserLocationOnMap
    } = useRouteMapLogic(generatedRidesId, token);

    useEffect(() => {
        console.log('RouteMapView props:', {
            generatedRidesId,
            token,
            startingPoint,
            endingPoint,
            stopPoints,
            style,
            isDark,
            spreadProps: restProps
        });
    }, []);


    // Update user location on map whenever it changes
    useEffect(() => {
        if (userLocation && webViewRef.current) {
            updateUserLocationOnMap(webViewRef, userLocation);
        }
    }, [userLocation]);

    const onWebViewLoad = () => {
        handleWebViewLoad(webViewRef, routeData, startingPoint, endingPoint, stopPoints, userLocation);
    };

    const onWebViewMessage = (event) => {
        handleWebViewMessage(event, (error) => error, onWebViewLoad);
    };

    if (isLoading) {
        return (
            <View style={[InputUtilities.container, style, InputUtilities.centered]}>
                <ActivityIndicator size="large" color="#1e40af" />
                <Text style={[InputUtilities.loadingText, { color: isDark ? '#fff' : '#000' }]}>
                    Loading route...
                </Text>
            </View>
        );
    }

    if (error && !routeData) {
        return (
            <View style={[InputUtilities.container, style, InputUtilities.centered]}>
                <Text style={[InputUtilities.errorText, { color: isDark ? '#ff6b6b' : '#dc3545' }]}>
                    {error}
                </Text>
                <Text
                    style={[InputUtilities.retryText, { color: isDark ? '#4dabf7' : '#007bff' }]}
                    onPress={fetchRouteData}
                >
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <View style={[InputUtilities.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html: createMapHTML() }}
                style={InputUtilities.webView}
                onLoadEnd={onWebViewLoad}
                onMessage={onWebViewMessage}
                onError={handleWebViewError}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                mixedContentMode="compatibility"
                allowsInlineMediaPlaybook={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={['*']}
                allowsFullscreenVideo={false}
                scalesPageToFit={true}
            />
        </View>
    );
};

export default RouteMapView;