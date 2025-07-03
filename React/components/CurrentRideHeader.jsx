import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import utilities from '../styles/utilities';
import colors from '../styles/colors';

const CurrentRideHeader = ({ startedRides, startedRidesLoading, startedRidesError }) => (
    <ScrollView horizontal={true} style={utilities.currentRideContainer}>
        <View style={utilities.currentRideBox}>
            <Text style={utilities.currentRideTitle}>Current Ride</Text>
            {startedRidesLoading ? (
                <ActivityIndicator color={colors.white} />
            ) : startedRidesError ? (
                <Text style={utilities.currentRideError}>{startedRidesError}</Text>
            ) : startedRides.length > 0 ? (
                startedRides.map((ride, idx) => (
                    <View key={idx} style={utilities.currentRideItem}>
                        <Text style={utilities.currentRideLabel}>
                            Ride ID: <Text style={utilities.currentRideValue}>{ride.ridesId}</Text>
                        </Text>
                        <Text style={utilities.currentRideLabel}>
                            Name: <Text style={utilities.currentRideValue}>{ride.ridesName}</Text>
                        </Text>
                        <Text style={utilities.currentRideLabel}>
                            Location: <Text style={utilities.currentRideValue}>{ride.locationName}</Text>
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={utilities.currentRideEmpty}>
                    No current ride found.
                </Text>
            )}
        </View>
    </ScrollView>
);

export default CurrentRideHeader;