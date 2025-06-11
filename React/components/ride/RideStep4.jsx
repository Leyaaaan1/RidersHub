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
    StatusBar
} from 'react-native';
import utilities from '../../styles/utilities';
import rideUtilities from '../../styles/rideUtilities';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {fetchRideMapImage, getRideDetails} from '../../services/rideService';
import WaveLine from '../../styles/waveLineComponent';
import colors from '../../styles/colors';
import MapImageSwapper from "../../styles/MapImageSwapper";
import ParticipantListModal from '../ParticipantListModal';
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
        <View style={[utilities.containerWhite, { flex: 1 }]}>
            <StatusBar backgroundColor={colors.black} barStyle="light-content" translucent={false} />


            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 10,  backgroundColor: "#000000"}}>
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

                showsVerticalScrollIndicator={false}
            >
                <View style={{ backgroundColor: "#3a3636", borderWidth: 2,  borderRadius: 12, margin: 10, padding: 10 }}>


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


                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%', marginTop: 10 }}>
                        {startMapImage || endMapImage ? (
                            <MapImageSwapper
                                startImage={startMapImage}
                                endImage={endMapImage}
                                startPoint={startingPoint}
                                endPoint={endingPoint}
                                imageStyle={[utilities.oblongImage, { width: 300, height: 250 }]}
                            />
                        ) : (
                            <Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No start or end map available</Text>
                        )}
                    </View>
                            {/*<Text style={[utilities.label, { color: '#000', fontSize: 12, textAlign: 'right' }]}>Ending Point:</Text>*/}
                            {/*<Text style={[utilities.compactText, { color: '#000', textAlign: 'right' }]}>{endingPoint}</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                <View style={{ padding: 10 }}>


                    {description && (
                        <View style={{ marginTop: 10, padding: 5 }}>
                            <Text style={[utilities.smallText, { lineHeight: 18 }]}>
                                {description}
                            </Text>
                        </View>
                    )}
                </View>
                <View>


                {/*{participants && (*/}
                {/*            <View style={{width: '100%', marginTop: 10, alignItems: 'flex-start'}}>*/}
                {/*                <View style={{*/}
                {/*                    borderWidth: 1,*/}
                {/*                    borderColor: colors.secondary,*/}
                {/*                    borderRadius: 8,*/}
                {/*                    marginTop: 5,*/}
                {/*                    width: '100%',*/}
                {/*                    overflow: 'hidden'*/}
                {/*                }}>*/}
                {/*                    /!* Header *!/*/}
                {/*                    <View style={{*/}
                {/*                        flexDirection: 'row',*/}
                {/*                        backgroundColor: 'rgba(76, 175, 80, 0.3)',*/}
                {/*                        padding: 8,*/}
                {/*                        borderBottomWidth: 1,*/}
                {/*                        borderBottomColor: colors.secondary*/}
                {/*                    }}>*/}
                {/*                        <Text style={{flex: 0.8, color: '#fff', fontWeight: 'bold', textAlign: 'left'}}>Riders</Text>*/}
                {/*                    </View>*/}

                {/*                    /!* Participant rows *!/*/}
                {/*                    {Array.isArray(participants) ?*/}
                {/*                        participants.map((participant, index) => (*/}
                {/*                            <View key={index} style={{*/}
                {/*                                flexDirection: 'row',*/}
                {/*                                padding: 8,*/}
                {/*                                borderBottomWidth: index < participants.length - 1 ? 1 : 0,*/}
                {/*                                borderBottomColor: 'rgba(255, 255, 255, 0.2)',*/}
                {/*                                backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'*/}
                {/*                            }}>*/}
                {/*                                <Text style={{flex: 0.2, color: '#fff', textAlign: 'left', paddingLeft: 5}}>{index + 1}</Text>*/}
                {/*                                <Text style={{flex: 0.8, color: '#fff', textAlign: 'left'}}>{typeof participant === 'object' ? participant.username : participant}</Text>*/}
                {/*                            </View>*/}
                {/*                        )) :*/}
                {/*                        <View style={{padding: 8, width: '100%'}}>*/}
                {/*                            <Text style={{color: '#fff', textAlign: 'left'}}>{participants}</Text>*/}
                {/*                        </View>*/}
                {/*                    }*/}
                {/*                </View>*/}
                {/*            </View>*/}
                {/*        )}*/}
                </View>
            </ScrollView>
            <View style={rideUtilities.customBottomContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowParticipantsModal(true)}>
                            <Text style={rideUtilities.customBottomText}>Participants</Text>
                        </TouchableOpacity>
                        <ParticipantListModal
                            visible={showParticipantsModal}
                            onClose={() => setShowParticipantsModal(false)}
                            participants={participants}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={rideUtilities.customBottomText}>Column 2</Text>
                    </View>
                </View>
            </View>

        </View>

    );
};

export default RideStep4;