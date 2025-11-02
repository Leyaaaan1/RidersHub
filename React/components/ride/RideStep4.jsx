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
import RouteMapView from "../../utilities/route/RouteMapView";

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
            <StatusBar backgroundColor="#000" barStyle="light-content" translucent={false} />

            {/* Modern Header */}
            <View style={modernRideStyles.modernHeader}>
                <TouchableOpacity style={modernRideStyles.modernBackButton} onPress={handleBack}>
                    <FontAwesome name="arrow-left" size={18} color="#fff" />
                </TouchableOpacity>

                <View style={modernRideStyles.modernHeaderCenter}>
                    <Text style={modernRideStyles.modernHeaderTitle} numberOfLines={1}>
                        {locationName}
                    </Text>
                    <Text style={modernRideStyles.modernHeaderSubtitle}>
                        ID: {generatedRidesId}
                    </Text>
                </View>

                <View style={modernRideStyles.modernHeaderRight}>
                    {username !== currentUsername ? (
                        <TouchableOpacity style={modernRideStyles.modernJoinButton} onPress={handleJoinRide}>
                            <FontAwesome name="plus" size={14} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={modernRideStyles.modernJoinButtonText}>Join</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={modernRideStyles.modernStartButton}
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
                            <FontAwesome name="play" size={16} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Animated.View style={[modernRideStyles.fadeContainer, { transform: [{ translateY: slideAnim }] }]}>
                    {/* Hero Card */}
                    <View style={modernRideStyles.sectionContainer}>

                        <View style={modernRideStyles.mapWrapper}>
                            <RouteMapView
                                generatedRidesId={generatedRidesId}
                                token={token}
                                startingPoint={startingPoint}
                                endingPoint={endingPoint}
                                stopPoints={stopPoints}
                                style={{ flex: 1 }}
                                isDark={true}
                            />
                        </View>
                    </View>
                    <ScrollView style={modernRideStyles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={modernRideStyles.heroCard}>
                        <View style={modernRideStyles.heroCardHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={modernRideStyles.heroCardTitle}>{rideName}</Text>
                                <View style={modernRideStyles.heroCardMeta}>
                                    <FontAwesome name="user-circle" size={14} color="#8c2323" />
                                    <Text style={modernRideStyles.heroCardMetaText}>{username}</Text>
                                </View>
                            </View>
                            <View style={modernRideStyles.rideTypeBadge}>
                                <FontAwesome name={getRideTypeIcon(riderType)} size={20} color="#fff" />
                            </View>
                        </View>

                        {/* Date & Distance Info */}
                        <View style={modernRideStyles.infoRow}>
                            <View style={modernRideStyles.infoCard}>
                                <FontAwesome name="calendar" size={14} color="#8c2323" style={{ marginBottom: 6 }} />
                                <Text style={modernRideStyles.infoCardLabel}>Date & Time</Text>
                                <Text style={modernRideStyles.infoCardValue} numberOfLines={2}>
                                    {formatDate(date)}
                                </Text>
                            </View>
                            <View style={modernRideStyles.infoCard}>
                                <FontAwesome name="road" size={14} color="#10b981" style={{ marginBottom: 6 }} />
                                <Text style={modernRideStyles.infoCardLabel}>Distance</Text>
                                <Text style={modernRideStyles.infoCardValue}>{distanceState} km</Text>
                            </View>
                        </View>

                        {/* Route Summary */}
                        <View style={modernRideStyles.routeSummary}>
                            <View style={modernRideStyles.routePoint}>
                                <View style={modernRideStyles.routePointDot} />
                                <View style={{ flex: 1 }}>
                                    <Text style={modernRideStyles.routePointLabel}>From</Text>
                                    <Text style={modernRideStyles.routePointText}>{startingPoint}</Text>
                                </View>
                            </View>

                            <View style={modernRideStyles.routeConnector}>
                                <View style={modernRideStyles.routeConnectorLine} />
                                <FontAwesome name="long-arrow-down" size={16} color="#666" />
                            </View>

                            <View style={modernRideStyles.routePoint}>
                                <View style={[modernRideStyles.routePointDot, { backgroundColor: '#10b981' }]} />
                                <View style={{ flex: 1 }}>
                                    <Text style={modernRideStyles.routePointLabel}>To</Text>
                                    <Text style={modernRideStyles.routePointText}>{endingPoint}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Map Section */}

                    {/* Description Section */}
                    {description && (
                        <View style={modernRideStyles.sectionContainer}>
                            <View style={modernRideStyles.sectionHeaderRow}>
                                <View style={modernRideStyles.sectionIndicator} />
                                <Text style={modernRideStyles.sectionTitle}>About This Ride</Text>
                            </View>
                            <View style={modernRideStyles.descriptionCard}>
                                <Text style={modernRideStyles.descriptionCardText}>{description}</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </Animated.View>

            {/* Modern Bottom Navigation */}
            <View style={modernRideStyles.modernBottomNav}>
                <TouchableOpacity
                    style={modernRideStyles.modernBottomNavButton}
                    onPress={() => setShowParticipantsModal(true)}
                >
                    <FontAwesome name="users" size={18} color="#fff" />
                    <Text style={modernRideStyles.modernBottomNavText}>Riders</Text>
                </TouchableOpacity>

                <View style={modernRideStyles.modernBottomNavDivider} />

                <TouchableOpacity
                    style={modernRideStyles.modernBottomNavButton}
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
                    <FontAwesome name="map-marker" size={18} color="#fff" />
                    <Text style={modernRideStyles.modernBottomNavText}>Routes</Text>
                </TouchableOpacity>
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