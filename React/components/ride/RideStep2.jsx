// React/components/ride/RideStep2.jsx
import React from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from "../../styles/colors";

const RideStep2 = ({
                       isSearching, searchResults, searchQuery, setSearchQuery,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName, setLocationName, prevStep, nextStep
                   }) => {
    return (
        <View style={utilities.container}>

            <Text style={utilities.title}>RIDE LOCATION</Text>
            {/*<TextInput*/}
            {/*    value={searchQuery}*/}
            {/*    onChangeText={setSearchQuery}*/}
            {/*    placeholder="Search for a location"*/}
            {/*    placeholderTextColor="#999"*/}
            {/*/>*/}

            <TextInput
                style={utilities.input}
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                }}
                placeholder="Search for a location"
                placeholderTextColor="#999"
            />

            {isSearching && (
                <Text style={utilities.searchingText}>Searching...</Text>
            )}

            {searchResults.length > 0 && (
                <ScrollView
                    style={utilities.searchResultsList}
                    nestedScrollEnabled={true}
                >
                    {searchResults.map((item) => (
                        <TouchableOpacity
                            key={item.place_id.toString()}
                            style={utilities.resultItem}
                            onPress={() => handleLocationSelect(item)}
                        >
                            <Text style={utilities.searchResultName}>
                                {item.display_name.split(',')[0]}
                            </Text>
                            <Text style={utilities.searchResultAddress}>
                                {item.display_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <View style={utilities.mapContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(latitude, longitude) }}
                    style={utilities.map}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                />
                <Text style={[utilities.mapInstructions, {backgroundColor: colors.primary}]}>
                    Tap on the map to select the ride location
                </Text>
            </View>

            <Text style={utilities.label}>Selected Location</Text>
            <TextInput
                style={utilities.input}
                value={locationName}
                onChangeText={setLocationName}
                placeholder="Location name will appear here"
                editable={false}
            />

            <View style={[utilities.bottomAreaContainerLeft, {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}]}>
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