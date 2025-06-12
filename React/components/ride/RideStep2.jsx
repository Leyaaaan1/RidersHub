// React/components/ride/RideStep2.jsx
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Image,
    StatusBar
} from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from "../../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const RideStep2 = ({
                       isSearching, searchResults, searchQuery, setSearchQuery,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName,
                       prevStep, nextStep,
                   }) => {





    return (
        <View style={[utilities.containerWhite, { position: 'relative' }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Full-screen map that extends behind everything */}
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: '100%'
            }}>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(latitude, longitude) }}
                    style={{ flex: 1 }}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                />
            </View>

            {/* Navbar positioned below status bar */}
            <View style={[utilities.navbarContainerPrimary, {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                marginTop: 20,
                top: 0
            }]}>
                <Text style={utilities.textWhite}>RIDE LOCATION</Text>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                    onPress={nextStep}
                >
                    <Text style={utilities.buttonText}>Next</Text>
                    <FontAwesome name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>

            {/* Search UI overlaid on map */}
            <View style={{
                position: 'absolute',
                top: 90,
                left: 20,
                right: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 10,
                padding: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }}>
                <TextInput
                    style={utilities.inputLocationName}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search for a location"
                    placeholderTextColor="#000"
                    color="#000"
                />

                {isSearching && (
                    <Text style={utilities.searchingText}>Searching...</Text>
                )}

                {searchResults.length > 0 && (
                    <ScrollView
                        style={[utilities.searchResultsList, {
                            maxHeight: 200,
                            backgroundColor: 'white'
                        }]}
                        nestedScrollEnabled={true}
                    >
                        {searchResults.map((item) => (
                            <TouchableOpacity
                                key={item.place_id.toString()}
                                style={utilities.resultItem}
                                onPress={() => { handleLocationSelect(item) }}
                            >
                                <Text style={[utilities.searchResultName, { color: '#333' }]}>
                                    {item.display_name.split(',')[0]}
                                </Text>
                                <Text style={[utilities.searchResultAddress, { color: '#666' }]}>
                                    {item.display_name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* Selected location info overlaid at bottom of map */}
            {locationName && locationName.trim() && (
                <View style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 10,
                    padding: 15
                }}>
                    <Text style={[utilities.label, { color: '#fff' }]}>Selected Location</Text>
                    <Text style={{ color: '#fff', marginTop: 5 }}>{locationName}</Text>
                </View>
            )}

            {/* Map instruction overlay */}
            <Text style={[utilities.mapInstructions, {
                top: 'auto',
                bottom: locationName ? 140 : 20,
                left: 20,
                right: 20,
                backgroundColor: colors.primary,
                padding: 12,
                borderRadius: 8
            }]}>
                Tap on the map to select the ride location
            </Text>
        </View>
    );
};

export default RideStep2;