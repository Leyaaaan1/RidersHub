import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import MapImageSwapper from "../../styles/MapImageSwapper";
import { getLocationImage } from "../../services/rideService";

const RideRoutesPage = ({ route }) => {
    const {
        startMapImage,
        endMapImage,
        startingPoint,
        endingPoint,
        token,
    } = route.params;

    const [startingPointImages, setStartingPointImages] = useState([]);
    const [startingPointImageLoading, setStartingPointImageLoading] = useState(false);
    const [startingPointImageError, setStartingPointImageError] = useState(null);

    const [endingPointImages, setEndingPointImages] = useState([]);
    const [endingPointImageLoading, setEndingPointImageLoading] = useState(false);
    const [endingPointImageError, setEndingPointImageError] = useState(null);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startingPoint, endingPoint, token]);

    return (
        <ScrollView>
            {startMapImage || endMapImage ? (
                <MapImageSwapper
                    startImage={startMapImage}
                    endImage={endMapImage}
                    startPoint={startingPoint}
                    endPoint={endingPoint}
                />
            ) : (
                <Text style={{ color: '#fff', textAlign: 'center', width: '100%' }}>
                    No start or end map available
                </Text>
            )}

            <View style={{ marginTop: 20 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
                    Starting Point Images
                </Text>
                {startingPointImageLoading ? (
                    <Text style={{ color: '#fff' }}>Loading...</Text>
                ) : startingPointImages.length > 0 ? (
                    <FlatList
                        data={startingPointImages}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, idx) => idx.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={{ width: 300, height: 200, marginRight: 10 }}
                                resizeMode="cover"
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <Text style={{ color: '#fff' }}>
                        {startingPointImageError || "No images available"}
                    </Text>
                )}
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 8 }}>
                    Ending Point Images
                </Text>
                {endingPointImageLoading ? (
                    <Text style={{ color: '#fff' }}>Loading...</Text>
                ) : endingPointImages.length > 0 ? (
                    <FlatList
                        data={endingPointImages}
                        horizontal
                        pagingEnabled
                        keyExtractor={(_, idx) => idx.toString()}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={{ width: 300, height: 200, marginRight: 10 }}
                                resizeMode="cover"
                            />
                        )}
                        showsHorizontalScrollIndicator={true}
                    />
                ) : (
                    <Text style={{ color: '#fff' }}>
                        {endingPointImageError || "No images available"}
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

export default RideRoutesPage;