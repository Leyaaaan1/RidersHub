// React/components/ride/RideStep4.jsx
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Modal, SafeAreaView} from 'react-native';
import utilities from '../../styles/utilities';
import rideUtilities from '../../styles/rideUtilities';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {fetchRideMapImage, getRideDetails} from '../../services/rideService';
import WaveLine from '../../styles/waveLineComponent';
import colors from '../../styles/colors';


const RideStep4 = (props) => {
    const navigation = useNavigation();
    const route = props.route || {};
    const routeParams = route.params || {};

    const {
        generatedRidesId = props.generatedRidesId || routeParams.generatedRidesId,
        rideName = props.rideName || routeParams.rideName,
        locationName = props.locationName || routeParams.locationName,
        riderType = props.riderType || routeParams.riderType,
        date = props.date || routeParams.date,
        startingPoint = props.startingPoint || routeParams.startingPoint,
        endingPoint = props.endingPoint || routeParams.endingPoint,
        participants = props.participants || routeParams.participants,
        description = props.description || routeParams.description,
        token = props.token || routeParams.token,
        username = props.username || routeParams.username,
        distance = props.distance || routeParams.distance
    } = props;

    const formatDate = (date) => {
        if (!date) return 'Not specified';
        return date instanceof Date ?
            date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : date.toString();
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const [mapImage, setMapImage] = useState(null);
    const [startMapImage, setStartMapImage] = useState(null);
    const [endMapImage, setEndMapImage] = useState(null);

    const [imageLoading, setImageLoading] = useState(false);
    const [distanceState, setDistance] = useState(distance || "--");

    useEffect(() => {
        const getMapImage = async () => {
            console.log("useEffect running with rideId:", generatedRidesId);

            if (!generatedRidesId) {
                console.log("No ride ID available yet");
                return;
            }

            try {
                console.log("Fetching map image for ride ID:", generatedRidesId);
                setImageLoading(true);
                const imageUrl = await fetchRideMapImage(generatedRidesId, token);
                console.log("Successfully fetched map image URL:", imageUrl);
                setMapImage(imageUrl);
            } catch (error) {
                console.error("Failed to load map image:", error.message || error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                }
            } finally {
                setImageLoading(false);
            }
        };

        getMapImage();
    }, [generatedRidesId, token]);

    useEffect(() => {
        if (!generatedRidesId || !token) {
            console.log("Missing required data for ride details:", { generatedRidesId, token });
            return;
        }

        console.log("Fetching ride details for ID:", generatedRidesId);
        setImageLoading(true);

        getRideDetails(generatedRidesId, token)
            .then(rideDetails => {
                if (rideDetails.magImageStartingLocation) {
                    setStartMapImage(rideDetails.magImageStartingLocation);
                }
                if (rideDetails.magImageEndingLocation) {
                    setEndMapImage(rideDetails.magImageEndingLocation);
                }

                console.log("Full ride details response:", rideDetails);
                if (rideDetails && typeof rideDetails.distance !== 'undefined') {
                    console.log("Ride distance from backend:", rideDetails.distance);
                    setDistance(rideDetails.distance);
                } else {
                    console.warn("No distance found in ride details:", rideDetails);
                    setDistance("N/A");
                }
            })
            .catch(error => {
                console.error('Error fetching ride details:', error.message || error);
                if (error.response) {
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                }
                setDistance("Error");
            })
            .finally(() => {
                setImageLoading(false);
            });
    }, [generatedRidesId, token]);

    return (
        <View style={utilities.containerWhite}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
            <View style={utilities.navbarContainer}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
                    onPress={handleBack}
                >
                    <Text style={{ color: '#fff', marginLeft: 5 }}>Back</Text>
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={[
                            rideUtilities.title,
                            {
                                color: colors.background,
                                marginBottom: 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                                textAlign: 'center',
                                width: '100%',
                            }
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                    >
                        {locationName?.toUpperCase()}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.7, marginLeft: 10, textAlign: 'center', width: '100%' }}>
                        {generatedRidesId}
                    </Text>
                </View>
                <View>
                    <TouchableOpacity>
                        <View>
                            <Text style={{ color: colors.white, fontSize: 12, opacity: 0.7 }}>
                                Join Ride
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[utilities.centeredContainer, { padding: 15, backgroundColor: colors.primary }]}>
                    {/*<View style={[*/}
                    {/*    rideUtilities.topContainer,*/}
                    {/*    rideUtilities.middleContainer,*/}
                    {/*    { width: 'auto', paddingHorizontal: 15, flex: 1 }*/}
                    {/*]}>*/}


                        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            {/* Left Column */}
                            <View style={{flex: 1, alignItems: 'flex-start'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <FontAwesome name="map-marker" size={18} color="#fff" style={{ marginRight: 6 }} />
                                    <Text style={[rideUtilities.detailText, { fontSize: 30 }]}>{rideName} </Text>
                                </View>
                                <Text style={rideUtilities.detailText}>Owner: {username} </Text>
                                <Text style={rideUtilities.detailText}>{distanceState} km</Text>

                            </View>

                            {/* Right Column */}
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <View style={{alignItems: 'center'}}>
                                    {riderType === 'car' && <FontAwesome name="car" size={24} color="#fff" />}
                                    {riderType === 'motor' && <FontAwesome name="motorcycle" size={24} color="#fff" />}
                                    {riderType === 'bike' && <FontAwesome name="bicycle" size={24} color="#fff" />}
                                    {riderType === 'cafe Racers' && <FontAwesome name="rocket" size={24} color="#fff" />}
                                </View>
                                <View style={[rideUtilities.formGroup, {alignItems: 'center', marginTop: 8}]}>
                                    <Text style={rideUtilities.detailText}>{formatDate(date)}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{width: '100%', alignItems: 'center'}}>
                            {imageLoading ? (
                                <ActivityIndicator size="large" color="#4CAF50" />
                            ) : mapImage ? (
                                <Image
                                    source={{uri: mapImage}}
                                    style={{width: '100%', height: 200, borderRadius: 8}}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={{color: '#fff'}}>No map available</Text>
                            )}
                        </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%', marginTop: 10 }}>
                        {/* Starting Point Column */}
                        <View style={{ flex: 1, alignItems: 'flex-start', paddingHorizontal: 8 }}>
                            <Text style={[utilities.label, { color: '#fff', fontSize: 12, textAlign: 'left' }]}>Starting Point:</Text>
                            <Text style={[utilities.compactText, { color: '#fff', textAlign: 'left' }]}>{startingPoint}</Text>
                            {startMapImage ? (
                                <Image
                                    source={{ uri: startMapImage }}
                                    style={[utilities.oblongImage, { width: 200, height: 100 }]}
                                />
                            ) : (
                                <Text style={{ color: '#fff', textAlign: 'center' }}>No start map available</Text>
                            )}

                        </View>

                        {/* Ending Point Column */}
                        <View style={{ flex: 1, alignItems: 'flex-end', paddingHorizontal: 8 }}>

                            {endMapImage ? (
                                <Image
                                    source={{ uri: endMapImage }}
                                    style={[utilities.oblongImage, { width: 200, height: 100 }]}

                                />
                            ) : (
                                <Text style={{ color: '#fff', textAlign: 'center' }}>No end map available</Text>
                            )}
                            <Text style={[utilities.label, { color: '#fff', fontSize: 12, textAlign: 'right' }]}>Ending Point:</Text>
                            <Text style={[utilities.compactText, { color: '#fff', textAlign: 'right' }]}>{endingPoint}</Text>
                        </View>
                    </View>
                    {description && (
                        <View style={[
                            rideUtilities.middleContainer,
                            {width: 'auto', marginTop: 10}
                        ]}>
                            <Text style={[rideUtilities.label, {color: '#fff', fontSize: 20}]}>Description:</Text>
                            <Text style={[rideUtilities.detailText, {textAlign: 'justify'}]}>{description}</Text>
                        </View>
                    )}
                        {participants && (
                            <View style={{width: '100%', marginTop: 10, alignItems: 'flex-start'}}>
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: colors.secondary,
                                    borderRadius: 8,
                                    marginTop: 5,
                                    width: '100%',
                                    overflow: 'hidden'
                                }}>
                                    {/* Header */}
                                    <View style={{
                                        flexDirection: 'row',
                                        backgroundColor: 'rgba(76, 175, 80, 0.3)',
                                        padding: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.secondary
                                    }}>
                                        <Text style={{flex: 0.8, color: '#fff', fontWeight: 'bold', textAlign: 'left'}}>Riders</Text>
                                    </View>

                                    {/* Participant rows */}
                                    {Array.isArray(participants) ?
                                        participants.map((participant, index) => (
                                            <View key={index} style={{
                                                flexDirection: 'row',
                                                padding: 8,
                                                borderBottomWidth: index < participants.length - 1 ? 1 : 0,
                                                borderBottomColor: 'rgba(255, 255, 255, 0.2)',
                                                backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                            }}>
                                                <Text style={{flex: 0.2, color: '#fff', textAlign: 'left', paddingLeft: 5}}>{index + 1}</Text>
                                                <Text style={{flex: 0.8, color: '#fff', textAlign: 'left'}}>{typeof participant === 'object' ? participant.username : participant}</Text>
                                            </View>
                                        )) :
                                        <View style={{padding: 8, width: '100%'}}>
                                            <Text style={{color: '#fff', textAlign: 'left'}}>{participants}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        )}
                </View>
            </ScrollView>
        </SafeAreaView>
        </View>
    );
};

export default RideStep4;