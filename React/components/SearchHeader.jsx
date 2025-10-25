// React/components/SearchHeader.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import colors from "../styles/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getRideDetails } from '../services/rideService';
import riderPageUtils from "../styles/riderPageUtils";

const SearchHeader = ({ token, username, navigation }) => {
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    console.log('current user:', username);



    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError('Please enter a ride ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const ride = await getRideDetails(searchId.trim(), token);
            navigation.navigate('RideStep4', {
                generatedRidesId: ride.generatedRidesId,
                rideName: ride.ridesName,
                locationName: ride.locationName,
                riderType: ride.riderType,
                distance: ride.distance,
                date: ride.date,
                startingPoint: ride.startingPointName,
                endingPoint: ride.endingPointName,
                participants: ride.participants,
                description: ride.description,
                token: token,
                username: ride.username,
                currentUsername: username
            });
        } catch (error) {
            setError(error.message || 'Failed to find ride');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View >

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: colors.primary,
                        borderRadius: 5,
                        padding: 10,
                        marginRight: 10,
                        color: '#fff'
                    }}
                    placeholder="Ride ID"
                    placeholderTextColor="#fff"
                    value={searchId}
                    onChangeText={setSearchId}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    disabled={loading}
                    style={{
                        backgroundColor: colors.primary,
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <FontAwesome name="search" size={18} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
            {error ? (
                <Text style={{ color: colors.primary, marginTop: 5 }}>{error}</Text>
            ) : null}
        </View>
    );
};

export default SearchHeader;