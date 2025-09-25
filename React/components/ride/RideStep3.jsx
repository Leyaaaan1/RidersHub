import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import rideStepsUtilities from '../../styles/rideStepsUtilities';
import { WebView } from 'react-native-webview';
import getMapHTML from '../../utils/mapHTML';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { reverseGeocodeLandmark } from '../../services/rideService';
import RouteService from '../../services/RouteService';

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
    const [routeLoading, setRouteLoading] = useState(false);

    // MAIN ROUTE DRAWING FUNCTION - Always use road-following routes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (endingLatitude && endingLongitude && startingLatitude && startingLongitude) {
                drawRoadRoute(); // Draw route polygon only
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [startingLatitude, startingLongitude, endingLatitude, endingLongitude, stopPoints]);

    const drawRoadRoute = async () => {
        if (!startingLatitude || !startingLongitude || !endingLatitude || !endingLongitude) {
            console.log('Missing coordinates for route drawing');
            return;
        }

        setRouteLoading(true);

        try {
            // Clear existing route first
            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`
                if (window.clearRoute) {
                    window.clearRoute();
                }
                true;
            `);
            }

            // Prepare route data matching backend format
            const routeData = {
                startLng: startingLongitude,
                startLat: startingLatitude,
                endLng: endingLongitude,
                endLat: endingLatitude,
                stopPoints: stopPoints.map(stop => ({
                    stopLatitude: stop.lat,
                    stopLongitude: stop.lng,
                    stopName: stop.name || 'Stop Point'
                }))
            };

            // Call your backend route preview API
            const routeResponse = await RouteService.getRoutePreview(routeData, token);

            if (!routeResponse) {
                console.error('No response from route service');
                return;
            }

            // Parse the response if it's a string
            let parsedResponse = routeResponse;
            if (typeof routeResponse === 'string') {
                try {
                    parsedResponse = JSON.parse(routeResponse);
                } catch (e) {
                    console.error('Failed to parse route response:', e);
                    return;
                }
            }

            // Extract route from ORS response format
            if (!parsedResponse.routes || parsedResponse.routes.length === 0) {
                console.error('No routes found in response');
                return;
            }

            const route = parsedResponse.routes[0];

            // Handle ORS geometry format
            let coordinates = null;

            if (route.geometry) {
                if (typeof route.geometry === 'string') {
                    // If geometry is encoded polyline string
                    coordinates = decodePolyline(route.geometry);
                } else if (route.geometry.coordinates) {
                    // If geometry is GeoJSON format
                    coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]
                }
            }

            if (!coordinates || coordinates.length < 2) {
                console.error('No valid coordinates found for route drawing');
                return;
            }

            // Draw the route polyline on the map
            if (webViewRef.current) {
                const coordinatesString = JSON.stringify(coordinates);

                webViewRef.current.injectJavaScript(`
                try {
                    const coordinates = ${coordinatesString};
                    
                    if (window.drawRoute) {
                        const success = window.drawRoute(coordinates, {
                            color: '#1e40af',
                            weight: 4,
                            opacity: 0.8
                        });
                        
                        if (success) {
                            // Add route markers
                            const startCoords = [${startingLatitude}, ${startingLongitude}];
                            const endCoords = [${endingLatitude}, ${endingLongitude}];
                            const stopCoords = ${JSON.stringify(stopPoints.map(stop => [stop.lat, stop.lng]))};
                            
                            if (window.addRouteMarkers) {
                                window.addRouteMarkers(startCoords, endCoords, stopCoords);
                            }
                            
                            // Fit route to map view
                            if (window.fitRouteToMap) {
                                window.fitRouteToMap(coordinates, [30, 30]);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error drawing route:', error);
                }
                true;
            `);
            }

        } catch (error) {
            console.error('Error drawing route:', error);

            // Handle specific errors
            if (error.message?.includes('500')) {
                console.error('Backend route calculation failed - check ORS API configuration');
            }
        } finally {
            setRouteLoading(false);
        }
    };

// Helper function to decode polyline (if needed)
    const decodePolyline = (str) => {
        let index = 0, len = str.length;
        let lat = 0, lng = 0;
        let coordinates = [];

        while (index < len) {
            let b, shift = 0, result = 0;
            do {
                b = str.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            let deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += deltaLat;

            shift = 0;
            result = 0;
            do {
                b = str.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            let deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += deltaLng;

            coordinates.push([lat / 1e5, lng / 1e5]);
        }

        return coordinates;
    };
    const findCoordinatesInObject = (obj, path = '') => {
        if (!obj || typeof obj !== 'object') return null;

        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;

            // Check if this might be a coordinates array
            if (Array.isArray(value) && value.length > 0) {
                // Check if it's a coordinate array (array of [lng, lat] pairs)
                if (Array.isArray(value[0]) && value[0].length >= 2 &&
                    typeof value[0][0] === 'number' && typeof value[0][1] === 'number') {
                    console.log(`Found potential coordinates at path: ${currentPath}`);
                    console.log('Sample coordinates:', value.slice(0, 3));
                    return processRawCoordinates(value, currentPath);
                }
            }

            // Recursively search nested objects
            if (typeof value === 'object' && !Array.isArray(value)) {
                const result = findCoordinatesInObject(value, currentPath);
                if (result) return result;
            }
        }

        return null;
    };

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

        // Redraw route polygon with new stop point
        setTimeout(() => drawRoadRoute(), 500);
    };

    const handleSelectLocationAndUpdateMap = async (item) => {
        await handleLocationSelect(item);
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);

        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
                if (window.centerMap && window.updateMarker) {
                    window.centerMap(${lat}, ${lon}, 15);
                    window.updateMarker(${lat}, ${lon});
                }
                true;
            `);
        }

        // Redraw route polygon if we have both points
        if (endingLatitude && endingLongitude) {
            setTimeout(() => drawRoadRoute(), 500);
        }
    };

    const finalizePointSelection = () => {
        if (mapMode === 'starting' && startingPoint) {
            setMapMode('ending');
        } else if (mapMode === 'ending' && endingPoint) {
            setMapMode('stop');
            setTimeout(() => drawRoadRoute(), 300);
        }
    };

    const removeStopPoint = (index) => {
        setStopPoints(prev => prev.filter((_, i) => i !== index));
        setTimeout(() => drawRoadRoute(), 300);
    };

    const handleMapModeChange = (newMode) => {
        setMapMode(newMode);
        // Keep the route polygon when changing modes
    };

    const onWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data.type);

            switch (data.type) {
                case 'mapReady':
                    setMapDarkMode(data.isDarkTheme);
                    console.log('Map is ready, redrawing route polygon if needed');
                    // Redraw route polygon if we have coordinates
                    if (startingLatitude && startingLongitude && endingLatitude && endingLongitude) {
                        setTimeout(() => drawRoadRoute(), 1000);
                    }
                    break;
                case 'mapError':
                    console.error('Map initialization error:', data.error);
                    break;
                default:
                    if (mapMode === 'stop' && isAddingStop) {
                        handleStopMapMessage(event);
                    } else {
                        handleMessage(event);
                    }
                    if (data.isDarkTheme !== undefined) {
                        setMapDarkMode(data.isDarkTheme);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
        }
    };

    const getPlaceholderText = () => {
        switch (mapMode) {
            case 'starting': return 'Search for starting point';
            case 'ending': return 'Search for destination';
            case 'stop': return 'Search for stop point';
            default: return 'Search location';
        }
    };

    return (
        <View style={rideStepsUtilities.containerWhite}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

            {/* Full-screen Map */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: '100%' }}>
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
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    mixedContentMode="compatibility"
                />
            </View>

            {/* Navigation Bar */}
            <View style={rideStepsUtilities.navbarContainerPrimary}>
                <TouchableOpacity style={rideStepsUtilities.navButton} onPress={prevStep}>
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

            {/* Search Container */}
            <View style={rideStepsUtilities.searchContainer}>
                <View style={[rideStepsUtilities.searchInputContainer, isSearchFocused && rideStepsUtilities.searchInputFocused]}>
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
                        editable={mapMode !== 'stop' || !isAddingStop}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearchInputChange('')} style={{ padding: 4, marginRight: 8 }}>
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

                {routeLoading && (
                    <View style={[rideStepsUtilities.loadingContainer, { marginTop: 8 }]}>
                        <ActivityIndicator size="small" color="#1e40af" />
                        <Text style={[rideStepsUtilities.loadingText, { color: '#1e40af' }]}>Drawing route...</Text>
                    </View>
                )}

                {searchResults && searchResults.length > 0 && (
                    <ScrollView style={rideStepsUtilities.searchResultsList} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        {searchResults.map((item, index) => (
                            <TouchableOpacity
                                key={item.place_id.toString()}
                                style={[rideStepsUtilities.resultItem, index === searchResults.length - 1 && rideStepsUtilities.resultItemLast]}
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

            {/* Toggle Button */}
            <View style={{ position: 'absolute', top: 120, right: 10, zIndex: 20 }}>
                <TouchableOpacity
                    style={{
                        paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#f1f3f4',
                        borderRadius: 16, top: 10, flexDirection: 'row', alignItems: 'center',
                        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4
                    }}
                    onPress={() => setShowProgressBar(prev => !prev)}
                >
                    <FontAwesome name={showProgressBar ? 'eye-slash' : 'eye'} size={16} color="#5f6368" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#5f6368' }}>
                        {showProgressBar ? 'Hide Details' : 'Show Details'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Progress Container */}
            {showProgressBar && (
                <View style={rideStepsUtilities.progressContainer}>
                    <View style={rideStepsUtilities.topRowContainer}>
                        {startingPoint && (
                            <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.halfWidthCard]}>
                                <View style={rideStepsUtilities.cardHeader}>
                                    <View style={rideStepsUtilities.headerLeft}>
                                        <Text style={rideStepsUtilities.cardTitle}>Starting Point</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[rideStepsUtilities.changeButton, mapMode === 'starting' && { borderWidth: 2}]}
                                        onPress={() => handleMapModeChange('starting')}
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

                        {endingPoint && (
                            <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.halfWidthCard]}>
                                <View style={rideStepsUtilities.cardHeader}>
                                    <View style={rideStepsUtilities.headerLeft}>
                                        <Text style={rideStepsUtilities.cardTitle}>Ending Point</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[rideStepsUtilities.changeButton, mapMode === 'ending' && { borderWidth: 2}]}
                                        onPress={() => handleMapModeChange('ending')}
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

                    {stopPoints.length > 0 && (
                        <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.fullWidthCard]}>
                            <View style={rideStepsUtilities.cardHeader}>
                                <View style={rideStepsUtilities.headerLeft}>
                                    <Text style={rideStepsUtilities.cardTitle}>Stop Points</Text>
                                </View>
                                <View style={rideStepsUtilities.stopCounter}>
                                    <Text style={rideStepsUtilities.stopCounterText}>{stopPoints.length}</Text>
                                </View>
                            </View>
                            <ScrollView style={rideStepsUtilities.stopScrollView} showsVerticalScrollIndicator={false}>
                                {stopPoints.map((stop, index) => (
                                    <View key={index} style={rideStepsUtilities.stopItem}>
                                        <View style={rideStepsUtilities.stopNumber}>
                                            <Text style={rideStepsUtilities.stopNumberText}>{index + 1}</Text>
                                        </View>
                                        <Text style={rideStepsUtilities.stopName} numberOfLines={1}>{stop.name}</Text>
                                        <TouchableOpacity style={{ marginLeft: 8, padding: 4 }} onPress={() => removeStopPoint(index)}>
                                            <FontAwesome name="times" size={12} color="#999" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}

            {/* Action Buttons */}
            <View style={rideStepsUtilities.actionButtonsContainer}>
                {mapMode === 'stop' && !isAddingStop && (
                    <TouchableOpacity style={[rideStepsUtilities.button, rideStepsUtilities.secondaryButton]} onPress={startAddStopPoint}>
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
                {((mapMode === 'starting' && startingPoint) || (mapMode === 'ending' && endingPoint)) && (
                    <TouchableOpacity style={[rideStepsUtilities.button, rideStepsUtilities.primaryButton]} onPress={finalizePointSelection}>
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