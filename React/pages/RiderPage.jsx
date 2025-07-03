
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StatusBar, ScrollView} from 'react-native';
import utilities from "../styles/utilities";
import riderPageUtils from "../styles/riderPageUtils";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, } from '../services/rideService';
import RidesList from '../components/RidesList';
import SearchHeader from "../components/SearchHeader";
import rideUtilities from "../styles/rideUtilities";
import MyRidesModal from '../components/MyRidesModal';
import {getCurrentStartedRides,} from "../services/startService";
import CurrentRideHeader from "../components/CurrentRideHeader";




const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
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
    const fetchAndDisplayStartedRides = async (token) => {
        try {
            const rides = await getCurrentStartedRides(token);
            return rides.map(ride => ({
                ridesId: ride.generatedRidesId,
                ridesName: ride.ridesName,
                locationName: ride.locationName
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

    return (
        <View style={utilities.containerWhite}>

            <View style={utilities.navbarContainerPrimary}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Text style={[utilities.textWhite, { fontWeight: 'bold' }]}>{username?.toUpperCase()}</Text>
                        {loading ? (
                            <Text style={utilities.textWhite}>Loading...</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome
                                    name={
                                        riderType?.riderType === 'car' ? 'car' :
                                            riderType?.riderType === 'motor' || riderType?.riderType === 'Motorcycle' ? 'motorcycle' :
                                                riderType?.riderType === 'bike' || riderType?.riderType === 'Bicycle' ? 'bicycle' :
                                                    riderType?.riderType === 'cafe Racers' ? 'rocket' : 'user'
                                    }
                                    size={16}
                                    color="#fff"
                                    style={{ marginRight: 5 }}
                                />
                            </View>
                        )}
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <TouchableOpacity
                            style={[
                                {
                                    borderStyle: 'dashed',
                                    borderWidth: 1,
                                    borderColor: colors.white,
                                    padding: 10,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 40,
                                }
                            ]}
                            onPress={() => {
                                if (!token) {
                                    Alert.alert('Error', 'Authentication token is missing');
                                    return;
                                }
                                navigation.navigate('CreateRide', { token, username });
                            }}
                        >
                            <Text style={[utilities.smallTextBlack, { color: colors.white, textAlign: 'center' }]}>Create</Text>
                        </TouchableOpacity>

                    </View>

                <View style={{ flex: 1, alignItems: 'flex-end'}}>
                    <View style={{ width: 150, alignSelf: 'flex-end' }}>
                        <SearchHeader
                            token={token}
                            username={username}
                            navigation={navigation}
                        />
                    </View>
                </View>
                </View>
            </View>


            <View style={riderPageUtils.contentContainer}>
                {startedRidesLoading ? (
                    <ActivityIndicator color={colors.white} size="small" style={{ marginTop: 6 }} />
                ) : startedRidesError ? (
                    <Text style={utilities.currentRideError}>{startedRidesError}</Text>
                ) : startedRides.length > 0 ? (
                    startedRides.map((ride, idx) => (
                        <View key={idx} style={utilities.currentRideItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 6 }}>
                                <Text style={utilities.currentRideValue}>
                                    {ride.locationName} (ID: {ride.ridesId})
                                </Text>
                                <Text style={{ marginLeft: 8, color: 'green', fontWeight: 'bold', fontSize: 12 , padding: 6}}>Active</Text>
                                <FontAwesome name="circle" size={14} color="green" />
                            </View>
                            <View>
                                <Text style={utilities.currentRideLabelMiddle}>
                                    Rides Name: <Text style={utilities.currentRideValueMiddle}>{ride.ridesName}</Text>
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={utilities.currentRideEmpty}>No ongoing ride found.</Text>
                )}
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
            <View style={rideUtilities.customBottomContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setMyRidesModalVisible(true)}>
                            <Text style={rideUtilities.customBottomText}>My Rides</Text>
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
            </View>
        </View>
    );
};


export default RiderPage;