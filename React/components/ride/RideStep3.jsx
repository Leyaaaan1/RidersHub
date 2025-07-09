import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { reverseGeocodeLandmark } from '../../services/rideService';
import ProgressBar from './ProgressBar';
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

    const onWebViewMessage = (event) => {
        if (mapMode === 'stop' && isAddingStop) handleStopMapMessage(event);
        else handleMessage(event);
    };

return (

        <View style={[utilities.containerWhite, { position: 'relative' }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Map */}
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
                                    (currentStop ? currentStop.lng : startingLongitude)
                        ) }}
                    style={{ flex: 1 }}
                    onMessage={onWebViewMessage}
                    javaScriptEnabled={true}
                />
            </View>

            {/* Navbar */}
            <View style={[utilities.navbarContainerPrimary, {
                backgroundColor: 'rgba(0, 0, 0, 0.7)', marginTop: 20, top: 0
            }]}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                    onPress={prevStep}
                >
                    <FontAwesome name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={utilities.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[utilities.button, { backgroundColor: colors.primary, marginLeft: 8 }]}
                    onPress={handleCreateRide}
                    disabled={!startingPoint || !endingPoint || loading}
                >
                    <Text style={utilities.buttonText}>{loading ? 'Creating...' : 'Create & Review'}</Text>
                </TouchableOpacity>

            </View>

            {/* Search Box */}
            <View style={{
                position: 'absolute', top: 150, left: 20, right: 20,
                backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 15, elevation: 5, zIndex: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[utilities.inputLocationName, { flex: 1 }]}
                        value={searchQuery}
                        onChangeText={handleSearchInputChange}
                        placeholder={`Search for a ${mapMode === 'starting' ? 'starting' : mapMode === 'ending' ? 'ending' : 'stop'} location`}
                        placeholderTextColor="#fff"
                        color="#fff"
                        returnKeyType="search"
                        onSubmitEditing={() => handleSearchInputChange(searchQuery)}
                        editable={mapMode !== 'stop' || !isAddingStop}
                    />
                    <TouchableOpacity
                        onPress={() => handleSearchInputChange(searchQuery)}
                        style={{
                            marginLeft: 8, backgroundColor: colors.primary, padding: 8, borderRadius: 6,
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        disabled={mapMode === 'stop' && isAddingStop}
                    >
                        <FontAwesome name="search" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
                {isSearching && <Text style={utilities.searchingText}>Searching...</Text>}
                {searchResults && searchResults.length > 0 && (
                    <ScrollView
                        style={[utilities.searchResultsList, { maxHeight: 200, backgroundColor: 'white' }]}
                        nestedScrollEnabled={true}
                    >
                        {searchResults.map((item) => (
                            <TouchableOpacity
                                key={item.place_id.toString()}
                                style={utilities.resultItem}
                                onPress={() => handleSelectLocationAndUpdateMap(item)}
                                disabled={mapMode === 'stop' && isAddingStop}
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

            {/* Map Instructions */}
            <Text style={[utilities.mapInstructions, {
                top: 95, left: 20, right: 20, backgroundColor: colors.primary, padding: 12, borderRadius: 8
            }]}>
                {mapMode === 'starting'
                    ? 'Tap on the map to select starting point'
                    : mapMode === 'ending'
                        ? 'Tap on the map to select ending point'
                        : 'Tap on the map to select a stop point'}
            </Text>

            {/* Progress Bar */}
            <View style={{ position: 'absolute', bottom: 200, left: 20, right: 20 }}>
                <ProgressBar
                    showProgressBar={showProgressBar}
                    setShowProgressBar={setShowProgressBar}
                    startingPoint={startingPoint}
                    endingPoint={endingPoint}
                    stopPoints={stopPoints}
                    isAddingStop={isAddingStop}
                    currentStop={currentStop}
                />
            </View>

            {/* Stop Point Controls */}
            {mapMode === 'stop' && (
                <View style={{ position: 'absolute', bottom: 150, left: 20, right: 20 }}>
                    {!isAddingStop && (
                        <TouchableOpacity
                            style={[utilities.button, { backgroundColor: '#2196F3', marginTop: 8 }]}
                            onPress={startAddStopPoint}
                            disabled={mapMode === 'starting' || mapMode === 'ending'}
                        >
                            <Text style={utilities.buttonText}>Add Stop Point</Text>
                        </TouchableOpacity>
                    )}
                    {isAddingStop && (
                        <TouchableOpacity
                            style={[utilities.button, { backgroundColor: '#4CAF50', marginTop: 8 }]}
                            onPress={confirmStopPoint}
                            disabled={!currentStop || addingStopLoading}
                        >
                            <Text style={utilities.buttonText}>
                                {addingStopLoading ? 'Resolving...' : 'Confirm Stop Point'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Finalize selection button */}
            <View style={{
                position: 'absolute', bottom: 100, left: 20, right: 20,
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}>
                {(mapMode === 'starting' || mapMode === 'ending') && (
                    <TouchableOpacity
                        style={[utilities.button, { backgroundColor: colors.primary }]}
                        onPress={finalizePointSelection}
                        disabled={(mapMode === 'starting' && !startingPoint) || (mapMode === 'ending' && !endingPoint)}
                    >
                        <Text style={utilities.buttonText}>
                            {mapMode === 'starting'
                                ? 'Confirm Starting Point'
                                : 'Confirm Ending Point'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Create ride button at bottom */}
            <View style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
            }}>
                <TouchableOpacity
                    style={[utilities.button, { backgroundColor: '#4CAF50' }]}
                    onPress={handleCreateRide}
                    disabled={!startingPoint || !endingPoint || loading}
                >
                    <Text style={utilities.buttonText}>{loading ? 'Creating...' : 'Create & Review'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep3;