import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { getLocationImage } from "../../services/rideService";
import rideRoutesPageUtilities from "../../styles/RideRoutesPageUtilities";
import LinearGradient from 'react-native-linear-gradient';
import { getStopPointsByRideId } from '../../services/startService';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import modernRideStyles from "../../styles/modernRideStyles";

const { width } = Dimensions.get('window');

const RideRoutesPage = ({ route }) => {
    const {
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

    const [stopPoints, setStopPoints] = useState([]);
    const [stopPointsLoading, setStopPointsLoading] = useState(false);
    const [stopPointsError, setStopPointsError] = useState(null);
    const [stopPointImages, setStopPointImages] = useState({});

    // Placeholder direction images
    const directionImages = [
        { id: 1, url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800", step: "Head north on main road" },
        { id: 2, url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", step: "Turn right at intersection" },
        { id: 3, url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800", step: "Continue to destination" }
    ];

    const fetchStopPointImage = async (stopName) => {
        try {
            const images = await getLocationImage(stopName, token);
            return Array.isArray(images) ? images : [];
        } catch (error) {
            console.error(`Error fetching images for ${stopName}:`, error);
            return [];
        }
    };

    const fetchPointImages = async (start, end) => {
        try {
            setStartingPointImageLoading(true);
            setEndingPointImageLoading(true);

            const [startImages, endImages] = await Promise.all([
                getLocationImage(start, token),
                getLocationImage(end, token)
            ]);

            setStartingPointImages(Array.isArray(startImages) ? startImages : []);
            setEndingPointImages(Array.isArray(endImages) ? endImages : []);
        } catch (error) {
            setStartingPointImageError(error.message);
            setEndingPointImageError(error.message);
        } finally {
            setStartingPointImageLoading(false);
            setEndingPointImageLoading(false);
        }
    };

    useEffect(() => {
        const fetchStopPoints = async () => {
            setStopPointsLoading(true);
            setStopPointsError(null);
            try {
                const data = await getStopPointsByRideId(generatedRidesId, token);
                const points = Array.isArray(data) ? data : [];
                setStopPoints(points);

                const imagesMap = {};
                for (const point of points) {
                    imagesMap[point.stopName] = await fetchStopPointImage(point.stopName);
                }
                setStopPointImages(imagesMap);
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

    useEffect(() => {
        fetchPointImages(startingPoint, endingPoint);
    }, [startingPoint, endingPoint, token]);

    return (
        <ScrollView style={rideRoutesPageUtilities.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Header Section */}
            <LinearGradient
                colors={['#000', '#1a1a1a', '#000']}
                style={rideRoutesPageUtilities.headerGradient}
            >
                <View style={rideRoutesPageUtilities.header}>
                    <View style={rideRoutesPageUtilities.headerContent}>
                        {/* Status Badge */}
                        <View style={rideRoutesPageUtilities.routeStatusContainer}>
                            <View style={rideRoutesPageUtilities.statusDot} />
                            <Text style={rideRoutesPageUtilities.statusText}>INACTIVE ROUTE</Text>
                        </View>

                        {/* Route Points Display */}
                        <View style={{ marginTop: 24 }}>
                            <View style={rideRoutesPageUtilities.routeDetailsContainer}>
                                <View style={rideRoutesPageUtilities.routePoint}>
                                    <View style={rideRoutesPageUtilities.startDot} />
                                    <Text style={[rideRoutesPageUtilities.routePointText, { fontSize: 12, color: '#888', marginBottom: 4 }]}>Starting Point</Text>
                                    <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{startingPoint}</Text>
                                </View>

                                <View style={rideRoutesPageUtilities.routeConnection}>
                                    <FontAwesome name="arrow-right" size={18} color="#2e7d32" />
                                </View>

                                <View style={rideRoutesPageUtilities.routePoint}>
                                    <View style={rideRoutesPageUtilities.endDot} />
                                    <Text style={[rideRoutesPageUtilities.routePointText, { fontSize: 12, color: '#888', marginBottom: 4 }]}>Ending Point</Text>
                                    <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{endingPoint}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Stop Points Section */}
            <View style={[rideRoutesPageUtilities.stopPointsSection, { marginTop: 24 }]}>
                <View style={rideRoutesPageUtilities.sectionHeader}>
                    <View style={rideRoutesPageUtilities.sectionTitleRow}>
                        <View style={rideRoutesPageUtilities.sectionIndicator} />
                        <Text style={rideRoutesPageUtilities.sectionTitle}>Stop Points</Text>
                        {stopPoints.length > 0 && (
                            <View style={rideRoutesPageUtilities.countBadge}>
                                <Text style={rideRoutesPageUtilities.countBadgeText}>{stopPoints.length}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {stopPointsLoading ? (
                    <View style={rideRoutesPageUtilities.loadingContainer}>
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
                            <React.Fragment key={idx}>
                                <View style={rideRoutesPageUtilities.stopPointCard}>
                                    <View style={rideRoutesPageUtilities.stopPointHeader}>
                                        <View style={rideRoutesPageUtilities.stopPointNumber}>
                                            <Text style={rideRoutesPageUtilities.stopPointNumberText}>{idx + 1}</Text>
                                        </View>
                                        <View style={rideRoutesPageUtilities.stopPointInfo}>
                                            <Text style={rideRoutesPageUtilities.stopPointName}>{point.stopName}</Text>
                                            <Text style={rideRoutesPageUtilities.stopPointCoords}>Stop #{idx + 1}</Text>
                                        </View>
                                        <FontAwesome name="map-marker" size={18} color="#666" />
                                    </View>

                                    {/* Stop Point Images */}
                                    {stopPointImages[point.stopName]?.length > 0 && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginTop: 16 }}
                                        >
                                            {stopPointImages[point.stopName].map((img, imgIdx) => (
                                                <View key={imgIdx} style={{ marginRight: 12, borderRadius: 12, overflow: 'hidden' }}>
                                                    <Image
                                                        source={{ uri: img.imageUrl }}
                                                        style={{ width: 200, height: 150, backgroundColor: '#222' }}
                                                    />
                                                    {(img.author || img.license) && (
                                                        <View style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                                            padding: 8
                                                        }}>
                                                            <Text style={{ color: '#fff', fontSize: 10 }}>
                                                                {img.author ? `Photo: ${img.author}` : ''}
                                                                {img.author && img.license ? ' | ' : ''}
                                                                {img.license ? `License: ${img.license}` : ''}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>
                                {idx < stopPoints.length - 1 && (
                                    <View style={rideRoutesPageUtilities.stopPointConnector} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                ) : (
                    <View style={rideRoutesPageUtilities.emptyStateContainer}>
                        <Text style={rideRoutesPageUtilities.emptyStateText}>No stop points on this route</Text>
                    </View>
                )}
            </View>

            {/* Direction Images Section (Placeholder) */}
            <View style={[rideRoutesPageUtilities.imageSection, { marginTop: 24 }]}>
                <View style={rideRoutesPageUtilities.sectionHeader}>
                    <View style={rideRoutesPageUtilities.sectionTitleRow}>
                        <View style={[rideRoutesPageUtilities.sectionIndicator, { backgroundColor: '#10b981' }]} />
                        <Text style={rideRoutesPageUtilities.sectionTitle}>Turn-by-Turn Directions</Text>
                        <View style={rideRoutesPageUtilities.mapBadge}>
                            <Text style={rideRoutesPageUtilities.mapBadgeText}>{directionImages.length} STEPS</Text>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    {directionImages.map((direction, idx) => (
                        <View key={direction.id} style={[rideRoutesPageUtilities.imageCard, { marginBottom: 16, marginHorizontal: 0 }]}>
                            <Image
                                source={{ uri: direction.url }}
                                style={[rideRoutesPageUtilities.image, { height: 200 }]}
                            />
                            <View style={rideRoutesPageUtilities.imageCounter}>
                                <Text style={rideRoutesPageUtilities.imageCounterText}>
                                    {idx + 1}/{directionImages.length}
                                </Text>
                            </View>
                            <View style={rideRoutesPageUtilities.imageMetaContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        backgroundColor: '#8c2323',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{idx + 1}</Text>
                                    </View>
                                    <Text style={[rideRoutesPageUtilities.imageMeta, { fontSize: 14 }]}>{direction.step}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Info Banner */}
                <View style={{
                    marginHorizontal: 20,
                    backgroundColor: '#111',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#333',
                    marginTop: 8
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <FontAwesome name="info-circle" size={18} color="#666" style={{ marginRight: 12, marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                                Direction Images
                            </Text>
                            <Text style={{ color: '#888', fontSize: 12 }}>
                                These are placeholder images. Direction photos will be available once connected to the backend.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default RideRoutesPage;