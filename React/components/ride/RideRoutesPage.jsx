import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, StatusBar, TouchableOpacity, Animated, Dimensions } from 'react-native';
import MapImageSwapper from "../../styles/MapImageSwapper";
import { getLocationImage } from "../../services/rideService";
import rideRoutesPageUtilities from "../../styles/RideRoutesPageUtilities";
import LinearGradient from 'react-native-linear-gradient';
import imageStyles from "../../styles/ImageStyles";
import { getStopPointsByRideId } from '../../services/startService';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RideImagesCarousel from "../../styles/RideImagesCarousel";


const RideRoutesPage = ({ route }) => {
    const {
        startMapImage,
        endMapImage,
        startingPoint,
        generatedRidesId,
        endingPoint,
        token,
    } = route.params;

    const [startingPointImages, setStartingPointImages] = useState([]);
    const [endingPointImages, setEndingPointImages] = useState([]);
    const [startingPointImageLoading, setStartingPointImageLoading] = useState(false);
    const [endingPointImageLoading, setEndingPointImageLoading] = useState(false);
    const [startingPointImageError, setStartingPointImageError] = useState(null);
    const [endingPointImageError, setEndingPointImageError] = useState(null);
    const [showStart, setShowStart] = useState(true);

    const [stopPoints, setStopPoints] = useState([]);
    const [stopPointsLoading, setStopPointsLoading] = useState(false);
    const [stopPointsError, setStopPointsError] = useState(null);

    // Animation values
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [pulseAnim] = useState(new Animated.Value(1));

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
                    toValue: 1.2,
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

    useEffect(() => {
        const fetchStopPoints = async () => {
            setStopPointsLoading(true);
            setStopPointsError(null);
            try {
                const data = await getStopPointsByRideId(generatedRidesId, token);
                setStopPoints(Array.isArray(data) ? data : []);
            } catch (err) {
                setStopPointsError(err.message || "Failed to load stop points");
            } finally {
                setStopPointsLoading(false);
            }
        };
        if (generatedRidesId && token) {
            fetchStopPoints();
        }
    }, [token, generatedRidesId]);

    const fetchPointImages = async (start, end) => {
        if (!start || !

            end || !token) {
            setStartingPointImageError("Missing starting point, ending point, or token");
            setEndingPointImageError("Missing starting point, ending point, or token");
            return;
        }

        setStartingPointImageLoading(true);
        setEndingPointImageLoading(true);
        setStartingPointImageError(null);
        setEndingPointImageError(null);

        try {
            const startImages = await getLocationImage(start, token);
            setStartingPointImages(Array.isArray(startImages) ? startImages : []);
        } catch (error) {
            setStartingPointImageError(error.message || "Failed to load starting point images");
        } finally {
            setStartingPointImageLoading(false);
        }

        try {
            const endImages = await getLocationImage(end, token);
            setEndingPointImages(Array.isArray(endImages) ? endImages : []);
        } catch (error) {
            setEndingPointImageError(error.message || "Failed to load ending point images");
        } finally {
            setEndingPointImageLoading(false);
        }
    };

    useEffect(() => {
        fetchPointImages(startingPoint, endingPoint);
    }, [startingPoint, endingPoint, token]);

    const images = showStart ? startingPointImages : endingPointImages;
    const imagesLoading = showStart ? startingPointImageLoading : endingPointImageLoading;
    const imagesError = showStart ? startingPointImageError : endingPointImageError;

    const currentLabel = showStart ? 'Starting Point' : 'Destination';
    const otherLabel = showStart ? 'Destination' : 'Starting Point';

    return (
        <ScrollView style={rideRoutesPageUtilities.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <LinearGradient
                colors={['#000', '#1a1a1a', '#000']}
                style={rideRoutesPageUtilities.headerGradient}
            >
                <Animated.View style={[rideRoutesPageUtilities.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={rideRoutesPageUtilities.headerContent}>
                        <View style={rideRoutesPageUtilities.routeDetailsContainer}>
                            <View style={rideRoutesPageUtilities.routePoint}>
                                <View style={rideRoutesPageUtilities.startDot} />
                                <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{startingPoint}</Text>
                            </View>
                            <View style={rideRoutesPageUtilities.routeConnection}>
                                <FontAwesome name="arrow-right" size={18} color="#2e7d32" style={{ alignSelf: 'center', marginVertical: 2 }} />
                            </View>
                            <View style={rideRoutesPageUtilities.routePoint}>
                                <View style={rideRoutesPageUtilities.endDot} />
                                <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{endingPoint}</Text>
                            </View>
                        </View>

                    </View>
                </Animated.View>
            </LinearGradient>



            <RideImagesCarousel
                images={images}
                imagesLoading={imagesLoading}
                imagesError={imagesError}
                pulseAnim={pulseAnim}
            />
            <Animated.View style={[rideRoutesPageUtilities.mapSection, { opacity: fadeAnim }]}>
                <View style={rideRoutesPageUtilities.sectionHeader}>
                </View>
                <View style={rideRoutesPageUtilities.mapContainer}>
                    <MapImageSwapper
                        startImage={startMapImage}
                        endImage={endMapImage}
                        startPoint={startingPoint}
                        endPoint={endingPoint}
                        showStart={showStart}
                        setShowStart={setShowStart}
                    />
                </View>
            </Animated.View>

            <Animated.View style={[rideRoutesPageUtilities.stopPointsSection, { opacity: fadeAnim }]}>
                <Text style={{ color: '#fff' }}>
                    <FontAwesome name="map-marker" size={16} color="#fff" /> Stop Points {stopPoints.length > 0 ? `(${stopPoints.length})` : ''}
                </Text>
                {stopPointsLoading ? (
                    <View style={rideRoutesPageUtilities.loadingContainer}>
                        <Animated.View style={[rideRoutesPageUtilities.loadingDot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={rideRoutesPageUtilities.loadingText}>Loading stop points...</Text>
                    </View>
                ) : stopPointsError ? (
                    <View style={rideRoutesPageUtilities.errorContainer}>
                        <Text style={rideRoutesPageUtilities.errorIcon}>⚠️</Text>
                        <Text style={rideRoutesPageUtilities.errorText}>{stopPointsError}</Text>
                    </View>
                ) : stopPoints.length > 0 ? (
                    <View style={rideRoutesPageUtilities.stopPointsList}>
                        {stopPoints.map((point, idx) => (
                            <View key={idx} style={rideRoutesPageUtilities.stopPointCard}>
                                <View style={rideRoutesPageUtilities.stopPointHeader}>
                                    <View style={rideRoutesPageUtilities.stopPointNumber}>
                                        <Text style={rideRoutesPageUtilities.stopPointNumberText}>{idx + 1}</Text>
                                    </View>
                                    <View style={rideRoutesPageUtilities.stopPointInfo}>
                                        <Text style={rideRoutesPageUtilities.stopPointName}>{point.stopName}</Text>

                                    </View>
                                </View>

                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={rideRoutesPageUtilities.emptyStateContainer}>
                        <Text style={rideRoutesPageUtilities.emptyStateText}>No stop points on this route</Text>
                    </View>
                )}
            </Animated.View>
        </ScrollView>
    );
};

export default RideRoutesPage;