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
        <View style={{width: '100%', alignItems: 'center'}}>
            {currentImage ? (
                <TouchableOpacity onPress={toggleImage} style={{alignItems: 'center'}}>
                    <View style={{position: 'relative'}}>
                        <Text style={{color: '#fff', marginTop: 5,  fontSize: 12, textAlign: 'center'}}>
                            Tap to see {otherLabel}
                        </Text>
                        <Image
                            source={{uri: currentImage}}
                            style={[
                                imageStyle,
                                {
                                    shadowColor: '#000',

                                    elevation: 8, // for Android
                                }
                            ]}
                        />
                        <View style={{
                            position: 'absolute',
                            top: 10,
                            left: 0,
                            right: 0,
                            alignItems: 'center'
                        }}>
                            <View style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                padding: 8,
                                borderRadius: 15,
                                marginTop: 300
                            }}>
                                <Text style={{color: '#fff', fontSize: 12}}>{currentLabel}:</Text>
                                <Text style={{
                                    color: '#fff',
                                    fontSize: 24,
                                    textAlign: 'center'
                                }}>{currentPoint}</Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            ) : (
                <Text style={{color: '#fff', textAlign: 'center'}}>
                    No map available
                </Text>
            )}
        </View>
    );
};
export default MapImageSwapper;