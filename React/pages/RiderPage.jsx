
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StatusBar} from 'react-native';
import utilities from "../styles/utilities";
import riderPageUtils from "../styles/riderPageUtils";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, getRideDetails} from '../services/rideService';
import RidesList from '../components/RidesList';
import SearchHeader from "../components/SearchHeader";
import rideUtilities from "../styles/rideUtilities";
import MyRidesModal from '../components/MyRidesModal';
import {currentRide, startService} from "../services/startService";




const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);

    const [myRidesModalVisible, setMyRidesModalVisible] = useState(false);

    console.log('RiderPage mounted with username:', token);

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

    return (
        <View style={utilities.containerWhite}>

            <View style={[utilities.navbarContainerPrimary, { paddingVertical: 12, paddingHorizontal: 20 }]}>
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
                <View style={utilities.currentRideContainer}>
                    <View style={{  padding: 10, borderRadius: 8 , borderColor: colors.primary, borderWidth: 1}}>
                        <Text style={{ color: colors.white, textAlign: 'center' }}>Current Ride</Text>
                    </View>
                </View>
                <RidesList
                    token={token}

                    onRideSelect={(ride) => {
                        console.log('Selected ride:', ride);
                        console.log('Selected ride:', ride.username);
                        console.log('Selected ride:', username);
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
                    // renderActionButton={(ride) => (
                    //     <TouchableOpacity
                    //         style={{
                    //             backgroundColor: colors.primary,
                    //             padding: 8,
                    //             borderRadius: 5,
                    //             marginTop: 10
                    //         }}
                    //         onPress={() => handleJoinRequest(ride.generatedRidesId)}
                    //     >
                    //         <Text style={{ color: '#fff', textAlign: 'center' }}>Join Ride</Text>
                    //     </TouchableOpacity>
                    // )}
                />

            </View>
            <View style={rideUtilities.customBottomContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <TouchableOpacity
                        onPress={async () => {
                            try {
                                await startService.startRide(generatedRidesId, token);
                                navigation.navigate('StartedRide', { generatedRidesId, token });
                            } catch (error) {
                                if (error.response) {
                                    console.log('Error status:', error.response.status);
                                    console.log('Error data:', error.response.data);
                                } else {
                                    console.log('Error:', error);
                                }
                                Alert.alert('Error', error.message || 'Failed to start the ride.');
                            }                        }}
                    >
                        <Text style={rideUtilities.customBottomText}>Current Rides</Text>
                    </TouchableOpacity>
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