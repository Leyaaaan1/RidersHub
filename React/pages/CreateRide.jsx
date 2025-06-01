
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import utilities from '../styles/utilities';
import {Picker} from "@react-native-picker/picker";

const CreateRide = ({ route, navigation }) => {
    const { token, username } = route.params;

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
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [participants, setParticipants] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());

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
                riderType: riderType || 'car', // Default to ROAD_BIKE if not specified
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
                [{ text: 'OK', onPress: () => navigation.navigate('RiderPage', { token }) }]
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

        <Text style={utilities.label}>Location</Text>
        <TextInput
            style={utilities.input}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Enter location name"
        />

        <Text style={utilities.label}>Rider Type</Text>
        <View>
            <Picker
                selectedValue={riderType}
                onValueChange={(itemValue) => setRiderType(itemValue)}
            >
                <Picker.Item label="Car" value="CAR" />
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

        <Text style={utilities.label}>Coordinates</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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

        <Text style={utilities.label}>Participants</Text>
        <View>
            {/* Dropdown or selection component would be better here */}
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
            style={utilities.button}
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