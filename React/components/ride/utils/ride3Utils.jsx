import { reverseGeocodeLandmark } from '../../../services/rideService';

export const getPlaceholderText = (mapMode) => {
    switch (mapMode) {
        case 'starting': return 'Search for starting point';
        case 'ending':   return 'Search for destination';
        case 'stop':     return 'Search for stop point';
        default:         return 'Search location';
    }
};

export const startAddStopPoint = (setMapMode, setIsAddingStop, setCurrentStop) => {
    setMapMode('stop');
    setIsAddingStop(true);
    setCurrentStop(null);
};

export const handleStopMapMessage = async (
    event,
    token,
    setAddingStopLoading,
    setSelectedStopLocation,
    setStopConfirmDialogVisible
) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'mapClick') {
        setAddingStopLoading(true);
        try {
            const stopName = await reverseGeocodeLandmark(token, data.lat, data.lng);
            setSelectedStopLocation({ lat: data.lat, lng: data.lng, name: stopName || `${data.lat}, ${data.lng}` });
            setStopConfirmDialogVisible(true);
        } catch {
            setSelectedStopLocation({ lat: data.lat, lng: data.lng, name: `${data.lat}, ${data.lng}` });
            setStopConfirmDialogVisible(true);
        }
        setAddingStopLoading(false);
    }
};

export const confirmSelectedStop = (
    selectedStopLocation,
    setStopPoints,
    setStopConfirmDialogVisible,
    setSelectedStopLocation
) => {
    if (!selectedStopLocation) return;
    setStopPoints(prev => [...prev, selectedStopLocation]);
    setStopConfirmDialogVisible(false);
    setSelectedStopLocation(null);
};

export const confirmStopPoint = (
    currentStop,
    setStopPoints,
    setIsAddingStop,
    setCurrentStop,
    setMapMode
) => {
    if (!currentStop) return;
    setStopPoints(prev => [...prev, currentStop]);
    setIsAddingStop(false);
    setCurrentStop(null);
    setMapMode('ending');
};

export const handleSelectLocationAndUpdateMap = async (item, handleLocationSelect, webViewRef) => {
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

export const finalizePointSelection = (
    mapMode,
    startingPoint,
    endingPoint,
    setMapMode,
    setShowAddStopDialog
) => {
    if (mapMode === 'starting' && startingPoint) setMapMode('ending');
    else if (mapMode === 'ending' && endingPoint) setShowAddStopDialog(true);
};

export const handleStopLocationSelect = (
    item,
    setSelectedStopLocation,
    setStopConfirmDialogVisible,
    webViewRef
) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setSelectedStopLocation({ lat, lng: lon, name: item.display_name });
    setStopConfirmDialogVisible(true);
    if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
      map.setView([${lat}, ${lon}], 15);
      L.marker([${lat}, ${lon}]).addTo(map).bindPopup("${item.display_name}").openPopup();
      true;
    `);
    }
};

export const updateRouteVisualization = (
    webViewRef,
    startingLatitude,
    startingLongitude,
    startingPoint,
    endingLatitude,
    endingLongitude,
    endingPoint,
    stopPoints = []
) => {
    if (!webViewRef.current) return;
    const message = {
        type: 'updateRoute',
        start: { lat: +startingLatitude, lng: +startingLongitude, name: startingPoint },
        end:   { lat: +endingLatitude,   lng: +endingLongitude,   name: endingPoint   },
        stops: stopPoints.map((sp, i) => ({ lat: +sp.lat, lng: +sp.lng, name: sp.name || `Stop ${i+1}` }))
    };
    console.log('➡️ Sending updateRoute:', message);
    webViewRef.current.postMessage(JSON.stringify(message));
};

export const clearRouteVisualization = (webViewRef) => {
    if (webViewRef.current)
        webViewRef.current.postMessage(JSON.stringify({ type: 'clearRoute' }));
};

export const toggleRouteVisibility = (webViewRef) => {
    if (webViewRef.current)
        webViewRef.current.postMessage(JSON.stringify({ type: 'toggleRoute' }));
};

export const onWebViewMessage = (
    event,
    mapMode,
    isAddingStop,
    handleStopMapMessage,
    handleMessage,
    setMapDarkMode,
    setRouteDisplayed
) => {
    try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.type) {
            case 'mapReady':     return setMapDarkMode(data.isDarkTheme);
            case 'mapError':     return console.error('Map error:', data.error);
            case 'themeChanged': return setMapDarkMode(data.isDark);
            case 'routeUpdated': return setRouteDisplayed(true);
            default:
                if (mapMode === 'stop' && isAddingStop) handleStopMapMessage(event);
                else handleMessage(event);
        }
    } catch (err) {
        console.error('Msg parse err:', err);
    }
};
