// Updated getMapHTML function that includes route drawing capabilities
const getMapHTML = (lat, lng, isDark = false) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Route Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <style>
            body, html { 
                margin: 0; 
                padding: 0; 
                height: 100%; 
                overflow: hidden; 
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
            ${isDark ? `
            .leaflet-tile-pane { 
                filter: invert(1) hue-rotate(180deg); 
            }
            .leaflet-marker-icon {
                filter: invert(1) hue-rotate(180deg);
            }
            ` : ''}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            let map, marker, routePolyline;
            let startMarker, endMarker, stopMarkers = [];
            let isDarkMode = ${isDark};
            
            function initMap() {
                try {
                    map = L.map('map', {
                        center: [${lat}, ${lng}],
                        zoom: 13,
                        zoomControl: false,
                        attributionControl: false
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: ''
                    }).addTo(map);

                    marker = L.marker([${lat}, ${lng}], {
                        draggable: true
                    }).addTo(map);

                    marker.on('dragend', function(e) {
                        const position = e.target.getLatLng();
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerDrag',
                            lat: position.lat,
                            lng: position.lng
                        }));
                    });

                    map.on('click', function(e) {
                        const { lat, lng } = e.latlng;
                        marker.setLatLng([lat, lng]);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapClick',
                            lat: lat,
                            lng: lng
                        }));
                    });

                    // Notify React Native that map is ready
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapReady',
                        isDarkTheme: isDarkMode
                    }));

                    console.log('Map initialized successfully');
                } catch (error) {
                    console.error('Error initializing map:', error);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapError',
                        error: error.message
                    }));
                }
            }

            function clearRoute() {
                try {
                    if (routePolyline) {
                        map.removeLayer(routePolyline);
                        routePolyline = null;
                    }
                    if (startMarker) {
                        map.removeLayer(startMarker);
                        startMarker = null;
                    }
                    if (endMarker) {
                        map.removeLayer(endMarker);
                        endMarker = null;
                    }
                    stopMarkers.forEach(marker => {
                        if (marker) map.removeLayer(marker);
                    });
                    stopMarkers = [];
                } catch (error) {
                    console.error('Error clearing route:', error);
                }
            }

            function drawRoute(coordinates, points) {
                try {
                    console.log('Drawing route with', coordinates.length, 'coordinate points');
                    
                    // Validate coordinates
                    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
                        throw new Error('Invalid coordinates provided');
                    }

                    // Clear existing route
                    clearRoute();

                    // Convert coordinates to Leaflet format [lat, lng]
                    // Mapbox returns [lng, lat] format, so we need to swap
                    const latLngs = coordinates.map(coord => {
                        if (!Array.isArray(coord) || coord.length < 2) {
                            console.warn('Invalid coordinate:', coord);
                            return null;
                        }
                        return [coord[1], coord[0]]; // Swap lng,lat to lat,lng
                    }).filter(coord => coord !== null);

                    if (latLngs.length === 0) {
                        throw new Error('No valid coordinates found');
                    }
                    
                    // Create polyline
                    routePolyline = L.polyline(latLngs, {
                        color: '#8c2323',
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1
                    }).addTo(map);

                    // Add markers for start, stops, and end
                    if (points && points.start) {
                        startMarker = L.marker([points.start.lat, points.start.lng], {
                            icon: L.divIcon({
                                html: '<div style="background: #22c55e; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">S</div>',
                                iconSize: [28, 28],
                                className: 'custom-marker'
                            })
                        }).addTo(map);
                    }

                    if (points && points.end) {
                        endMarker = L.marker([points.end.lat, points.end.lng], {
                            icon: L.divIcon({
                                html: '<div style="background: #ef4444; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">E</div>',
                                iconSize: [28, 28],
                                className: 'custom-marker'
                            })
                        }).addTo(map);
                    }

                    // Add stop markers
                    if (points && points.stops && points.stops.length > 0) {
                        points.stops.forEach((stop, index) => {
                            const stopMarker = L.marker([stop.lat, stop.lng], {
                                icon: L.divIcon({
                                    html: '<div style="background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">' + (index + 1) + '</div>',
                                    iconSize: [24, 24],
                                    className: 'custom-marker'
                                })
                            }).addTo(map);
                            stopMarkers.push(stopMarker);
                        });
                    }

                    // Fit map to show the entire route with padding
                    const bounds = routePolyline.getBounds();
                    map.fitBounds(bounds, { 
                        padding: [50, 50],
                        maxZoom: 15
                    });

                    // Hide the original draggable marker when route is shown
                    if (marker) {
                        map.removeLayer(marker);
                    }

                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'routeDrawn',
                        success: true,
                        pointCount: coordinates.length,
                        latLngCount: latLngs.length
                    }));

                } catch (error) {
                    console.error('Error drawing route:', error);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'routeDrawError',
                        error: error.message,
                        stack: error.stack
                    }));
                }
            }

            // Listen for messages from React Native
            window.addEventListener('message', function(event) {
                try {
                    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                    console.log('WebView received message:', data.type);
                    
                    if (data.type === 'drawRoute') {
                        drawRoute(data.coordinates, data.points);
                    } else if (data.type === 'clearRoute') {
                        clearRoute();
                        // Show the original marker again
                        if (marker && !map.hasLayer(marker)) {
                            marker.addTo(map);
                        }
                    }
                } catch (error) {
                    console.error('Error handling message:', error);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'messageError',
                        error: error.message
                    }));
                }
            });

            // Initialize map when page loads
            window.addEventListener('load', initMap);
        </script>
    </body>
    </html>
    `;
};

export default getMapHTML;