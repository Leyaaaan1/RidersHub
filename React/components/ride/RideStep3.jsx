// React/components/ride/RideStep3.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import colors from '../../styles/colors';

const RideStep3 = ({
                       mapMode, setMapMode, isSearching, searchResults,
                       handleLocationSelect, webViewRef,
                       startingLatitude, startingLongitude, endingLatitude, endingLongitude,
                       handleMessage, startingPoint, setStartingPoint,
                       endingPoint, setEndingPoint, prevStep, loading, nextStep,
                       handleCreateRide
                   }) => {



    const handleCreateAndNext = async () => {
        try {
            // Wait for the ride to be created successfully
            await handleCreateRide();
            // Only move to next step if ride creation was successful
            nextStep();
        } catch (error) {
            console.error('Error creating ride:', error);
            // Don't proceed to next step if there was an error
        }
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

            <View style={[utilities.mapContainer, {borderWidth: 2, borderColor: '#4CAF50'}]}>
                <Text style={[
                    utilities.mapInstructions,
                    {backgroundColor: mapMode === 'starting' ? colors.primary : colors.primary}
                ]}>
                    <Text>
                        {mapMode === 'starting' ? 'Tap on the map to select starting point' : 'Tap on the map to select ending point'}
                    </Text>
                </Text>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(
                            mapMode === 'starting' ? startingLatitude : endingLatitude,
                            mapMode === 'starting' ? startingLongitude : endingLongitude
                        ) }}
                    style={[utilities.map, {borderWidth: 1, borderColor: '#4CAF50'}]}
                    onMessage={handleMessage}
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
                    onPress={handleCreateAndNext}
                    disabled={!startingPoint || !endingPoint || loading}
                >
                    <Text style={utilities.buttonText}>{loading ? 'Creating Ride...' : 'Create & Review'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep3;