// React/components/RidesList.jsx
import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, TouchableWithoutFeedback, Animated} from 'react-native';
import { fetchRides } from '../services/rideService';
import utilities from "../styles/utilities";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { rideCardStyles } from '../styles/rideCardStyles';

const RideCard = ({ item, onPress }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        // Fade and slide animation on mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for distance badge
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

    const getRideTypeIcon = (riderType) => {
        switch (riderType) {
            case 'car':
                return 'car';
            case 'motor':
            case 'Motorcycle':
                return 'motorcycle';
            case 'bike':
            case 'Bicycle':
                return 'bicycle';
            case 'cafe Racers':
                return 'rocket';
            default:
                return 'user';
        }
    };

    return (
        <Animated.View
            style={[
                rideCardStyles.cardContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <TouchableWithoutFeedback onPress={() => onPress && onPress(item)}>
                <View style={rideCardStyles.cardContent}>
                    {/* Header Section */}
                    <View style={rideCardStyles.headerSection}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Text style={rideCardStyles.rideTitle}>
                                {item.locationName}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Animated.View
                                style={[
                                    rideCardStyles.distanceBadge,
                                    { transform: [{ scale: pulseAnim }], marginRight: 8 }
                                ]}
                            >
                                <FontAwesome
                                    name={getRideTypeIcon(item.riderType)}
                                    size={15}
                                    color="#fff"
                                    style={rideCardStyles.distanceIcon}
                                />
                                <Text style={rideCardStyles.distanceText}>
                                    {item.distance} km
                                </Text>
                            </Animated.View>
                            <View style={rideCardStyles.rideIdBadge}>
                                <Text style={rideCardStyles.rideIdText}>
                                    #{item.generatedRidesId}
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* Location Section */}
                    <View style={rideCardStyles.locationSection}>
                        <FontAwesome
                            name="map-marker"
                            size={16}
                            color={colors.primary}
                            style={rideCardStyles.locationIcon}
                        />
                        <Text style={rideCardStyles.locationText}>
                            {item.ridesName}
                        </Text>
                    </View>
                    {item.date ? (
                        <Text style={[rideCardStyles.dateText, { marginLeft: 8 }]}>
                            {new Date(item.date).toLocaleString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </Text>
                    ) : null}

                    {/* Owner Section */}
                    <View style={rideCardStyles.ownerSection}>
                        <FontAwesome
                            name="user-circle"
                            size={14}
                            color="#666"
                            style={rideCardStyles.ownerIcon}
                        />
                        <Text style={rideCardStyles.ownerText}>
                            Created by {item.username}
                        </Text>
                    </View>

                    {/* Route Section */}
                    <View style={rideCardStyles.routeSection}>
                        <Text style={rideCardStyles.routeText}>
                            {item.startingPointName}
                        </Text>
                        <FontAwesome
                            name="arrow-right"
                            size={14}
                            color={colors.primary}
                            style={rideCardStyles.routeArrow}
                        />
                        <Text style={rideCardStyles.routeText}>
                            {item.endingPointName}
                        </Text>
                    </View>



                    {/* Map Image */}
                    {item.mapImageUrl && (
                        <View style={rideCardStyles.mapContainer}>
                            <Image
                                source={{ uri: item.mapImageUrl }}
                                style={rideCardStyles.mapImage}
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    {/* Description */}
                    {item.description && (
                        <View style={rideCardStyles.descriptionSection}>
                            <Text style={rideCardStyles.descriptionText}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    );
};

const RidesList = ({
                       token,
                       initialPage = 0,
                       pageSize = 5,
                       onRideSelect,
                       emptyMessage = "No rides found",
                       headerComponent = null,
                       renderActionButton,
                       style = {},
                   }) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    console.log('RidesList mounted with token:', rides);

    const loadRides = async (pageNum = page, refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
            } else if (!refresh && !hasMore) {
                return;
            } else {
                setLoading(true);
            }

            setError('');

            const result = await fetchRides(token, pageNum, pageSize);

            if (result && result.content) {
                if (refresh) {
                    setRides(result.content);
                } else {
                    setRides(prev => [...prev, ...result.content]);
                }

                setHasMore(!result.last);
                setPage(result.number);
            }
        } catch (err) {
            setError(err.message || 'Failed to load rides');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadRides(initialPage, true);
    }, [token, initialPage, pageSize]);

    const handleRefresh = () => {
        loadRides(0, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadRides(page + 1);
        }
    };

    const renderRideItem = ({ item, index }) => (
        <RideCard
            item={item}
            onPress={onRideSelect}
        />
    );

    const renderFooter = () => {
        if (!loading || refreshing) return null;

        return (
            <View style={rideCardStyles.footerContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading && !refreshing && rides.length === 0) return null;

        return (
            <View style={rideCardStyles.emptyContainer}>
                <FontAwesome name="road" size={48} color="#666" />
                <Text style={rideCardStyles.emptyText}>{emptyMessage}</Text>
            </View>
        );
    };

    return (
        <View style={[rideCardStyles.container, style]}>
            {error ? (
                <View style={rideCardStyles.errorContainer}>
                    <FontAwesome name="exclamation-triangle" size={24} color="red" />
                    <Text style={rideCardStyles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={rideCardStyles.retryButton}
                        onPress={handleRefresh}
                    >
                        <Text style={rideCardStyles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={rides}
                    renderItem={renderRideItem}
                    keyExtractor={(item) => item.generatedRidesId.toString()}
                    ListHeaderComponent={headerComponent}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ItemSeparatorComponent={() => <View style={rideCardStyles.separator} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={rideCardStyles.flatListContent}
                />
            )}
        </View>
    );
};

export default RidesList;