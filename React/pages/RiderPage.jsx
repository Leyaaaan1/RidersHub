
import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Alert} from "react-native";
import utilities from "../styles/utilities";
import FontAwesome from "react-native-vector-icons/FontAwesome";



const RiderPage = ({ route , navigation}) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchCurrentRiderType();
    }, []);


    const fetchCurrentRiderType = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://192.168.1.51:8080/riders/current-rider-type', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRiderType(data);
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to fetch rider type');
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
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                    {/* Left icon bar (empty) */}
                    <View style={{ width: 30 }} />

                    {/* Username and Rider Type */}
                    <View style={{ flex: 1 }}>
                        <Text style={utilities.compactText}>{username?.toUpperCase()}</Text>
                        {loading ? (
                            <Text style={utilities.compactText}>Loading...</Text>
                        ) : (
                            <Text style={utilities.compactText}>{riderType?.riderType || 'Not set'}</Text>
                        )}
                    </View>

                    {/* Gear icon */}
                    <TouchableOpacity onPress={() => {}}>
                        <FontAwesome name="gear" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            <View style={utilities.centeredContainer}>
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
                    <Text style={utilities.buttonText}>Create ride</Text>
                </TouchableOpacity>
            </View>

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

            {/* User Details Container */}
            <View style={utilities.bottomAreaContainer}>
                <TouchableOpacity style={utilities.button}>
                    <Text style={utilities.buttonText}>Action</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RiderPage;
