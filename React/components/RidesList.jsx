// React/components/RidesList.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
        <TouchableOpacity
            style={{
                backgroundColor: colors.primary,
                padding: 15,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
            }}
            onPress={() => onRideSelect && onRideSelect(item)}
        >
            {/* Header with ride name/ID and location */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                    <Text style={[utilities.titleText, { fontSize: 16 }]}>{item.ridesName}</Text>
                    <Text style={utilities.smallText}>ID: {item.generatedRidesId}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FontAwesome
                        name="map-marker"
                        size={30}
                        color="#fff"
                        style={{ marginRight: 5, alignSelf: 'flex-start', marginTop: 9 }}
                    />
                    <Text style={[utilities.titleText, { fontSize: 30 }]}>{item.locationName}</Text>
                </View>
            </View>

            {/* Date and ride details */}
            <View style={{ marginBottom: 8 }}>
                <Text style={[utilities.smallText, { color: '#ddd', marginBottom: 6 }]}>{item.date}</Text>

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

            {/* Map image (unchanged size) */}
            {item.mapImageUrl && (
                <Image
                    source={{ uri: item.mapImageUrl }}
                    style={{ width: '100%', height: 300, borderRadius: 6, marginTop: 8 }}
                    resizeMode="cover"
                />
            )}
        </TouchableOpacity>
    );    const renderFooter = () => {
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
                    contentContainerStyle={{ padding: 10 }}
                />
            )}
        </View>
    );
};

export default RidesList;