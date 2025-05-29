
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import utilities from "../styles/utilities";
import FontAwesome from "react-native-vector-icons/FontAwesome";



const RiderPage = ({ route }) => {

    const { username, token } = route.params;
    const [riderType, setRiderType] = React.useState('');

    React.useEffect(() => {
        const fetchRiderType = async () => {
            try {
                const response = await fetch('http://192.168.1.51:8080/riders/current-rider-type', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setRiderType(data); // Assuming backend returns plain string (e.g. "REGULAR", "VIP")
                } else {
                    const errorText = await response.text();
                    console.error('Failed to fetch rider type:', errorText);
                }
            } catch (error) {
                console.error('Error fetching rider type:', error);
            }
        };

        if (token) {
            fetchRiderType();
        }
    }, [token]);


    return (
        <View style={utilities.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[utilities.titleText, { flex: 1 }]}>{username?.toUpperCase()} {riderType} </Text>
                <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }} onPress={() => { /* handle settings press */ }}>
                    <FontAwesome name="gear" size={28} color="black" />
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
