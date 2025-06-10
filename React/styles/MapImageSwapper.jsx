import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const MapImageSwapper = ({ startImage, endImage, startPoint, endPoint, imageStyle }) => {
    const [showStart, setShowStart] = useState(true);

    const toggleImage = () => setShowStart(!showStart);

    const currentImage = showStart ? startImage : endImage;
    const currentPoint = showStart ? startPoint : endPoint;
    const currentLabel = showStart ? 'Starting Point' : 'Destination';
    const otherLabel = showStart ? 'Destination' : 'Starting Point';

    return (
        <View style={{ width: '100%', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#fff' , padding: 10}}>
        <Text style={{ color: '#fff', fontSize: 12 }}>{currentLabel}:</Text>
            <Text style={{ color: '#fff', fontSize: 30 }}>{currentPoint}</Text>

            {currentImage ? (
                <TouchableOpacity onPress={toggleImage} style={{ alignItems: 'center' }}>
                    <Image source={{ uri: currentImage }} style={imageStyle} />
                    <Text style={{ color: '#fff', marginTop: 5, fontSize: 12 }}>
                        Tap to see {otherLabel}
                    </Text>
                </TouchableOpacity>
            ) : (
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    No map available
                </Text>
            )}
        </View>
    );
};

export default MapImageSwapper;