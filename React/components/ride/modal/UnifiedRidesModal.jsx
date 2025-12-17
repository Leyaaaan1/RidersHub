import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fetchMyRides, fetchRides} from '../../../services/rideService';
import utilities from '../../../styles/utilities';
import colors  from '../../../styles/colors';

const UnifiedRidesModal = ({
                             visible,
                             onClose,
                             token,
                             onRideSelect,
                             mode = 'all', // 'all' or 'my'
                             pageSize = 10,
                           }) => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isMyRidesMode = mode === 'my';
  const title = isMyRidesMode ? 'My Rides' : 'All Rides';

  useEffect(() => {
    if (visible) {
      loadRides(0, true);
    }
  }, [visible, token, mode]);

  const loadRides = async (pageNum = page, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(0);
      } else if (!refresh && !hasMore) {
        return;
      } else {
        setLoading(true);
      }

      setError('');

      // Use the same pagination logic for both modes
      const result = isMyRidesMode
        ? await fetchMyRides(token, pageNum, pageSize)
        : await fetchRides(token, pageNum, pageSize);

      if (result && result.content) {
        if (refresh) {
          setRides(result.content);
        } else {
          setRides(prev => [...prev, ...result.content]);
        }

        setHasMore(!result.last);
        setPage(result.number);
      }
    } catch (err) {
      console.error('Error loading rides:', err);
      setError(err.message || 'Failed to load rides');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadRides(0, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadRides(page + 1);
    }
  };

  const getRideTypeIcon = (riderType) => {
    switch (riderType) {
      case 'car':
        return 'car';
      case 'motor':
      case 'Motorcycle':
        return 'motorcycle';
      case 'bike':
      case 'Bicycle':
        return 'bicycle';
      case 'cafe Racers':
        return 'rocket';
      default:
        return 'user';
    }
  };

  const renderRideItem = ({ item }) => (
    <TouchableWithoutFeedback onPress={() => {
      onClose();
      onRideSelect && onRideSelect(item);
    }}>
      <View style={{
        backgroundColor: '#151515',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
      }}>
        {/* Header with Location Name */}
        <Text style={[utilities.titleText, { fontSize: 22, textAlign: 'center', marginBottom: 5 }]}>
          {item.locationName.toUpperCase()}
        </Text>

        {/* Ride ID */}
        <Text style={[utilities.smallText, { marginTop: -5, textAlign: 'center', color: '#888' }]}>
          ID: #{item.generatedRidesId}
        </Text>

        {/* Ride Name with Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={[utilities.titleText, { fontSize: 18, flexShrink: 1 }]}>
            {item.ridesName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome
              name={getRideTypeIcon(item.riderType)}
              size={16}
              color={colors.primary}
              style={{ marginRight: 5 }}
            />
            <Text style={[utilities.smallText, { color: colors.primary, fontWeight: 'bold' }]}>
              {item.distance} km
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
          <FontAwesome name="map-marker" size={14} color={colors.primary} />
          <Text style={[utilities.smallText, { fontWeight: 'bold', marginLeft: 5, flexShrink: 1 }]}>
            {item.startingPointName}
          </Text>
          <FontAwesome name="arrow-right" size={12} color="#fff" style={{ marginHorizontal: 8 }} />
          <Text style={[utilities.smallText, { fontWeight: 'bold', flexShrink: 1 }]}>
            {item.endingPointName}
          </Text>
        </View>

        {/* Date */}
        {item.date && (
          <Text style={[utilities.smallText, { marginTop: 8, color: '#aaa' }]}>
            <FontAwesome name="calendar" size={12} color="#aaa" /> {' '}
            {new Date(item.date).toLocaleString('en-US', {
              month: 'long',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        )}

        {/* Creator (only show in "All Rides" mode) */}
        {!isMyRidesMode && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <FontAwesome name="user-circle" size={14} color="#666" />
            <Text style={[utilities.smallText, { marginLeft: 5, color: '#666' }]}>
              Created by {item.username}
            </Text>
          </View>
        )}

        {/* Map Image */}
        {item.mapImageUrl && (
          <Image
            source={{ uri: item.mapImageUrl }}
            style={{
              width: '100%',
              height: 120,
              borderRadius: 6,
              marginTop: 12,
              borderWidth: 1,
              borderColor: colors.primary
            }}
            resizeMode="cover"
          />
        )}

        {/* Description */}
        {item.description && (
          <Text style={[utilities.smallText, { marginTop: 12, color: '#ccc', fontStyle: 'italic' }]}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const renderEmpty = () => (
    <View style={{ padding: 40, alignItems: 'center' }}>
      <FontAwesome name="road" size={48} color="#666" style={{ marginBottom: 15 }} />
      <Text style={{ color: '#ddd', fontSize: 16 }}>
        {isMyRidesMode ? "You haven't created any rides yet" : "No rides available"}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;

    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#333'
        }}>
          <TouchableOpacity onPress={onClose} style={{ marginRight: 15 }}>
            <FontAwesome name="arrow-left" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={[utilities.titleText, { fontSize: 20, flex: 1 }]}>
            {title}
          </Text>
          <Text style={[utilities.smallText, { color: '#666' }]}>
            {rides.length} ride{rides.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Content */}
        {error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <FontAwesome name="exclamation-triangle" size={32} color="red" style={{ marginBottom: 15 }} />
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 15 }}>{error}</Text>
            <TouchableOpacity
              style={[utilities.button, { marginTop: 15 }]}
              onPress={handleRefresh}
            >
              <Text style={utilities.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={rides}
            renderItem={renderRideItem}
            keyExtractor={(item) => item.generatedRidesId.toString()}
            ListEmptyComponent={loading && !refreshing ? null : renderEmpty}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ padding: 15 }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default UnifiedRidesModal;