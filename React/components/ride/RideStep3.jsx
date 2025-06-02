// React/components/ride/RideStep3.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const RideStep3 = ({
                       riderType, setRiderType, distance, setDistance,
                       participants, setParticipants, handleFetchAllRiders,
                       description, setDescription, prevStep, handleCreateRide, loading
                   }) => {
    return (
        <View>
            <Text style={utilities.title}>Step 3: Ride Details</Text>

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

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={prevStep}
                >
                    <Text style={utilities.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={utilities.button}
                    onPress={handleCreateRide}
                    disabled={loading}
                >
                    <Text style={utilities.buttonText}>
                        {loading ? 'Creating...' : 'Create Ride'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep3;