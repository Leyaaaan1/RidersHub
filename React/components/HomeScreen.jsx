// HomeScreen.jsx
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import global from "../styles/global";

const HomeScreen = () => {
    return (
        <SafeAreaView style={global.container}>
            {/* Top Navbar */}
            <View>
                <Text style={global.navbarTextDark}>Welcome User</Text>
            </View>

            {/* Center Content */}
            <View style={global.center}>
                <Text style={global.titleText}>This is the middle content.</Text>
            </View>

            {/* Bottom Home Button */}
            <View style={global.bottomBar}>
                <TouchableOpacity style={global.button}>
                    <Text style={global.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
