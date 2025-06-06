// React/components/ride/RideStep4.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import utilities from '../../styles/utilities';

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
                       loading
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

    return (
        <View style={utilities.formGroup}>
            <Text style={utilities.title}>Review Ride Details</Text>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Ride Name:</Text>
                <Text style={utilities.value}>{rideName}</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Rider Type:</Text>
                <Text style={utilities.value}>{riderType}</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Distance:</Text>
                <Text style={utilities.value}>{distance} km</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Date and Time:</Text>
                <Text style={utilities.value}>{formatDate(date)}</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Location:</Text>
                <Text style={utilities.value}>{locationName}</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Starting Point:</Text>
                <Text style={utilities.value}>{startingPoint}</Text>
            </View>

            <View style={utilities.formGroup}>
                <Text style={utilities.label}>Destination:</Text>
                <Text style={utilities.value}>{endingPoint}</Text>
            </View>

            {participants && (
                <View style={utilities.formGroup}>
                    <Text style={utilities.label}>Participants:</Text>
                    <Text style={utilities.value}>{participants}</Text>
                </View>
            )}

            {description && (
                <View style={utilities.formGroup}>
                    <Text style={utilities.label}>Description:</Text>
                    <Text style={utilities.value}>{description}</Text>
                </View>
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity
                    style={[utilities.button, { backgroundColor: '#666' }]}
                    onPress={prevStep}>
                    <Text style={utilities.buttonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={utilities.button}
                    onPress={handleCreateRide}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={utilities.buttonText}>Confirm & Create Ride</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RideStep4;