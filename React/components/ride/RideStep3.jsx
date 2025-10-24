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
    const [routeInfo, setRouteInfo] = useState(null);

    // MAIN ROUTE DRAWING FUNCTION - GeoJSON Integration
    useEffect(() => {
        const timer = setTimeout(() => {
            if (endingLatitude && endingLongitude && startingLatitude && startingLongitude) {
                drawGeoJSONRoute(); // Updated function name
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [startingLatitude, startingLongitude, endingLatitude, endingLongitude, stopPoints]);

    const drawGeoJSONRoute = async () => {
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

            console.log('=== REQUESTING GEOJSON ROUTE ===');
            console.log('Route data:', routeData);

            // Call backend route preview API (now returns GeoJSON)
            const geoJsonResponse = await RouteService.getRoutePreview(routeData, token);

            if (!geoJsonResponse) {
                console.error('No GeoJSON response from route service');
                return;
            }

            console.log('=== GEOJSON RESPONSE RECEIVED ===');
            console.log('Response type:', typeof geoJsonResponse);

            // Parse the response if it's a string
            let geoJsonData = geoJsonResponse;
            if (typeof geoJsonResponse === 'string') {
                try {
                    geoJsonData = JSON.parse(geoJsonResponse);
                } catch (e) {
                    console.error('Failed to parse GeoJSON response:', e);
                    return;
                }
            }

            console.log('Parsed GeoJSON:', geoJsonData);

            // Validate GeoJSON structure using helper function
            const validation = validateGeoJSON(geoJsonData);
            if (!validation.valid) {
                console.error('GeoJSON validation failed:', validation.error);
                return;
            }

            const routeFeature = validation.feature;
            const geometry = routeFeature.geometry;
            const properties = routeFeature.properties || {};

            // Process coordinates using helper function
            const coordResult = processGeoJSONCoordinates(geometry.coordinates);
            const leafletCoordinates = coordResult.coordinates;

            console.log('=== ROUTE PROCESSING ===');
            console.log('GeoJSON coordinates count:', geometry.coordinates.length);
            console.log('Valid Leaflet coordinates:', coordResult.validCount);
            console.log('Invalid coordinates:', coordResult.invalidCount);

            // Extract route properties for styling
            const routeStyle = {
                color: properties.color || '#1e40af',
                weight: properties.weight || 4,
                opacity: properties.opacity || 0.8
            };

            // Extract and store route metadata
            const routeMetadata = extractRouteStats(routeFeature);
            setRouteInfo(routeMetadata);

            console.log('Route style:', routeStyle);
            console.log('Route metadata:', routeMetadata);

            // Draw the GeoJSON route on the map
            if (webViewRef.current) {
                const coordinatesString = JSON.stringify(leafletCoordinates);
                const styleString = JSON.stringify(routeStyle);
                const metadataString = JSON.stringify(routeMetadata);

                webViewRef.current.injectJavaScript(`
                    try {
                        console.log('=== DRAWING GEOJSON ROUTE ===');
                        
                        const coordinates = ${coordinatesString};
                        const style = ${styleString};
                        const routeInfo = ${metadataString};
                        
                        console.log('Coordinates received:', coordinates.length);
                        console.log('Style:', style);
                        console.log('Route info:', routeInfo);
                        
                        if (window.drawGeoJSONRoute) {
                            const success = window.drawGeoJSONRoute(coordinates, style, routeInfo);
                            
                            if (success) {
                                console.log('✅ GeoJSON route drawn successfully');
                                
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
                                
                                // Send success message back to React Native
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'routeDrawSuccess',
                                    routeInfo: routeInfo
                                }));
                                
                            } else {
                                console.error('❌ Failed to draw GeoJSON route');
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    type: 'routeDrawError',
                                    error: 'Failed to draw route'
                                }));
                            }
                        } else {
                            console.warn('⚠️ drawGeoJSONRoute function not available, using fallback');
                            // Fallback to regular drawRoute function
                            if (window.drawRoute) {
                                window.drawRoute(coordinates, style);
                            }
                        }
                    } catch (error) {
                        console.error('❌ Error in GeoJSON route drawing:', error);
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'routeDrawError',
                            error: error.message
                        }));
                    }
                    true;
                `);
            }

        } catch (error) {
            console.error('❌ Error drawing GeoJSON route:', error);
            handleGeoJSONError(error, 'Route drawing');

            // Handle specific errors with user-friendly messages
            if (error.message?.includes('500')) {
                console.error('Backend route calculation failed - check ORS API configuration');
            }
            if (error.message?.includes('GeoJSON')) {
                console.error('GeoJSON format error - check backend transformation');
            }
        } finally {
            setRouteLoading(false);
        }
    };

    // Helper function to validate GeoJSON structure
    const validateGeoJSON = (geoJson) => {
        if (!geoJson || typeof geoJson !== 'object') {
            return { valid: false, error: 'Invalid GeoJSON object' };
        }

        if (geoJson.type !== 'FeatureCollection') {
            return { valid: false, error: 'Expected FeatureCollection type' };
        }

        if (!Array.isArray(geoJson.features)) {
            return { valid: false, error: 'Features must be an array' };
        }

        const routeFeatures = geoJson.features.filter(feature =>
            feature.geometry && feature.geometry.type === 'LineString'
        );

        if (routeFeatures.length === 0) {
            return { valid: false, error: 'No LineString features found' };
        }

        const feature = routeFeatures[0];
        if (!feature.geometry.coordinates || feature.geometry.coordinates.length < 2) {
            return { valid: false, error: 'Insufficient coordinates in geometry' };
        }

        return { valid: true, feature: feature };
    };

    // Helper function to extract route statistics from GeoJSON
    const extractRouteStats = (geoJsonFeature) => {
        const properties = geoJsonFeature.properties || {};

        return {
            distance: properties.distance || 0, // meters
            duration: properties.duration || 0, // seconds
            distanceKm: properties.distance ? (properties.distance / 1000).toFixed(2) : '0.00',
            durationMin: properties.duration ? Math.round(properties.duration / 60) : 0,
            durationFormatted: formatDuration(properties.duration || 0),
            provider: properties.service || 'Unknown',
            generatedAt: properties.generatedAt ? new Date(properties.generatedAt).toISOString() : null
        };
    };

    // Helper function to format duration
    const formatDuration = (seconds) => {
        if (!seconds || seconds <= 0) return '0 min';

        const minutes = Math.round(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes} min`;
    };

    // Helper function to process GeoJSON coordinates
    const processGeoJSONCoordinates = (geoJsonCoordinates) => {
        if (!Array.isArray(geoJsonCoordinates)) {
            throw new Error('Coordinates must be an array');
        }

        const leafletCoords = [];
        const invalidCoords = [];

        geoJsonCoordinates.forEach((coord, index) => {
            if (Array.isArray(coord) && coord.length >= 2) {
                const lng = parseFloat(coord[0]);
                const lat = parseFloat(coord[1]);

                // Validate coordinate values
                if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng) &&
                    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
                    leafletCoords.push([lat, lng]); // Convert to [lat, lng] for Leaflet
                } else {
                    invalidCoords.push({ index, coord: [lng, lat] });
                }
            } else {
                invalidCoords.push({ index, coord });
            }
        });

        if (invalidCoords.length > 0) {
            console.warn('Found', invalidCoords.length, 'invalid coordinates:', invalidCoords.slice(0, 3));
        }

        if (leafletCoords.length < 2) {
            throw new Error(`Insufficient valid coordinates: ${leafletCoords.length} (need at least 2)`);
        }

        return {
            coordinates: leafletCoords,
            validCount: leafletCoords.length,
            invalidCount: invalidCoords.length,
            totalCount: geoJsonCoordinates.length
        };
    };

    // Enhanced error handler for GeoJSON processing
    const handleGeoJSONError = (error, context = 'GeoJSON processing') => {
        console.error(`❌ Error in ${context}:`, error);

        const errorInfo = {
            message: error.message || 'Unknown error',
            type: error.name || 'Error',
            context: context,
            timestamp: new Date().toISOString()
        };

        return errorInfo;
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

            try {
                const stopName = await reverseGeocodeLandmark(token, data.lat, data.lng);
                setCurrentStop({
                    lat: data.lat,
                    lng: data.lng,
                    name: stopName || `${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}`
                });
            } catch (error) {
                console.error('Error getting stop name:', error);
                setCurrentStop({
                    lat: data.lat,
                    lng: data.lng,
                    name: `${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}`
                });
            } finally {
                setAddingStopLoading(false);
            }
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

        // Redraw route with new stop point
        setTimeout(() => drawGeoJSONRoute(), 500);
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

        // Redraw route if we have both points
        if (endingLatitude && endingLongitude) {
            setTimeout(() => drawGeoJSONRoute(), 500);
        }
    };

    const finalizePointSelection = () => {
        if (mapMode === 'starting' && startingPoint) {
            setMapMode('ending');
        } else if (mapMode === 'ending' && endingPoint) {
            setMapMode('stop');
            setTimeout(() => drawGeoJSONRoute(), 300);
        }
    };

    const removeStopPoint = (index) => {
        setStopPoints(prev => prev.filter((_, i) => i !== index));
        setTimeout(() => drawGeoJSONRoute(), 300);
    };

    const handleMapModeChange = (newMode) => {
        setMapMode(newMode);
        // Keep the route when changing modes
    };

    const onWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('WebView message received:', data.type);

            switch (data.type) {
                case 'mapReady':
                    setMapDarkMode(data.isDarkTheme);
                    console.log('Map is ready, redrawing route if needed');
                    // Redraw route if we have coordinates
                    if (startingLatitude && startingLongitude && endingLatitude && endingLongitude) {
                        setTimeout(() => drawGeoJSONRoute(), 1000);
                    }
                    break;
                case 'mapError':
                    console.error('Map initialization error:', data.error);
                    break;
                case 'routeDrawSuccess':
                    console.log('Route drawn successfully:', data.routeInfo);
                    if (data.routeInfo) {
                        setRouteInfo(data.routeInfo);
                    }
                    break;
                case 'routeDrawError':
                    console.error('Route drawing failed:', data.error);
                    break;
                case 'geoJsonError':
                    console.error('GeoJSON processing error:', data.error);
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

                {/* Route Information Display */}
                {routeInfo && routeInfo.distance > 0 && (
                    <View style={[rideStepsUtilities.routeInfoContainer, { marginTop: 8 }]}>
                        <View style={rideStepsUtilities.routeInfoRow}>
                            <FontAwesome name="road" size={14} color="#1e40af" />
                            <Text style={rideStepsUtilities.routeInfoText}>
                                {routeInfo.distanceKm} km • {routeInfo.durationFormatted}
                            </Text>
                        </View>
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

                    {/* Route Statistics Card */}
                    {routeInfo && routeInfo.distance > 0 && (
                        <View style={[rideStepsUtilities.modernCard, rideStepsUtilities.fullWidthCard]}>
                            <View style={rideStepsUtilities.cardHeader}>
                                <View style={rideStepsUtilities.headerLeft}>
                                    <FontAwesome name="road" size={16} color="#1e40af" style={{ marginRight: 8 }} />
                                    <Text style={rideStepsUtilities.cardTitle}>Route Information</Text>
                                </View>
                            </View>
                            <View style={rideStepsUtilities.routeStatsContainer}>
                                <View style={rideStepsUtilities.routeStatItem}>
                                    <FontAwesome name="location-arrow" size={14} color="#10b981" />
                                    <Text style={rideStepsUtilities.routeStatLabel}>Distance</Text>
                                    <Text style={rideStepsUtilities.routeStatValue}>{routeInfo.distanceKm} km</Text>
                                </View>
                                <View style={rideStepsUtilities.routeStatItem}>
                                    <FontAwesome name="clock-o" size={14} color="#f59e0b" />
                                    <Text style={rideStepsUtilities.routeStatLabel}>Duration</Text>
                                    <Text style={rideStepsUtilities.routeStatValue}>{routeInfo.durationFormatted}</Text>
                                </View>
                                <View style={rideStepsUtilities.routeStatItem}>
                                    <FontAwesome name="cog" size={14} color="#6b7280" />
                                    <Text style={rideStepsUtilities.routeStatLabel}>Provider</Text>
                                    <Text style={rideStepsUtilities.routeStatValue}>{routeInfo.provider}</Text>
                                </View>
                            </View>
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

                {mapMode === 'stop' && isAddingStop && !currentStop && (
                    <View style={[rideStepsUtilities.button, rideStepsUtilities.infoButton]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="hand-pointer-o" size={14} color="#ffffff" />
                            <Text style={rideStepsUtilities.buttonText}> Tap on map to add stop point</Text>
                        </View>
                    </View>
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