// React/components/ride/RideStep1.jsx
import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import utilities from '../../styles/utilities';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import colors from "../../styles/colors";
const RideStep1 = ({
                       error, rideName, setRideName, riderType, setRiderType, distance, setDistance,
                       participants, setParticipants, description, riderSearchQuery, setRiderSearchQuery,
                       searchedRiders, isRiderSearching, handleSearchRiders, setDescription, nextStep
                   }) => {

    return (
        <View style={utilities.container}>
            <Text style={utilities.title}>RIDE DETAILS</Text>

            {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

            <TextInput
                style={utilities.inputCenter}
                value={rideName}
                onChangeText={setRideName}
                placeholder="Enter ride name"
                placeholderTextColor="#6f1c1c"
            />

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
                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'cafe Racers' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('cafe Racers')}
                >
                    <FontAwesome name="rocket" size={24} color={riderType === 'cafe Racers' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'cafe Racers' ? '#fff' : '#333'}}>Cafe Racers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[utilities.riderTypeOption, riderType === 'cafe Racers' && utilities.selectedRiderType]}
                    onPress={() => setRiderType('cafe Racers')}
                >
                    <FontAwesome name="rocket" size={24} color={riderType === 'cafe Racers' ? '#fff' : '#333'} />
                    <Text style={{marginTop: 5, color: riderType === 'cafe Racers' ? '#fff' : '#333'}}>Cafe Racers</Text>
                </TouchableOpacity>
            </View>

            <Text style={utilities.label}>Distance (km)</Text>
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
                    value={riderSearchQuery}
                    onChangeText={(text) => {
                        setRiderSearchQuery(text);
                        handleSearchRiders(text);
                    }}
                    placeholder="Search for riders"
                />

                {isRiderSearching && (
                    <ActivityIndicator size="small" color={colors.primary} style={{marginVertical: 10}} />
                )}

                {/* Search results */}
                {searchedRiders.length > 0 && riderSearchQuery.trim() !== '' && (
                    <View style={utilities.searchResultsList}>
                        {searchedRiders.map(item => (
                            <TouchableOpacity
                                key={item.id.toString()}
                                style={utilities.searchResultItem}
                                onPress={() => {
                                    try {
                                        const participantsList = participants ? participants.split(',').map(p => p.trim()) : [];
                                        if (!participantsList.includes(item.username)) {
                                            setParticipants(participants ?
                                                `${participants}, ${item.username}` :
                                                item.username);
                                        }
                                        setRiderSearchQuery('');
                                        handleSearchRiders(''); // Clear search results when a rider is selected
                                    } catch (error) {
                                        console.error('Error selecting participant:', error);
                                    }
                                }}
                            >
                                <Text style={utilities.searchResultName}>{item.username}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {/* Selected participants */}
                {participants && (
                    <View style={{marginTop: 10}}>
                        <Text style={utilities.label}>Selected Participants:</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
                            {participants.split(',').map((participant, index) => (
                                participant.trim() && (
                                    <View key={index} style={{
                                        backgroundColor: colors.primary,
                                        borderRadius: 15,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        margin: 3,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{color: '#fff', marginRight: 5}}>{participant.trim()}</Text>
                                        <TouchableOpacity onPress={() => {
                                            const updated = participants.split(',')
                                                .filter(p => p.trim() !== participant.trim())
                                                .join(', ');
                                            setParticipants(updated);
                                        }}>
                                            <FontAwesome name="times-circle" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            ))}
                        </View>
                    </View>
                )}
            </View>


            <Text style={utilities.label}>Description</Text>
            <TextInput
                style={[utilities.input, {
                    height: 200,
                    textAlignVertical: 'top',
                    fontSize: 16,
                    paddingHorizontal: 15,
                    paddingVertical: 12
                }]}                value={description}
                onChangeText={setDescription}
                placeholder="Enter ride description"
                multiline
            />


            <View style={[utilities.bottomAreaContainerLeft, {
            }]}>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={nextStep}
                    disabled={!rideName.trim()}
                >
                    <Text style={utilities.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep1;