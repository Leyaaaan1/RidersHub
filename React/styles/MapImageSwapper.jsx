import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from './colors';
import utilities from "./utilities";
const MapImageSwapper = ({ startImage, endImage, startPoint, endPoint }) => {
    const [showStart, setShowStart] = useState(true);

    const toggleImage = () => setShowStart(!showStart);

    const currentImage = showStart ? startImage : endImage;
    const currentPoint = showStart ? startPoint : endPoint;
    const currentLabel = showStart ? 'Starting Point' : 'Destination';
    const otherLabel = showStart ? 'Destination' : 'Starting Point';

    return (
        <View style={[utilities.containerWhite, { position: 'relative' }]}>
            {currentImage ? (
                <TouchableOpacity onPress={toggleImage} style={{ alignItems: 'center'  }}>

                    <Image
                        source={{ uri: currentImage }}
                        style={{ width: '100%', height: 200, borderRadius: 8, borderWidth: 2, borderColor: '#fff', backgroundColor: '#222' }}
                        resizeMode="cover"
                    />`
                    <View style={{ marginTop: 4, alignItems: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', paddingVertical: 0, marginVertical: 0 }}>
                            Tap to see {otherLabel}
                        </Text>
                    </View>
                    <View style={{

                    }}>
                        <View style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            padding: 6,
                            borderRadius: 10,
                        }}>
                            <Text style={{ color: '#fff', fontSize: 12 }}>{currentLabel}:</Text>
                            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>{currentPoint}</Text>
                        </View>
                    </View>
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