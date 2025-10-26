import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StatusBar,
    FlatList
} from 'react-native';

import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, } from '../services/rideService';
import RidesList from '../components/RidesList';
import SearchHeader from "../components/SearchHeader";
import MyRidesModal from '../components/MyRidesModal';
import { modernUtilities } from "../styles/modernUtilities";
import {getActiveRide} from "../services/startService";


const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myRidesModalVisible, setMyRidesModalVisible] = useState(false);
    const [activeRide, setActiveRide] = useState(null);
    const [activeRideLoading, setActiveRideLoading] = useState(false);


    useEffect(() => {
        fetchCurrentRiderType();
        fetchActiveRide();
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
    const fetchActiveRide = async () => {
        try {
            setActiveRideLoading(true);
            const result = await getActiveRide(token); // ✅ Just pass the token
            setActiveRide(result); // The result is already the RideResponseDTO
        } catch (error) {
            console.error('Error fetching active ride:', error);
            setActiveRide(null); // Set to null if no active ride
        } finally {
            setActiveRideLoading(false);
        }
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
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (!activeRide) return;
                    navigation.navigate('StartedRide', { activeRide, token, username });
                }}
                style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: '#1e1e1e', borderRadius: 8, padding: 12 }}
            >
                <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>Active Ride</Text>
                {activeRideLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : activeRide ? (
                    <View>
                        <Text style={{ color: '#fff', fontSize: 14 }}>{activeRide.ridesName}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
                            <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.locationName}</Text>
                            <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.riderType}</Text>
                            <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.distance} km</Text>
                        </View>
                    </View>
                ) : (
                    <Text style={{ color: '#666', fontSize: 14 }}>No active ride</Text>
                )}
            </TouchableOpacity>
            <FlatList
                data={[]} // No data, only using header
                ListHeaderComponent={
                    <>
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