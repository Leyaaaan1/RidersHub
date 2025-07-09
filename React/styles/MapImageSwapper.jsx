import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import colors from './colors';
import styles from './MapImageSwapperUtilities';

const MapImageSwapper = ({ startImage, endImage, startPoint, endPoint, showStart, setShowStart }) => {
    const currentImage = showStart ? startImage : endImage;
    const currentPoint = showStart ? startPoint : endPoint;
    const currentLabel = showStart ? 'Starting point' : 'Destination';
    const otherLabel = showStart ? 'Destination' : 'Starting Point';

    return (
        <View style={styles.container}>
            {currentImage ? (
                <View style={styles.mapContainer}>
                    <TouchableOpacity
                        onPress={() => setShowStart(!showStart)}
                        style={styles.imageContainer}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: currentImage }}
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>

                    {/* Clean Location Info */}
                    <View style={styles.locationInfo}>
                        <View style={styles.locationRow}>
                            <View style={styles.locationDot} />
                            <View style={styles.locationText}>
                                <Text style={styles.locationLabel}>{currentLabel}</Text>
                                <Text style={styles.locationName}>{currentPoint}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Minimal Tap Instruction */}
                    <TouchableOpacity
                        style={styles.tapButton}
                        onPress={() => setShowStart(!showStart)}
                    >
                        <Text style={styles.tapText}>
                            Top to view {otherLabel}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.noMapContainer}>
                    <Text style={styles.noMapText}>
                        No map available
                    </Text>
                </View>
            )}
        </View>
    );
};

export default MapImageSwapper;