import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { getLocationImage } from '../../services/rideService';
import rideRoutesPageUtilities from '../../styles/RideRoutesPageUtilities';
import LinearGradient from 'react-native-linear-gradient';
import { getStopPointsByRideId } from '../../services/startService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const RideRoutesPage = ({ route }) => {
  const {
    startingPoint,
    generatedRidesId,
    endingPoint,
    token,
  } = route.params;

  const [stopPoints, setStopPoints] = useState([]);
  const [stopPointsLoading, setStopPointsLoading] = useState(false);
  const [stopPointsError, setStopPointsError] = useState(null);
  const [stopPointImages, setStopPointImages] = useState({});
  const [loadingImages, setLoadingImages] = useState({});

  // Fetch stop points only (no images)
  const fetchStopPoints = useCallback(async () => {
    setStopPointsLoading(true);
    setStopPointsError(null);
    try {
      const data = await getStopPointsByRideId(generatedRidesId, token);
      const points = Array.isArray(data) ? data : [];
      setStopPoints(points);
    } catch (err) {
      setStopPointsError(err.message || 'Failed to load stop points');
    } finally {
      setStopPointsLoading(false);
    }
  }, [generatedRidesId, token]);

  // Fetch images for a specific stop point (manual)
  const fetchImagesForStop = useCallback(async (stopName) => {
    if (stopPointImages[stopName]) {
      // Already loaded
      return;
    }

    setLoadingImages(prev => ({ ...prev, [stopName]: true }));
    try {
      const images = await getLocationImage(stopName, token);
      setStopPointImages(prev => ({
        ...prev,
        [stopName]: Array.isArray(images) ? images : []
      }));
    } catch (error) {
      console.error(`Error fetching images for ${stopName}:`, error);
      setStopPointImages(prev => ({
        ...prev,
        [stopName]: [] // Set empty array on error
      }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [stopName]: false }));
    }
  }, [token, stopPointImages]);

  // Load all images at once
  const loadAllImages = useCallback(async () => {
    for (const point of stopPoints) {
      if (!stopPointImages[point.stopName]) {
        await fetchImagesForStop(point.stopName);
      }
    }
  }, [stopPoints, stopPointImages, fetchImagesForStop]);

  // Fetch stop points on mount only
  useEffect(() => {
    if (generatedRidesId && token) {
      fetchStopPoints();
    }
  }, [generatedRidesId, token, fetchStopPoints]);

  return (
    <ScrollView style={rideRoutesPageUtilities.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Section */}
      <LinearGradient
        colors={['#000', '#1a1a1a', '#000']}
        style={rideRoutesPageUtilities.headerGradient}
      >
        <View style={rideRoutesPageUtilities.header}>
          <View style={rideRoutesPageUtilities.headerContent}>
            {/* Route Points Display */}
            <View style={{ marginTop: 24 }}>
              <View style={rideRoutesPageUtilities.routeDetailsContainer}>
                <View style={rideRoutesPageUtilities.routePoint}>
                  <View style={rideRoutesPageUtilities.startDot} />
                  <Text style={[rideRoutesPageUtilities.routePointText, { fontSize: 12, color: '#888', marginBottom: 4 }]}>Starting Point</Text>
                  <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{startingPoint}</Text>
                </View>

                <View style={rideRoutesPageUtilities.routeConnection}>
                  <FontAwesome name="arrow-right" size={18} color="#2e7d32" />
                </View>

                <View style={rideRoutesPageUtilities.routePoint}>
                  <View style={rideRoutesPageUtilities.endDot} />
                  <Text style={[rideRoutesPageUtilities.routePointText, { fontSize: 12, color: '#888', marginBottom: 4 }]}>Ending Point</Text>
                  <Text style={rideRoutesPageUtilities.routePointText} numberOfLines={2}>{endingPoint}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stop Points Section */}
      <View style={[rideRoutesPageUtilities.stopPointsSection, { marginTop: 24 }]}>
        <View style={rideRoutesPageUtilities.sectionHeader}>
          <View style={rideRoutesPageUtilities.sectionTitleRow}>
            <View style={rideRoutesPageUtilities.sectionIndicator} />
            <Text style={rideRoutesPageUtilities.sectionTitle}>Stop Points</Text>
            {stopPoints.length > 0 && (
              <View style={rideRoutesPageUtilities.countBadge}>
                <Text style={rideRoutesPageUtilities.countBadgeText}>{stopPoints.length}</Text>
              </View>
            )}
          </View>
          {/* Load All Images Button */}
          {stopPoints.length > 0 && (
            <TouchableOpacity
              onPress={loadAllImages}
              style={{
                marginTop: 12,
                backgroundColor: '#2e7d32',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome name="image" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontWeight: '600' }}>Load All Images</Text>
            </TouchableOpacity>
          )}
        </View>

        {stopPointsLoading ? (
          <View style={rideRoutesPageUtilities.loadingContainer}>
            <Text style={rideRoutesPageUtilities.loadingText}>Loading stop points...</Text>
          </View>
        ) : stopPointsError ? (
          <View style={rideRoutesPageUtilities.errorContainer}>
            <Text style={rideRoutesPageUtilities.errorIcon}>⚠️</Text>
            <Text style={rideRoutesPageUtilities.errorText}>{stopPointsError}</Text>
            {/* Retry Button */}
            <TouchableOpacity
              onPress={fetchStopPoints}
              style={{
                marginTop: 16,
                backgroundColor: '#2e7d32',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : stopPoints.length > 0 ? (
          <View style={rideRoutesPageUtilities.stopPointsList}>
            {stopPoints.map((point, idx) => (
              <React.Fragment key={idx}>
                <View style={rideRoutesPageUtilities.stopPointCard}>
                  <View style={rideRoutesPageUtilities.stopPointHeader}>
                    <View style={rideRoutesPageUtilities.stopPointNumber}>
                      <Text style={rideRoutesPageUtilities.stopPointNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={rideRoutesPageUtilities.stopPointInfo}>
                      <Text style={rideRoutesPageUtilities.stopPointName}>{point.stopName}</Text>
                      <Text style={rideRoutesPageUtilities.stopPointCoords}>Stop #{idx + 1}</Text>
                    </View>
                    <FontAwesome name="map-marker" size={18} color="#666" />
                  </View>

                  {/* Load Images Button for individual stop */}
                  {!stopPointImages[point.stopName] && !loadingImages[point.stopName] && (
                    <TouchableOpacity
                      onPress={() => fetchImagesForStop(point.stopName)}
                      style={{
                        marginTop: 12,
                        backgroundColor: '#333',
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FontAwesome name="image" size={14} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#fff', fontSize: 13 }}>Load Images</Text>
                    </TouchableOpacity>
                  )}

                  {/* Loading indicator */}
                  {loadingImages[point.stopName] && (
                    <View style={{ marginTop: 12, alignItems: 'center' }}>
                      <ActivityIndicator size="small" color="#2e7d32" />
                      <Text style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Loading images...</Text>
                    </View>
                  )}

                  {/* Stop Point Images */}
                  {stopPointImages[point.stopName]?.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{ marginTop: 16 }}
                    >
                      {stopPointImages[point.stopName].map((img, imgIdx) => (
                        <View key={imgIdx} style={{ marginRight: 12, borderRadius: 12, overflow: 'hidden' }}>
                          <Image
                            source={{ uri: img.imageUrl }}
                            style={{ width: 200, height: 150, backgroundColor: '#222' }}
                          />
                          {(img.author || img.license) && (
                            <View style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              padding: 8,
                            }}>
                              <Text style={{ color: '#fff', fontSize: 10 }}>
                                {img.author ? `Photo: ${img.author}` : ''}
                                {img.author && img.license ? ' | ' : ''}
                                {img.license ? `License: ${img.license}` : ''}
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  {/* Show message if no images found */}
                  {stopPointImages[point.stopName]?.length === 0 && (
                    <Text style={{ color: '#666', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
                      No images available
                    </Text>
                  )}
                </View>
                {idx < stopPoints.length - 1 && (
                  <View style={rideRoutesPageUtilities.stopPointConnector} />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View style={rideRoutesPageUtilities.emptyStateContainer}>
            <Text style={rideRoutesPageUtilities.emptyStateText}>No stop points on this route</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RideRoutesPage;