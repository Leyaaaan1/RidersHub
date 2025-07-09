import React from 'react';
import { View, Text, Image, FlatList, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import rideRoutesPageUtilities from './RideRoutesPageUtilities';
const RideImagesCarousel = ({ images, imagesLoading, imagesError, pulseAnim }) => (
    <Animated.View style={[rideRoutesPageUtilities.imageSection, { opacity: 1 }]}>
        {imagesLoading ? (
            <View style={rideRoutesPageUtilities.loadingContainer}>
                <Animated.View style={[rideRoutesPageUtilities.loadingDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={rideRoutesPageUtilities.loadingText}>Loading images...</Text>
            </View>
        ) : images.length > 0 ? (
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                    <View style={rideRoutesPageUtilities.imageCard}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={rideRoutesPageUtilities.image}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={rideRoutesPageUtilities.imageOverlay}
                        />
                        {(item.author || item.license) && (
                            <View style={rideRoutesPageUtilities.imageMetaContainer}>
                                <Text style={rideRoutesPageUtilities.imageMeta}>
                                    {item.author ? `📸 ${item.author}` : ''}
                                    {item.author && item.license ? ' • ' : ''}
                                    {item.license ? `${item.license}` : ''}
                                </Text>
                            </View>
                        )}
                        <View style={rideRoutesPageUtilities.imageCounter}>
                            <Text style={rideRoutesPageUtilities.imageCounterText}>
                                {index + 1} / {images.length}
                            </Text>
                        </View>
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={rideRoutesPageUtilities.imagesList}
            />
        ) : (
            <View style={rideRoutesPageUtilities.errorContainer}>
                <Text style={rideRoutesPageUtilities.errorIcon}>📷</Text>
                <Text style={rideRoutesPageUtilities.errorText}>
                    {imagesError || "No images available"}
                </Text>
            </View>
        )}
    </Animated.View>
);

export default RideImagesCarousel;