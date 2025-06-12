// React/components/ride/RideStep3.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from '../../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RideStep3 = ({
                       mapMode, setMapMode, isSearching, searchResults,
                       handleLocationSelect, webViewRef,
                       startingLatitude, startingLongitude, endingLatitude, endingLongitude,
                       handleMessage, startingPoint, setStartingPoint,
                       endingPoint, setEndingPoint, prevStep, loading, nextStep,
                       handleCreateRide
                   }) => {
    // State for storing coordinates when map is tapped
    const [pendingCoordinates, setPendingCoordinates] = useState(null);

    // Custom message handler
    const handleMapMessageWithConfirmation = (event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'mapClick') {
            // Store coordinates without immediately processing them
            setPendingCoordinates({
                lat: data.lat,
                lng: data.lng
            });
        } else {
            // For other message types, process normally
            handleMessage(event);
        }
    };

    // Confirm button handler
    const confirmLocation = () => {
        if (pendingCoordinates) {
            // Create a synthetic event that mimics the map click event
            const syntheticEvent = {
                nativeEvent: {
                    data: JSON.stringify({
                        type: 'mapClick',
                        lat: pendingCoordinates.lat,
                        lng: pendingCoordinates.lng
                    })
                }
            };

            // Process the location with the normal handler
            handleMessage(syntheticEvent);

            // Automatically switch to ending point mode if we just set starting point
            if (mapMode === 'starting') {
                setMapMode('ending');
            }

            // Clear pending coordinates
            setPendingCoordinates(null);
        }
    };

    // Reset/cancel button handler
    const cancelLocation = () => {
        setPendingCoordinates(null);
    };

    return (
        <View style={utilities.container}>
            <View style={utilities.progressIndicator}>
                <View style={[
                    utilities.progressStep,
                    startingPoint ? {backgroundColor: '#4CAF50'} :
                        (mapMode === 'starting' ? {backgroundColor: colors.primary} : {backgroundColor: '#ccc'})
                ]}>
                    <Text style={utilities.progressText}>Starting Point</Text>
                    {startingPoint ? <Text style={utilities.smallText}>✓ Selected</Text> : null}
                </View>

                <View style={[utilities.progressConnector, startingPoint ? {backgroundColor: '#4CAF50'} : {backgroundColor: '#ccc'}]} />

                <View style={[
                    utilities.progressStep,
                    endingPoint ? {backgroundColor: '#4CAF50'} :
                        (mapMode === 'ending' ? {backgroundColor: colors.primary} : {backgroundColor: '#ccc'})
                ]}>
                    <Text style={utilities.progressText}>Ending Point</Text>
                    {endingPoint ? <Text style={utilities.smallText}>✓ Selected</Text> : null}
                </View>
            </View>

            {isSearching && (
                <Text style={utilities.searchingText}>Searching...</Text>
            )}

            {searchResults.length > 0 && (
                <View style={utilities.searchResultsList}>
                    {searchResults.map(item => (
                        <TouchableOpacity
                            key={item.place_id.toString()}
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
                    ))}
                </View>
            )}

            <View style={[utilities.mapContainer, {borderWidth: 2, borderColor: '#4CAF50', position: 'relative'}]}>
                {/* Map Instructions Banner */}
                <Text style={[
                    utilities.mapInstructions,
                    {backgroundColor: mapMode === 'starting' ? colors.primary : colors.primary}
                ]}>
                    <Text>
                        {mapMode === 'starting'
                            ? 'Tap on the map to select starting point'
                            : 'Tap on the map to select ending point'}
                    </Text>
                </Text>

                {/* Confirmation UI at top of map */}
                <View style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    right: 10,
                    zIndex: 999,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: 8,
                    padding: 10
                }}>
                    <Text style={{color: 'white', flex: 1, textAlign: 'center'}}>
                        {pendingCoordinates
                            ? `Confirm ${mapMode === 'starting' ? 'starting' : 'ending'} point?`
                            : `Select ${mapMode === 'starting' ? 'starting' : 'ending'} point`}
                    </Text>

                    <View style={{flexDirection: 'row'}}>
                        {pendingCoordinates && (
                            <>
                                <TouchableOpacity
                                    style={[utilities.smallButton, {backgroundColor: '#f44336', marginRight: 10}]}
                                    onPress={cancelLocation}
                                >
                                    <FontAwesome name="times" size={18} color="#fff" />
                                    <Text style={[utilities.buttonText, {marginLeft: 5, fontSize: 12}]}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[utilities.smallButton, {backgroundColor: '#4CAF50'}]}
                                    onPress={confirmLocation}
                                >
                                    <FontAwesome name="check" size={18} color="#fff" />
                                    <Text style={[utilities.buttonText, {marginLeft: 5, fontSize: 12}]}>Confirm</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(
                            mapMode === 'starting' ? startingLatitude : endingLatitude,
                            mapMode === 'starting' ? startingLongitude : endingLongitude
                        ) }}
                    style={[utilities.map, {borderWidth: 1, borderColor: '#4CAF50'}]}
                    onMessage={handleMapMessageWithConfirmation}
                    javaScriptEnabled={true}
                />
            </View>

            <Text style={utilities.label}>Starting Point</Text>
            <TextInput
                style={[utilities.input, mapMode === 'starting' ? utilities.activeInput : {}]}
                value={startingPoint}
                onChangeText={setStartingPoint}
                placeholder="Starting point will appear here"
                editable={true}
            />

            <Text style={utilities.label}>Ending Point</Text>
            <TextInput
                style={[utilities.input, mapMode === 'ending' ? utilities.activeInput : {}]}
                value={endingPoint}
                onChangeText={setEndingPoint}
                placeholder="Ending point will appear here"
                editable={true}
            />

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={prevStep}
                >
                    <Text style={utilities.buttonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[utilities.button, {backgroundColor: '#4CAF50'}]}
                    onPress={handleCreateRide}
                    disabled={!startingPoint || !endingPoint || loading}
                >
                    <Text style={utilities.buttonText}>{loading ? 'Creating Ride...' : 'Create & Review'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep3;