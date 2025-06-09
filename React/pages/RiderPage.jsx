
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StatusBar} from 'react-native';
import utilities from "../styles/utilities";
import riderPageUtils from "../styles/riderPageUtils";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, getRideDetails} from '../services/rideService';
import RidesList from '../components/RidesList';




const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);



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
    const SearchHeader = () => {
        const [searchId, setSearchId] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleSearch = async () => {
            if (!searchId.trim()) {
                setError('Please enter a ride ID');
                return;
            }

            setLoading(true);
            setError('');

            try {
                const ride = await getRideDetails(searchId.trim(), token);
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
                    username: username
                });
            } catch (error) {
                setError(error.message || 'Failed to find ride');
            } finally {
                setLoading(false);
            }
        };

        return (
            <View style={{ padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: colors.primary,
                            borderRadius: 5,
                            padding: 10,
                            marginRight: 10,
                            color: '#333'
                        }}
                        placeholder="Search by Ride ID"
                        placeholderTextColor="#999"
                        value={searchId}
                        onChangeText={setSearchId}
                    />
                    <TouchableOpacity
                        onPress={handleSearch}
                        disabled={loading}
                        style={{
                            backgroundColor: colors.primary,
                            padding: 10,
                            borderRadius: 5,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <FontAwesome name="search" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
                {error ? (
                    <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text>
                ) : null}
            </View>
        );
    };

    return (
        <View style={utilities.container}>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" translucent={false} />

            {/* Navbar */}
            <View style={utilities.navbarContainer}>
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

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                    minWidth: 80, // Add minimum width
                                    height: 40,   // Add fixed height
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
                            <Text style={[utilities.smallText, { color: colors.white, textAlign: 'center' }]}>Create</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => {}}>
                            <FontAwesome name="gear" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Scrollable content */}
            <View style={riderPageUtils.contentContainer}>
                <RidesList
                    token={token}
                    headerComponent={
                        <View style={{ marginBottom: 15 }}>
                            <SearchHeader />
                        </View>
                    }
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
                            username: username
                        });
                    }}
                />
            </View>
        </View>
    );};


export default RiderPage;