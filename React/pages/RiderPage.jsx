
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Alert} from "react-native";
import utilities from "../styles/utilities";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import {getCurrentRiderType} from '../services/rideService';




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


    return (

        <View style={utilities.container}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
                {/* Username and Rider Type - Left aligned */}
                <View style={{ flex: 1 }}>
                    <Text style={utilities.compactText}>{username?.toUpperCase()}</Text>
                    {loading ? (
                        <Text style={utilities.compactText}>Loading...</Text>
                    ) : (
                        <Text style={utilities.compactText}>{riderType?.riderType || 'Not set'}</Text>
                    )}
                </View>

                {/* Create ride button - Centered */}
                <View style={{ flex: 1, alignItems: 'center' }}>
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

                {/* Settings icon - Right aligned */}
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => {}}>
                        <FontAwesome name="gear" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={utilities.centeredContainer}>

                    <View style={utilities.centeredContainer}>
                        <TouchableOpacity style={utilities.button}>
                            <Text style={utilities.buttonText}>Action</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={utilities.centeredContainer}>
                        <TouchableOpacity style={utilities.button}>
                            <Text style={utilities.buttonText}>Action</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={utilities.bottomAreaContainer}>
                        <TouchableOpacity style={utilities.button}>
                            <Text style={utilities.buttonText}>Action</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
};

export default RiderPage;
