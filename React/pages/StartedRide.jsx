// React/pages/StartedRide.jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import styles from '../styles/StartedRideStyles';
import { currentRide } from "../services/startService";

const StartedRide = ({ route }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [rideData, setRideData] = useState(null);
    const { generatedRidesId, token } = route.params || {};

    useEffect(() => {
        if (!generatedRidesId || !token) {
            Alert.alert('Error', 'Missing ride ID or authentication token.');
            setLoading(false);
            return;
        }
        const fetchRide = async () => {
            try {
                const data = await currentRide(generatedRidesId, token);
                setRideData(data);
            } catch (error) {
                setRideData(null);
                Alert.alert('Error', error.message || 'Failed to load ride information');
            } finally {
                setLoading(false);
            }
        };
        fetchRide();
    }, [generatedRidesId, token]);

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.black} barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <FontAwesome name="arrow-left" size={20} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ACTIVE RIDE</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading ride details...</Text>
                    </View>
                ) : rideData ? (
                    <View style={styles.rideInfoContainer}>
                        <Text style={styles.rideTitle}>{rideData.rideName}</Text>
                        <Text style={styles.rideId}>ID: {generatedRidesId}</Text>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoTitle}>Ride in Progress</Text>
                            <Text style={styles.infoText}>
                                Your ride has started. You can track your progress and manage
                                the ride from this screen.
                            </Text>
                        </View>

                        {/* Add more ride details and controls as needed */}
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