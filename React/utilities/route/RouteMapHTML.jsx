export const createMapHTML = () => {
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
                font-size: 14px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.98);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                border: 2px solid;
                min-width: 150px;
            }
            .route-popup strong {
                display: block;
                margin-bottom: 4px;
                font-size: 15px;
            }
            .route-popup b {
                color: #1e40af;
            }
            /* Custom marker styles */
            .custom-marker {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                color: white;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                border: 3px solid white;
                transition: transform 0.2s;
            }
            .custom-marker:hover {
                transform: scale(1.2);
            }
            .marker-start {
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            }
            .marker-stop {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            }
            .marker-end {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            .location-name-label {
                background: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 13px;
                font-weight: 600;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                border: 2px solid;
                white-space: nowrap;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
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
                    }).setView(defaultCenter, 15); // Street level zoom

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
                            weight: 5,
                            opacity: 0.9,
                            smoothFactor: 1,
                            lineJoin: 'round',
                            lineCap: 'round'
                        },
                        onEachFeature: function(feature, layer) {
                            // Add route properties popup if available
                            if (feature.properties) {
                                let popupContent = '<div class="route-popup" style="border-color: #1e40af;">';
                                
                                if (feature.properties.summary) {
                                    const summary = feature.properties.summary;
                                    popupContent += '<strong>📍 Route Information</strong><br>';
                                    
                                    if (summary.distance) {
                                        const distance = (summary.distance / 1000).toFixed(2);
                                        popupContent += \`<b>Distance:</b> \${distance} km<br>\`;
                                    }
                                    
                                    if (summary.duration) {
                                        const totalMinutes = Math.floor(summary.duration / 60);
                                        const hours = Math.floor(totalMinutes / 60);
                                        const minutes = totalMinutes % 60;
                                        const durationText = hours > 0 ? \`\${hours}h \${minutes}min\` : \`\${minutes}min\`;
                                        popupContent += \`<b>Duration:</b> \${durationText}\`;
                                    }
                                } else {
                                    popupContent += '<strong>📍 Route Information</strong>';
                                }
                                
                                popupContent += '</div>';
                                layer.bindPopup(popupContent);
                            }
                        }
                    }).addTo(map);

                    // Add route markers first
                    addRouteMarkers();

                    // Center on starting point at street level
                    const startPoint = window.startingPoint;
                    if (startPoint && startPoint.lat && startPoint.lng) {
                        map.setView([startPoint.lat, startPoint.lng], 16, {
                            animate: true,
                            duration: 1
                        });
                    } else if (geoJsonRouteLayer) {
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

                    // Create polyline route with enhanced styling
                    routeLayer = L.polyline(routeCoordinates, {
                        color: '#1e40af',
                        weight: 5,
                        opacity: 0.9,
                        smoothFactor: 1,
                        lineJoin: 'round',
                        lineCap: 'round'
                    }).addTo(map);

                    // Add route markers
                    addRouteMarkers();

                    // Center on starting point at street level
                    const startPoint = window.startingPoint;
                    if (startPoint && startPoint.lat && startPoint.lng) {
                        map.setView([startPoint.lat, startPoint.lng], 16, {
                            animate: true,
                            duration: 1
                        });
                    } else if (routeCoordinates.length > 0) {
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

                    // Create custom div icon
                    const createCustomMarker = (latLng, className, iconText, color, popupText, labelText) => {
                        const icon = L.divIcon({
                            className: 'custom-div-icon',
                            html: \`<div class="custom-marker \${className}">\${iconText}</div>\`,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16]
                        });

                        const marker = L.marker(latLng, { icon: icon })
                            .addTo(markersGroup)
                            .bindPopup(\`<div class="route-popup" style="border-color: \${color};">\${popupText}</div>\`);

                        // Add permanent label with location name
                        if (labelText) {
                            const label = L.tooltip({
                                permanent: true,
                                direction: 'top',
                                offset: [0, -20],
                                className: 'location-name-label',
                                opacity: 1
                            });
                            label.setContent(\`<span style="color: \${color}; border-color: \${color};">\${labelText}</span>\`);
                            marker.bindTooltip(label);
                        }

                        return marker;
                    };

                    // Add start marker (Green)
                    if (startPoint && startPoint.lat && startPoint.lng) {
                        const name = startPoint.name || startPoint.address || 'Starting Point';
                        createCustomMarker(
                            [startPoint.lat, startPoint.lng],
                            'marker-start',
                            '🚀',
                            '#16a34a',
                            \`<strong>🚀 Starting Point</strong><br><b>\${name}</b>\`,
                            name
                        );
                    }

                    // Add stop markers (Orange)
                    stopPoints.forEach((stop, index) => {
                        if (stop.lat && stop.lng) {
                            const name = stop.name || stop.address || \`Stop \${index + 1}\`;
                            createCustomMarker(
                                [stop.lat, stop.lng],
                                'marker-stop',
                                (index + 1).toString(),
                                '#d97706',
                                \`<strong>📍 Stop Point \${index + 1}</strong><br><b>\${name}</b>\`,
                                name
                            );
                        }
                    });

                    // Add end marker (Red)
                    if (endPoint && endPoint.lat && endPoint.lng) {
                        const name = endPoint.name || endPoint.address || 'Ending Point';
                        createCustomMarker(
                            [endPoint.lat, endPoint.lng],
                            'marker-end',
                            '🏁',
                            '#dc2626',
                            \`<strong>🏁 Ending Point</strong><br><b>\${name}</b>\`,
                            name
                        );
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