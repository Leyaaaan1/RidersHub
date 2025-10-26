// javascript
// File: `React/pages/StartedRide.jsx`
import React from 'react';
import {View, Text, ScrollView, StatusBar, Animated, TouchableOpacity} from 'react-native';
import { modernUtilities as styles } from "../styles/modernUtilities";
import rideRoutesPageUtilities from "../styles/RideRoutesPageUtilities";
import RouteMapView from "../utilities/route/RouteMapView";
import rideStepsUtilities from "../styles/rideStepsUtilities";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const StartedRide = ({ route }) => {
    const { activeRide, token, username } = route.params || {};

    if (!activeRide) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No ride data available</Text>
            </View>
        );
    }

    return (

        <View style={styles.contentContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#151515" />

            <Animated.View style={[rideRoutesPageUtilities.mapSection, { width: '100%', height: 770 }]}>
                <RouteMapView
                    generatedRidesId={activeRide.generatedRidesId}
                    token={token}
                    startingPoint={activeRide.startingPoint}
                    endingPoint={activeRide.endingPoint}
                    stopPoints={activeRide.stopPoints}
                    style={{ flex: 1 }}
                    isDark={true}
                />
                <View style={[rideStepsUtilities.topRowContainer, { padding: 16, justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity style={rideStepsUtilities.actionButton}>
                        <FontAwesome name="stop-circle" size={23} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={rideStepsUtilities.actionButton}>
                        <FontAwesome name="users" size={23} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={rideStepsUtilities.actionButton}>
                        <FontAwesome name="info-circle" size={23} color="#fff" />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <Text style={styles.activeRideLocation}>{activeRide.ridesName}</Text>
            <Text style={styles.activeRideName}>{activeRide.locationName}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
                <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.riderType}</Text>
                <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.distance} km</Text>
                <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.date}</Text>
            </View>

            <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
                <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Starting Point</Text>
                <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.startingPointName || activeRide.startingPoint || '—'}</Text>
            </View>

            <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
                <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Ending Point</Text>
                <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.endingPointName || activeRide.endingPoint || '—'}</Text>
            </View>

            <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
                <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Participants</Text>
                <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.participants ?? '—'}</Text>
            </View>

            <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
                <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Description</Text>
                <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.description || '—'}</Text>
            </View>

            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                <Text style={{ color: '#95a5a6', fontSize: 12 }}>Ride created by: {activeRide.username || username || '—'}</Text>
            </View>
        </View>
    );
};

export default StartedRide;