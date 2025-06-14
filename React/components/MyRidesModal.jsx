// Create a new component: React/components/MyRidesModal.jsx
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Image,
    SafeAreaView
} from 'react-native';
import { fetchMyRides } from '../services/rideService';
import utilities from "../styles/utilities";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const MyRidesModal = ({ visible, onClose, token, onRideSelect }) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (visible) {
            loadMyRides();
        }
    }, [visible, token]);

    const loadMyRides = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await fetchMyRides(token);
            setRides(result);
        } catch (err) {
            setError(err.message || 'Failed to load your rides');
        } finally {
            setLoading(false);
        }
    };

    const renderRideItem = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => onRideSelect && onRideSelect(item)}>
            <View style={{
                backgroundColor: "#151515",
                padding: 15,
                borderRadius: 12,
                marginBottom: 15,
                borderLeftWidth: 0,
                borderRightWidth: 0,
            }}>
                <Text style={[utilities.titleText, { fontSize: 22, textAlign: 'center', marginBottom: 0 }]}>
                    {item.locationName.toUpperCase()}
                </Text>
                <Text style={[utilities.smallText, { marginTop: -5, textAlign: 'center' }]}>ID: {item.generatedRidesId}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[utilities.titleText, { fontSize: 18, flexShrink: 1 }]}>
                        {item.ridesName}
                    </Text>
                    <FontAwesome name="map-marker" size={18} color={colors.white} />
                </View>

                <Text style={[utilities.smallText, { fontWeight: 'bold', marginTop: 5 }]}>
                    {item.startingPointName} <FontAwesome name="arrow-right" size={12} color="#fff" /> {item.endingPointName}
                </Text>

                <Text style={[utilities.smallText, { marginTop: 5 }]}>
                    {item.date ? new Date(item.date).toLocaleString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }) : ''}
                </Text>

                {item.mapImageUrl && (
                    <Image
                        source={{ uri: item.mapImageUrl }}
                        style={{ width: '100%', height: 120, borderRadius: 6, marginTop: 8, borderWidth: 1, borderColor: colors.primary }}
                        resizeMode="cover"
                    />
                )}
            </View>
        </TouchableWithoutFeedback>
    );

    const renderEmpty = () => (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#ddd' }}>You haven't created any rides yet</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
                <View style={{ flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#333' }}>
                    <TouchableOpacity onPress={onClose} style={{ marginRight: 15 }}>
                        <FontAwesome name="arrow-left" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <Text style={[utilities.titleText, { fontSize: 20 }]}>My Rides</Text>
                </View>

                {error ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: 'red' }}>{error}</Text>
                        <TouchableOpacity
                            style={[utilities.button, { marginTop: 15 }]}
                            onPress={loadMyRides}
                        >
                            <Text style={utilities.buttonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={rides}
                        renderItem={renderRideItem}
                        keyExtractor={(item) => item.generatedRidesId.toString()}
                        ListEmptyComponent={loading ? null : renderEmpty}
                        contentContainerStyle={{ padding: 15 }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={loading ? (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : null}
                    />
                )}
            </SafeAreaView>
        </Modal>
    );
};

export default MyRidesModal;