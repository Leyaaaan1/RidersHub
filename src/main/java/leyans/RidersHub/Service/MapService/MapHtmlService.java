package leyans.RidersHub.Service.MapService;
import org.springframework.stereotype.Component;

@Component
public class MapHtmlService {

    public String generateMapHTML(double latitude, double longitude, String label) {
        return String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" />
                    <link rel=\"stylesheet\" href=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.css\" />
                    <script src=\"https://unpkg.com/leaflet@1.7.1/dist/leaflet.js\"></script>
                    <style>
                        body { margin: 0; padding: 0; }
                        #map { width: 100%%; height: 100vh; }
                        .mode-toggle {
                            position: absolute;
                            left: 10px;
                            top: 50%%;
                            transform: translateY(-50%%);
                            z-index: 1000;
                            background: white;
                            border-radius: 4px;
                            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
                            padding: 6px 10px;
                            display: flex;
                            flex-direction: column;
                        }
                        .mode-toggle button {
                            border: none;
                            background: #fff;
                            padding: 6px 10px;
                            margin: 2px 0;
                            border-radius: 4px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        .mode-toggle button.active {
                            background: #4285F4;
                            color: white;
                        }
                        .mode-toggle button:hover {
                            background: #f0f0f0;
                        }
                        .mode-toggle button.active:hover {
                            background: #3b77db;
                        }
                    </style>
                </head>
                <body>
                    <div id=\"map\"></div>
                    <div class=\"mode-toggle\">
                        <button id=\"lightMode\">Light</button>
                        <button id=\"darkMode\">Dark</button>
                    </div>
                    <script>
                        const savedMode = localStorage.getItem('mapMode') || 'light';

                        const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([%f, %f], 15);

                        L.control.zoom({ position: 'topleft' }).addTo(map);

                        const lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>'
                        });

                        const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href=\"https://carto.com/\">CARTO</a>'
                        });

                        if (savedMode === 'dark') {
                            darkTiles.addTo(map);
                            document.getElementById('darkMode').classList.add('active');
                        } else {
                            lightTiles.addTo(map);
                            document.getElementById('lightMode').classList.add('active');
                        }

                        const marker = L.marker([%f, %f], { draggable: true }).addTo(map)
                            .bindPopup('<div style=\"text-align:center\">%s</div>').openPopup();

                        marker.on('dragend', function(e) {
                            window.ReactNativeWebView?.postMessage(JSON.stringify({
                                type: 'markerDrag',
                                lat: marker.getLatLng().lat,
                                lng: marker.getLatLng().lng
                            }));
                        });

                        map.on('click', function(e) {
                            marker.setLatLng(e.latlng);
                            window.ReactNativeWebView?.postMessage(JSON.stringify({
                                type: 'mapClick',
                                lat: e.latlng.lat,
                                lng: e.latlng.lng
                            }));
                        });

                        document.getElementById('lightMode').addEventListener('click', function () {
                            map.removeLayer(darkTiles);
                            lightTiles.addTo(map);
                            localStorage.setItem('mapMode', 'light');
                            this.classList.add('active');
                            document.getElementById('darkMode').classList.remove('active');
                        });

                        document.getElementById('darkMode').addEventListener('click', function () {
                            map.removeLayer(lightTiles);
                            darkTiles.addTo(map);
                            localStorage.setItem('mapMode', 'dark');
                            this.classList.add('active');
                            document.getElementById('lightMode').classList.remove('active');
                        });
                    </script>
                </body>
                </html>
                """, latitude, longitude, latitude, longitude, label);
    }
}
