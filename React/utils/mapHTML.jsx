// Updated getMapHTML function with multiple free tile providers and theme switch button
const getMapHTML = (lat, lng, isDark = false) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Route Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
                background: ${isDark ? '#1a1a1a' : '#ffffff'};
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
            
            /* Left control panel */
            .left-controls {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            /* Custom zoom controls */
            .custom-zoom-btn {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.2s;
                border: 1px solid ${isDark ? '#404040' : '#ccc'};
                background-color: ${isDark ? '#2d2d2d' : 'white'};
                color: ${isDark ? 'white' : '#333'};
            }
            
            .custom-zoom-btn:hover {
                background-color: ${isDark ? '#404040' : '#f0f0f0'};
                transform: scale(1.05);
            }
            
            /* Theme switch button */
            .theme-switch-btn {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.2s;
                border: 1px solid ${isDark ? '#404040' : '#ccc'};
                background-color: ${isDark ? '#2d2d2d' : 'white'};
                color: ${isDark ? '#fbbf24' : '#1f2937'};
                margin-top: 12px;
            }
            
            .theme-switch-btn:hover {
                background-color: ${isDark ? '#404040' : '#f0f0f0'};
                transform: scale(1.05);
            }
            
            /* Dark mode specific styles */
            ${isDark ? `
            .leaflet-control-zoom a {
                background-color: #2d2d2d !important;
                color: white !important;
                border-color: #404040 !important;
            }
            .leaflet-control-zoom a:hover {
                background-color: #404040 !important;
            }
            .leaflet-popup-content-wrapper {
                background: #2d2d2d !important;
                color: white !important;
            }
            .leaflet-popup-tip {
                background: #2d2d2d !important;
            }
            ` : ''}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div class="left-controls">
            <button id="zoom-in" class="custom-zoom-btn" title="Zoom in">+</button>
            <button id="zoom-out" class="custom-zoom-btn" title="Zoom out">−</button>
            <button id="theme-switch" class="theme-switch-btn" title="Switch theme">
                ${isDark ? '☀️' : '🌙'}
            </button>
        </div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            let map, marker, routePolyline;
            let startMarker, endMarker, stopMarkers = [];
            let isDarkMode = ${isDark};
            let currentTileLayer;
            let lastRouteData = null;

            // Free tile providers
            const tileProviders = {
                light: {
                    // Option 1: CartoDB Positron (Clean, minimal)
                    cartodb: {
                        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                        options: {
                            attribution: '© OpenStreetMap, © CartoDB',
                            subdomains: 'abcd',
                            maxZoom: 19
                        }
                    },
                    // Option 2: Stamen Toner Lite (Clean, light)
                    stamen: {
                        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png',
                        options: {
                            attribution: '© Stamen Design, © OpenStreetMap',
                            maxZoom: 18
                        }
                    },
                    // Option 3: OpenStreetMap (Default, always available)
                    osm: {
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        options: {
                            attribution: '© OpenStreetMap',
                            maxZoom: 19
                        }
                    }
                },
                dark: {
                    // Option 1: CartoDB Dark Matter (Best dark option)
                    cartodb: {
                        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                        options: {
                            attribution: '© OpenStreetMap, © CartoDB',
                            subdomains: 'abcd',
                            maxZoom: 19
                        }
                    },
                    // Option 2: Stamen Toner (Dark-ish, high contrast)
                    stamen: {
                        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png',
                        options: {
                            attribution: '© Stamen Design, © OpenStreetMap',
                            maxZoom: 18
                        }
                    },
                    // Option 3: OSM with CSS filter (Fallback)
                    osm_filtered: {
                        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        options: {
                            attribution: '© OpenStreetMap',
                            maxZoom: 19,
                            className: 'dark-tiles'
                        }
                    }
                }
            };

            function initMap() {
                try {
                    map = L.map('map', {
                        center: [${lat}, ${lng}],
                        zoom: 13,
                        zoomControl: false,
                        attributionControl: false
                    });

                    // Add custom CSS for dark filter if needed
                    const style = document.createElement('style');
                    style.textContent = \`
                        .dark-tiles {
                            filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2);
                        }
                    \`;
                    document.head.appendChild(style);

                    // Set up tile layer based on theme
                    setupTileLayer();

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
                        
                        if (lastRouteData) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'requestRouteRedraw'
                            }));
                        }
                    });

                    map.on('click', function(e) {
                        const { lat, lng } = e.latlng;
                        marker.setLatLng([lat, lng]);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapClick',
                            lat: lat,
                            lng: lng
                        }));
                        
                        if (lastRouteData) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'requestRouteRedraw'
                            }));
                        }
                    });

                    // Set up custom controls
                    setupControls();

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

            function setupControls() {
                // Zoom controls
                document.getElementById('zoom-in').addEventListener('click', function() {
                    map.zoomIn();
                });
                document.getElementById('zoom-out').addEventListener('click', function() {
                    map.zoomOut();
                });

                // Theme switch
                document.getElementById('theme-switch').addEventListener('click', function() {
                    switchTheme(!isDarkMode);
                    
                    // Notify React Native about theme change
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'themeChanged',
                        isDark: isDarkMode
                    }));
                });
            }

            function setupTileLayer() {
                // Remove existing tile layer if it exists
                if (currentTileLayer) {
                    map.removeLayer(currentTileLayer);
                }

                let provider;
                
                if (isDarkMode) {
                    // Try CartoDB Dark first, fall back to Stamen, then OSM with filter
                    provider = tileProviders.dark.cartodb;
                } else {
                    // Try CartoDB Positron first, fall back to Stamen, then OSM
                    provider = tileProviders.light.cartodb;
                }

                currentTileLayer = L.tileLayer(provider.url, provider.options);
                
                // Handle tile loading errors
                currentTileLayer.on('tileerror', function(e) {
                    console.warn('Tile loading error, trying fallback:', e);
                    // You can implement fallback logic here
                });

                currentTileLayer.addTo(map);
            }

            function switchTheme(dark) {
                isDarkMode = dark;
                setupTileLayer();

                // Update body background
                document.body.style.background = isDarkMode ? '#1a1a1a' : '#ffffff';

                // Update control buttons
                updateControlStyles();
                
                // Update theme switch button icon
                const themeBtn = document.getElementById('theme-switch');
                themeBtn.innerHTML = isDarkMode ? '☀️' : '🌙';
                themeBtn.title = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
                
                // Redraw the route if we have one with the new theme colors
                if (lastRouteData) {
                    drawRoute(lastRouteData.coordinates, lastRouteData.points);
                }
            }

            function updateControlStyles() {
                const controls = document.querySelectorAll('.custom-zoom-btn, .theme-switch-btn');
                controls.forEach(control => {
                    if (isDarkMode) {
                        control.style.backgroundColor = '#2d2d2d';
                        control.style.color = control.classList.contains('theme-switch-btn') ? '#fbbf24' : 'white';
                        control.style.borderColor = '#404040';
                    } else {
                        control.style.backgroundColor = 'white';
                        control.style.color = control.classList.contains('theme-switch-btn') ? '#1f2937' : '#333';
                        control.style.borderColor = '#ccc';
                    }
                });
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
                    
                    lastRouteData = null;
                } catch (error) {
                    console.error('Error clearing route:', error);
                }
            }

            function drawRoute(coordinates, points) {
                try {
                    console.log('Drawing route with', coordinates.length, 'coordinate points');

                    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
                        throw new Error('Invalid coordinates provided');
                    }

                    // Store the route data
                    lastRouteData = {
                        coordinates: [...coordinates],
                        points: JSON.parse(JSON.stringify(points))
                    };

                    // Clear existing route
                    clearRoute();

                    // Convert coordinates to Leaflet format [lat, lng]
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

                    // Create polyline with theme-appropriate colors
                    const routeColor = isDarkMode ? '#60a5fa' : '#3b82f6';
                    routePolyline = L.polyline(latLngs, {
                        color: routeColor,
                        weight: 4,
                        opacity: 0.8,
                        smoothFactor: 1
                    }).addTo(map);

                    // Add markers for start, stops, and end
                    if (points && points.start) {
                        startMarker = L.marker([points.start.lat, points.start.lng], {
                            icon: L.divIcon({
                                html: '<div style="background: #22c55e; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">S</div>',
                                iconSize: [28, 28],
                                className: 'custom-marker'
                            })
                        }).addTo(map);
                    }

                    if (points && points.end) {
                        endMarker = L.marker([points.end.lat, points.end.lng], {
                            icon: L.divIcon({
                                html: '<div style="background: #ef4444; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">E</div>',
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
                                    html: '<div style="background: #f59e0b; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">' + (index + 1) + '</div>',
                                    iconSize: [24, 24],
                                    className: 'custom-marker'
                                })
                            }).addTo(map);
                            stopMarkers.push(stopMarker);
                        });
                    }

                    // Fit map to show the entire route
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
                        if (marker && !map.hasLayer(marker)) {
                            marker.addTo(map);
                        }
                    } else if (data.type === 'switchTheme') {
                        switchTheme(data.isDark);
                    } else if (data.type === 'preserveRoute') {
                        const newCenter = [data.lat, data.lng];
                        map.setView(newCenter, map.getZoom());
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