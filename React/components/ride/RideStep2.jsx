// React/components/ride/RideStep2.jsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import utilities from '../../styles/utilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';

const RideStep2 = ({
                       mapMode, setMapMode, isSearching, searchResults,
                       handleLocationSelect, webViewRef,
                       startingLatitude, startingLongitude, endingLatitude, endingLongitude,
                       handleMessage, startingPoint, setStartingPoint,
                       endingPoint, setEndingPoint, prevStep, nextStep
                   }) => {
    return (
        <View>
            <Text style={utilities.title}>Step 2: Starting & Ending Points</Text>

            <View style={utilities.coordinatesContainer}>
                <TouchableOpacity
                    style={[utilities.button, mapMode === 'starting' && utilities.selectedRiderType]}
                    onPress={() => setMapMode('starting')}
                >
                    <Text style={utilities.buttonText}>Select Starting Point</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[utilities.button, mapMode === 'ending' && utilities.selectedRiderType]}
                    onPress={() => setMapMode('ending')}
                >
                    <Text style={utilities.buttonText}>Select Ending Point</Text>
                </TouchableOpacity>
            </View>

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
                    {mapMode === 'starting' ? 'Tap on the map to select starting point' : 'Tap on the map to select ending point'}
                </Text>
                <WebView
                    ref={webViewRef}
                    source={{ html: getMapHTML(
                            mapMode === 'starting' ? startingLatitude : endingLatitude,
                            mapMode === 'starting' ? startingLongitude : endingLongitude
                        ) }}
                    style={utilities.map}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                />
            </View>

            <Text style={utilities.label}>Starting Point</Text>
            <TextInput
                style={utilities.input}
                value={startingPoint}
                onChangeText={setStartingPoint}
                placeholder="Starting point will appear here"
                editable={true}
            />

            <Text style={utilities.label}>Ending Point</Text>
            <TextInput
                style={utilities.input}
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
                    style={utilities.button}
                    onPress={nextStep}
                    disabled={!startingPoint.trim() || !endingPoint.trim()}
                >
                    <Text style={utilities.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep2;