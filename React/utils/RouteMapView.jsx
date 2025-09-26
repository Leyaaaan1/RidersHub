import React, { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import RouteService from '../services/RouteService';

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
    const [isMapReady, setIsMapReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [debugInfo, setDebugInfo] = useState('');
    const routeService = new RouteService(undefined, token);

    // Get route map HTML with improved debugging
    const getRouteMapHTML = (centerLat = 7.07, centerLng = 125.61) => {
        return `
        <!DOCTYPE html>
        <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Route Map</title>    
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
            <style>
                body, html { 
                    margin: 0; 
                    padding: 0; 
                    height: 100%; 
                    overflow: hidden;
                    background: #f0f0f0;
                }
                #map { 
                    height: 100vh; 
                    width: 100vw; 
                }
                .leaflet-control-attribution { 
                    display: none !important; 
                }
                .custom-marker {
                    background: none !important;
                    border: none !important;
                }
                .route-popup {
                    font-size: 12px;
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.95);
                    color: #333;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    border: 1px solid #ddd;
                }
                .debug-info {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 5px;
                    font-size: 10px;
                    border-radius: 3px;
                    max-width: 200px;
                    z-index: 1000;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <div id="debug" class="debug-info">Initializing map...</div>
            <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
            <script>
                let map, currentRoute = null;
                let startMarker = null, endMarker = null, stopMarkers = [];
                let debugElement = document.getElementById('debug');
                
                function updateDebug(message) {
                    console.log('DEBUG:', message);
                    if (debugElement) {
                        debugElement.innerHTML = message;
                    }
                }
                
                function initMap() {
                    try {
                        updateDebug('Initializing map...');
                        
                        map = L.map('map', {
                            center: [${centerLat}, ${centerLng}],
                            zoom: 12,
                            minZoom: 8,
                            maxZoom: 18,
                            zoomControl: true,
                            attributionControl: false,
                            scrollWheelZoom: true,
                            doubleClickZoom: false,
                            boxZoom: false,
                            keyboard: false
                        });

                        // Standard OpenStreetMap tiles
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '',
                            maxZoom: 18
                        }).addTo(map);

                        updateDebug('Map initialized successfully');

                        // Notify React Native that map is ready
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapReady'
                        }));

                    } catch (error) {
                        console.error('Error initializing route map:', error);
                        updateDebug('Map init error: ' + error.message);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapError',
                            error: error.message
                        }));
                    }
                }

                // Enhanced function to draw route
                window.drawRoute = function(coordinates, options = {}) {
                    try {
                        updateDebug('Drawing route with ' + (coordinates?.length || 0) + ' coordinates');
                        
                        if (!Array.isArray(coordinates) || coordinates.length < 2) {
                            updateDebug('Invalid coordinates: need at least 2 points');
                            return false;
                        }

                        // Clear existing route
                        if (currentRoute) {
                            map.removeLayer(currentRoute);
                            currentRoute = null;
                        }

                        // Convert coordinates format - handle both [lng,lat] and [lat,lng] formats
                        const leafletCoords = coordinates.map((coord, index) => {
                            if (!Array.isArray(coord) || coord.length < 2) {
                                console.warn('Invalid coordinate at index', index, ':', coord);
                                return null;
                            }
                            
                            const lng = parseFloat(coord[0]);
                            const lat = parseFloat(coord[1]);
                            
                            if (isNaN(lng) || isNaN(lat)) {
                                console.warn('NaN coordinate at index', index, ':', coord);
                                return null;
                            }
                            
                            // Check if coordinates seem to be in [lng, lat] format (typical for GeoJSON)
                            // Davao area: lat ~7, lng ~125
                            if (Math.abs(lng) > Math.abs(lat) && Math.abs(lng) > 90) {
                                // Likely [lng, lat] format, convert to [lat, lng] for Leaflet
                                return [lat, lng];
                            } else {
                                // Likely already [lat, lng] format
                                return [lng, lat];
                            }
                        }).filter(coord => coord !== null);

                        if (leafletCoords.length < 2) {
                            updateDebug('Not enough valid coordinates: ' + leafletCoords.length);
                            return false;
                        }

                        updateDebug('Valid coordinates: ' + leafletCoords.length);

                        // Route styling
                        const routeOptions = {
                            color: '#2563eb',
                            weight: 5,
                            opacity: 0.9,
                            smoothFactor: 1.0,
                            lineJoin: 'round',
                            lineCap: 'round',
                            ...options
                        };

                        // Add white outline for better visibility
                        const outlineOptions = {
                            color: '#ffffff',
                            weight: 7,
                            opacity: 0.6,
                            smoothFactor: 1.0,
                            lineJoin: 'round',
                            lineCap: 'round'
                        };

                        // Draw outline first
                        L.polyline(leafletCoords, outlineOptions).addTo(map);
                        
                        // Draw main route
                        currentRoute = L.polyline(leafletCoords, routeOptions).addTo(map);

                        // Fit map to route bounds
                        const bounds = currentRoute.getBounds();
                        map.fitBounds(bounds, { 
                            padding: [30, 30], 
                            maxZoom: 16
                        });

                        updateDebug('Route drawn successfully');

                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'routeDrawn',
                            success: true,
                            coordinateCount: leafletCoords.length
                        }));
                        
                        return true;
                    } catch (error) {
                        console.error('Error drawing route:', error);
                        updateDebug('Route draw error: ' + error.message);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'routeDrawn',
                            success: false,
                            error: error.message
                        }));
                        return false;
                    }
                };

                // Enhanced markers
                window.addRouteMarkers = function(startCoords, endCoords, stopCoords = []) {
                    try {
                        updateDebug('Adding route markers');
                        
                        // Clear existing markers
                        clearRouteMarkers();

                        const createMarkerIcon = (color, size = 22, innerColor = '#fff') => {
                            return L.divIcon({
                                className: 'custom-marker',
                                html: \`<div style="
                                    background: \${color}; 
                                    width: \${size}px; 
                                    height: \${size}px; 
                                    border-radius: 50%; 
                                    border: 3px solid white; 
                                    box-shadow: 0 3px 6px rgba(0,0,0,0.4);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                ">
                                    <div style="
                                        width: \${size-10}px; 
                                        height: \${size-10}px; 
                                        background: \${innerColor}; 
                                        border-radius: 50%;
                                        opacity: 0.9;
                                    "></div>
                                </div>\`,
                                iconSize: [size, size],
                                iconAnchor: [size/2, size/2]
                            });
                        };

                        const startIcon = createMarkerIcon('#22c55e', 26, '#dcfce7');
                        const endIcon = createMarkerIcon('#ef4444', 26, '#fee2e2');
                        const stopIcon = createMarkerIcon('#f59e0b', 20, '#fef3c7');

                        // Add start marker - handle coordinate format
                        if (startCoords && Array.isArray(startCoords) && startCoords.length >= 2) {
                            let lat, lng;
                            // Check coordinate format
                            if (Math.abs(startCoords[0]) > Math.abs(startCoords[1]) && Math.abs(startCoords[0]) > 90) {
                                // [lng, lat] format
                                lng = startCoords[0];
                                lat = startCoords[1];
                            } else {
                                // [lat, lng] format
                                lat = startCoords[0];
                                lng = startCoords[1];
                            }
                            
                            startMarker = L.marker([lat, lng], { 
                                icon: startIcon,
                                zIndexOffset: 1000
                            })
                            .addTo(map)
                            .bindPopup('<div class="route-popup"><strong>🚀 Start Point</strong></div>');
                        }

                        // Add end marker
                        if (endCoords && Array.isArray(endCoords) && endCoords.length >= 2) {
                            let lat, lng;
                            if (Math.abs(endCoords[0]) > Math.abs(endCoords[1]) && Math.abs(endCoords[0]) > 90) {
                                lng = endCoords[0];
                                lat = endCoords[1];
                            } else {
                                lat = endCoords[0];
                                lng = endCoords[1];
                            }
                            
                            endMarker = L.marker([lat, lng], { 
                                icon: endIcon,
                                zIndexOffset: 1000
                            })
                            .addTo(map)
                            .bindPopup('<div class="route-popup"><strong>🏁 End Point</strong></div>');
                        }

                        // Add stop markers
                        if (Array.isArray(stopCoords)) {
                            stopCoords.forEach((coord, index) => {
                                if (Array.isArray(coord) && coord.length >= 2) {
                                    let lat, lng;
                                    if (Math.abs(coord[0]) > Math.abs(coord[1]) && Math.abs(coord[0]) > 90) {
                                        lng = coord[0];
                                        lat = coord[1];
                                    } else {
                                        lat = coord[0];
                                        lng = coord[1];
                                    }
                                    
                                    const stopMarker = L.marker([lat, lng], { 
                                        icon: stopIcon,
                                        zIndexOffset: 999
                                    })
                                    .addTo(map)
                                    .bindPopup(\`<div class="route-popup"><strong>📍 Stop \${index + 1}</strong></div>\`);
                                    
                                    stopMarkers.push(stopMarker);
                                }
                            });
                        }

                        updateDebug('Markers added successfully');
                        return true;
                    } catch (error) {
                        console.error('Error adding route markers:', error);
                        updateDebug('Marker error: ' + error.message);
                        return false;
                    }
                };

                window.clearRouteMarkers = function() {
                    try {
                        if (startMarker) {
                            map.removeLayer(startMarker);
                            startMarker = null;
                        }
                        if (endMarker) {
                            map.removeLayer(endMarker);
                            endMarker = null;
                        }
                        stopMarkers.forEach(marker => map.removeLayer(marker));
                        stopMarkers = [];
                        return true;
                    } catch (error) {
                        console.error('Error clearing route markers:', error);
                        return false;
                    }
                };

                // Initialize map when page loads
                window.addEventListener('load', initMap);
            </script>
        </body>
        </html>
        `;
    };

    // Load route coordinates when component mounts
    useEffect(() => {
        const loadRouteCoordinates = async () => {
            if (!generatedRidesId || !token) {
                setError('Missing ride ID or token');
                setIsLoading(false);
                setDebugInfo('Missing ride ID or token');
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                setDebugInfo(`Loading route for ride ID: ${generatedRidesId}`);

                console.log('Loading route coordinates for ride:', generatedRidesId);
                const coordinates = await routeService.getSavedRouteCoordinates(generatedRidesId);

                if (coordinates && coordinates.length > 0) {
                    setRouteCoordinates(coordinates);
                    setDebugInfo(`Loaded ${coordinates.length} route points`);
                    console.log('Route coordinates loaded:', coordinates.length, 'points');
                    console.log('First few coordinates:', coordinates.slice(0, 3));
                } else {
                    console.log('No route coordinates found');
                    setRouteCoordinates([]);
                    setDebugInfo('No route coordinates found');
                }
            } catch (err) {
                console.error('Error loading route coordinates:', err);
                setError(err.message || 'Failed to load route coordinates');
                setDebugInfo(`Error: ${err.message}`);
                setRouteCoordinates([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadRouteCoordinates();
    }, [generatedRidesId, token]);

    // Draw route when map is ready and coordinates are loaded
    useEffect(() => {
        if (isMapReady && routeCoordinates.length > 0) {
            console.log('Drawing route on map with coordinates:', routeCoordinates.length);
            setDebugInfo(`Drawing ${routeCoordinates.length} route points`);

            setTimeout(() => {
                // Draw route
                webViewRef.current?.postMessage(JSON.stringify({
                    type: 'drawRoute',
                    coordinates: routeCoordinates
                }));

                // Add markers
                if (routeCoordinates.length > 1) {
                    const startCoord = routeCoordinates[0];
                    const endCoord = routeCoordinates[routeCoordinates.length - 1];

                    webViewRef.current?.postMessage(JSON.stringify({
                        type: 'addMarkers',
                        startCoords: startCoord,
                        endCoords: endCoord,
                        stopCoords: stopPoints.map(stop => [stop.lng, stop.lat]) // Ensure proper format
                    }));
                }
            }, 300);
        }
    }, [isMapReady, routeCoordinates, stopPoints]);

    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            switch (data.type) {
                case 'mapReady':
                    console.log('Route map is ready');
                    setIsMapReady(true);
                    setDebugInfo('Map ready, waiting for route data...');
                    break;
                case 'mapError':
                    console.error('Route map error:', data.error);
                    setError(data.error);
                    setDebugInfo(`Map error: ${data.error}`);
                    break;
                case 'routeDrawn':
                    if (data.success) {
                        console.log('Route drawn successfully:', data.coordinateCount, 'points');
                        setDebugInfo(`Route drawn: ${data.coordinateCount} points`);
                    } else {
                        console.error('Failed to draw route:', data.error);
                        setError(data.error || 'Failed to draw route');
                        setDebugInfo(`Route error: ${data.error}`);
                    }
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (err) {
            console.error('Error parsing WebView message:', err);
            setDebugInfo(`Message error: ${err.message}`);
        }
    };

    const injectedJavaScript = `
        window.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                
                switch(data.type) {
                    case 'drawRoute':
                        if (window.drawRoute) {
                            window.drawRoute(data.coordinates);
                        }
                        break;
                    case 'addMarkers':
                        if (window.addRouteMarkers) {
                            window.addRouteMarkers(data.startCoords, data.endCoords, data.stopCoords);
                        }
                        break;
                }
            } catch (error) {
                console.error('Injected JS error:', error);
            }
        });
        true;
    `;

    // Get center coordinates for initial map view
    const centerLat = routeCoordinates.length > 0 ?
        (Array.isArray(routeCoordinates[0]) ? routeCoordinates[0][1] : 7.07) : 7.07;
    const centerLng = routeCoordinates.length > 0 ?
        (Array.isArray(routeCoordinates[0]) ? routeCoordinates[0][0] : 125.61) : 125.61;

    if (error) {
        return (
            <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                <Text style={{ color: '#dc2626', textAlign: 'center', padding: 20 }}>
                    Error loading route map: {error}
                </Text>
                {debugInfo ? (
                    <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
                        Debug: {debugInfo}
                    </Text>
                ) : null}
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={{ color: '#333', marginTop: 10 }}>Loading route map...</Text>
                {debugInfo ? (
                    <Text style={{ color: '#666', fontSize: 12, marginTop: 5 }}>
                        {debugInfo}
                    </Text>
                ) : null}
            </View>
        );
    }

    if (routeCoordinates.length === 0) {
        return (
            <View style={[style, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                <Text style={{ color: '#666', textAlign: 'center', padding: 20 }}>
                    No route data available for this ride
                </Text>
                {debugInfo ? (
                    <Text style={{ color: '#666', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
                        Debug: {debugInfo}
                    </Text>
                ) : null}
            </View>
        );
    }

    return (
        <WebView
            ref={webViewRef}
            source={{ html: getRouteMapHTML(centerLat, centerLng) }}
            style={style}
            onMessage={handleWebViewMessage}
            injectedJavaScript={injectedJavaScript}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="compatibility"
            onError={(error) => {
                console.error('WebView error:', error);
                setError('Failed to load map');
                setDebugInfo(`WebView error: ${error.nativeEvent.description}`);
            }}
        />
    );
};

export default RouteMapView;