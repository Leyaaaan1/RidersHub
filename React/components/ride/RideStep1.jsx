// React/components/ride/RideStep1.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const RideStep1 = ({
                       error, rideName, setRideName, riderType, setRiderType, distance, setDistance,
                       participants, setParticipants, handleFetchAllRiders,
                       description, setDescription, nextStep
                   }) => {
    return (
        <View>
            <Text style={utilities.title}>Step 1: Ride Details</Text>

            {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

            <Text style={utilities.label}>Ride Name</Text>
            <TextInput
                style={utilities.input}
                value={rideName}
                onChangeText={setRideName}
                placeholder="Enter ride name"
                placeholderTextColor="#999"
            />

            <Text style={utilities.label}>Rider Type</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10}}>
                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'car' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('car')}
                >
                    <FontAwesome name="car" size={24} color={riderType === 'car' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'car' ? '#fff' : '#333'}}>Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'motor' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('motor')}
                >
                    <FontAwesome name="motorcycle" size={24} color={riderType === 'motor' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'motor' ? '#fff' : '#333'}}>Motorcycle</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'bike' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('bike')}
                >
                    <FontAwesome name="bicycle" size={24} color={riderType === 'bike' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'bike' ? '#fff' : '#333'}}>Bike</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'cafe Racers' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('cafe Racers')}
                >
                    <FontAwesome name="rocket" size={24} color={riderType === 'cafe Racers' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'cafe Racers' ? '#fff' : '#333'}}>Cafe Racers</Text>
                </TouchableOpacity>
            </View>

            <Text style={utilities.label}>Distance (m)</Text>
            <TextInput
                style={utilities.input}
                value={distance}
                onChangeText={setDistance}
                placeholder="Enter distance in meters"
                keyboardType="numeric"
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
                    onPress={handleFetchAllRiders}
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
                onPress={nextStep}
                disabled={!rideName.trim()}
            >
                <Text style={utilities.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RideStep1;