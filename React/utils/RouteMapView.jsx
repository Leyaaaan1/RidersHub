import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import RouteService from "../services/RouteService";

const RouteMapView = ({
                          generatedRidesId,
                          token,
                          startingPoint,
                          endingPoint,
                          stopPoints = [],
                          style,
                          isDark = false
                      }) => {
    const webViewRef = useRef(null);
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
            console.log('=== STARTING ROUTE DATA FETCH ===');
            console.log('Generated Rides ID:', generatedRidesId);
            console.log('Token present:', !!token);

            setIsLoading(true);
            setError(null);

            const routeService = new RouteService(null, token);

            // Test connection first (optional)

            // Fetch route data
            const data = await routeService.getRouteCoordinates(generatedRidesId);

            if (!data) {
                throw new Error('No route data received from server');
            }

            setRouteData(data);
            console.log('Route data loaded successfully:', data);

        } catch (error) {
            console.error('=== ERROR IN FETCHROUTEDATA ===');
            console.error('Error:', error);

            const errorMessage = error.message || 'Failed to load route data';
            setError(errorMessage);

            // Show user-friendly alert
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

    const createMapHTML = () => {
        // Use CartoDB Positron (white map) tile layer
        const tileLayer = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

        return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #fff;
            }
            #map {
                height: 100vh;
                width: 100vw;
                border-radius: 10px;
            }
            .error-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                z-index: 1000;
                max-width: 80%;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            let map;
            let routeLayer;
            let markersGroup;

            function initMap() {
                try {
                    const defaultCenter = [8.2280, 125.5428];
                    map = L.map('map', {
                        zoomControl: true,
                        scrollWheelZoom: true,
                        doubleClickZoom: true,
                        touchZoom: true
                    }).setView(defaultCenter, 12);

                    L.tileLayer('${tileLayer}', {
                        maxZoom: 19,
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);

                    markersGroup = L.layerGroup().addTo(map);

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'mapReady',
                        message: 'Map initialized successfully'
                    }));

                    return true;
                } catch (error) {
                    return false;
                }
            }

            function displayRoute(routeData) {
                try {
                    if (!map) {
                        showError('Map not ready');
                        return false;
                    }

                    if (routeLayer) {
                        map.removeLayer(routeLayer);
                    }
                    markersGroup.clearLayers();

                    if (!routeData) {
                        showError('No route data available');
                        return false;
                    }

                    let routeCoordinates = [];

                    if (routeData.features && routeData.features.length > 0) {
                        const feature = routeData.features[0];
                        if (feature.geometry && feature.geometry.coordinates) {
                            routeCoordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                        }
                    } else if (routeData.coordinates) {
                        routeCoordinates = routeData.coordinates.map(coord =>
                            Array.isArray(coord) ? [coord[1], coord[0]] : [coord.lat, coord.lng]
                        );
                    } else if (Array.isArray(routeData)) {
                        routeCoordinates = routeData.map(coord =>
                            Array.isArray(coord) ? [coord[1], coord[0]] : [coord.lat, coord.lng]
                        );
                    }

                    if (routeCoordinates.length === 0) {
                        showError('No valid route coordinates');
                        return false;
                    }

                    routeLayer = L.polyline(routeCoordinates, {
                        color: '#1e40af',
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1
                    }).addTo(map);

                    addRouteMarkers();

                    if (routeCoordinates.length > 0) {
                        const group = new L.featureGroup([routeLayer]);
                        map.fitBounds(group.getBounds().pad(0.1));
                    }

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'routeLoaded',
                        message: 'Route displayed successfully',
                        coordinatesCount: routeCoordinates.length
                    }));

                    return true;
                } catch (error) {
                    showError('Failed to display route: ' + error.message);
                    return false;
                }
            }

            function addRouteMarkers() {
                try {
                    const startPoint = window.startingPoint;
                    const endPoint = window.endingPoint;
                    const stopPoints = window.stopPoints || [];

                    if (startPoint && startPoint.lat && startPoint.lng) {
                        const startMarker = L.circleMarker([startPoint.lat, startPoint.lng], {
                            radius: 8,
                            fillColor: '#22c55e',
                            color: '#16a34a',
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1
                        }).addTo(markersGroup);

                        startMarker.bindPopup(\`<b>Start:</b><br>\${startPoint.name || 'Starting Point'}\`);
                    }

                    stopPoints.forEach((stop, index) => {
                        if (stop.lat && stop.lng) {
                            const stopMarker = L.circleMarker([stop.lat, stop.lng], {
                                radius: 6,
                                fillColor: '#f59e0b',
                                color: '#d97706',
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 1
                            }).addTo(markersGroup);

                            stopMarker.bindPopup(\`<b>Stop \${index + 1}:</b><br>\${stop.name || stop.address || 'Stop Point'}\`);
                        }
                    });

                    if (endPoint && endPoint.lat && endPoint.lng) {
                        const endMarker = L.circleMarker([endPoint.lat, endPoint.lng], {
                            radius: 8,
                            fillColor: '#ef4444',
                            color: '#dc2626',
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1
                        }).addTo(markersGroup);

                        endMarker.bindPopup(\`<b>End:</b><br>\${endPoint.name || 'Ending Point'}\`);
                    }
                } catch (error) {
                    // Marker error handling
                }
            }

            function showError(message) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = \`
                    <h3>Map Error</h3>
                    <p>\${message}</p>
                \`;
                document.body.appendChild(errorDiv);

                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 5000);
            }

            window.loadRouteData = function(routeData, startPoint, endPoint, stopPoints) {
                window.routeData = routeData;
                window.startingPoint = startPoint;
                window.endingPoint = endPoint;
                window.stopPoints = stopPoints;

                if (map) {
                    displayRoute(routeData);
                } else {
                    showError('Map not ready for route data');
                }
            };

            document.addEventListener('DOMContentLoaded', function() {
                initMap();
            });
        </script>
    </body>
    </html>
    `;
    };
    const handleWebViewLoad = () => {
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

    const handleWebViewMessage = (event) => {
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
        setError(`WebView error: ${nativeEvent.description}`);
    };

    if (isLoading) {
        return (
            <View style={[styles.container, style, styles.centered]}>
                <ActivityIndicator size="large" color="#1e40af" />
                <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
                    Loading route...
                </Text>
            </View>
        );
    }

    if (error && !routeData) {
        return (
            <View style={[styles.container, style, styles.centered]}>
                <Text style={[styles.errorText, { color: isDark ? '#ff6b6b' : '#dc3545' }]}>
                    {error}
                </Text>
                <Text
                    style={[styles.retryText, { color: isDark ? '#4dabf7' : '#007bff' }]}
                    onPress={fetchRouteData}
                >
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <WebView
                ref={webViewRef}
                source={{ html: createMapHTML() }}
                style={styles.webView}
                onLoadEnd={handleWebViewLoad}
                onMessage={handleWebViewMessage}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    retryText: {
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default RouteMapView;