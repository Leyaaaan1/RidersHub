// React/components/ride/RideStep4.jsx
import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    StatusBar, Alert
} from 'react-native';
import utilities from '../../styles/utilities';
import rideUtilities from '../../styles/rideUtilities';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {fetchRideMapImage, getRideDetails, getLocationImage} from '../../services/rideService';
import colors from '../../styles/colors';
import MapImageSwapper from "../../styles/MapImageSwapper";
import ParticipantListModal from '../ParticipantListModal';
import useJoinRide from './RideHandler';

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
        distance = props.distance || routeParams.distance,
        username= props.username || routeParams.username,
        currentUsername = props.currentUsername || routeParams.currentUsername,


    } = props;
    console.log("RideStep4 props:", props);

    const formatDate = (date) => {
        if (!date) return 'Not specified';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return date.toString();
        const options = { month: 'long', day: '2-digit', year: 'numeric' };
        const datePart = d.toLocaleDateString('en-US', options);
        let hours = d.getHours();
        const minutes = d.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${datePart} ${hours}:${minutes}${ampm}`;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const [mapImage, setMapImage] = useState(null);
    const [startMapImage, setStartMapImage] = useState(null);
    const [endMapImage, setEndMapImage] = useState(null);

    const [imageLoading, setImageLoading] = useState(false);
    const [distanceState, setDistance] = useState(distance || "--");

    const [showParticipantsModal, setShowParticipantsModal] = useState(false);

    const { loading: joiningRide, joinRide } = useJoinRide();

    const [rideNameImage, setRideNameImage] = useState(null);
    const [rideNameImageLoading, setRideNameImageLoading] = useState(false);
    const [rideNameImageError, setRideNameImageError] = useState(null);


    const fetchLocationImage = async (rideName) => {
        if (!rideName || !token) {
            console.log("Missing ride name or token for image fetch");
            return;
        }

        try {
            setRideNameImageLoading(true);
            setRideNameImageError(null);
            const imageData = await getLocationImage(rideName, token);
            console.log("Location image data:", imageData);
            // Store the complete image data object
            setRideNameImage(imageData);
            return imageData;
        } catch (error) {
            console.error("Failed to fetch location image:", error);
            setRideNameImageError(error.message || "Failed to load location image");
            return null;
        } finally {
            setRideNameImageLoading(false);
        }
    };

    useEffect(() => {
        if (locationName && token) {
            fetchLocationImage(locationName);
        }
    }, [locationName, token]);


    const handleJoinRide = () => {
        if (!generatedRidesId || !token) {
            Alert.alert("Error", "Missing ride information. Please try again.");
            return;
        }
        joinRide(generatedRidesId, token, () => {
            // Optional callback after successful join
            console.log("Successfully requested to join ride");
        });
    };

    useEffect(() => {
        const getMapImage = async () => {

            if (!generatedRidesId) {
                return;
            }

            try {
                setImageLoading(true);
                const imageUrl = await fetchRideMapImage(generatedRidesId, token);
                setMapImage(imageUrl);
            } catch (error) {
                if (error.response) {
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

                if (rideDetails && typeof rideDetails.distance !== 'undefined') {
                    setDistance(rideDetails.distance);
                } else {
                    setDistance("N/A");
                }
            })
            .catch(error => {
                if (error.response) {
                    console.error("Response status:", error.response.status);
                }
                setDistance("Error");
            })
            .finally(() => {
                setImageLoading(false);
            });
    }, [generatedRidesId, token]);

    return (
        <View style={[utilities.containerWhite, { flex: 1 }]}>
            <StatusBar backgroundColor={colors.black} barStyle="light-content" translucent={false} />


            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 10,  backgroundColor: "#000000" }}>
                {/* Back button - left */}
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}
                        onPress={handleBack}
                    >
                        <Text style={{ color: '#fff', marginLeft: 5 }}>Back</Text>
                    </TouchableOpacity>
                </View>
                {/* Name and ID - center */}
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={[
                            rideUtilities.title,
                            {
                                color: colors.white,
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
                    <Text style={{ color: '#fff', fontSize: 12, opacity: 0.7, marginLeft: 0, textAlign: 'center', width: '100%' }}>
                        {generatedRidesId}
                    </Text>
                </View>
                {/* Join Ride - right */}
                <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}>
                    {username !== currentUsername ? (
                        <TouchableOpacity onPress={() => handleJoinRide()}>
                            <View>
                                <Text style={{ color: colors.white, fontSize: 12, opacity: 0.7 }}>
                                    Join Ride
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                <FontAwesome name="play-circle" size={40} color="#fff" style={{ marginRight: 5 }} />
                            </View>
                        </TouchableOpacity>
                    )}


                </View>
            </View>


            <ScrollView

                showsVerticalScrollIndicator={false}
            >
                <View style={{ backgroundColor: "#151515", borderWidth: 2, padding: 10}}>


                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 8 }}>
                        <Text
                            style={[
                                rideUtilities.detailText,
                                { fontSize: 30, textAlign: 'center', width: '100%', textDecorationLine: 'underline' }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {rideName}
                        </Text>

                        <Text style={{ color: '#fff', fontSize: 14, marginTop: 2 }}>Location</Text>
                        <View style={[rideUtilities.formGroup, { alignItems: 'center', marginTop: 8 }]}>
                            <Text style={rideUtilities.detailText}>{formatDate(date)}</Text>
                        </View>
                        <View style={{width: '100%', alignItems: 'center'}}>
                            {rideNameImageLoading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : rideNameImage && rideNameImage.imageUrl ? (
                                <View style={{width: '100%'}}>
                                    <Image
                                        source={{ uri: rideNameImage.imageUrl }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            borderRadius: 8,
                                            borderWidth: 2,
                                            marginTop: 20
                                        }}
                                        resizeMode="cover"
                                    />
                                    {(rideNameImage.author || rideNameImage.license) && (
                                        <Text style={{color: '#aaa', fontSize: 10, marginTop: 4, textAlign: 'right'}}>
                                            {rideNameImage.author ? `Photo: ${rideNameImage.author}` : ''}
                                            {rideNameImage.author && rideNameImage.license ? ' | ' : ''}
                                            {rideNameImage.license ? `License: ${rideNameImage.license}` : ''}
                                        </Text>
                                    )}
                                </View>
                            ) : (
                                <Text style={{color: '#fff'}}>
                                    {rideNameImageError || "No location image available"}
                                </Text>
                            )}
                        </View>

                        <View style={{width: '100%', alignItems: 'center'}}>
                            {imageLoading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : mapImage ? (
                                <Image
                                    source={{ uri: mapImage }}
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        marginTop: 20
                                    }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text style={{color: '#fff'}}>No map available</Text>
                            )}
                        </View>


                    </View>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        {/* Left Column */}
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={rideUtilities.detailText}>Owner: {username} </Text>
                            <Text style={rideUtilities.detailText}>current user: {currentUsername} </Text>
                            <Text style={rideUtilities.detailText}>{distanceState} km</Text>
                        </View>
                        {/* Right Column */}
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <View style={{ alignItems: 'center' }}>
                                {riderType === 'car' && <FontAwesome name="car" size={24} color="#fff" />}
                                {riderType === 'motor' && <FontAwesome name="motorcycle" size={24} color="#fff" />}
                                {riderType === 'bike' && <FontAwesome name="bicycle" size={24} color="#fff" />}
                                {riderType === 'cafe Racers' && <FontAwesome name="rocket" size={24} color="#fff" />}
                            </View>

                        </View>
                    </View>
                </View>
                <View style={{ padding: 10 }}>
                    {description && (
                        <View style={{ marginTop: 10, padding: 5 }}>
                            <Text style={[utilities.smallText, { lineHeight: 18 }]}>
                                {description}
                            </Text>
                        </View>
                    )}
                </View>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    width: '100%',
                    backgroundColor: '#151515',
                    borderWidth: 2,
                    borderColor: '#333',
                    borderRadius: 8,
                    padding: 15,
                    marginVertical: 10
                }}>
                    {startMapImage || endMapImage ? (
                        <MapImageSwapper
                            startImage={startMapImage}
                            endImage={endMapImage}
                            startPoint={startingPoint}
                            endPoint={endingPoint}
                            imageStyle={[utilities.oblongImage, { width: 330, height: 360, padding: 10 }]}
                        />
                    ) : (
                        <Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No start or end map available</Text>
                    )}
                </View>



            </ScrollView>
            <View style={rideUtilities.customBottomContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowParticipantsModal(true)}>
                            <Text style={rideUtilities.customBottomText}>Riders</Text>
                        </TouchableOpacity>

                        <ParticipantListModal
                            visible={showParticipantsModal}
                            onClose={() => setShowParticipantsModal(false)}
                            participants={participants}
                            generatedRidesId={generatedRidesId}
                            token={token}
                            onRideSelect={(ride) => {
                                setShowParticipantsModal(false);
                            }}
                            username={username}
                            currentUsername={currentUsername}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{color: "#fff"}}> Sample </Text>
                        </View>
                    </View>

                </View>
            </View>
        </View>


    );
};

export default RideStep4;