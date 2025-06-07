// React/components/ride/RideStep4.jsx
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image} from 'react-native';
import utilities from '../../styles/utilities';
import rideUtilities from '../../styles/rideUtilities';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { fetchRideMapImage } from '../../services/rideService';
import WaveLine from '../../styles/waveLineComponent';
import colors from '../../styles/colors';


const RideStep4 = ({
                       generatedRidesId,
                       rideName,
                       locationName,
                       riderType,
                       distance,
                       date,
                       startingPoint,
                       endingPoint,
                       participants,
                       description,
                       prevStep,
    token,
    username,
                       loading,
                   }) => {

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
    const navigation = useNavigation();
    const handleSubmit = () => {
        // Just navigate back to RiderPage without creating the ride again
        navigation.navigate('RiderPage', { token, username });
    };


    const [mapImage, setMapImage] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

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
                console.error("Failed to load map image:", error);
            } finally {
                setImageLoading(false);
            }
        };

        getMapImage();
    }, [generatedRidesId, token]);


    return (
            <View style={rideUtilities.formGroup}>
                <View style={[
                    rideUtilities.topContainer,
                    rideUtilities.middleContainer,
                    {width: 'auto', paddingHorizontal: 15}
                ]}>
                    <Text style={[rideUtilities.title, {color: '#db6e6e', marginBottom: 8}]}>
                        {rideName.toUpperCase()}

                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>

                        {/* Left Column */}
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                            <Text style={rideUtilities.detailText}>Rider: {username} </Text>
                            <Text style={rideUtilities.detailText}>{distance} km</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome name="map-marker" size={24} color="#fff" style={{marginRight: 8}} />
                                <Text style={rideUtilities.detailText}>{locationName} </Text>
                            </View>
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
                                                onLoadStart={() => console.log("Starting to load image:", mapImage)}
                                                onLoadEnd={() => console.log("Image load completed")}
                                                onError={(e) => console.error("Image loading error:", e.nativeEvent.error)}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Text style={{color: '#fff'}}>No map available</Text>
                                        )}
                                    </View>


                    <View style={{flexDirection: 'column', alignItems: 'center', paddingVertical: 10}}>
                        {/* Starting Point */}
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <View style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: '#4CAF50',
                                marginRight: 8
                            }} />
                            <View style={{flex: 1}}>
                                <Text style={[utilities.label, {color: '#fff', fontSize: 12}]}>Starting Point:</Text>
                                <Text style={[utilities.compactText, {color: '#fff'}]}>{startingPoint}</Text>
                            </View>
                        </View>

                        {/* Wave Line with FontAwesome Arrow */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 2,
                            justifyContent: 'center'
                        }}>
                            <WaveLine color="#4CAF50" />
                            <FontAwesome
                                name="long-arrow-right"
                                size={20}
                                color="#f44336"
                                style={{marginLeft: 8}}
                            />
                        </View>

                        {/* Ending Point */}
                        <View style={{flexDirection: 'row-reverse', alignItems: 'center', marginTop: 5, justifyContent: 'flex-start'}}>
                            <View style={{
                                width: 12,
                                height: 12,
                                borderRadius: 6,
                                backgroundColor: '#f44336',
                                marginLeft: 8
                            }} />
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Text style={[utilities.label, {color: '#fff', fontSize: 12, textAlign: 'right'}]}>Destination:</Text>
                                <Text style={[utilities.compactText, {color: '#fff', textAlign: 'right'}]}>{endingPoint}</Text>
                            </View>
                        </View>
                    </View>
                </View>


                {description && (
                    <View style={[
                        rideUtilities.topContainer,
                        rideUtilities.middleContainer,
                        {width: 'auto', paddingHorizontal: 15, marginBottom: 10}
                    ]}>
                        <View style={rideUtilities.formGroup}>
                            <Text style={[rideUtilities.label, {color: '#fff', fontSize: 20}]}>Description:</Text>
                            <Text style={rideUtilities.detailText}>{description}</Text>
                        </View>
                    </View>
                )}
                {participants && (
                    <View style={utilities.formGroup}>
                        <Text style={utilities.label}>Participants:</Text>
                        <Text style={utilities.compactText}>{participants}</Text>
                    </View>
                )}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity
                            style={[utilities.button, { backgroundColor: '#666' }]}
                            onPress={prevStep}>
                            <Text style={utilities.buttonText}>Back</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[utilities.button, { backgroundColor: '#d9534f' }]}
                            onPress={handleSubmit}>
                            <Text style={utilities.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
            </View>
    );
};

export default RideStep4;