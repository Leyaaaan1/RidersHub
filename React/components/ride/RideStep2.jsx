// React/components/ride/RideStep2.jsx
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Image} from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from "../../styles/colors";


const RideStep2 = ({
                       isSearching, searchResults, searchQuery, setSearchQuery,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName, setLocationName, prevStep, nextStep, setMapboxImageUrl
                   }) => {

    const MAPBOX_TOKEN = "sample";
    useEffect(() => {
        if (latitude && longitude && locationName) {
            const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-marker+ff0000(${longitude},${latitude})/${longitude},${latitude},14/600x300?access_token=${MAPBOX_TOKEN}`;
            setMapboxImageUrl(url);
        }
    }, [latitude, longitude, locationName]);


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
                onChangeText={setSearchQuery}  // This will call handleSearchQueryChange
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
                            onPress={() => { handleLocationSelect(item) }}
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

            {locationName && locationName.trim() && (
                <>
                    <Text style={utilities.label}>Selected Location</Text>
                    <View style={[utilities.input, {paddingVertical: 14}]}>
                        <Text>{locationName}</Text>
                    </View>

                    {/* Mapbox Static Image Display */}
                    {/*{imageLoading ? (*/}
                    {/*    <View style={utilities.imageContainer}>*/}
                    {/*        <ActivityIndicator size="large" color={colors.primary} />*/}
                    {/*        <Text style={utilities.loadingText}>Loading map preview...</Text>*/}
                    {/*    </View>*/}
                    {/*) : mapboxImageUrl ? (*/}
                    {/*    <View style={utilities.imageContainer}>*/}
                    {/*        <Text style={utilities.label}>Location Preview</Text>*/}
                    {/*        <Image*/}
                    {/*            source={{ uri: mapboxImageUrl }}*/}
                    {/*            style={utilities.mapboxImage}*/}
                    {/*            resizeMode="cover"*/}
                    {/*            onError={(error) => console.log('Image load error:', error)}*/}
                    {/*        />*/}
                    {/*    </View>*/}
                    {/*) : null}*/}
                </>
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