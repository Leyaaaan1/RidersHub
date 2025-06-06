
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert} from 'react-native';
import utilities from "../styles/utilities";
import riderPageUtils from "../styles/riderPageUtils";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType, getRideDetails} from '../services/rideService';
import RideStep4 from "../components/ride/RideStep4";




const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);


    const [searchId, setSearchId] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [foundRide, setFoundRide] = useState(null);
    const [showRideModal, setShowRideModal] = useState(false);


    const [debouncedSearchId, setDebouncedSearchId] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchId(searchId);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchId]);

    useEffect(() => {
        if (debouncedSearchId) {
            handleSearch();
        }
    }, [debouncedSearchId]);

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setSearchError('Please enter a ride ID');
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError('');
            setFoundRide(null);

            const rideDetails = await getRideDetails(parseInt(searchId), token);
            setFoundRide(rideDetails);
            setShowRideModal(true);
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


    return (

        <View style={utilities.container}>


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>

                {/* Left: Username and Rider Type */}
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <Text style={[utilities.compactText, { fontWeight: 'bold' }]}>{username?.toUpperCase()}</Text>
                    {loading ? (
                        <Text style={utilities.compactText}>Loading...</Text>
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
                                color="#333"
                                style={{ marginRight: 5 }}
                            />
                        </View>
                    )}
                </View>

                <View style={{  alignItems: 'center' }}>
                    <TouchableOpacity
                        style={utilities.button}
                        onPress={() => {
                            console.log("Token being passed:", token);
                            if (!token) {
                                Alert.alert('Error', 'Authentication token is missing');
                                return;
                            }
                            navigation.navigate('CreateRide', {
                                token: token,
                                username: username
                            });
                        }}
                    >
                        <Text style={utilities.buttonText}>+ Ride</Text>
                    </TouchableOpacity>
                </View>

                {/* Right: Settings Icon */}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => {}}>
                        <FontAwesome name="gear" size={18} color="black" />
                    </TouchableOpacity>
                </View>

            </View>

            <View style={utilities.centeredContainer}>
                <View style={{ flex: 2, alignItems: 'center' }}>
                    <View style={riderPageUtils.searchInputContainer}>
                        <TextInput
                            style={riderPageUtils.searchInput}
                            placeholder="Ride ID"
                            placeholderTextColor="#999"
                            value={searchId}
                            onChangeText={setSearchId}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity
                            style={riderPageUtils.searchButton}
                            onPress={handleSearch}
                            disabled={searchLoading}
                        >
                            {searchLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={utilities.buttonText}>Search</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    {searchError ? <Text style={riderPageUtils.errorText}>{searchError}</Text> : null}
                </View>


            </View>

            {foundRide && (
                <RideStep4
                    visible={showRideModal}
                    onClose={() => setShowRideModal(false)}
                    generatedRidesId={foundRide.generatedRidesId}
                    rideName={foundRide.ridesName}
                    locationName={foundRide.locationName}
                    riderType={foundRide.riderType}
                    distance={foundRide.distance}
                    date={foundRide.date}
                    startingPoint={foundRide.startingPointName}  // Changed to match API response field
                    endingPoint={foundRide.endingPointName}      // Changed to match API response field
                    participants={foundRide.participants}
                    description={foundRide.description}
                    token={token}
                    username={username}
                />
            )}
        </View>
    );
};


export default RiderPage;