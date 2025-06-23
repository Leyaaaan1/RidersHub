// React/utils/mapstel.jsx
const getMapHTML = (latitude, longitude) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            /* Base Styles */
            body { 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                transition: background-color 0.3s ease;
            }
            
            #map { 
                width: 100%; 
                height: 100vh; 
            }
            
            /* Control Panel */
            .control-panel {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            /* Button Base Styles */
            .control-btn {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: bold;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                background: white;
                color: #333;
            }
            
            .control-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            
            .control-btn:active {
                transform: scale(0.95);
            }
            
            /* Theme Toggle Button */
            .theme-btn {
                background: linear-gradient(45deg, #333 50%, #fff 50%);
                color: #333;
            }
            
            /* Dark theme styles */
            body.dark-theme {
                background-color: #121212;
            }
            
            body.dark-theme .control-btn {
                background: #2a2a2a;
                color: #fff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .control-panel {
                    left: 10px;
                }
                .control-btn {
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        
        <!-- Control Panel -->
        <div class="control-panel">
            <button id="zoom-in" class="control-btn">+</button>
            <button id="zoom-out" class="control-btn">−</button>
            <button id="theme-toggle" class="control-btn theme-btn">🌙</button>
        </div>
        
        <script>
            // Initialize map
            const map = L.map('map').setView([${parseFloat(latitude) || 7.0731}, ${parseFloat(longitude) || 125.6128}], 15);
            
            // Initialize with light theme
            let isDarkTheme = false;
            
            // Define tile layers for light and dark themes
            const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            });
            
            const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CartoDB'
            });
            
            // Set initial theme
            darkTiles.addTo(map);
            
            // Add marker
            const marker = L.marker([${parseFloat(latitude) || 7.0731}, ${parseFloat(longitude) || 125.6128}]).addTo(map);
            
            // Map click event
            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapClick',
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                }));
            });
            
            // Control buttons functionality
            document.getElementById('zoom-in').addEventListener('click', function() {
                map.zoomIn();
            });
            
            document.getElementById('zoom-out').addEventListener('click', function() {
                map.zoomOut();
            });
            
            document.getElementById('theme-toggle').addEventListener('click', function() {
                isDarkTheme = !isDarkTheme;
                
                if (isDarkTheme) {
                    document.body.classList.add('dark-theme');
                    darkTiles.addTo(map);
                    lightTiles.remove();
                    this.textContent = '☀️';
                } else {
                    document.body.classList.remove('dark-theme');
                    lightTiles.addTo(map);
                    darkTiles.remove();
                    this.textContent = '🌙';
                }
            });
        </script>
    </body>
    </html>
`;

export default getMapHTML;