// React/components/RidesList.jsx
import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, TouchableWithoutFeedback} from 'react-native';
import { fetchRides } from '../services/rideService';
import utilities from "../styles/utilities";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const RidesList = ({
                       token,
                       initialPage = 0,
                       pageSize = 5,
                       onRideSelect,
                       emptyMessage = "No rides found",
                       headerComponent = null,
                       style = {}
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

    const renderRideItem = ({ item }) => (

        <TouchableWithoutFeedback
            onPress={() => onRideSelect && onRideSelect(item)}
        >


            <View style={{
                backgroundColor: "#151515",
                padding: 25,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0,  },
                borderLeftWidth: 0,
                borderRightWidth: 0,
            }}>
                <Text style={[utilities.titleText, { fontSize: 35, textAlign: 'center', alignSelf: 'center', marginBottom: 0, paddingBottom: 0 }]}>{item.locationName.toUpperCase()}</Text>
                <Text style={[utilities.smallText, { marginTop: -8 } ]}>ID: {item.generatedRidesId}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                        style={[utilities.titleText, { fontSize: 25, flexShrink: 1, flexWrap: 'wrap' }]}
                    >
                        {item.ridesName}
                    </Text>
                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                        <FontAwesome
                            name="map-marker"
                            size={24}
                            color={colors.white}
                            style={{  marginRight: 5, marginTop: -15 }}
                        />
                    </View>
                </View>
                <Text style={[utilities.smallText, { fontWeight: 'bold', fontSize: 15, marginTop: 5, textAlign: 'center' }]}>
                    {item.startingPointName} <FontAwesome name="arrow-right" size={16} color="#fff" /> {item.endingPointName}
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'flex-start' }}>
                    {/* Left Side */}
                    <View style={{ flex: 1, paddingRight: 10 }}>


                        <Text style={[utilities.smallText, { marginBottom: 6 }]}>
                            {item.date ? new Date(item.date).toLocaleString('en-US', {
                                month: 'long',
                                day: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }) : ''}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome
                                name={
                                    item.riderType === 'car' ? 'car' :
                                        item.riderType === 'motor' || item.riderType === 'Motorcycle' ? 'motorcycle' :
                                            item.riderType === 'bike' || item.riderType === 'Bicycle' ? 'bicycle' :
                                                item.riderType === 'cafe Racers' ? 'rocket' : 'user'
                                }
                                size={14}
                                color="#fff"
                                style={{ marginRight: 5 }}
                            />
                            <Text style={[utilities.smallText, { fontSize: 12 }]}>
                                {item.distance} km
                            </Text>
                        </View>
                    </View>

                    {/* Right Side (Location) */}

                </View>


                {/* Map image (unchanged size) */}
                {item.mapImageUrl && (
                    <Image
                        source={{ uri: item.mapImageUrl }}
                        style={{ width: '100%', height: 200, borderRadius: 6, marginTop: 8, borderWidth: 2, borderColor: colors.primary }}
                        resizeMode="cover"
                    />
                )}
                {item.description && (
                    <View style={{ marginTop: 10, padding: 5 }}>
                        <Text style={[utilities.smallText, { lineHeight: 18 }]}>
                            {item.description}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
    const renderFooter = () => {
        if (!loading || refreshing) return null;

        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading && !refreshing && rides.length === 0) return null;

        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>{emptyMessage}</Text>
            </View>
        );
    };

    return (
        <View>
            {error ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red' }}>{error}</Text>
                    <TouchableOpacity
                        style={[utilities.button, { marginTop: 10 }]}
                        onPress={handleRefresh}
                    >
                        <Text style={utilities.buttonText}>Retry</Text>
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
                    contentContainerStyle={{ paddingVertical: 15, paddingHorizontal: 0 }}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    showsVerticalScrollIndicator={false}

                />
            )}

        </View>

    );
};

export default RidesList;