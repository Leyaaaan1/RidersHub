
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import utilities from "../styles/utilities";



const RiderPage = ({ route }) => {
    const { username } = route.params;
    return (
        <View style={utilities.container}>
            <View>
                <Text style={utilities.titleText}>{username?.toUpperCase()}</Text>

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