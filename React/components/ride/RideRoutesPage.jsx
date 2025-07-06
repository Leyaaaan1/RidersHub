import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import MapImageSwapper from "../../styles/MapImageSwapper";
import { getLocationImage } from "../../services/rideService";
import rideRoutesUtilities from "../../styles/rideRoutesUtilities";
import LinearGradient from 'react-native-linear-gradient';
import imageStyles from "../../styles/ImageStyles";

const RideRoutesPage = ({ route }) => {
    const {
        startMapImage,
        endMapImage,
        startingPoint,
        endingPoint,
        token,
    } = route.params;

    const [startingPointImages, setStartingPointImages] = useState([]);
    const [endingPointImages, setEndingPointImages] = useState([]);
    const [startingPointImageLoading, setStartingPointImageLoading] = useState(false);
    const [endingPointImageLoading, setEndingPointImageLoading] = useState(false);
    const [startingPointImageError, setStartingPointImageError] = useState(null);
    const [endingPointImageError, setEndingPointImageError] = useState(null);
    const [showStart, setShowStart] = useState(true);

    const fetchPointImages = async (start, end) => {
        if (!start || !end || !token) {
            setStartingPointImageError("Missing starting point, ending point, or token");
            setEndingPointImageError("Missing starting point, ending point, or token");
            return;
        }

        setStartingPointImageLoading(true);
        setEndingPointImageLoading(true);
        setStartingPointImageError(null);
        setEndingPointImageError(null);

        try {
            const startImages = await getLocationImage(start, token);
            setStartingPointImages(Array.isArray(startImages) ? startImages : []);
        } catch (error) {
            setStartingPointImageError(error.message || "Failed to load starting point images");
        } finally {
            setStartingPointImageLoading(false);
        }

        try {
            const endImages = await getLocationImage(end, token);
            setEndingPointImages(Array.isArray(endImages) ? endImages : []);
        } catch (error) {
            setEndingPointImageError(error.message || "Failed to load ending point images");
        } finally {
            setEndingPointImageLoading(false);
        }
    };

    useEffect(() => {
        fetchPointImages(startingPoint, endingPoint);
    }, [startingPoint, endingPoint, token]);

    const images = showStart ? startingPointImages : endingPointImages;
    const imagesLoading = showStart ? startingPointImageLoading : endingPointImageLoading;
    const imagesError = showStart ? startingPointImageError : endingPointImageError;

    return (
        <ScrollView style={rideRoutesUtilities.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Minimal Header */}
            <View style={rideRoutesUtilities.header}>
                <View style={rideRoutesUtilities.headerContent}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity >
                            <Text style={{ fontSize: 22, color: '#fff', marginRight: 12 }}>{'\u25C0'}</Text>
                        </TouchableOpacity>
                        <View style={rideRoutesUtilities.routeDetails}>
                            <Text style={rideRoutesUtilities.routeText}>{startingPoint}</Text>
                            <View style={rideRoutesUtilities.routeArrow} />
                            <Text style={rideRoutesUtilities.routeText}>{endingPoint}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Clean Image Section */}
            <View style={rideRoutesUtilities.imageSection}>
                {imagesLoading ? (
                    <View style={rideRoutesUtilities.loadingContainer}>
                        <Text style={rideRoutesUtilities.loadingText}>Loading...</Text>
                    </View>
                ) : images.length > 0 ? (
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, idx) => idx.toString()}
                        renderItem={({ item }) => (
                            <View>
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={rideRoutesUtilities.image}
                                    resizeMode="cover"
                                />
                                {(item.author || item.license) && (
                                    <Text style={imageStyles.imageMeta}>
                                        {item.author ? `Photo: ${item.author}` : ''}
                                        {item.author && item.license ? ' | ' : ''}
                                        {item.license ? `License: ${item.license}` : ''}
                                    </Text>
                                )}
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={rideRoutesUtilities.imagesList}
                    />
                ) : (
                    <View style={rideRoutesUtilities.errorContainer}>
                        <Text style={rideRoutesUtilities.errorText}>
                            {imagesError || "No images available"}
                        </Text>
                    </View>
                )}

                {/* Minimal Switch Button */}

            </View>

            {/* Map Section */}
            <View style={rideRoutesUtilities.mapSection}>
                <View style={rideRoutesUtilities.swapperSection}>
                    <MapImageSwapper
                        startImage={startMapImage}
                        endImage={endMapImage}
                        startPoint={startingPoint}
                        endPoint={endingPoint}
                        showStart={showStart}
                        setShowStart={setShowStart}
                    />
                </View>
            </View>

        </ScrollView>
    );
};

export default RideRoutesPage;