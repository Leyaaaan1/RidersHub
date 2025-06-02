// React/components/ride/RideStep1.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';

const RideStep1 = ({
                       error, rideName, setRideName, isSearching, searchResults,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName, setLocationName, nextStep
                   }) => {
    return (
        <View>

            {error ? <Text style={{color: 'red', marginBottom: 10}}>{error}</Text> : null}

            <TextInput
                style={utilities.input}
                value={rideName}
                onChangeText={setRideName}
                placeholder="Enter ride name"
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

            <TouchableOpacity
                style={utilities.button}
                onPress={nextStep}
                disabled={!rideName.trim() || !locationName.trim()}
            >
                <Text style={utilities.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RideStep1;