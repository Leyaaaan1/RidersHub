// React/components/ride/RideStep4.jsx
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image} from 'react-native';
import utilities from '../../styles/utilities';
import rideUtilities from '../../styles/rideUtilities';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";

import WaveLine from '../../styles/waveLineComponent';
const RideStep4 = ({
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
                       handleCreateRide,
    token,
    username,
                       mapboxImageUrl,
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
        handleCreateRide().then(() => {
            navigation.navigate('RiderPage', { token, username });
        });
    };
    const [imageLoading, setImageLoading] = useState(true);

    return (
            <View style={rideUtilities.formGroup}>
                <Text style={rideUtilities.title}>RIDE DETAILS</Text>
                <View style={[
                    rideUtilities.topContainer,
                    rideUtilities.middleContainer,
                    {width: 'auto', paddingHorizontal: 15}
                ]}>
                    <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Text style={[rideUtilities.title, {color: '#db6e6e', marginBottom: 8}]}>
                            {rideName.toUpperCase()}
                        </Text>

                        <Text style={rideUtilities.detailText}>{distance} km</Text>

                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {riderType === 'car' && <FontAwesome name="car" size={24} color="#fff" style={{marginRight: 8}} />}
                            {riderType === 'motor' && <FontAwesome name="motorcycle" size={24} color="#fff" style={{marginRight: 8}} />}
                            {riderType === 'bike' && <FontAwesome name="bicycle" size={24} color="#fff" style={{marginRight: 8}} />}
                            {riderType === 'cafe Racers' && <FontAwesome name="rocket" size={24} color="#fff" style={{marginRight: 8}} />}
                        </View>
                        <View style={rideUtilities.formGroup}>
                            <Text style={rideUtilities.detailText}>{formatDate(date)}</Text>
                        </View>
                    </View>
                    <View style={[
                        rideUtilities.topContainer,
                        rideUtilities.middleContainer,
                        {width: 'auto', paddingHorizontal: 15, marginBottom: 10}
                    ]}>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome name="map-marker" size={24} color="#fff" style={{marginRight: 8}} />
                                <Text style={rideUtilities.detailText}>{locationName}</Text>
                            </View>
                        </View>
                </View>



                <View style={[
                    rideUtilities.topContainer,
                    rideUtilities.middleContainer,
                    {width: 'auto', paddingHorizontal: 15, marginBottom: 10}
                ]}>
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
                            marginVertical: 15,
                            justifyContent: 'center'
                        }}>
                            <WaveLine color="#4CAF50" />
                            <FontAwesome
                                name="long-arrow-right"
                                size={20}
                                color="#4CAF50"
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
                </View>

                <View>
                    {mapboxImageUrl && (
                        <View style={utilities.imageContainer}>
                            <Text style={utilities.label}>Location Map</Text>
                            {imageLoading && (
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                    style={{position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -10}, {translateY: -10}], zIndex: 1}}
                                />
                            )}
                            <Image
                                source={{ uri: mapboxImageUrl }}
                                style={utilities.mapboxImage}
                                resizeMode="cover"
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                                onError={(error) => {
                                    console.log('Image load error:', error);
                                    setImageLoading(false);
                                }}
                            />
                        </View>
                    )}
                </View>



                {participants && (
                        <View style={utilities.formGroup}>
                            <Text style={utilities.label}>Participants:</Text>
                            <Text style={utilities.compactText}>{participants}</Text>
                        </View>
                    )}

                    {description && (
                        <View style={utilities.formGroup}>
                            <Text style={utilities.label}>Description:</Text>
                            <Text style={utilities.compactText}>{description}</Text>
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