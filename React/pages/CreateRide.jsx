
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import utilities from '../styles/utilities';
import {Picker} from "@react-native-picker/picker";
import { WebView } from 'react-native-webview';
import getMapHTML from '../utils/mapHTML';
const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;
    const webViewRef = useRef(null);

    console.log('CreateRide component rendered with token:', token);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [rideName, setRideName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [riderType, setRiderType] = useState('');
    const [distance, setDistance] = useState('');
    const [startingPoint, setStartingPoint] = useState('');
    const [endingPoint, setEndingPoint] = useState('');
    const [latitude, setLatitude] = useState('7.0731'); // Default to Davao
    const [longitude, setLongitude] = useState('125.6128');
    const [participants, setParticipants] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapRegion, setMapRegion] = useState({
        latitude: 7.0731,
        longitude: 125.6128,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    const updateMapLocation = () => {
        const lat = parseFloat(latitude) || 7.0731;
        const lon = parseFloat(longitude) || 125.6128;
        webViewRef.current?.injectJavaScript(`
            map.setView([${lat}, ${lon}], 15);
            marker.setLatLng([${lat}, ${lon}]);
        `);
    }
    useEffect(() => {
        if (webViewRef.current) {
            updateMapLocation();
        }
    }, [latitude, longitude]);


    const handleWebViewMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapClick') {
            setLatitude(data.lat.toString());
            setLongitude(data.lng.toString());

            // Show coordinates immediately
            console.log(`Selected location: ${data.lat}, ${data.lng}`);

            // Set a temporary loading state for location name
            setLocationName('Fetching location name...');

            // Try to get location name from coordinates
            fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                `lat=${data.lat}&lon=${data.lng}&format=json&addressdetails=1`,
                {
                    headers: { 'User-Agent': 'RidersHub/1.0' }
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data && data.display_name) {
                        const name = data.address?.suburb ||
                            data.address?.village ||
                            data.address?.town ||
                            data.address?.city ||
                            data.display_name.split(',')[0];

                        setLocationName(name);
                        setSearchQuery(data.display_name);

                        // You could also automatically populate starting/ending point if they're empty
                        if (!startingPoint.trim()) {
                            setStartingPoint(name);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error reverse geocoding:', error);
                    setLocationName('Location name unavailable');
                });
        }
    };

    const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            const map = L.map('map').setView([${parseFloat(latitude) || 7.0731}, ${parseFloat(longitude) || 125.6128}], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const marker = L.marker([${parseFloat(latitude) || 7.0731}, ${parseFloat(longitude) || 125.6128}]).addTo(map);

            map.on('click', function(e) {
                marker.setLatLng(e.latlng);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapClick',
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                }));
            });
        </script>
    </body>
    </html>
    `;

    const searchLocation = async (query) => {
        if (!query.trim() || query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(query)}&` +
                `countrycodes=ph&` +
                `format=json&` +
                `limit=5&` +
                `addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'RidersHub/1.0'
                    }
                }
            );

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching location:', error);
            Alert.alert('Error', 'Failed to search locations');
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = (location) => {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setLocationName(location.display_name.split(',')[0]);
        setSearchQuery(location.display_name);
        setSearchResults([]);

        setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    // Handle map press to select location
    const handleMapPress = async (e) => {
        const { latitude: lat, longitude: lon } = e.nativeEvent.coordinate;

        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setMapRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });

        // Try to get location name from coordinates
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?` +
                `lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
                {
                    headers: {
                        'User-Agent': 'RidersHub/1.0'
                    }
                }
            );

            const data = await response.json();
            if (data && data.display_name) {
                const name = data.address?.suburb ||
                    data.address?.village ||
                    data.address?.town ||
                    data.address?.city ||
                    data.display_name.split(',')[0];

                setLocationName(name);
                setSearchQuery(data.display_name);
            }
        } catch (error) {
            console.error('Error reverse geocoding:', error);
        }
    };

    // Debounce search
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            searchLocation(searchQuery);
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchQuery]);

    const fetchAllRiders = async () => {
        try {
            const response = await fetch('http://192.168.1.51:8080/riders/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const riders = await response.json();
                Alert.alert(
                    'Available Riders',
                    riders.map(rider => rider.username).join(', '),
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Error', 'Failed to fetch riders');
            }
        } catch (err) {
            Alert.alert('Error', 'Network error occurred');
        }
    };

    const handleCreateRide = async () => {
        try {
            // Validate required fields
            if (!rideName.trim()) {
                setError('Ride name is required');
                return;
            }
            if (!startingPoint.trim()) {
                setError('Starting point is required');
                return;
            }
            if (!endingPoint.trim()) {
                setError('Ending point is required');
                return;
            }
            if (!distance || isNaN(parseFloat(distance))) {
                setError('Please enter a valid distance');
                return;
            }

            setLoading(true);
            setError('');

            // Parse participants as an array if provided
            const participantsArray = participants ? participants.split(',').map(p => p.trim()) : [];

            const rideData = {
                ridesName: rideName,
                locationName: locationName,
                riderType: riderType || 'car',
                distance: parseFloat(distance),
                startingPoint: startingPoint,
                date: date.toISOString(),
                latitude: parseFloat(latitude) || 0,
                longitude: parseFloat(longitude) || 0,
                endingPoint: endingPoint,
                participants: participantsArray,
                description: description
            };

            const response = await fetch('http://192.168.1.51:8080/riders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(rideData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create ride');
            }

            Alert.alert(
                'Success',
                'Ride created successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('RiderPage', { token, username }) }]
            );
        } catch (err) {
            setError(err.message || 'An error occurred');
            Alert.alert('Error', err.message || 'Failed to create ride');
        } finally {
            setLoading(false);
        }
    };

return (
    <ScrollView contentContainerStyle={utilities.container}>
        <Text style={utilities.title}>Create New Ride</Text>

        {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

        <Text style={utilities.label}>Ride Name</Text>
        <TextInput
            style={utilities.input}
            value={rideName}
            onChangeText={setRideName}
            placeholder="Enter ride name"
        />


        <Text style={utilities.label}>Location Search*</Text>
        <TextInput
            style={utilities.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for a location"
        />

        {isSearching && (
            <Text style={utilities.searchingText}>Searching...</Text>
        )}

        {searchResults.length > 0 && (
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.place_id.toString()}
                style={utilities.searchResultsList}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={utilities.searchResultItem}
                        onPress={() => handleLocationSelect(item)}
                    >
                        <Text style={utilities.searchResultName}>
                            {item.display_name.split(',')[0]}
                        </Text>
                        <Text style={utilities.searchResultAddress}>
                            {item.display_name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        )}

        {/* Map View */}
        <View style={utilities.mapContainer}>
            <Text style={utilities.mapInstructions}>
                Tap on the map to select a location
            </Text>
            <WebView
                ref={webViewRef}
                source={{ html: getMapHTML(latitude, longitude) }}
                style={utilities.map}
                onMessage={handleWebViewMessage}
                javaScriptEnabled={true}
            />
        </View>

        <Text style={utilities.label}>Selected Location</Text>
        <TextInput
            style={utilities.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Location name will appear here"
            editable={false}
        />


        <Text style={utilities.label}>Coordinates</Text>
        <View style={utilities.coordinatesContainer}>
            <TextInput
                style={[utilities.input, {width: '48%'}]}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                keyboardType="numeric"
            />
            <TextInput
                style={[utilities.input, {width: '48%'}]}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                keyboardType="numeric"
            />
        </View>


        <Text style={utilities.label}>Rider Type</Text>
        <View>
            <Picker
                selectedValue={riderType}
                onValueChange={(itemValue) => setRiderType(itemValue)}
            >
                <Picker.Item label="car" value="car" />
                <Picker.Item label="Motorcycle" value="MOTORCYCLE" />
            </Picker>
        </View>

        <Text style={utilities.label}>Distance (m)</Text>
        <TextInput
            style={utilities.input}
            value={distance}
            onChangeText={setDistance}
            placeholder="Enter distance in meters"
            keyboardType="numeric"
        />

        <Text style={utilities.label}>Starting Point</Text>
        <TextInput
            style={utilities.input}
            value={startingPoint}
            onChangeText={setStartingPoint}
            placeholder="Enter starting point"
        />

        <Text style={utilities.label}>Ending Point</Text>
        <TextInput
            style={utilities.input}
            value={endingPoint}
            onChangeText={setEndingPoint}
            placeholder="Enter ending point"
        />



        <Text style={utilities.label}>Participants</Text>
        <View>
            <TextInput
                style={utilities.input}
                value={participants}
                onChangeText={setParticipants}
                placeholder="Enter rider usernames (comma separated)"
            />
            <TouchableOpacity
                style={[utilities.button, {marginTop: 5}]}
                onPress={fetchAllRiders}
            >
                <Text style={[utilities.buttonText, {fontSize: 14}]}>View Available Riders</Text>
            </TouchableOpacity>
        </View>

        <Text style={utilities.label}>Description</Text>
        <TextInput
            style={[utilities.input, {height: 100, textAlignVertical: 'top'}]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter ride description"
            multiline
        />

        <TouchableOpacity
            style={[utilities.button, utilities.button]}
            onPress={handleCreateRide}
            disabled={loading}
        >
            <Text style={utilities.buttonText}>
                {loading ? 'Creating...' : 'Create Ride'}
            </Text>
        </TouchableOpacity>
    </ScrollView>
);
};



export default CreateRide;