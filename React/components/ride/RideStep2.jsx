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
import rideStepsUtilities from '../../styles/rideStepsUtilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from "../../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const RideStep2 = ({
                       isSearching, searchResults, searchQuery, setSearchQuery,
                       handleLocationSelect, webViewRef, latitude, longitude,
                       handleMessage, locationName,
                       prevStep, nextStep, handleSearchInputChange, token,
                   }) => {

    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mapDarkMode, setMapDarkMode] = useState(false);

    const onWebViewMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'themeChange') {
            setMapDarkMode(data.isDarkTheme);
        } else {
            handleMessage(event);
        }
    };

    return (
        <View style={rideStepsUtilities.containerWhite}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Full-screen Map */}
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

            {/* Modern Floating Navbar */}
            <View style={rideStepsUtilities.navbarContainerPrimary}>

                <TouchableOpacity
                    style={rideStepsUtilities.navButton}
                    onPress={prevStep}
                >
                    <FontAwesome name="arrow-left" size={16} color="#5f6368" style={{ marginRight: 6 }} />
                    <Text style={rideStepsUtilities.buttonTextDark}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[rideStepsUtilities.navButton, rideStepsUtilities.nextButton]}
                    onPress={nextStep}
                >
                    <Text style={rideStepsUtilities.buttonText}>Next</Text>
                    <FontAwesome name="arrow-right" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
            </View>

            {/* Modern Search Card */}
            <View style={rideStepsUtilities.searchContainer}>
                <View style={[
                    rideStepsUtilities.searchInputContainer,
                    isSearchFocused && rideStepsUtilities.searchInputFocused
                ]}>
                    <FontAwesome name="search" size={16} color="#5f6368" style={{ marginRight: 12 }} />
                    <TextInput
                        style={rideStepsUtilities.inputLocationName}
                        value={searchQuery}
                        onChangeText={handleSearchInputChange}
                        placeholder="Where do you want to ride?"
                        placeholderTextColor="#9aa0a6"
                        returnKeyType="search"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        onSubmitEditing={() => handleSearchInputChange(searchQuery)}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearchQuery('')}
                            style={{ padding: 4, marginRight: 8 }}
                        >
                            <FontAwesome name="times-circle" size={16} color="#9aa0a6" />
                        </TouchableOpacity>
                    )}
                </View>

                {isSearching && (
                    <View style={[rideStepsUtilities.loadingContainer, { marginTop: 16 }]}>
                        <ActivityIndicator size="small" color="#8c2323" />
                        <Text style={rideStepsUtilities.loadingText}>Finding locations...</Text>
                    </View>
                )}

                {searchResults.length > 0 && (
                    <ScrollView
                        style={rideStepsUtilities.searchResultsList}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    >
                        {searchResults.map((item, index) => (
                            <TouchableOpacity
                                key={item.place_id.toString()}
                                style={[
                                    rideStepsUtilities.resultItem,
                                    index === searchResults.length - 1 && rideStepsUtilities.resultItemLast
                                ]}
                                onPress={() => { handleLocationSelect(item) }}
                            >
                                <View style={rideStepsUtilities.resultIconContainer}>
                                    <FontAwesome name="map-marker" size={16} color="#8c2323" />
                                </View>
                                <View style={rideStepsUtilities.resultTextContainer}>
                                    <Text style={rideStepsUtilities.searchResultName}>
                                        {item.display_name.split(',')[0]}
                                    </Text>
                                    <Text style={rideStepsUtilities.searchResultAddress}>
                                        {item.display_name}
                                    </Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <FontAwesome name="chevron-right" size={14} color="#dadce0" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>


            {/* Selected Location Card */}
            {locationName && locationName.trim() && (
                <View style={rideStepsUtilities.locationInfoCard}>

                    <Text style={rideStepsUtilities.locationName}>{locationName}</Text>
                    <TouchableOpacity
                        style={[rideStepsUtilities.button, rideStepsUtilities.primaryButton, { marginTop: 16 }]}
                        onPress={nextStep}
                    >
                        <Text style={rideStepsUtilities.buttonText}>Confirm Location</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default RideStep2;