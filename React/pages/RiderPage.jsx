import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    StatusBar,
    ScrollView,
    FlatList
} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, } from '../services/rideService';
import RidesList from '../components/RidesList';
import SearchHeader from "../components/SearchHeader";
import MyRidesModal from '../components/MyRidesModal';
import {getCurrentStartedRides,} from "../services/startService";
import { modernUtilities } from "../styles/modernUtilities"; // Import separated utilities
import AsyncStorage from '@react-native-async-storage/async-storage';


const RiderPage = ({ route , navigation}) => {

    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);

    const [myRidesModalVisible, setMyRidesModalVisible] = useState(false);

    const [startedRides, setStartedRides] = useState([]);
    const [startedRidesLoading, setStartedRidesLoading] = useState(false);
    const [startedRidesError, setStartedRidesError] = useState('');

    useEffect(() => {
        fetchCurrentRiderType();
    }, [token]);

    const fetchCurrentRiderType = async () => {
        try {
            setLoading(true);
            const result = await getCurrentRiderType(token);

            if (result.success) {
                setRiderType(result.data);
            } else {
                Alert.alert('Error', result.message || 'Failed to fetch rider type');
            }
        } catch (error) {
            console.error('Error fetching rider type:', error);
            Alert.alert('Error', 'Network error occurred while fetching rider type');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const getUserData = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                const storedToken = await AsyncStorage.getItem('userToken');

                if (storedUsername) setUsername(storedUsername);
                if (storedToken) setToken(storedToken);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    const fetchAndDisplayStartedRides = async (token) => {
        try {
            const rides = await getCurrentStartedRides(token);
            console.log('Raw started rides response:', rides);

            return rides.map(ride => ({
                ridesId: ride.generatedRidesId,
                ridesName: ride.ridesName,
                locationName: ride.locationName,
            }));

        } catch (error) {
            console.error('Error fetching started rides:', error);
            throw error;
        }

    };

    useEffect(() => {
        if (!token) return;
        setStartedRidesLoading(true);
        fetchAndDisplayStartedRides(token)
            .then(rides => {
                setStartedRides(rides);
                setStartedRidesError('');
            })
            .catch(err => {
                setStartedRides([]);
                setStartedRidesError('Failed to fetch started rides');
            })
            .finally(() => setStartedRidesLoading(false));
    }, [token]);

    const renderActiveRidesSection = () => {
        if (!startedRidesLoading && startedRides.length === 0 && !startedRidesError) {
            return null;
        }
        return (
            <View>
                {startedRidesLoading ? (
                    <View style={modernUtilities.loadingContainer}>
                        <ActivityIndicator color="#8c2323" size="small" />
                    </View>
                ) : startedRidesError ? (
                    <Text style={modernUtilities.errorText}>{startedRidesError}</Text>
                ) : startedRides.length > 0 ? (
                    startedRides.map((ride, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={modernUtilities.activeRideCard}
                            onPress={() => {
                                navigation.navigate('StartedRide', {
                                    generatedRidesId: ride.ridesId,
                                    ridesName: ride.ridesName,
                                    locationName: ride.locationName,
                                    token: token,
                                    username: username
                                });
                            }}
                        >
                            <View style={modernUtilities.activeRideHeader}>
                                <Text style={modernUtilities.activeRideName}>{ride.ridesName} </Text>
                                <View style={modernUtilities.activeStatus}>
                                    <FontAwesome name="circle" size={6} color="#27ae60" />
                                    <Text style={modernUtilities.activeStatusText}>ACTIVE</Text>
                                </View>
                            </View>
                            <Text style={modernUtilities.activeRideLocation}>{ride.locationName}</Text>
                            <Text style={modernUtilities.activeRideId}>ID: {ride.ridesId}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={modernUtilities.emptyState}>
                        <FontAwesome name="bicycle" size={30} color="#bdc3c7" />
                        <Text style={modernUtilities.emptyStateText}>No ongoing ride found.</Text>
                    </View>
                )}
            </View>
        );
    };


    return (
        <View style={modernUtilities.container}>
            <StatusBar barStyle="light-content" backgroundColor="#151515" />

            {/* Modern Header */}
            <View style={modernUtilities.headerContainer}>
                <View style={modernUtilities.userSection}>
                    <View style={modernUtilities.userInfo}>
                        <View style={modernUtilities.avatar}>
                            <FontAwesome name="user" size={20} color="#fff" />
                        </View>
                        <View style={modernUtilities.userDetails}>
                            <Text style={modernUtilities.welcomeText}>Welcome back,</Text>
                            <Text style={modernUtilities.usernameText}>{username?.toUpperCase()}</Text>
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" style={{ marginTop: 4 }} />
                            ) : (
                                <View style={modernUtilities.riderTypeBadge}>
                                    <FontAwesome
                                        name={
                                            riderType?.riderType === 'car' ? 'car' :
                                                riderType?.riderType === 'motor' || riderType?.riderType === 'Motorcycle' ? 'motorcycle' :
                                                    riderType?.riderType === 'bike' || riderType?.riderType === 'Bicycle' ? 'bicycle' :
                                                        riderType?.riderType === 'cafe Racers' ? 'rocket' : 'user'
                                        }
                                        size={12}
                                        color="#fff"
                                        style={{ marginRight: 5 }}
                                    />
                                    <Text style={modernUtilities.riderTypeText}>
                                        {riderType?.riderType}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={modernUtilities.searchContainer}>
                        <SearchHeader
                            token={token}
                            username={username}
                            navigation={navigation}
                        />
                    </View>
                </View>

                <View style={modernUtilities.quickActions}>
                    <TouchableOpacity
                        style={modernUtilities.createButton}
                        onPress={() => {
                            if (!token) {
                                Alert.alert('Error', 'Authentication token is missing');
                                return;
                            }
                            navigation.navigate('CreateRide', { token, username });
                        }}
                    >
                        <FontAwesome name="plus" size={14} color="#8c2323" />
                        <Text style={modernUtilities.createButtonText}>Create Ride</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={[]} // No data, only using header
                ListHeaderComponent={
                    <>
                        {renderActiveRidesSection()}
                        <View style={modernUtilities.feedSection}>
                            <RidesList
                                token={token}
                                onRideSelect={(ride) => {
                                    navigation.navigate('RideStep4', {
                                        generatedRidesId: ride.generatedRidesId,
                                        rideName: ride.ridesName,
                                        locationName: ride.locationName,
                                        riderType: ride.riderType,
                                        distance: ride.distance,
                                        date: ride.date,
                                        startingPoint: ride.startingPointName,
                                        endingPoint: ride.endingPointName,
                                        participants: ride.participants,
                                        description: ride.description,
                                        token: token,
                                        username: ride.username,
                                        currentUsername: username
                                    });
                                }}
                            />
                        </View>
                    </>
                }
                showsVerticalScrollIndicator={false}
                style={modernUtilities.contentContainer}
            />

            {/* Modern Bottom Section */}
            <View style={modernUtilities.bottomContainer}>
                <TouchableOpacity
                    style={modernUtilities.myRidesButton}
                    onPress={() => setMyRidesModalVisible(true)}
                >
                    <Text style={modernUtilities.myRidesButtonText}>My Rides</Text>
                </TouchableOpacity>

                <MyRidesModal
                    visible={myRidesModalVisible}
                    onClose={() => setMyRidesModalVisible(false)}
                    token={token}
                    onRideSelect={(ride) => {
                        navigation.navigate('RideStep4', {
                            generatedRidesId: ride.generatedRidesId,
                            rideName: ride.ridesName,
                            locationName: ride.locationName,
                            riderType: ride.riderType,
                            distance: ride.distance,
                            date: ride.date,
                            startingPoint: ride.startingPointName,
                            endingPoint: ride.endingPointName,
                            participants: ride.participants,
                            description: ride.description,
                            token: token,
                            username: ride.username,
                            currentUsername: username
                        });
                    }}
                />
            </View>
        </View>
    );
};

export default RiderPage;