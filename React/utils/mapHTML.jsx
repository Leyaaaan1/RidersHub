// Enhanced getMapHTML function with route drawing capabilities
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

            // Function to clear existing route
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

            // Function to draw route polyline
            window.drawRoute = function(coordinates, options = {}) {
                try {
                    console.log('Drawing route with', coordinates.length, 'coordinates');
                    
                    // Validate coordinates
                    if (!Array.isArray(coordinates) || coordinates.length < 2) {
                        console.error('Invalid coordinates for route drawing');
                        return false;
                    }

                    // Clear existing route first
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                    }

                    // Default styling options
                    const defaultOptions = {
                        color: '#1e40af',
                        weight: 5,
                        opacity: 0.8,
                        smoothFactor: 1.0,
                        lineJoin: 'round',
                        lineCap: 'round'
                    };

                    // Merge with provided options
                    const routeOptions = { ...defaultOptions, ...options };

                    // Create polyline
                    currentRoute = L.polyline(coordinates, routeOptions).addTo(map);

                    // Add popup showing route info
                    const distance = calculateDistance(coordinates);
                    currentRoute.bindPopup(\`Route distance: \${distance.toFixed(2)} km\`);

                    console.log('Route drawn successfully with', coordinates.length, 'points');
                    return true;

                } catch (error) {
                    console.error('Error drawing route:', error);
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

            // Function to fit route to map view
            window.fitRouteToMap = function(coordinates, padding = [20, 20]) {
                try {
                    if (!Array.isArray(coordinates) || coordinates.length === 0) {
                        console.error('No coordinates provided for fitting route');
                        return false;
                    }

                    const bounds = L.latLngBounds(coordinates);
                    map.fitBounds(bounds, { 
                        padding: padding,
                        maxZoom: 16
                    });
                    
                    console.log('Map fitted to route bounds');
                    return true;
                } catch (error) {
                    console.error('Error fitting route to map:', error);
                    return false;
                }
            };

            // Function to add route markers (start, end, stops)
            window.addRouteMarkers = function(startCoords, endCoords, stopCoords = []) {
                try {
                    // Clear existing route markers
                    clearRouteMarkers();

                    // Custom icons for different marker types
                    const startIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    const endIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });

                    const stopIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background: #f59e0b; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    });

                    // Add start marker
                    if (startCoords && startCoords.length >= 2) {
                        startMarker = L.marker([startCoords[0], startCoords[1]], { icon: startIcon })
                            .addTo(map)
                            .bindPopup('Start Point');
                    }

                    // Add end marker
                    if (endCoords && endCoords.length >= 2) {
                        endMarker = L.marker([endCoords[0], endCoords[1]], { icon: endIcon })
                            .addTo(map)
                            .bindPopup('End Point');
                    }

                    // Add stop markers
                    if (Array.isArray(stopCoords)) {
                        stopCoords.forEach((coord, index) => {
                            if (coord && coord.length >= 2) {
                                const stopMarker = L.marker([coord[0], coord[1]], { icon: stopIcon })
                                    .addTo(map)
                                    .bindPopup(\`Stop \${index + 1}\`);
                                stopMarkers.push(stopMarker);
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
                    return true;
                } catch (error) {
                    console.error('Error clearing route markers:', error);
                    return false;
                }
            };

            // Helper function to calculate approximate distance
            function calculateDistance(coordinates) {
                if (!coordinates || coordinates.length < 2) return 0;
                
                let totalDistance = 0;
                for (let i = 1; i < coordinates.length; i++) {
                    const point1 = L.latLng(coordinates[i-1]);
                    const point2 = L.latLng(coordinates[i]);
                    totalDistance += point1.distanceTo(point2);
                }
                
                return totalDistance / 1000; // Convert to kilometers
            }

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