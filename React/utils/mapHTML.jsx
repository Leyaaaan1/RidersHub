const getMapHTML = (latitude, longitude) => {
    // Safely handle coordinates
    const lat = parseFloat(latitude) || 7.0731;
    const lng = parseFloat(longitude) || 125.6128;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; height: 100vh; width: 100vw; }
            #map { width: 100%; height: 100%; }
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
                background: white;
                color: #333;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            .control-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .control-btn:active {
                transform: scale(0.95);
            }
            .theme-btn {
                background: linear-gradient(45deg, #333 50%, #fff 50%);
                position: relative;
                overflow: hidden;
            }
            .theme-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255,255,255,0.2);
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .theme-btn:hover::before {
                opacity: 1;
            }
            body.dark-theme { 
                background-color: #121212; 
            }
            body.dark-theme .control-btn {
                background: #2a2a2a;
                color: #fff;
                box-shadow: 0 2px 8px rgba(255,255,255,0.1);
            }
            body.dark-theme .control-btn:hover {
                box-shadow: 0 4px 12px rgba(255,255,255,0.15);
            }
            /* Prevent text selection on buttons */
            .control-btn {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <div class="control-panel">
            <button id="zoom-in" class="control-btn" title="Zoom In">+</button>
            <button id="zoom-out" class="control-btn" title="Zoom Out">−</button>
            <button id="theme-toggle" class="control-btn theme-btn" title="Toggle Theme">
                <div id="theme-icon" style="text-align:center; pointer-events: none;">🌙</div>
            </button>
        </div>
        <script>
            const map = L.map('map', { zoomControl: false }).setView([${lat}, ${lng}], 15);
            let isDarkTheme = false;
            let isThemeButtonPressed = false;
            
            const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            });
            
            const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CartoDB'
            });
            
            lightTiles.addTo(map);
            const marker = L.marker([${lat}, ${lng}]).addTo(map);
            
            // Handle map clicks for marker placement
            map.on('click', function(e) {
                // Only handle map clicks if theme button wasn't just pressed
                if (!isThemeButtonPressed) {
                    marker.setLatLng(e.latlng);
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapClick',
                            lat: e.latlng.lat,
                            lng: e.latlng.lng
                        }));
                    }
                }
                // Reset the flag after a short delay
                setTimeout(() => {
                    isThemeButtonPressed = false;
                }, 100);
            });
            
            // Zoom controls
            document.getElementById('zoom-in').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                map.zoomIn();
            });
            
            document.getElementById('zoom-out').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                map.zoomOut();
            });
            
            // Theme toggle with improved event handling
            document.getElementById('theme-toggle').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Set flag to prevent map click event
                isThemeButtonPressed = true;
                
                isDarkTheme = !isDarkTheme;
                const themeIcon = document.getElementById('theme-icon');
                
                if (isDarkTheme) {
                    document.body.classList.add('dark-theme');
                    map.removeLayer(lightTiles);
                    map.addLayer(darkTiles);
                    themeIcon.innerHTML = '☀️';
                } else {
                    document.body.classList.remove('dark-theme');
                    map.removeLayer(darkTiles);
                    map.addLayer(lightTiles);
                    themeIcon.innerHTML = '🌙';
                }
            });
            
            // Prevent theme button from triggering map events
            document.getElementById('theme-toggle').addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            document.getElementById('theme-toggle').addEventListener('touchstart', function(e) {
                e.stopPropagation();
            });
            
            // Also prevent zoom buttons from triggering map events
            document.getElementById('zoom-in').addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            document.getElementById('zoom-out').addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            document.getElementById('zoom-in').addEventListener('touchstart', function(e) {
                e.stopPropagation();
            });
            
            document.getElementById('zoom-out').addEventListener('touchstart', function(e) {
                e.stopPropagation();
            });
        </script>
    </body>
    </html>
  `;
};

export default getMapHTML;