import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import rideStepsUtilities from '../../styles/rideStepsUtilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { reverseGeocodeLandmark } from '../../services/rideService';

const RideStep3 = ({
                       mapMode, setMapMode, isSearching, searchResults,
                       handleLocationSelect, webViewRef,
                       startingLatitude, startingLongitude, endingLatitude, endingLongitude,
                       handleMessage, startingPoint, setStartingPoint,
                       endingPoint, setEndingPoint, prevStep, loading, nextStep,
                       handleCreateRide, handleSearchInputChange, searchQuery,
                       stopPoints, setStopPoints, token
                   }) => {
    const [currentStop, setCurrentStop] = useState(null);
    const [isAddingStop, setIsAddingStop] = useState(false);
    const [addingStopLoading, setAddingStopLoading] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [mapDarkMode, setMapDarkMode] = useState(false);

    const startAddStopPoint = () => {
        setMapMode('stop');
        setIsAddingStop(true);
        setCurrentStop(null);
    };

    const handleStopMapMessage = async (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'mapClick') {
            setCurrentStop({
                lat: data.lat,
                lng: data.lng,
                name: 'Fetching location name...'
            });
            setAddingStopLoading(true);
            const stopName = await reverseGeocodeLandmark(token, data.lat, data.lng);
            setCurrentStop({
                lat: data.lat,
                lng: data.lng,
                name: stopName || `${data.lat}, ${data.lng}`
            });
            setAddingStopLoading(false);
        }
    };

    const confirmStopPoint = () => {
        if (!currentStop) return;
        setStopPoints(prev => [
            ...prev,
            { lat: currentStop.lat, lng: currentStop.lng, name: currentStop.name }
        ]);
        setIsAddingStop(false);
        setCurrentStop(null);
        setMapMode('ending');
    };

    const handleSelectLocationAndUpdateMap = async (item) => {
        await handleLocationSelect(item);
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
                map.setView([${lat}, ${lon}], 15);
                marker.setLatLng([${lat}, ${lon}]);
                true;
            `);
        }
    };

    const finalizePointSelection = () => {
        if (mapMode === 'starting' && startingPoint) setMapMode('ending');
        else if (mapMode === 'ending' && endingPoint) setMapMode('stop');
    };

    // Simplified onWebViewMessage function without route drawing logic
    const onWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data.type, data);

            switch (data.type) {
                case 'mapReady':
                    console.log('Map is ready, dark mode:', data.isDarkTheme);
                    setMapDarkMode(data.isDarkTheme);
                    break;

                case 'mapError':
                    console.error('Map initialization error:', data.error);
                    break;

                case 'messageError':
                    console.error('Message handling error:', data.error);
                    break;

                case 'themeChange':
                    setMapDarkMode(data.isDarkTheme);
                    break;

                default:
                    // Handle other message types (stop points, map clicks, etc.)
                    if (mapMode === 'stop' && isAddingStop) {
                        handleStopMapMessage(event);
                    } else {
                        handleMessage(event);
                    }

                    // Preserve theme state if it's included in the message
                    if (data.isDarkTheme !== undefined) {
                        setMapDarkMode(data.isDarkTheme);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
            console.error('Raw message data:', event.nativeEvent.data);
        }
    };

    const getPlaceholderText = () => {
        switch (mapMode) {
            case 'starting':
                return 'Search for starting point';
            case 'ending':
                return 'Search for destination';
            case 'stop':
                return 'Search for stop point';
            default:
                return 'Search location';
        }
    };

    const removeStopPoint = (index) => {
        setStopPoints(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <View style={rideStepsUtilities.containerWhite}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Full-screen Map */}
            <View style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0, height: '100%'
            }}>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(
                            mapMode === 'starting' ? startingLatitude :
                                mapMode === 'ending' ? endingLatitude :
                                    (currentStop ? currentStop.lat : startingLatitude),
                            mapMode === 'starting' ? startingLongitude :
                                mapMode === 'ending' ? endingLongitude :
                                    (currentStop ? currentStop.lng : startingLongitude),
                            mapDarkMode
                        ) }}
                    style={{ flex: 1 }}
                    onMessage={onWebViewMessage}
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
                    style={[rideStepsUtilities.button, rideStepsUtilities.primaryButton,
                        (!startingPoint || !endingPoint || loading) && rideStepsUtilities.disabledButton]}
                    onPress={handleCreateRide}
                    disabled={!startingPoint || !endingPoint || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={rideStepsUtilities.buttonText}>Create</Text>
                    )}
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
                        placeholder={getPlaceholderText()}
                        placeholderTextColor="#9aa0a6"
                        returnKeyType="search"
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        onSubmitEditing={() => handleSearchInputChange(searchQuery)}
                        editable={mapMode !== 'stop' || !isAddingStop}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => handleSearchInputChange('')}
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

                {searchResults && searchResults.length > 0 && (
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
                                onPress={() => handleSelectLocationAndUpdateMap(item)}
                                disabled={mapMode === 'stop' && isAddingStop}
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

            <View style={{
                position: 'absolute',
                top: 120,
                right: 10,
                zIndex: 20
            }}>
                <TouchableOpacity
                    style={{
                        paddingVertical: 6,
                        paddingHorizontal: 12,
                        backgroundColor: '#f1f3f4',
                        borderRadius: 16,
                        top: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        elevation: 4
                    }}
                    onPress={() => setShowProgressBar(prev => !prev)}
                >
                    <FontAwesome
                        name={showProgressBar ? 'eye-slash' : 'eye'}
                        size={16}
                        color="#5f6368"
                        style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: '#5f6368' }}>
                        {showProgressBar ? 'Hide Details' : 'Show Details'}
                    </Text>
                </TouchableOpacity>
            </View>

            {showProgressBar && (
                <View style={rideStepsUtilities.progressContainer}>
                    {/* Top Row: Starting and Ending Points in Two Columns */}
                    <View style={rideStepsUtilities.topRowContainer}>
                        {/* Starting Point Card */}
                        {startingPoint && (
                            <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.halfWidthCard]}>
                                <View style={rideStepsUtilities.cardHeader}>
                                    <View style={rideStepsUtilities.headerLeft}>
                                        <Text style={rideStepsUtilities.cardTitle}>Starting Point</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            rideStepsUtilities.changeButton,
                                            mapMode === 'starting' && { borderWidth: 2}
                                        ]}
                                        onPress={() => setMapMode('starting')}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={rideStepsUtilities.changeButtonText}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={rideStepsUtilities.locationText} numberOfLines={2}>
                                    {startingPoint}
                                </Text>
                            </View>
                        )}

                        {/* Destination Card */}
                        {endingPoint && (
                            <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.halfWidthCard]}>
                                <View style={rideStepsUtilities.cardHeader}>
                                    <View style={rideStepsUtilities.headerLeft}>
                                        <Text style={rideStepsUtilities.cardTitle}>Ending Point</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[
                                            rideStepsUtilities.changeButton,
                                            mapMode === 'ending' && { borderWidth: 2}
                                        ]}
                                        onPress={() => setMapMode('ending')}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={rideStepsUtilities.changeButtonText}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={rideStepsUtilities.locationText} numberOfLines={2}>
                                    {endingPoint}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Bottom Row: Stop Points Full Width */}
                    {stopPoints.length > 0 && (
                        <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.fullWidthCard]}>
                            <View style={rideStepsUtilities.cardHeader}>
                                <View style={rideStepsUtilities.headerLeft}>
                                    <Text style={rideStepsUtilities.cardTitle}>
                                        Stop Points
                                    </Text>
                                </View>
                                <View style={rideStepsUtilities.stopCounter}>
                                    <Text style={rideStepsUtilities.stopCounterText}>
                                        {stopPoints.length}
                                    </Text>
                                </View>
                            </View>
                            <ScrollView
                                style={rideStepsUtilities.stopScrollView}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={rideStepsUtilities.stopScrollContent}
                            >
                                {stopPoints.map((stop, index) => (
                                    <View key={index} style={rideStepsUtilities.stopItem}>
                                        <View style={rideStepsUtilities.stopNumber}>
                                            <Text style={rideStepsUtilities.stopNumberText}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <Text style={rideStepsUtilities.stopName} numberOfLines={1}>
                                            {stop.name}
                                        </Text>
                                        <TouchableOpacity
                                            style={{ marginLeft: 8, padding: 4 }}
                                            onPress={() => removeStopPoint(index)}
                                        >
                                            <FontAwesome name="times" size={12} color="#999" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}

            {/* Action Buttons Container */}
            <View style={rideStepsUtilities.actionButtonsContainer}>
                {mapMode === 'stop' && !isAddingStop && (
                    <TouchableOpacity
                        style={[rideStepsUtilities.button, rideStepsUtilities.secondaryButton]}
                        onPress={startAddStopPoint}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="plus" size={14} color="#ffffff" />
                            <Text style={rideStepsUtilities.buttonText}> Add Stop Point</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {mapMode === 'stop' && isAddingStop && currentStop && (
                    <TouchableOpacity
                        style={[rideStepsUtilities.button, rideStepsUtilities.successButton]}
                        onPress={confirmStopPoint}
                        disabled={addingStopLoading}
                    >
                        {addingStopLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome name="check" size={14} color="#ffffff" />
                                <Text style={rideStepsUtilities.buttonText}> Confirm Stop Point</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Main Action Container */}
            <View style={rideStepsUtilities.mainActionContainer}>
                {((mapMode === 'starting' && startingPoint) ||
                    (mapMode === 'ending' && endingPoint)) && (
                    <TouchableOpacity
                        style={[rideStepsUtilities.button, rideStepsUtilities.primaryButton]}
                        onPress={finalizePointSelection}
                    >
                        <Text style={rideStepsUtilities.buttonText}>
                            {mapMode === 'starting' ? 'Continue to Destination' : 'Continue to Stop Points'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default RideStep3;