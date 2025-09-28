import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import RouteService, {getRouteCoordinates} from "../services/RouteService";

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
            setIsLoading(true);
            setError(null);

            // Fetch route data with token
            const data = await getRouteCoordinates(token, generatedRidesId);

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
            .route-popup {
                font-size: 12px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            let map;
            let routeLayer;
            let geoJsonRouteLayer;
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
                    console.error('Error initializing map:', error);
                    return false;
                }
            }

            function displayRoute(routeData) {
                try {
                    console.log('=== DISPLAYING ROUTE ===');
                    console.log('Route data type:', typeof routeData);
                    console.log('Route data structure:', routeData);

                    if (!map) {
                        showError('Map not ready');
                        return false;
                    }

                    // Clear existing routes
                    if (routeLayer) {
                        map.removeLayer(routeLayer);
                        routeLayer = null;
                    }
                    if (geoJsonRouteLayer) {
                        map.removeLayer(geoJsonRouteLayer);
                        geoJsonRouteLayer = null;
                    }
                    markersGroup.clearLayers();

                    if (!routeData) {
                        showError('No route data available');
                        return false;
                    }

                    // Check if routeData is GeoJSON format (has features property)
                    if (routeData.features && Array.isArray(routeData.features) && routeData.features.length > 0) {
                        console.log('Processing as GeoJSON route data');
                        return displayGeoJsonRoute(routeData);
                    } else {
                        console.log('Processing as coordinate array route data');
                        return displayCoordinateRoute(routeData);
                    }
                } catch (error) {
                    console.error('Error in displayRoute:', error);
                    showError('Failed to display route: ' + error.message);
                    return false;
                }
            }

            function displayGeoJsonRoute(geoJsonData) {
                try {
                    console.log('=== DISPLAYING GEOJSON ROUTE ===');
                    console.log('GeoJSON features:', geoJsonData.features.length);

                    // Create GeoJSON layer with enhanced styling
                    geoJsonRouteLayer = L.geoJSON(geoJsonData, {
                        style: {
                            color: '#1e40af',
                            weight: 4,
                            opacity: 0.8,
                            smoothFactor: 1,
                            lineJoin: 'round',
                            lineCap: 'round'
                        },
                        onEachFeature: function(feature, layer) {
                            // Add route properties popup if available
                            if (feature.properties) {
                                let popupContent = '<div class="route-popup">';
                                
                                if (feature.properties.summary) {
                                    const summary = feature.properties.summary;
                                    popupContent += '<strong>Route Information</strong><br>';
                                    
                                    if (summary.distance) {
                                        const distance = (summary.distance / 1000).toFixed(2);
                                        popupContent += \`<strong>Distance:</strong> \${distance} km<br>\`;
                                    }
                                    
                                    if (summary.duration) {
                                        const totalMinutes = Math.floor(summary.duration / 60);
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        const durationText = hours > 0 ? \`\${hours}h \${minutes}min\` : \`\${minutes}min\`;
                                        popupContent += \`<strong>Duration:</strong> \${durationText}\`;
                                    }
                                } else {
                                    popupContent += '<strong>Route Information</strong>';
                                }
                                
                                popupContent += '</div>';
                                layer.bindPopup(popupContent);
                            }
                        }
                    }).addTo(map);

                    // Add route markers
                    addRouteMarkers();

                    // Fit map to route bounds
                    if (geoJsonRouteLayer) {
                        const bounds = geoJsonRouteLayer.getBounds();
                        if (bounds.isValid()) {
                            map.fitBounds(bounds.pad(0.1));
                        }
                    }

                    // Get route statistics
                    let totalDistance = 0;
                    let totalDuration = 0;
                    let coordinateCount = 0;

                    geoJsonData.features.forEach(feature => {
                        if (feature.properties && feature.properties.summary) {
                            totalDistance += feature.properties.summary.distance || 0;
                            totalDuration += feature.properties.summary.duration || 0;
                        }
                        if (feature.geometry && feature.geometry.coordinates) {
                            coordinateCount += feature.geometry.coordinates.length;
                        }
                    });

                    console.log('GeoJSON route displayed successfully');
                    console.log('Total distance:', (totalDistance / 1000).toFixed(2), 'km');
                    console.log('Total duration:', Math.floor(totalDuration / 60), 'minutes');
                    console.log('Coordinate points:', coordinateCount);

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'routeLoaded',
                        message: 'GeoJSON route displayed successfully',
                        coordinatesCount: coordinateCount,
                        distance: totalDistance / 1000,
                        duration: totalDuration
                    }));

                    return true;
                } catch (error) {
                    console.error('Error displaying GeoJSON route:', error);
                    showError('Failed to display GeoJSON route: ' + error.message);
                    return false;
                }
            }

            function displayCoordinateRoute(routeData) {
                try {
                    console.log('=== DISPLAYING COORDINATE ROUTE ===');
                    
                    let routeCoordinates = [];

                    // Handle different coordinate data formats
                    if (routeData.coordinates) {
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

                    // Create polyline route
                    routeLayer = L.polyline(routeCoordinates, {
                        color: '#1e40af',
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1,
                        lineJoin: 'round',
                        lineCap: 'round'
                    }).addTo(map);

                    // Add route markers
                    addRouteMarkers();

                    // Fit map to route bounds
                    if (routeCoordinates.length > 0) {
                        const group = new L.featureGroup([routeLayer]);
                        map.fitBounds(group.getBounds().pad(0.1));
                    }

                    console.log('Coordinate route displayed successfully');
                    console.log('Coordinate points:', routeCoordinates.length);

                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'routeLoaded',
                        message: 'Coordinate route displayed successfully',
                        coordinatesCount: routeCoordinates.length
                    }));

                    return true;
                } catch (error) {
                    console.error('Error displaying coordinate route:', error);
                    showError('Failed to display coordinate route: ' + error.message);
                    return false;
                }
            }

            function addRouteMarkers() {
                try {
                    const startPoint = window.startingPoint;
                    const endPoint = window.endingPoint;
                    const stopPoints = window.stopPoints || [];

                    // Create custom marker icons
                    const createCircleMarker = (latLng, options, popupText) => {
                        return L.circleMarker(latLng, options)
                            .addTo(markersGroup)
                            .bindPopup(\`<div class="route-popup">\${popupText}</div>\`);
                    };

                    // Add start marker
                    if (startPoint && startPoint.lat && startPoint.lng) {
                        createCircleMarker([startPoint.lat, startPoint.lng], {
                            radius: 8,
                            fillColor: '#22c55e',
                            color: '#16a34a',
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1
                        }, \`<b>Start:</b><br>\${startPoint.name || 'Starting Point'}\`);
                    }

                    // Add stop markers
                    stopPoints.forEach((stop, index) => {
                        if (stop.lat && stop.lng) {
                            createCircleMarker([stop.lat, stop.lng], {
                                radius: 6,
                                fillColor: '#f59e0b',
                                color: '#d97706',
                                weight: 2,
                                opacity: 1,
                                fillOpacity: 1
                            }, \`<b>Stop \${index + 1}:</b><br>\${stop.name || stop.address || 'Stop Point'}\`);
                        }
                    });

                    // Add end marker
                    if (endPoint && endPoint.lat && endPoint.lng) {
                        createCircleMarker([endPoint.lat, endPoint.lng], {
                            radius: 8,
                            fillColor: '#ef4444',
                            color: '#dc2626',
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1
                        }, \`<b>End:</b><br>\${endPoint.name || 'Ending Point'}\`);
                    }

                    console.log('Route markers added successfully');
                } catch (error) {
                    console.error('Error adding route markers:', error);
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
                console.log('=== LOADING ROUTE DATA ===');
                console.log('Route data type:', typeof routeData);
                console.log('Start point:', startPoint);
                console.log('End point:', endPoint);
                console.log('Stop points:', stopPoints);

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