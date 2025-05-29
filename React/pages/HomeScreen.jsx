// HomeScreen.jsx
import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import utilities from "../styles/utilities";

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={utilities.container}>
            {/* Top Navbar */}
            <View>
                <Text style={utilities.navbarTextDark}>Riders</Text>
            </View>

            {/* Center Content */}
            <View style={utilities.center}>
                <Text style={utilities.titleText}>This is the middle content.</Text>
            </View>

            {/* Bottom Home Button */}
            <View style={utilities.button}>
                <TouchableOpacity style={utilities.button}>
                    <Text style={utilities.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>

            <View>
                <TouchableOpacity
                    style={utilities.button}
                    onPress={() => navigation.navigate('AuthScreen')}
                >
                    <Text style={utilities.buttonText}>Login</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
