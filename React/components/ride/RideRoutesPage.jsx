// React/components/ride/RideRoutesPage.jsx
import React from 'react';
import { View, Text } from 'react-native';
import MapImageSwapper from "../../styles/MapImageSwapper";
import utilities from '../../styles/utilities';

const RideRoutesPage = ({ route }) => {
    const {
        startMapImage,
        endMapImage,
        mapImage,
        rideNameImage,
        startingPoint,
        endingPoint,
        rideName,
        locationName,
        riderType,
        date,
        participants,
        description,
        token,
        distance,
        username,
        currentUsername,
    } = route.params;

    console.log('RideRoutesPage params:', route.params);

    return (
        <View>



            {startMapImage || endMapImage ? (
                <MapImageSwapper
                    startImage={startMapImage}
                    endImage={endMapImage}
                    startPoint={startingPoint}
                    endPoint={endingPoint}

                />
            ) : (
                <Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No start or end map available</Text>
            )}

        </View>


    );
};

export default RideRoutesPage;