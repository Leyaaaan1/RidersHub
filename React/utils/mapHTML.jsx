// Enhanced getMapHTML function with better ORS API support
const getMapHTML = (lat, lng, isDark = false) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Location Map</title>
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
            .route-popup {
                font-size: 12px;
                padding: 5px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            ${isDark ? `
            .leaflet-tile-pane { 
                filter: invert(1) hue-rotate(180deg); 
            }
            .leaflet-marker-icon, .custom-marker {
                filter: invert(1) hue-rotate(180deg);
            }
            ` : ''}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            let map, marker;
            let isDarkMode = ${isDark};
            let currentRoute = null;
            let startMarker = null;
            let endMarker = null;
            let stopMarkers = [];
            
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

            // Enhanced function to clear existing route
            window.clearRoute = function() {
                try {
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                        currentRoute = null;
                        console.log('Route cleared successfully');
                    }
                    return true;
                } catch (error) {
                    console.error('Error clearing route:', error);
                    return false;
                }
            };

            // Enhanced function to draw route polyline with better validation
            window.drawRoute = function(coordinates, options = {}) {
                try {
                    console.log('=== WEBVIEW ROUTE DRAWING START ===');
                    console.log('Received coordinates count:', coordinates?.length);
                    
                    // Enhanced coordinate validation
                    if (!Array.isArray(coordinates) || coordinates.length < 2) {
                        console.error('Invalid coordinates for route drawing:', {
                            isArray: Array.isArray(coordinates),
                            length: coordinates?.length,
                            sample: coordinates?.slice(0, 2)
                        });
                        return false;
                    }

                    // Validate coordinate format and values
                    const validatedCoords = [];
                    let invalidCount = 0;

                    coordinates.forEach((coord, index) => {
                        if (Array.isArray(coord) && coord.length >= 2) {
                            const lat = parseFloat(coord[0]);
                            const lng = parseFloat(coord[1]);
                            
                            // Check if coordinates are valid numbers and within reasonable bounds
                            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) &&
                                lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                                validatedCoords.push([lat, lng]);
                            } else {
                                invalidCount++;
                                if (invalidCount <= 5) { // Log first 5 invalid coords
                                    console.warn('Invalid coordinate at index', index, ':', coord, 
                                        '-> lat:', lat, 'lng:', lng);
                                }
                            }
                        } else {
                            invalidCount++;
                            if (invalidCount <= 5) {
                                console.warn('Malformed coordinate at index', index, ':', coord);
                            }
                        }
                    });

                    if (invalidCount > 0) {
                        console.warn('Found', invalidCount, 'invalid coordinates out of', coordinates.length);
                    }

                    if (validatedCoords.length < 2) {
                        console.error('Not enough valid coordinates for route:', validatedCoords.length);
                        return false;
                    }

                    console.log('Valid coordinates for route:', validatedCoords.length);
                    console.log('First coordinate:', validatedCoords[0]);
                    console.log('Last coordinate:', validatedCoords[validatedCoords.length - 1]);

                    // Clear existing route
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                    }

                    // Enhanced default styling
                    const defaultOptions = {
                        color: '#1e40af',
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1.0,
                        lineJoin: 'round',
                        lineCap: 'round'
                    };

                    const routeOptions = { ...defaultOptions, ...options };

                    // Create polyline with validated coordinates
                    currentRoute = L.polyline(validatedCoords, routeOptions).addTo(map);

                    // Calculate route statistics
                    const routeDistance = calculateDistance(validatedCoords);
                    console.log('Route distance:', routeDistance.toFixed(2), 'km');

                    // Add route click event for debugging
                    currentRoute.on('click', function(e) {
                        console.log('Route clicked at:', e.latlng);
                    });

                    console.log('=== ROUTE DRAWN SUCCESSFULLY ===');
                    console.log('Route bounds:', currentRoute.getBounds());
                    
                    // Send success message back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'routeDrawn',
                        success: true,
                        coordinateCount: validatedCoords.length,
                        distance: routeDistance,
                        bounds: currentRoute.getBounds()
                    }));
                    
                    return true;

                } catch (error) {
                    console.error('=== ROUTE DRAWING ERROR ===');
                    console.error('Error:', error.message);
                    console.error('Stack:', error.stack);
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'routeDrawn',
                        success: false,
                        error: error.message
                    }));
                    
                    return false;
                }
            };

            // Function to update marker position
            window.updateMarker = function(lat, lng) {
                try {
                    if (marker) {
                        marker.setLatLng([lat, lng]);
                        console.log('Marker updated to:', lat, lng);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error updating marker:', error);
                    return false;
                }
            };

            // Function to center map on coordinates
            window.centerMap = function(lat, lng, zoom = 15) {
                try {
                    map.setView([lat, lng], zoom);
                    console.log('Map centered on:', lat, lng, 'zoom:', zoom);
                    return true;
                } catch (error) {
                    console.error('Error centering map:', error);
                    return false;
                }
            };

            // Enhanced function to fit route to map view
            window.fitRouteToMap = function(coordinates, padding = [20, 20]) {
                try {
                    if (!Array.isArray(coordinates) || coordinates.length === 0) {
                        console.error('No coordinates provided for fitting route');
                        return false;
                    }

                    // Use the current route bounds if available, otherwise create from coordinates
                    let bounds;
                    if (currentRoute) {
                        bounds = currentRoute.getBounds();
                    } else {
                        bounds = L.latLngBounds(coordinates);
                    }

                    map.fitBounds(bounds, { 
                        padding: padding,
                        maxZoom: 16
                    });
                    
                    console.log('Map fitted to route bounds:', bounds);
                    return true;
                } catch (error) {
                    console.error('Error fitting route to map:', error);
                    return false;
                }
            };

            // Enhanced function to add route markers
            window.addRouteMarkers = function(startCoords, endCoords, stopCoords = []) {
                try {
                    console.log('Adding route markers...');
                    console.log('Start:', startCoords, 'End:', endCoords, 'Stops:', stopCoords);
                    
                    // Clear existing route markers
                    clearRouteMarkers();

                    // Create custom icons
                    const createMarkerIcon = (color, size = 20) => {
                        return L.divIcon({
                            className: 'custom-marker',
                            html: \`<div style="background: \${color}; width: \${size}px; height: \${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>\`,
                            iconSize: [size, size],
                            iconAnchor: [size/2, size/2]
                        });
                    };

                    const startIcon = createMarkerIcon('#22c55e', 24); // Green
                    const endIcon = createMarkerIcon('#ef4444', 24);   // Red
                    const stopIcon = createMarkerIcon('#f59e0b', 18);  // Amber

                    // Add start marker
                    if (startCoords && Array.isArray(startCoords) && startCoords.length >= 2) {
                        startMarker = L.marker([startCoords[0], startCoords[1]], { 
                            icon: startIcon,
                            zIndexOffset: 1000
                        })
                        .addTo(map)
                        .bindPopup('<div class="route-popup"><strong>Start Point</strong></div>');
                        
                        console.log('Start marker added at:', startCoords);
                    }

                    // Add end marker
                    if (endCoords && Array.isArray(endCoords) && endCoords.length >= 2) {
                        endMarker = L.marker([endCoords[0], endCoords[1]], { 
                            icon: endIcon,
                            zIndexOffset: 1000
                        })
                        .addTo(map)
                        .bindPopup('<div class="route-popup"><strong>End Point</strong></div>');
                        
                        console.log('End marker added at:', endCoords);
                    }

                    // Add stop markers
                    if (Array.isArray(stopCoords)) {
                        stopCoords.forEach((coord, index) => {
                            if (Array.isArray(coord) && coord.length >= 2) {
                                const stopMarker = L.marker([coord[0], coord[1]], { 
                                    icon: stopIcon,
                                    zIndexOffset: 999
                                })
                                .addTo(map)
                                .bindPopup(\`<div class="route-popup"><strong>Stop \${index + 1}</strong></div>\`);
                                
                                stopMarkers.push(stopMarker);
                                console.log('Stop', index + 1, 'marker added at:', coord);
                            }
                        });
                    }

                    console.log('Route markers added successfully');
                    return true;
                } catch (error) {
                    console.error('Error adding route markers:', error);
                    return false;
                }
            };

            // Function to clear route markers
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
                    console.log('Route markers cleared');
                    return true;
                } catch (error) {
                    console.error('Error clearing route markers:', error);
                    return false;
                }
            };

            // Enhanced distance calculation
            function calculateDistance(coordinates) {
                if (!coordinates || coordinates.length < 2) return 0;
                
                let totalDistance = 0;
                for (let i = 1; i < coordinates.length; i++) {
                    const point1 = L.latLng(coordinates[i-1][0], coordinates[i-1][1]);
                    const point2 = L.latLng(coordinates[i][0], coordinates[i][1]);
                    totalDistance += point1.distanceTo(point2);
                }
                
                return totalDistance / 1000; // Convert to kilometers
            }

            // Debug function to check map state
            window.debugMapState = function() {
                console.log('=== MAP STATE DEBUG ===');
                console.log('Map center:', map.getCenter());
                console.log('Map zoom:', map.getZoom());
                console.log('Has current route:', !!currentRoute);
                console.log('Route coordinates count:', currentRoute ? currentRoute.getLatLngs().length : 0);
                console.log('Start marker:', !!startMarker);
                console.log('End marker:', !!endMarker);
                console.log('Stop markers:', stopMarkers.length);
                return true;
            };

            // Initialize map when page loads
            window.addEventListener('load', initMap);

            // Handle window resize
            window.addEventListener('resize', function() {
                if (map) {
                    setTimeout(function() {
                        map.invalidateSize();
                    }, 100);
                }
            });
        </script>
    </body>
    </html>
    `;
};

export default getMapHTML;