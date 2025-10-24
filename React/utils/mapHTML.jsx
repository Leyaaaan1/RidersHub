
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
                padding: 8px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                border: 1px solid #e2e8f0;
            }
            .route-info {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.95);
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                border: 1px solid #e2e8f0;
                min-width: 120px;
                z-index: 1000;
            }
            .route-info-title {
                font-weight: 600;
                color: #1e40af;
                margin-bottom: 4px;
            }
            .route-info-item {
                margin: 2px 0;
                color: #4b5563;
            }
            ${isDark ? `
            .leaflet-tile-pane { 
                filter: invert(1) hue-rotate(180deg); 
            }
            .leaflet-marker-icon, .custom-marker {
                filter: invert(1) hue-rotate(180deg);
            }
            .route-info, .route-popup {
                background: rgba(31, 41, 55, 0.95) !important;
                color: #f9fafb !important;
                border-color: #4b5563 !important;
            }
            .route-info-title {
                color: #60a5fa !important;
            }
            .route-info-item {
                color: #d1d5db !important;
            }
            ` : ''}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div id="routeInfo" class="route-info" style="display: none;">
            <div class="route-info-title">Route Info</div>
            <div id="routeDistance" class="route-info-item">Distance: --</div>
            <div id="routeDuration" class="route-info-item">Duration: --</div>
        </div>
        
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            let map, marker;
            let isDarkMode = ${isDark};
            let currentRoute = null;
<<<<<<< Updated upstream
            let currentGeoJsonRoute = null;
=======
            let currentGeoJSONLayer = null;
>>>>>>> Stashed changes
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

                    console.log('Map initialized successfully with GeoJSON support');
                } catch (error) {
                    console.error('Error initializing map:', error);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapError',
                        error: error.message
                    }));
                }
            }

<<<<<<< Updated upstream
            // Enhanced function to clear existing routes
=======
            // Enhanced function to clear existing route and GeoJSON layers
>>>>>>> Stashed changes
            window.clearRoute = function() {
                try {
                    let cleared = false;
                    
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                        currentRoute = null;
<<<<<<< Updated upstream
                        console.log('Coordinate route cleared');
                    }
                    if (currentGeoJsonRoute) {
                        map.removeLayer(currentGeoJsonRoute);
                        currentGeoJsonRoute = null;
                        console.log('GeoJSON route cleared');
=======
                        cleared = true;
>>>>>>> Stashed changes
                    }
                    
                    if (currentGeoJSONLayer) {
                        map.removeLayer(currentGeoJSONLayer);
                        currentGeoJSONLayer = null;
                        cleared = true;
                    }
                    
                    // Hide route info
                    const routeInfo = document.getElementById('routeInfo');
                    if (routeInfo) {
                        routeInfo.style.display = 'none';
                    }
                    
                    if (cleared) {
                        console.log('All routes and GeoJSON layers cleared successfully');
                    }
                    
                    return true;
                } catch (error) {
                    console.error('Error clearing route:', error);
                    return false;
                }
            };

<<<<<<< Updated upstream
            // NEW: Function to draw GeoJSON route directly from ORS
            window.drawGeoJsonRoute = function(geoJsonData, options = {}) {
                try {
                    console.log('=== WEBVIEW GEOJSON ROUTE DRAWING START ===');
                    
                    // Validate GeoJSON data
                    if (!geoJsonData || typeof geoJsonData !== 'object') {
                        console.error('Invalid GeoJSON data:', geoJsonData);
                        return false;
                    }

                    if (!geoJsonData.features || !Array.isArray(geoJsonData.features) || geoJsonData.features.length === 0) {
                        console.error('No features found in GeoJSON data');
                        return false;
                    }

                    console.log('GeoJSON features found:', geoJsonData.features.length);
                    console.log('First feature type:', geoJsonData.features[0].geometry?.type);

                    // Clear existing routes
                    if (currentGeoJsonRoute) {
                        map.removeLayer(currentGeoJsonRoute);
                    }
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                        currentRoute = null;
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

                    // Create GeoJSON layer with ORS polyline data
                    currentGeoJsonRoute = L.geoJSON(geoJsonData, {
                        style: routeOptions,
                        onEachFeature: function(feature, layer) {
                            // Add route properties popup if available
                            if (feature.properties) {
                                let popupContent = '<div class="route-popup">';
                                
                                if (feature.properties.summary) {
                                    const summary = feature.properties.summary;
                                    if (summary.distance) {
                                        popupContent += \`<strong>Distance:</strong> \${(summary.distance / 1000).toFixed(2)} km<br>\`;
                                    }
                                    if (summary.duration) {
                                        const hours = Math.floor(summary.duration / 3600);
                                        const minutes = Math.floor((summary.duration % 3600) / 60);
                                        popupContent += \`<strong>Duration:</strong> \${hours > 0 ? hours + 'h ' : ''}\${minutes}min\`;
                                    }
                                }
                                
                                popupContent += '</div>';
                                layer.bindPopup(popupContent);
                            }
                        }
                    }).addTo(map);

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

                    console.log('=== GEOJSON ROUTE DRAWN SUCCESSFULLY ===');
                    console.log('Total distance:', (totalDistance / 1000).toFixed(2), 'km');
                    console.log('Total duration:', Math.floor(totalDuration / 60), 'minutes');
                    console.log('Coordinate points:', coordinateCount);
                    
                    // Send success message back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'routeDrawn',
                        success: true,
                        coordinateCount: coordinateCount,
                        distance: totalDistance / 1000,
                        duration: totalDuration,
                        bounds: currentGeoJsonRoute.getBounds()
                    }));
                    
                    return true;

                } catch (error) {
                    console.error('=== GEOJSON ROUTE DRAWING ERROR ===');
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

            // Enhanced function to draw route polyline (keep for backward compatibility)
            window.drawRoute = function(coordinates, options = {}) {
                try {
                    console.log('=== WEBVIEW COORDINATE ROUTE DRAWING START ===');
=======
            // NEW: Enhanced function to draw route from GeoJSON data
            window.drawGeoJSONRoute = function(coordinates, style = {}, routeInfo = {}) {
                try {
                    console.log('=== DRAWING GEOJSON ROUTE ===');
                    console.log('Coordinates count:', coordinates?.length);
                    console.log('Style:', style);
                    console.log('Route info:', routeInfo);
>>>>>>> Stashed changes
                    
                    // Validate coordinates
                    if (!Array.isArray(coordinates) || coordinates.length < 2) {
                        console.error('Invalid coordinates for GeoJSON route drawing');
                        return false;
                    }

                    // Validate and process coordinates
                    const validatedCoords = validateAndProcessCoordinates(coordinates);
                    if (!validatedCoords || validatedCoords.length < 2) {
                        console.error('No valid coordinates after processing');
                        return false;
                    }

<<<<<<< Updated upstream
                    console.log('Valid coordinates for route:', validatedCoords.length);

                    // Clear existing routes
                    if (currentRoute) {
                        map.removeLayer(currentRoute);
                    }
                    if (currentGeoJsonRoute) {
                        map.removeLayer(currentGeoJsonRoute);
                        currentGeoJsonRoute = null;
                    }

                    // Enhanced default styling
                    const defaultOptions = {
=======
                    // Clear existing routes
                    window.clearRoute();

                    // Enhanced default styling for GeoJSON routes
                    const defaultStyle = {
>>>>>>> Stashed changes
                        color: '#1e40af',
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1.0,
                        lineJoin: 'round',
                        lineCap: 'round',
                        className: 'geojson-route'
                    };

                    const finalStyle = { ...defaultStyle, ...style };

                    // Create GeoJSON LineString feature
                    const geoJsonFeature = {
                        "type": "Feature",
                        "properties": {
                            "routeType": "driving",
                            "service": "RidersHub-ORS",
                            ...routeInfo
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": validatedCoords.map(coord => [coord[1], coord[0]]) // Convert back to [lng, lat]
                        }
                    };

                    // Create Leaflet GeoJSON layer
                    currentGeoJSONLayer = L.geoJSON(geoJsonFeature, {
                        style: function(feature) {
                            return finalStyle;
                        },
                        onEachFeature: function(feature, layer) {
                            // Add click event for route info
                            layer.on('click', function(e) {
                                const props = feature.properties;
                                let popupContent = '<div class="route-popup">';
                                popupContent += '<strong>Route Information</strong><br/>';
                                
                                if (props.distance) {
                                    const distanceKm = (props.distance / 1000).toFixed(2);
                                    popupContent += 'Distance: ' + distanceKm + ' km<br/>';
                                }
                                
                                if (props.duration) {
                                    const durationMin = Math.round(props.duration / 60);
                                    popupContent += 'Duration: ' + durationMin + ' min<br/>';
                                }
                                
                                if (props.service) {
                                    popupContent += 'Service: ' + props.service;
                                }
                                
                                popupContent += '</div>';
                                
                                layer.bindPopup(popupContent).openPopup(e.latlng);
                            });
                        }
                    }).addTo(map);

<<<<<<< Updated upstream
                    console.log('=== COORDINATE ROUTE DRAWN SUCCESSFULLY ===');
=======
                    // Store reference for clearing
                    currentRoute = currentGeoJSONLayer;

                    // Display route information in the UI
                    displayRouteInformation(routeInfo);

                    // Calculate and log route statistics
                    const routeDistance = calculateRouteDistance(validatedCoords);
                    console.log('GeoJSON route distance calculated:', routeDistance.toFixed(2), 'km');

                    console.log('=== GEOJSON ROUTE DRAWN SUCCESSFULLY ===');
                    console.log('Feature type:', geoJsonFeature.geometry.type);
                    console.log('Coordinate count:', validatedCoords.length);
>>>>>>> Stashed changes
                    
                    // Send success message
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'geoJsonRouteDrawn',
                        success: true,
                        coordinateCount: validatedCoords.length,
                        distance: routeDistance,
                        bounds: currentGeoJSONLayer.getBounds(),
                        routeInfo: routeInfo
                    }));
                    
                    return true;

                } catch (error) {
<<<<<<< Updated upstream
                    console.error('=== COORDINATE ROUTE DRAWING ERROR ===');
=======
                    console.error('=== GEOJSON ROUTE DRAWING ERROR ===');
>>>>>>> Stashed changes
                    console.error('Error:', error.message);
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'geoJsonRouteDrawn',
                        success: false,
                        error: error.message
                    }));
                    
                    return false;
                }
            };

            // ENHANCED: Backward compatible function for regular polyline drawing
            window.drawRoute = function(coordinates, options = {}) {
                try {
                    console.log('=== DRAWING REGULAR ROUTE (FALLBACK) ===');
                    
                    // Use GeoJSON function for better handling
                    return window.drawGeoJSONRoute(coordinates, options, {});

                } catch (error) {
                    console.error('Error in fallback route drawing:', error);
                    return false;
                }
            };

            // Helper function to validate and process coordinates
            function validateAndProcessCoordinates(coordinates) {
                const validatedCoords = [];
                let invalidCount = 0;

                coordinates.forEach((coord, index) => {
                    if (Array.isArray(coord) && coord.length >= 2) {
                        const lat = parseFloat(coord[0]);
                        const lng = parseFloat(coord[1]);
                        
                        // Check if coordinates are valid numbers and within bounds
                        if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) &&
                            lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                            validatedCoords.push([lat, lng]);
                        } else {
                            invalidCount++;
                            if (invalidCount <= 3) {
                                console.warn('Invalid coordinate at index', index, ':', coord);
                            }
                        }
                    } else {
                        invalidCount++;
                        if (invalidCount <= 3) {
                            console.warn('Malformed coordinate at index', index, ':', coord);
                        }
                    }
                });

                if (invalidCount > 0) {
                    console.warn('Processed coordinates:', validatedCoords.length, 'valid,', invalidCount, 'invalid');
                }

                return validatedCoords;
            }

            // Function to display route information in UI
            function displayRouteInformation(routeInfo) {
                const routeInfoElement = document.getElementById('routeInfo');
                const distanceElement = document.getElementById('routeDistance');
                const durationElement = document.getElementById('routeDuration');

                if (routeInfoElement && routeInfo) {
                    if (routeInfo.distance && routeInfo.distance > 0) {
                        const distanceKm = (routeInfo.distance / 1000).toFixed(2);
                        distanceElement.textContent = 'Distance: ' + distanceKm + ' km';
                        routeInfoElement.style.display = 'block';
                    }

                    if (routeInfo.duration && routeInfo.duration > 0) {
                        const durationMin = Math.round(routeInfo.duration / 60);
                        const hours = Math.floor(durationMin / 60);
                        const minutes = durationMin % 60;
                        
                        let durationText = 'Duration: ';
                        if (hours > 0) {
                            durationText += hours + 'h ' + minutes + 'm';
                        } else {
                            durationText += minutes + ' min';
                        }
                        
                        durationElement.textContent = durationText;
                        routeInfoElement.style.display = 'block';
                    }
                }
            }

            // Enhanced function to display route info (called from React Native)
            window.displayRouteInfo = function(distance, duration) {
                try {
                    const routeInfoElement = document.getElementById('routeInfo');
                    const distanceElement = document.getElementById('routeDistance');
                    const durationElement = document.getElementById('routeDuration');

                    if (routeInfoElement && distance && duration) {
                        distanceElement.textContent = 'Distance: ' + distance;
                        durationElement.textContent = 'Duration: ' + duration;
                        routeInfoElement.style.display = 'block';
                        
                        console.log('Route info displayed:', distance, duration);
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error displaying route info:', error);
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

            // NEW: Enhanced function to fit GeoJSON route to map view
            window.fitGeoJsonRouteToMap = function(geoJsonData, padding = [20, 20]) {
                try {
                    if (currentGeoJsonRoute) {
                        map.fitBounds(currentGeoJsonRoute.getBounds(), { 
                            padding: padding,
                            maxZoom: 16
                        });
                        console.log('Map fitted to GeoJSON route bounds');
                        return true;
                    } else if (geoJsonData && geoJsonData.features && geoJsonData.features.length > 0) {
                        // Create temporary layer to get bounds
                        const tempLayer = L.geoJSON(geoJsonData);
                        map.fitBounds(tempLayer.getBounds(), { 
                            padding: padding,
                            maxZoom: 16
                        });
                        console.log('Map fitted to GeoJSON data bounds');
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Error fitting GeoJSON route to map:', error);
                    return false;
                }
            };

            // Enhanced function to fit route to map view
            window.fitRouteToMap = function(coordinates, padding = [20, 20]) {
                try {
                    if (currentGeoJsonRoute) {
                        return window.fitGeoJsonRouteToMap(null, padding);
                    } else if (currentRoute) {
                        map.fitBounds(currentRoute.getBounds(), { 
                            padding: padding,
                            maxZoom: 16
                        });
                        console.log('Map fitted to coordinate route bounds');
                        return true;
                    } else if (Array.isArray(coordinates) && coordinates.length > 0) {
                        const bounds = L.latLngBounds(coordinates);
                        map.fitBounds(bounds, { 
                            padding: padding,
                            maxZoom: 16
                        });
                        console.log('Map fitted to provided coordinates');
                        return true;
                    }
<<<<<<< Updated upstream
                    return false;
=======

                    let bounds;
                    if (currentGeoJSONLayer) {
                        bounds = currentGeoJSONLayer.getBounds();
                    } else if (currentRoute) {
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
>>>>>>> Stashed changes
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

                    // Create custom icons with better styling
                    const createMarkerIcon = (color, size = 20, label = '') => {
                        return L.divIcon({
                            className: 'custom-marker',
                            html: \`<div style="
                                background: \${color}; 
                                width: \${size}px; 
                                height: \${size}px; 
                                border-radius: 50%; 
                                border: 3px solid white; 
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 12px;
                                font-weight: bold;
                                color: white;
                                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                            ">\${label}</div>\`,
                            iconSize: [size, size],
                            iconAnchor: [size/2, size/2]
                        });
                    };

                    const startIcon = createMarkerIcon('#22c55e', 28, 'S'); // Green with S
                    const endIcon = createMarkerIcon('#ef4444', 28, 'E');   // Red with E
                    const stopIcon = createMarkerIcon('#f59e0b', 22);       // Amber

                    // Add start marker
                    if (startCoords && Array.isArray(startCoords) && startCoords.length >= 2) {
                        startMarker = L.marker([startCoords[0], startCoords[1]], { 
                            icon: startIcon,
                            zIndexOffset: 1000
                        })
                        .addTo(map)
                        .bindPopup('<div class="route-popup"><strong>🚗 Start Point</strong></div>');
                        
                        console.log('Start marker added at:', startCoords);
                    }

                    // Add end marker
                    if (endCoords && Array.isArray(endCoords) && endCoords.length >= 2) {
                        endMarker = L.marker([endCoords[0], endCoords[1]], { 
                            icon: endIcon,
                            zIndexOffset: 1000
                        })
                        .addTo(map)
                        .bindPopup('<div class="route-popup"><strong>🏁 End Point</strong></div>');
                        
                        console.log('End marker added at:', endCoords);
                    }

                    // Add stop markers
                    if (Array.isArray(stopCoords)) {
                        stopCoords.forEach((coord, index) => {
                            if (Array.isArray(coord) && coord.length >= 2) {
                                const stopNumber = (index + 1).toString();
                                const numberedStopIcon = createMarkerIcon('#f59e0b', 22, stopNumber);
                                
                                const stopMarker = L.marker([coord[0], coord[1]], { 
                                    icon: numberedStopIcon,
                                    zIndexOffset: 999
                                })
                                .addTo(map)
                                .bindPopup(\`<div class="route-popup"><strong>📍 Stop \${index + 1}</strong></div>\`);
                                
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
            function clearRouteMarkers() {
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
            }

            // Expose clearRouteMarkers globally
            window.clearRouteMarkers = clearRouteMarkers;

            // Enhanced distance calculation
            function calculateRouteDistance(coordinates) {
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
<<<<<<< Updated upstream
                console.log('Has coordinate route:', !!currentRoute);
                console.log('Has GeoJSON route:', !!currentGeoJsonRoute);
=======
                console.log('Has current route:', !!currentRoute);
                console.log('Has GeoJSON layer:', !!currentGeoJSONLayer);
                console.log('Route coordinates count:', currentRoute ? currentRoute.getLatLngs()?.length || 0 : 0);
>>>>>>> Stashed changes
                console.log('Start marker:', !!startMarker);
                console.log('End marker:', !!endMarker);
                console.log('Stop markers:', stopMarkers.length);
                
                if (currentGeoJSONLayer) {
                    console.log('GeoJSON layer bounds:', currentGeoJSONLayer.getBounds());
                }
                
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