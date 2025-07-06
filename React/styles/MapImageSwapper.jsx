import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from './colors';
import utilities from "./utilities";

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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    mapContainer: {
        backgroundColor: '#111',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#222',
    },

    // Clean Location Info
    locationInfo: {
        backgroundColor: '#111',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#8c2323',
        marginRight: 12,
    },
    locationText: {
        flex: 1,
    },
    locationLabel: {
        color: '#666',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    locationName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.2,
    },

    // Minimal Tap Button
    tapButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10,
        alignItems: 'center',
    },
    tapText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.2,
    },

    // No Map State
    noMapContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 8,
    },
    noMapText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default MapImageSwapper;