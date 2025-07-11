const renderActiveRidesSection = () => {
    if (!startedRidesLoading && startedRides.length === 0 && !startedRidesError) {
        return null;
    }
    return (
        <View>
            {startedRidesLoading ? (
                <View style={modernUtilities.loadingContainer}>
                    <ActivityIndicator color="#8c2323" size="small" />
                </View>
            ) : startedRidesError ? (
                <Text style={modernUtilities.errorText}>{startedRidesError}</Text>
            ) : startedRides.length > 0 ? (
                startedRides.map((ride, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={modernUtilities.activeRideCard}
                        onPress={() => {
                            navigation.navigate('StartedRide', {
                                generatedRidesId: ride.ridesId,
                                ridesName: ride.ridesName,
                                locationName: ride.locationName,
                                token: token,
                                username: username
                            });
                        }}
                    >
                        <View style={modernUtilities.activeRideHeader}>
                            <Text style={modernUtilities.activeRideName}>{ride.ridesName} </Text>
                            <View style={modernUtilities.activeStatus}>
                                <FontAwesome name="circle" size={6} color="#27ae60" />
                                <Text style={modernUtilities.activeStatusText}>ACTIVE</Text>
                            </View>
                        </View>
                        <Text style={modernUtilities.activeRideLocation}>{ride.locationName}</Text>
                        <Text style={modernUtilities.activeRideId}>ID: {ride.ridesId}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <View style={modernUtilities.emptyState}>
                    <FontAwesome name="bicycle" size={30} color="#bdc3c7" />
                    <Text style={modernUtilities.emptyStateText}>No ongoing ride found.</Text>
                </View>
            )}
        </View>
    );
};
