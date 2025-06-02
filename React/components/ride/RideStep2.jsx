// React/components/ride/RideStep2.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';

const RideStep2 = ({
                       isSearching, searchResults, searchQuery, setSearchQuery,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName, setLocationName, prevStep, nextStep
                   }) => {
    return (
        <View>
            <Text style={utilities.title}>Step 2: Ride Location</Text>

            <Text style={utilities.label}>Search Location</Text>
            <TextInput
                style={utilities.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for a location"
                placeholderTextColor="#999"
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

            <View style={utilities.mapContainer}>
                <Text style={utilities.mapInstructions}>
                    Tap on the map to select the ride location
                </Text>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(latitude, longitude) }}
                    style={utilities.map}
                    onMessage={handleMessage}
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

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={prevStep}
                >
                    <Text style={utilities.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={utilities.button}
                    onPress={nextStep}
                    disabled={!locationName.trim()}
                >
                    <Text style={utilities.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep2;