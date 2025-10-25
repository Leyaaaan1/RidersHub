// React/components/ride/RideStep4.jsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    StatusBar,
    Alert,
    FlatList,
    Animated,
    Dimensions
} from 'react-native';
import modernRideStyles from '../../styles/modernRideStyles';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { fetchRideMapImage, getRideDetails, getLocationImage } from '../../services/rideService';
import ParticipantListModal from '../ParticipantListModal';
import useJoinRide from './RideHandler';
import { startService } from "../../services/startService";
import rideRoutesPageUtilities from "../../styles/RideRoutesPageUtilities";
import RouteMapView from "../../utils/RouteMapView";

const { width } = Dimensions.get('window');

const RideStep4 = (props) => {
    const navigation = useNavigation();
    const route = props.route || {};
    const routeParams = route.params || {};

    const {
        generatedRidesId = props.generatedRidesId || routeParams.generatedRidesId,
        rideName = props.rideName || routeParams.rideName,
        locationName = props.locationName || routeParams.locationName,
        riderType = props.riderType || routeParams.riderType,
        date = props.date || routeParams.date,
        startingPoint = props.startingPoint || routeParams.startingPoint,
        endingPoint = props.endingPoint || routeParams.endingPoint,
        participants = props.participants || routeParams.participants,
        description = props.description || routeParams.description,
        token = props.token || routeParams.token,
        distance = props.distance || routeParams.distance,
        username = props.username || routeParams.username,
        stopPoints = props.stopPoints || routeParams.stopPoints,
        currentUsername = props.currentUsername || routeParams.currentUsername,
    } = props;

    console.log("RideStep4 Props:", props);
    console.log("currentUsername:", currentUsername);
    console.log("username:", username);
    // Animation values
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [pulseAnim] = useState(new Animated.Value(1));

    // State variables
    const [mapImage, setMapImage] = useState(null);
    const [startMapImage, setStartMapImage] = useState(null);
    const [endMapImage, setEndMapImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [distanceState, setDistance] = useState(distance || "--");
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [rideNameImage, setRideNameImage] = useState(null);
    const [rideNameImageLoading, setRideNameImageLoading] = useState(false);
    const [rideNameImageError, setRideNameImageError] = useState(null);

    const { loading: joiningRide, joinRide } = useJoinRide();

    // Start animations on component mount
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();

        // Start pulse animation
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();

        return () => pulseAnimation.stop();
    }, []);

    const formatDate = (date) => {
        if (!date) return 'Not specified';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return date.toString();
        const options = { month: 'long', day: '2-digit', year: 'numeric' };
        const datePart = d.toLocaleDateString('en-US', options);
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${datePart} ${hours}:${minutes}${ampm}`;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const fetchLocationImage = async (rideName) => {
        if (!rideName || !token) {
            console.log("Missing ride name or token for image fetch");
            return;
        }

        try {
            setRideNameImageLoading(true);
            setRideNameImageError(null);
            const imageDataList = await getLocationImage(rideName, token);
            console.log("Location image data list:", imageDataList);
            setRideNameImage(Array.isArray(imageDataList) ? imageDataList : []);
            return imageDataList;
        } catch (error) {
            console.error("Failed to fetch location images:", error);
            setRideNameImageError(error.message || "Failed to load location images");
            return null;
        } finally {
            setRideNameImageLoading(false);
        }
    };

    const handleJoinRide = () => {
        if (!generatedRidesId || !token) {
            Alert.alert("Error", "Missing ride information. Please try again.");
            return;
        }
        joinRide(generatedRidesId, token, () => {
            console.log("Successfully requested to join ride");
        });
    };

    const getRideTypeIcon = (type) => {
        switch (type) {
            case 'car':
                return 'car';
            case 'motor':
                return 'motorcycle';
            case 'bike':
                return 'bicycle';
            case 'cafe Racers':
                return 'rocket';
            default:
                return 'circle';
        }
    };

    // Fetch effects
    useEffect(() => {
        if (locationName && token) {
            fetchLocationImage(locationName);
        }
    }, [locationName, token]);

    useEffect(() => {
        const getMapImage = async () => {
            if (!generatedRidesId) return;

            try {
                setImageLoading(true);
                const imageUrl = await fetchRideMapImage(generatedRidesId, token);
                setMapImage(imageUrl);
            } catch (error) {
                if (error.response) {
                    console.error("Response status:", error.response.status);
                }
            } finally {
                setImageLoading(false);
            }
        };

        getMapImage();
    }, [generatedRidesId, token]);

    useEffect(() => {
        if (!generatedRidesId || !token) {
            console.log("Missing required data for ride details:", { generatedRidesId, token });
            return;
        }

        console.log("Fetching ride details for ID:", generatedRidesId);
        setImageLoading(true);

        getRideDetails(generatedRidesId, token)
            .then(rideDetails => {
                if (rideDetails.magImageStartingLocation) {
                    setStartMapImage(rideDetails.magImageStartingLocation);
                }
                if (rideDetails.magImageEndingLocation) {
                    setEndMapImage(rideDetails.magImageEndingLocation);
                }

                if (rideDetails && typeof rideDetails.distance !== 'undefined') {
                    setDistance(rideDetails.distance);
                } else {
                    setDistance("N/A");
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error("Response status:", error.response.status);
                }
                setDistance("Error");
            })
            .finally(() => {
                setImageLoading(false);
            });
    }, [generatedRidesId, token]);

    return (
        <Animated.View style={[modernRideStyles.container, { opacity: fadeAnim }]}>
            <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" translucent={false} />

            {/* Header */}
            <View style={modernRideStyles.header}>
                <View style={modernRideStyles.headerLeft}>
                    <TouchableOpacity style={modernRideStyles.backButton} onPress={handleBack}>
                        <FontAwesome name="chevron-left" size={14} color="#fff" />
                        <Text style={modernRideStyles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <View style={modernRideStyles.headerCenter}>
                    <Text style={modernRideStyles.locationTitle}>
                        {locationName?.toUpperCase()}
                    </Text>
                    <Text style={modernRideStyles.rideId}>
                        {generatedRidesId}
                    </Text>
                </View>

                <View style={modernRideStyles.headerRight}>
                    {username !== currentUsername ? (
                        <TouchableOpacity style={modernRideStyles.joinButton} onPress={handleJoinRide}>
                            <Text style={modernRideStyles.joinButtonText}>Join Ride</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={modernRideStyles.startButton}
                            onPress={async () => {
                                try {
                                    await startService.startRide(generatedRidesId, token);
                                    navigation.navigate('StartedRide', {
                                        generatedRidesId,
                                        token,
                                    });
                                } catch (error) {
                                    Alert.alert('Error', error.message || 'Failed to start the ride.');
                                }
                            }}
                        >
                            <FontAwesome name="play-circle" size={32} color="#8c2323" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Main Content */}
            <Animated.View style={[modernRideStyles.fadeContainer, { transform: [{ translateY: slideAnim }] }]}>
                <ScrollView style={modernRideStyles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Full Screen Map Section */}
                    <Animated.View style={[rideRoutesPageUtilities.mapSection, { opacity: fadeAnim, width: '100%', height: 400 }]}>
                        <RouteMapView
                            generatedRidesId={generatedRidesId}
                            token={token}
                            startingPoint={startingPoint}
                            endingPoint={endingPoint}
                            stopPoints={stopPoints}
                            style={{ flex: 1 }}
                            isDark={true}
                        />
                    </Animated.View>

                    {/* Hero Section - Now Below Map */}
                    <View style={modernRideStyles.heroSection}>
                        <View style={{ flex: 2, alignItems: 'center', padding: 10 }}>
                            <Text style={modernRideStyles.rideTitle}>{rideName}</Text>
                        </View>

                        <View style={[modernRideStyles.statsSection, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            {/* Username on the left */}
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                <FontAwesome name="user" size={16} color="#8c2323" style={modernRideStyles.statIcon} />
                                <Text style={modernRideStyles.ownerText}>{username}</Text>
                            </View>
                            <View style={modernRideStyles.dateContainer}>
                                <Text style={modernRideStyles.dateText}>{formatDate(date)}</Text>
                            </View>

                            <Animated.View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                                <FontAwesome name={getRideTypeIcon(riderType)} size={20} color="#8c2323" />
                            </Animated.View>
                        </View>

                        {/* Location Images */}
                        <View style={modernRideStyles.imagesSection}>
                            <View style={modernRideStyles.locationImagesContainer}>
                                {rideNameImageLoading ? (
                                    <View style={modernRideStyles.loadingContainer}>
                                        <ActivityIndicator size="large" color="#8c2323" />
                                        <Text style={modernRideStyles.loadingText}>Loading location images...</Text>
                                    </View>
                                ) : Array.isArray(rideNameImage) && rideNameImage.length > 0 ? (
                                    <FlatList
                                        data={rideNameImage}
                                        horizontal
                                        pagingEnabled
                                        keyExtractor={(_, idx) => idx.toString()}
                                        renderItem={({ item }) => (
                                            <View style={modernRideStyles.imageContainer}>
                                                <Image
                                                    source={{ uri: item.imageUrl }}
                                                    style={modernRideStyles.locationImage}
                                                />
                                                {(item.author || item.license) && (
                                                    <View style={modernRideStyles.imageMetaContainer}>
                                                        <Text style={modernRideStyles.imageMeta}>
                                                            {item.author ? `Photo: ${item.author}` : ''}
                                                            {item.author && item.license ? ' | ' : ''}
                                                            {item.license ? `License: ${item.license}` : ''}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                ) : (
                                    <View style={modernRideStyles.errorContainer}>
                                        <Text style={modernRideStyles.errorText}>
                                            {rideNameImageError || "No location images available"}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Description Section */}
                    {description && (
                        <View style={modernRideStyles.descriptionSection}>
                            <Text style={modernRideStyles.descriptionTitle}>
                                About This Ride{'  '}
                                <FontAwesome name="road" size={14} color="#8c2323" />
                                <Text style={modernRideStyles.distanceContainer}>
                                    {' '}
                                    <Text style={modernRideStyles.distanceText}>{distance} km</Text>
                                </Text>
                            </Text>
                            <Text style={modernRideStyles.descriptionText}>{description}</Text>
                        </View>
                    )}
                </ScrollView>
            </Animated.View>
            {/* Bottom Navigation */}
            <View style={modernRideStyles.bottomNav}>
                <View style={modernRideStyles.bottomNavItem}>
                    <TouchableOpacity
                        style={modernRideStyles.bottomNavButton}
                        onPress={() => setShowParticipantsModal(true)}
                    >
                        <Text style={modernRideStyles.bottomNavText}>Riders</Text>
                    </TouchableOpacity>
                </View>

                <View style={modernRideStyles.bottomNavItem}>
                    <TouchableOpacity
                        style={modernRideStyles.bottomNavButton}
                        onPress={() => navigation.navigate('RideRoutesPage', {
                            startMapImage,
                            endMapImage,
                            mapImage,
                            rideNameImage,
                            startingPoint,
                            endingPoint,
                            rideName,
                            locationName,
                            riderType,
                            date,
                            participants,
                            description,
                            token,
                            distance,
                            username,
                            currentUsername,
                            generatedRidesId
                        })}
                    >
                        <Text style={modernRideStyles.bottomNavText}>Routes</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modals */}
            <ParticipantListModal
                visible={showParticipantsModal}
                onClose={() => setShowParticipantsModal(false)}
                participants={participants}
                generatedRidesId={generatedRidesId}
                token={token}
                onRideSelect={(ride) => {
                    setShowParticipantsModal(false);
                }}
                username={username}
                currentUsername={currentUsername}
            />
        </Animated.View>
    );
};

export default RideStep4;