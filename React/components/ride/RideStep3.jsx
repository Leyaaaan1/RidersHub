// React/components/ride/RideStep3.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
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
    const [pendingCoordinates, setPendingCoordinates] = useState(null);

    const handleMapMessageWithConfirmation = (event) => {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'mapClick') {
            setPendingCoordinates({
                lat: data.lat,
                lng: data.lng
            });
        } else {
            handleMessage(event);
        }
    };

    const confirmLocation = () => {
        if (pendingCoordinates) {
            const syntheticEvent = {
                nativeEvent: {
                    data: JSON.stringify({
                        type: 'mapClick',
                        lat: pendingCoordinates.lat,
                        lng: pendingCoordinates.lng
                    })
                }
            };

            handleMessage(syntheticEvent);

            if (mapMode === 'starting') {
                setMapMode('ending');
            }

            setPendingCoordinates(null);
        }
    };

    const cancelLocation = () => {
        setPendingCoordinates(null);
    };

    return (
        <View style={[utilities.containerWhite, { position: 'relative' }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Fullscreen map */}
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
                    source={{ html: getMapHTML(
                            mapMode === 'starting' ? startingLatitude : endingLatitude,
                            mapMode === 'starting' ? startingLongitude : endingLongitude
                        ) }}
                    style={{ flex: 1 }}
                    onMessage={handleMapMessageWithConfirmation}
                    javaScriptEnabled={true}
                />
            </View>

            {/* Navbar positioned below status bar */}
            <View style={[utilities.navbarContainerPrimary, {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                marginTop: 20,
                top: 0
            }]}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                    onPress={prevStep}
                >
                    <FontAwesome name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={utilities.buttonText}>Back</Text>
                </TouchableOpacity>
                <Text style={utilities.textWhite}>RIDE ROUTE</Text>

            </View>
            <View style={{
                position: 'absolute',
                top: 150,
                left: 20,
                right: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 10,
                padding: 15,
                elevation: 5,
                zIndex: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[utilities.inputLocationName, { flex: 1 }]}
                        value={mapMode === 'starting' ? (startingPoint || '') : (endingPoint || '')}
                        onChangeText={(text) => {
                            if (mapMode === 'starting') setStartingPoint(text);
                            else setEndingPoint(text);
                        }}
                        placeholder={`Search for a ${mapMode === 'starting' ? 'starting' : 'ending'} location`}
                        placeholderTextColor="#fff"
                        color="#fff"
                        returnKeyType="search"
                        // You may want to implement a search handler for mapMode
                    />
                    <TouchableOpacity
                        // onPress={...} // Add your search handler here
                        style={{
                            marginLeft: 8,
                            backgroundColor: colors.primary,
                            padding: 8,
                            borderRadius: 6,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <FontAwesome name="search" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>

                {isSearching && (
                    <Text style={utilities.searchingText}>Searching...</Text>
                )}

                {searchResults && searchResults.length > 0 && (
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
            <Text style={[utilities.mapInstructions, {
                top: 95,
                left: 20,
                right: 20,
                backgroundColor: mapMode === 'starting' ? colors.primary : colors.primary,
                padding: 12,
                borderRadius: 8
            }]}>
                {mapMode === 'starting'
                    ? 'Tap on the map to select starting point'
                    : 'Tap on the map to select ending point'}
            </Text>

            {/* Confirmation UI */}
            {pendingCoordinates && (
                <View style={{
                    marginTop: 50,
                    marginHorizontal: 40,
                    borderRadius: 8,
                    padding: 20,
                    alignItems: 'center',
                }}>
                    <Text style={{color: '#000', fontWeight: 'bold', marginBottom: 16, textAlign: 'center'}}>
                        Confirm {mapMode === 'starting' ? 'starting' : 'ending'} point?
                    </Text>
                    <View style={{flexDirection: 'row', width: '70%'}}>
                        <TouchableOpacity
                            onPress={cancelLocation}
                            style={{
                                flex: 1,
                                backgroundColor: '#eee',
                                padding: 10,
                                borderRadius: 5,
                                marginRight: 10,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{color: '#333', fontWeight: 'bold', fontSize: 14}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmLocation}
                            style={{
                                flex: 1,
                                backgroundColor: colors.primary,
                                padding: 10,
                                borderRadius: 5,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Progress indicators as overlay */}
            <View style={{
                position: 'absolute',
                bottom: 50,
                left: 20,
                right: 20,

            }}>
                <View style={utilities.progressIndicator}>
                    <View style={[
                        utilities.progressStep,
                        startingPoint ? {backgroundColor: '#4CAF50'} :
                            (mapMode === 'starting' ? {backgroundColor: colors.primary} : {backgroundColor: '#ccc'})
                    ]}>
                        <Text style={utilities.progressText}>Starting Point</Text>
                        {startingPoint && (
                            <View style={{ flex: 1, marginRight: endingPoint ? 10 : 0 }}>
                                <Text style={{ color: '#000' , fontWeight: 'bold'}}>{startingPoint}</Text>
                            </View>
                        )}


                    </View>

                    <View style={[utilities.progressConnector, startingPoint ? {backgroundColor: '#4CAF50'} : {backgroundColor: '#ccc'}]} />

                    <View style={[
                        utilities.progressStep,
                        endingPoint ? {backgroundColor: '#4CAF50'} :
                            (mapMode === 'ending' ? {backgroundColor: colors.primary} : {backgroundColor: '#ccc'})
                    ]}>
                        <Text style={utilities.progressText}>Ending Point</Text>
                        {endingPoint && (
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>{endingPoint}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>



            {/* Create ride button at bottom */}
            <View style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity
                    style={[utilities.button, {backgroundColor: '#4CAF50'}]}
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