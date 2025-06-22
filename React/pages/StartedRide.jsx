// React/pages/StartedRide.jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import utilities from '../styles/utilities';
import { getRideDetails } from '../services/rideService';

const StartedRide = ({ route }) => {
    const navigation = useNavigation();
    const { generatedRidesId, token } = route.params;
    const [rideData, setRideData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!generatedRidesId || !token) {
            Alert.alert("Error", "Missing ride information");
            navigation.goBack();
            return;
        }

        const fetchRideData = async () => {
            try {
                setLoading(true);
                const details = await getRideDetails(generatedRidesId, token);
                setRideData(details);
            } catch (error) {
                console.error("Error fetching ride details:", error);
                Alert.alert("Error", "Failed to load ride details");
            } finally {
                setLoading(false);
            }
        };

        fetchRideData();
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        color: '#fff',
        marginLeft: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        width: 50,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    rideInfoContainer: {
        padding: 10,
    },
    rideTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    rideId: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: '#151515',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    infoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoText: {
        color: '#ddd',
        fontSize: 14,
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default StartedRide;