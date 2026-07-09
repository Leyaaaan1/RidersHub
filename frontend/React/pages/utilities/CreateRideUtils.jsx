import {useState, useEffect, useRef, useCallback, useContext} from 'react';
import {Alert} from 'react-native';
import {
  searchLocation,
  searchCityOrLandmark,
  createRide,
  updateRide, // ← NEW import
  getRideDetails, // ← NEW import
  getLocationImage,
  getAllRiderTypes,
} from '../../services/rideService';
import {
  validateCoordinates,
  validateRideDate,
  validateRideName,
} from '../../utilities/validator/validationErrors';
import {
  ERROR_MESSAGES,
  resolveErrorMessage,
} from '../../utilities/validator/errorMessages';
import {DEFAULT_COORDS} from '../../utilities/route/map/appDefaults';
import {useUserLocation} from '../../hooks/useUserLocation';
import {handleWebViewMessage} from '../../utilities/mapUtils';
import {routeCache} from '../../services/cache/routeCache';
import {RideContext} from '../../context/RideContext';

const DEFAULT_LAT = '7.0731';
const DEFAULT_LNG = '125.6128';

// ── CHANGED: accept editMode + generatedRidesId ────────────────────────────
const useCreateRide = ({
  editMode = false,
  generatedRidesId: editRideId = null,
  username = null,
} = {}) => {
  const {notifyRideCreated} = useContext(RideContext);

  const webViewRef = useRef(null);
  const pendingRideIdRef = useRef(null);

  const {location, loading: locationLoading} = useUserLocation();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(editMode); // ← NEW
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [rideName, setRideName] = useState('');
  const [riderType, setRiderType] = useState('ADV 160');
  const [date, setDate] = useState(new Date());
  const [participants, setParticipants] = useState('');
  const [description, setDescription] = useState('');

  const isStartingPointFromSearchRef = useRef(false);
  const isEndingPointFromSearchRef = useRef(false);
  const isLocationFromSearchRef = useRef(false); // ← NEW — needed for edit hydration
  const setStartingPointFromSearch = val => {
    isStartingPointFromSearchRef.current = val;
  };
  const setEndingPointFromSearch = val => {
    isEndingPointFromSearchRef.current = val;
  };

  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(location.latitude);
  const [longitude, setLongitude] = useState(location.longitude);
  const [locationSelected, setLocationSelected] = useState(false);
  const [rideNameImage, setRideNameImage] = useState([]);

  useEffect(() => {
    if (editMode) return; // ← don't clobber hydrated values with GPS location
    setLatitude(location.latitude);
    setLongitude(location.longitude);
  }, [location, editMode]);

  const [startingPoint, setStartingPoint] = useState('');
  const [startingLatitude, setStartingLatitude] = useState(location.latitude);
  const [startingLongitude, setStartingLongitude] = useState(
    location.longitude,
  );
  const [endingPoint, setEndingPoint] = useState('');
  const [endingLatitude, setEndingLatitude] = useState(DEFAULT_COORDS.latitude);
  const [endingLongitude, setEndingLongitude] = useState(
    DEFAULT_COORDS.longitude,
  );
  const [stopPoints, setStopPoints] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [mapMode, setMapMode] = useState('starting');
  const mapModeRef = useRef('starting');
  const _setMapMode = useCallback(val => {
    mapModeRef.current = val;
    setMapMode(val);
  }, []);

  const [riderTypeOptions, setRiderTypeOptions] = useState([]);
  const [riderTypeLoading, setRiderTypeLoading] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      _setMapMode('location');
    } else if (currentStep === 3) {
      _setMapMode('starting');
    }
  }, [currentStep]);

  const [generatedRidesId, setGeneratedRidesId] = useState(
    editMode ? editRideId : null, // ← seed immediately so Step4 nav guards pass
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ── NEW: hydrate all form state from the existing ride when editing ──────
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!editMode || !editRideId) {
      setInitialLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const details = await getRideDetails(editRideId);
        if (cancelled) return;

        setRideName(details.ridesName || '');
        setRiderType(details.riderType || 'ADV 160');
        setDate(details.date ? new Date(details.date) : new Date());
        setDescription(details.description || '');
        setParticipants(
          Array.isArray(details.participants) ? details.participants : [],
        );

        setLocationName(details.locationName || '');
        setLatitude(details.latitude);
        setLongitude(details.longitude);
        setLocationSelected(true);
        isLocationFromSearchRef.current = true; // treat pre-filled name as resolved

        setStartingPoint(details.startingPointName || '');
        setStartingLatitude(details.startLat);
        setStartingLongitude(details.startLng);
        setStartingPointFromSearch(true); // skip re-geocoding unless user re-picks

        setEndingPoint(details.endingPointName || '');
        setEndingLatitude(details.endLat);
        setEndingLongitude(details.endLng);
        setEndingPointFromSearch(true);

        setStopPoints(
          (details.stopPoints || []).map(sp => ({
            lat: sp.stopLatitude,
            lng: sp.stopLongitude,
            name: sp.stopName,
            isFromSearch: true, // pre-filled — skip re-geocode on unchanged stops
          })),
        );

        setGeneratedRidesId(editRideId);
        pendingRideIdRef.current = editRideId;
      } catch (err) {
        setError('Failed to load ride details for editing.');
        Alert.alert('Error', 'Could not load this ride for editing.');
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, editRideId]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleMessage = useCallback(
    event =>
      handleWebViewMessage(event, {
        mapMode: mapModeRef.current,
        setLatitude,
        setLongitude,
        setStartingLatitude,
        setStartingLongitude,
        setStartingPointFromSearch,
        setEndingLatitude,
        setEndingLongitude,
        setEndingPointFromSearch,
        setLocationName,
        setLocationSelected,
        setStartingPoint,
        setEndingPoint,
      }),
    [],
  );
  const handleSearchInputChange = useCallback(value => {
    if (value) {
      setLocationSelected(false);
    }
    setSearchQuery(value);
  }, []);

  useEffect(() => {
    const fetchRiderTypes = async () => {
      setRiderTypeLoading(true);
      try {
        const types = await getAllRiderTypes();
        setRiderTypeOptions(types);
        if (types.length > 0 && !editMode) {
          // ← don't override hydrated riderType
          setRiderType(types[0].riderType);
        }
      } catch (error) {
        if (!editMode) setRiderType('ADV 160');
      } finally {
        setRiderTypeLoading(false);
      }
    };

    fetchRiderTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isValidQuery = searchQuery?.trim().length >= 3;
    if (!isValidQuery || locationSelected) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const searchFn =
      mapMode === 'location' ? searchCityOrLandmark : searchLocation;

    const timer = setTimeout(() => {
      searchFn(searchQuery)
        .then(data => setSearchResults(data))
        .catch(() =>
          Alert.alert('Error', ERROR_MESSAGES.LOCATION.SEARCH_FAILED),
        )
        .finally(() => setIsSearching(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, locationSelected, mapMode]);

  const handleLocationSelect = useCallback(async location => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    setLocationSelected(true);

    const selectedName = location.display_name
      ? location.display_name.split(',')[0].trim()
      : `${lat}, ${lon}`;

    const currentMode = mapModeRef.current;

    if (currentMode === 'location') {
      setLatitude(lat.toString());
      setLongitude(lon.toString());
      setLocationName(selectedName);
      isLocationFromSearchRef.current = true; // ← NEW: user re-picked, flag it
      getLocationImage(selectedName)
        .then(imgs => setRideNameImage(imgs))
        .catch(() => setRideNameImage([]));
    } else if (currentMode === 'starting') {
      setStartingLatitude(lat.toString());
      setStartingLongitude(lon.toString());
      setStartingPoint(selectedName);
      setStartingPointFromSearch(true);
      _setMapMode('ending');
    } else if (currentMode === 'ending') {
      setEndingLatitude(lat.toString());
      setEndingLongitude(lon.toString());
      setEndingPoint(selectedName);
      setEndingPointFromSearch(true);
    }

    setSearchQuery(selectedName);
    setSearchResults([]);

    return selectedName;
  }, []);

  const buildStopPointsPayload = () =>
    stopPoints.map(sp => ({
      stopLatitude: sp.lat ?? sp.stopLatitude,
      stopLongitude: sp.lng ?? sp.stopLongitude,
      stopName: sp.name ?? sp.stopName,
    }));

  const buildStopPointsFromSearchArray = () =>
    stopPoints.map(sp => sp.isFromSearch ?? false);

  const buildParticipantsArray = () => {
    if (Array.isArray(participants)) {
      return participants;
    }
    if (typeof participants === 'string' && participants.trim()) {
      return participants.split(',').map(p => p.trim());
    }
    return [];
  };

  const handleCreateRide = useCallback(async () => {
    const nameError = validateRideName(rideName);
    if (nameError) {
      setError(nameError);
      Alert.alert('Invalid Input', nameError);
      return;
    }

    const dateError = validateRideDate(date);
    if (dateError) {
      setError(dateError);
      Alert.alert('Invalid Date', dateError);
      return;
    }

    if (!startingPoint.trim()) {
      const msg = ERROR_MESSAGES.RIDE_CREATION.STARTING_POINT_REQUIRED;
      setError(msg);
      Alert.alert('Missing Location', msg);
      return;
    }

    if (!endingPoint.trim()) {
      const msg = ERROR_MESSAGES.RIDE_CREATION.ENDING_POINT_REQUIRED;
      setError(msg);
      Alert.alert('Missing Location', msg);
      return;
    }

    const coordErrors = validateCoordinates(
      startingLatitude,
      startingLongitude,
      endingLatitude,
      endingLongitude,
    );
    if (coordErrors && coordErrors.length > 0) {
      const firstError = coordErrors[0].message;
      setError(firstError);
      Alert.alert('Invalid Coordinates', firstError);
      return;
    }

    setLoading(true);
    setError('');

    const startLatParsed = parseFloat(startingLatitude);
    const startLngParsed = parseFloat(startingLongitude);
    const endLatParsed = parseFloat(endingLatitude);
    const endLngParsed = parseFloat(endingLongitude);
    const locLatParsed = parseFloat(latitude);
    const locLngParsed = parseFloat(longitude);

    const mapRiderTypeToDatabase = type => {
      const typeMap = {
        CAR: 'ADV 160',
        MOTORCYCLE: 'ADV 160',
        BIKE: 'ADV 160',
        SCOOTER: 'PCX 160',
        default: 'ADV 160',
      };
      return typeMap[type] || typeMap['default'];
    };

    const rideData = {
      ridesName: rideName.trim(),
      locationName: locationName.trim(),
      isLocationFromSearch: editMode // ← CHANGED
        ? isLocationFromSearchRef.current
        : locationSelected,
      riderType: mapRiderTypeToDatabase(riderType),
      date: date.toISOString(),
      description: description.trim(),
      latitude: locLatParsed || parseFloat(DEFAULT_LAT),
      longitude: locLngParsed || parseFloat(DEFAULT_LNG),
      startLat: startLatParsed,
      startLng: startLngParsed,
      endLat: endLatParsed,
      endLng: endLngParsed,
      startingPointName: startingPoint.trim(),
      endingPointName: endingPoint.trim(),
      isStartingPointFromSearch: isStartingPointFromSearchRef.current,
      isEndingPointFromSearch: isEndingPointFromSearchRef.current,
      stopPoints: buildStopPointsPayload(),
      stopPointsFromSearch: buildStopPointsFromSearchArray(),
      participants: buildParticipantsArray(),
    };

    try {
      // ── CHANGED: branch to updateRide vs createRide ─────────────────────
      const result = editMode
        ? await updateRide(editRideId, rideData)
        : await createRide(rideData);

      const generatedId =
        result?.generatedRidesId ??
        result?.ridesId ??
        result?.rideId ??
        result?.id ??
        result?.generatedId ??
        (editMode ? editRideId : typeof result === 'string' ? result : null);

      if (!generatedId) {
        const msg = ERROR_MESSAGES.RIDE_CREATION.RIDE_CREATION_NO_ID;
        setError(msg);
        Alert.alert('Warning', msg, [
          {text: 'OK', onPress: () => setLoading(false)},
        ]);
        return;
      }

      const routeCoordinates = {
        startLat: startLatParsed,
        startLng: startLngParsed,
        endLat: endLatParsed,
        endLng: endLngParsed,
        stopPoints: buildStopPointsPayload(),
        startingPointName: startingPoint,
        endingPointName: endingPoint,
      };

      await routeCache.save(generatedId, routeCoordinates).catch(() => {});

      setGeneratedRidesId(generatedId);
      pendingRideIdRef.current = generatedId;

      if (!editMode) {
        notifyRideCreated({
          generatedRidesId: generatedId,
          ridesName: rideData.ridesName,
          locationName: rideData.locationName,
          startingPointName: rideData.startingPointName,
          endingPointName: rideData.endingPointName,
          date: rideData.date,
          riderType: rideData.riderType,
          participants: rideData.participants,
          username,
        });
      }

      setCurrentStep(4);
    } catch (err) {
      const errorMsg = resolveErrorMessage(
        err,
        editMode
          ? 'Failed to update ride. Please try again.'
          : ERROR_MESSAGES.RIDE_CREATION.RIDE_CREATION_FAILED,
      );

      setError(errorMsg);

      Alert.alert(
        editMode ? 'Ride Update Failed' : 'Ride Creation Failed',
        errorMsg,
        [
          {text: 'Try Again', onPress: () => setError('')},
          {text: 'Cancel', onPress: () => setError(''), style: 'cancel'},
        ],
      );
    } finally {
      setLoading(false);
    }
  }, [
    rideName,
    date,
    startingPoint,
    endingPoint,
    startingLatitude,
    startingLongitude,
    endingLatitude,
    endingLongitude,
    locationName,
    locationSelected,
    description,
    latitude,
    longitude,
    riderType,
    participants,
    stopPoints,
    editMode,
    editRideId,
    username,
  ]);

  return {
    webViewRef,
    pendingRideIdRef,
    locationLoading,
    initialLoading, // ← NEW — consumed in CreateRide.jsx
    loading,
    error,
    currentStep,
    nextStep,
    prevStep,
    rideName,
    setRideName,
    riderType,
    setRiderType,
    date,
    setDate,
    participants,
    setParticipants,
    description,
    setDescription,
    locationName,
    setLocationName,
    latitude,
    longitude,
    locationSelected,
    rideNameImage,
    startingPoint,
    setStartingPoint,
    startingLatitude,
    startingLongitude,
    endingPoint,
    setEndingPoint,
    endingLatitude,
    endingLongitude,
    setEndingLatitude,
    setEndingLongitude,
    stopPoints,
    setStopPoints,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    setStartingPointFromSearch,
    setEndingPointFromSearch,
    handleSearchInputChange,
    handleLocationSelect,
    mapMode,
    setMapMode: _setMapMode,
    handleMessage,
    generatedRidesId,
    handleCreateRide,
  };
};

export default useCreateRide;
