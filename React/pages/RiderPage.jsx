
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StatusBar} from 'react-native';
import utilities from "../styles/utilities";
import riderPageUtils from "../styles/riderPageUtils";
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ScrollView, Keyboard } from 'react-native';

import {getCurrentRiderType, getRideDetails} from '../services/rideService';
import RideStep4 from "../components/ride/RideStep4";
import RidesList from '../components/RidesList';




const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);


    const [searchId, setSearchId] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [foundRide, setFoundRide] = useState(null);
    const [showRideModal, setShowRideModal] = useState(false);







    useEffect(() => {
        fetchCurrentRiderType();
    }, [token]);

    const handleSearch = async () => {
        Keyboard.dismiss(); // Hide keyboard

        if (searchId.length !== 4) {
            setSearchError('Please enter a valid 4-digit ride ID');
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError('');

            const rideDetails = await getRideDetails(parseInt(searchId), token);

            navigation.navigate('RideStep4', {
                generatedRidesId: rideDetails.generatedRidesId,
                rideName: rideDetails.ridesName,
                locationName: rideDetails.locationName,
                riderType: rideDetails.riderType,
                distance: rideDetails.distance,
                date: rideDetails.date,
                startingPoint: rideDetails.startingPointName,
                endingPoint: rideDetails.endingPointName,
                participants: rideDetails.participants,
                description: rideDetails.description,
                token,
                username
            });
        } catch (error) {
            setSearchError(error.message || 'Failed to find ride');
        } finally {
            setSearchLoading(false);
        }
    };
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
        return (
            <View style={utilities.searchSection}>
                <View style={riderPageUtils.searchInputContainer}>
                    <TextInput
                        style={riderPageUtils.searchInput}
                        placeholder="Ride ID"
                        placeholderTextColor="#999"
                        onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, '');
                            setSearchId(numericText);

                            // Only clear errors, don't auto-trigger search
                            if (numericText.length !== 4) {
                                setSearchError('');
                                setFoundRide(null);
                            }
                        }}
                        keyboardType="numeric"
                        maxLength={4}
                        value={searchId}
                    />
                    <TouchableOpacity
                        style={riderPageUtils.searchButton}
                        onPress={handleSearch}
                        disabled={searchLoading || searchId.length !== 4}
                    >
                        {searchLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={utilities.buttonText}>Search</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {searchError ? <Text style={riderPageUtils.errorText}>{searchError}</Text> : null}
                {searchId.length > 0 && searchId.length < 4 && (
                    <Text style={riderPageUtils.detailText}>Please enter 4 digits</Text>
                )}
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
                            style={utilities.buttonWhite}
                            onPress={() => {
                                if (!token) {
                                    Alert.alert('Error', 'Authentication token is missing');
                                    return;
                                }
                                navigation.navigate('CreateRide', { token, username });
                            }}
                        >
                            <Text style={utilities.title}> + Ride</Text>
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
                    headerComponent={<SearchHeader />}
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