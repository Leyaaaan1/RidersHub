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

    // ROUTE DRAWING FUNCTION - Only draws the polygon line
// Updated drawRoadRoute function for RideStep3.jsx
// Replace your existing drawRoadRoute function with this enhanced version

// Enhanced drawRoadRoute function with better response handling
// Replace your existing drawRoadRoute function in RideStep3.jsx with this simplified version

    const drawRoadRoute = async () => {
        if (!startingLatitude || !startingLongitude || !endingLatitude || !endingLongitude) return;

        console.log('Drawing route polygon...');
        setRouteLoading(true);

        try {
            const routeData = {
                startLng: parseFloat(startingLongitude),
                startLat: parseFloat(startingLatitude),
                endLng: parseFloat(endingLongitude),
                endLat: parseFloat(endingLatitude),
                stopPoints: stopPoints.map(point => ({
                    stopLongitude: parseFloat(point.lng),
                    stopLatitude: parseFloat(point.lat),
                    stopName: point.name
                }))
            };

            console.log('Route data being sent:', routeData);
            const routeResponse = await RouteService.getRoutePreview(routeData, token);

            console.log('=== ROUTE RESPONSE DEBUG ===');
            console.log('Full response:', routeResponse);

            let coordinates = null;

            // Extract coordinates from ORS response
            if (routeResponse?.routes?.[0]?.geometry?.coordinates) {
                const rawCoordinates = routeResponse.routes[0].geometry.coordinates;
                console.log('Raw coordinates from ORS:', rawCoordinates.length, 'points');
                console.log('First raw coordinate:', rawCoordinates[0]);
                console.log('Last raw coordinate:', rawCoordinates[rawCoordinates.length - 1]);

                // Validate that we have proper coordinate arrays
                if (Array.isArray(rawCoordinates) && rawCoordinates.length > 1) {
                    // Convert ORS format [lng, lat] to Leaflet format [lat, lng]
                    coordinates = rawCoordinates
                        .filter(coord => Array.isArray(coord) && coord.length >= 2)
                        .map(coord => [coord[1], coord[0]]); // [lat, lng] for Leaflet

                    console.log('Converted coordinates count:', coordinates.length);
                    console.log('First converted coordinate:', coordinates[0]);
                    console.log('Last converted coordinate:', coordinates[coordinates.length - 1]);
                }
            } else {
                console.error('No coordinates found in ORS response');
                console.log('Response structure check:', {
                    hasRoutes: !!routeResponse?.routes,
                    routesLength: routeResponse?.routes?.length,
                    firstRoute: routeResponse?.routes?.[0],
                    geometry: routeResponse?.routes?.[0]?.geometry
                });
            }

            if (coordinates && coordinates.length > 1 && webViewRef.current) {
                console.log('Drawing route with', coordinates.length, 'coordinate points');

                // Clear existing route and markers first
                webViewRef.current.injectJavaScript(`
                if (window.clearRoute) {
                    window.clearRoute();
                }
                if (window.clearRouteMarkers) {
                    window.clearRouteMarkers();
                }
                true;
            `);

                // Draw new route polyline with proper coordinates
                setTimeout(() => {
                    const routeScript = `
                    (function() {
                        try {
                            console.log('Drawing route polyline with ${coordinates.length} points');
                            
                            const routeCoords = ${JSON.stringify(coordinates)};
                            
                            if (!routeCoords || routeCoords.length < 2) {
                                console.error('Invalid coordinates for route drawing');
                                return false;
                            }
                            
                            // Validate coordinate format
                            const invalidCoords = routeCoords.filter(coord => 
                                !Array.isArray(coord) || coord.length < 2 || 
                                isNaN(coord[0]) || isNaN(coord[1])
                            );
                            
                            if (invalidCoords.length > 0) {
                                console.error('Found invalid coordinates:', invalidCoords.slice(0, 3));
                                return false;
                            }
                            
                            console.log('First few coordinates:', routeCoords.slice(0, 3));
                            console.log('Last few coordinates:', routeCoords.slice(-3));
                            
                            // Draw the route polyline
                            if (window.drawRoute) {
                                const routeSuccess = window.drawRoute(routeCoords, {
                                    color: '#1e40af',
                                    weight: 5,
                                    opacity: 0.8,
                                    smoothFactor: 1.0,
                                    lineJoin: 'round',
                                    lineCap: 'round'
                                });
                                
                                console.log('Route polyline drawn:', routeSuccess);
                                
                                if (routeSuccess) {
                                    // Add route markers
                                    const startCoords = [${parseFloat(startingLatitude)}, ${parseFloat(startingLongitude)}];
                                    const endCoords = [${parseFloat(endingLatitude)}, ${parseFloat(endingLongitude)}];
                                    const stopCoords = ${JSON.stringify(stopPoints.map(point => [parseFloat(point.lat), parseFloat(point.lng)]))};
                                    
                                    if (window.addRouteMarkers) {
                                        const markersSuccess = window.addRouteMarkers(startCoords, endCoords, stopCoords);
                                        console.log('Route markers added:', markersSuccess);
                                    }
                                    
                                    // Fit the map to show the entire route
                                    if (window.fitRouteToMap) {
                                        setTimeout(() => {
                                            window.fitRouteToMap(routeCoords, [30, 30]);
                                        }, 200);
                                    }
                                }
                                
                                return routeSuccess;
                            } else {
                                console.error('drawRoute function not available');
                                return false;
                            }
                        } catch (error) {
                            console.error('Error drawing route polyline:', error);
                            return false;
                        }
                    })();
                    true;
                `;

                    webViewRef.current.injectJavaScript(routeScript);
                }, 300);
            } else {
                console.error('No valid coordinates to draw route, falling back to straight line');
                drawFallbackStraightLine();
            }
        } catch (error) {
            console.error('Error drawing route polyline:', error);
            drawFallbackStraightLine();
        } finally {
            setRouteLoading(false);
        }
    };
// Helper function for fallback straight line
    const drawFallbackStraightLine = () => {
        if (startingLatitude && startingLongitude && endingLatitude && endingLongitude && webViewRef.current) {
            console.log('Drawing fallback straight line between points');
            const fallbackCoords = [
                [parseFloat(startingLatitude), parseFloat(startingLongitude)],
                [parseFloat(endingLatitude), parseFloat(endingLongitude)]
            ];

            const fallbackScript = `
            if (window.drawRoute) {
                const coords = ${JSON.stringify(fallbackCoords)};
                window.drawRoute(coords, {
                    color: '#dc2626',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '10, 10'
                });
                
                // Add markers for fallback line
                const startCoords = [${parseFloat(startingLatitude)}, ${parseFloat(startingLongitude)}];
                const endCoords = [${parseFloat(endingLatitude)}, ${parseFloat(endingLongitude)}];
                const stopCoords = ${JSON.stringify(stopPoints.map(point => [parseFloat(point.lat), parseFloat(point.lng)]))};
                
                if (window.addRouteMarkers) {
                    window.addRouteMarkers(startCoords, endCoords, stopCoords);
                }
            }
            true;
        `;
            webViewRef.current.injectJavaScript(fallbackScript);
        }
    };    const startAddStopPoint = () => {
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