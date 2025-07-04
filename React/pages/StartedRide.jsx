import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import styles from '../styles/StartedRideStyles';
import { getCurrentStartedRides } from "../services/startService";

const StartedRide = ({ route }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [rideData, setRideData] = useState(null);
    const { generatedRidesId, token } = route.params || {};

    useEffect(() => {
        const fetchStartedRide = async () => {
            try {
                const rides = await getCurrentStartedRides(token);
                // Find the ride with the matching generatedRidesId
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
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <FontAwesome name="arrow-left" size={20} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ACTIVE RIDE</Text>
                <View style={styles.headerRight} />
            </View>
            <ScrollView style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading ride details...</Text>
                    </View>
                ) : rideData ? (
                    <View style={styles.rideInfoContainer}>
                        <Text style={styles.rideTitle}>{rideData.ridesName}</Text>
                        <Text style={styles.rideId}>ID: {rideData.generatedRidesId}</Text>
                        <Text style={styles.rideId}>Location: {rideData.locationName}</Text>
                        <Text style={styles.rideId}>Owner {rideData.initiator}</Text>

                        <Text style={styles.rideId}>
                            Participants: {Array.isArray(rideData.participantUsernames) ? rideData.participantUsernames.join(', ') : rideData.participantUsernames}
                        </Text>
                        <Text style={styles.rideId}>Start Time: {new Date(rideData.startTime).toLocaleString()}</Text>
                        {/* Add more details as needed */}
                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Ride in Progress</Text>
                            <Text style={styles.infoText}>
                                Your ride has started. You can track your progress and manage
                                the ride from this screen.
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