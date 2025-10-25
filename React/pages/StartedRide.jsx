import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    ActivityIndicator,
    PermissionsAndroid, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import styles from '../styles/StartedRideStyles';
import { getCurrentStartedRides } from "../services/startService";
import rideUtilities from "../styles/rideUtilities";

const StartedRide = ({ route }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [rideData, setRideData] = useState(null);
    const { generatedRidesId, token } = route.params || {};

    console.log('Generated Rides ID:', generatedRidesId);
    console.log('Token:', token);
    console.log('Route Params:', route.params);

    useEffect(() => {
        const fetchStartedRide = async () => {
            try {
                const rides = await getCurrentStartedRides(token);
                const currentRide = Array.isArray(rides)
                    ? rides.find(r => r.generatedRidesId === generatedRidesId)
                    : null;
                setRideData(currentRide);
            } catch (error) {
                setRideData(null);
            } finally {
                setLoading(false);
            }
        };
        if (token && generatedRidesId) {
            fetchStartedRide();
        } else {
            setLoading(false);
        }
    }, [token, generatedRidesId]);

    const handleBack = () => {
        navigation.goBack();
    };

    console.log('Ride Data:', rideData);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.black} barStyle="light-content" />
            <View style={styles.header}>

                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}
                        onPress={handleBack}
                    >
                        <Text style={{ color: '#fff', marginLeft: 5 }}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <FontAwesome name="location-arrow" size={20} color="#ffd54f" style={[styles.routeIcon, { padding: 4, marginRight: 8 }]} />
                        <Text
                            style={[
                                rideUtilities.title,
                                {
                                    color: colors.white,
                                    marginBottom: 0,
                                    textAlign: 'center',
                                    width: 'auto',
                                }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            {rideData?.locationName?.toUpperCase() || ''}
                        </Text>
                    </View>

                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.7, marginLeft: 0, textAlign: 'center', width: '100%' }}>
                        {rideData?.generatedRidesId || ''}
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
            </View>
            <ScrollView style={styles.content}>
                {loading ? (
                    <View style={styles.errorContainer}>
                        <ActivityIndicator color="#fff" size="large" />
                        <Text style={styles.errorText}>Loading ride details...</Text>
                    </View>
                ) : rideData ? (


                            <View style={styles.routeCard}>
                                <Text style={styles.routeTitle}>
                                    Route Details
                                </Text>
                                <View style={styles.routeRow}>
                                    <FontAwesome name="map-marker" size={24} color="#4fc3f7" style={styles.routeIcon} />
                                    <Text style={styles.routeText}>
                                        Starting Point: {rideData?.startingPointName || 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.routeRow}>
                                    <FontAwesome name="flag-checkered" size={22} color="#81c784" style={styles.routeIcon} />
                                    <Text style={styles.routeText}>
                                        1st Stop: {rideData?.endingPointName || 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.routeRow}>
                                    <FontAwesome name="location-arrow" size={20} color="#ffd54f" style={styles.routeIcon} />
                                    <Text style={styles.routeText}>
                                        Location: {rideData?.locationName || 'N/A'}
                                    </Text>
                                </View>
                                <View style={styles.routeRow}>
                                    <FontAwesome name="road" size={20} color="#ff8a65" style={styles.routeIcon} />
                                    <Text style={styles.routeText}>
                                        Distance: {rideData?.distance ? `${rideData.distance} km` : 'N/A'}
                                    </Text>
                                </View>

                            </View>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load ride information</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default StartedRide;