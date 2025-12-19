import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {getCurrentRiderType, getRideDetails} from '../services/rideService';
import SearchHeader from '../components/ride/util/SearchHeader';
import { modernUtilities } from '../styles/modernUtilities';
import {getActiveRide} from '../services/startService';
import ScannerHeader from '../components/ride/util/SqannerHeader';
import UnifiedRidesModal from '../components/ride/modal/UnifiedRidesModal';
import InlineRidesList from '../components/ride/modal/InlineRidesList';


const RiderPage = ({ route , navigation}) => {

  const { username, token } = route.params;
  const [riderType, setRiderType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myRidesModalVisible, setMyRidesModalVisible] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [activeRideLoading, setActiveRideLoading] = useState(false);


  useEffect(() => {
    fetchCurrentRiderType();
    fetchActiveRide();
  }, [token]);

  const fetchCurrentRiderType = async () => {
    try {
      setLoading(true);
      const result = await getCurrentRiderType(token);

      if (result.success) {
        setRiderType(result.data);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch rider type');
      }
    } catch (error) {
      console.error('Error fetching rider type:', error);
      Alert.alert('Error', 'Network error occurred while fetching rider type');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveRide = async () => {
    try {
      setActiveRideLoading(true);
      const result = await getActiveRide(token);
      setActiveRide(result);
    } catch (error) {
      console.error('Error fetching active ride:', error);
      setActiveRide(null);
    } finally {
      setActiveRideLoading(false);
    }
  };

  const handleRideSelect = async (ride) => {
    try {
      // Show loading indicator
      console.log('[RiderPage] Fetching full ride details for:', ride.generatedRidesId);

      // Fetch complete ride details including coordinates
      const fullRideDetails = await getRideDetails(ride.generatedRidesId, token);


      navigation.navigate('RideStep4', {
        generatedRidesId: ride.generatedRidesId,
        rideName: ride.ridesName,
        locationName: ride.locationName,
        riderType: ride.riderType,
        distance: ride.distance,
        date: ride.date,
        // Pass coordinate objects from full ride details
        startingPoint: fullRideDetails.startingPoint,
        endingPoint: fullRideDetails.endingPoint,
        stopPoints: fullRideDetails.stopPoints || [],
        participants: ride.participants,

        startingPointName: ride.startingPointName || fullRideDetails.startingPoint?.name,
        endingPointName: ride.endingPointName || fullRideDetails.endingPoint?.name,
        description: ride.description,
        token: token,
        username: ride.username,
        currentUsername: username,
        rideDetailsWithCoords: fullRideDetails,
        skipCoordsFetch: true,
      });
    } catch (error) {
      console.error('[RiderPage] Error fetching ride details:', error);
      Alert.alert('Error', 'Failed to load ride details. Please try again.');
    }
  };

  return (
    <View style={modernUtilities.container}>
      <StatusBar barStyle="light-content" backgroundColor="#151515" />

      {/* Modern Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={modernUtilities.avatar}>
            <FontAwesome name="user" size={20} color="#fff" />
          </View>
          <View styl  e={{ flex: 1 }}>
            <Text
              style={[modernUtilities.usernameText, { flexShrink: 1 }]}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.6}
            >
              {username?.toUpperCase()}
            </Text>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" style={{ marginTop: 4 }} />
            ) : (
              <View style={modernUtilities.riderTypeBadge}>
                <FontAwesome
                  name={
                    riderType?.riderType === 'car' ? 'car' :
                      riderType?.riderType === 'motor' || riderType?.riderType === 'Motorcycle' ? 'motorcycle' :
                        riderType?.riderType === 'bike' || riderType?.riderType === 'Bicycle' ? 'bicycle' :
                          riderType?.riderType === 'cafe Racers' ? 'rocket' : 'user'
                  }
                  size={12}
                  color="#fff"
                  style={{ marginRight: 5 }}
                />
                <Text style={modernUtilities.riderTypeText}>
                  {riderType?.riderType}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <SearchHeader token={token} username={username} navigation={navigation} />
          <ScannerHeader token={token} username={username} navigation={navigation} />
        </View>
      </View>
      {/* Active Ride Section */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!activeRide) {return;}
          navigation.navigate('StartedRide', { activeRide, token, username });
        }}
        style={{ marginHorizontal: 16, marginVertical: 8, backgroundColor: '#1e1e1e', borderRadius: 8, padding: 12 }}
      >
        <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>Active Ride</Text>
        {activeRideLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : activeRide ? (
          <View>
            <Text style={{ color: '#fff', fontSize: 14 }}>{activeRide.ridesName}</Text>
            <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
              <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.locationName}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.riderType}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{activeRide.distance} km</Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: '#666', fontSize: 14 }}>No active ride</Text>
        )}
      </TouchableOpacity>

      {/* All Rides List - Displayed Inline */}
      <View style={{ flex: 1 }}>
        <InlineRidesList
          token={token}
          onRideSelect={handleRideSelect}
          mode="all"
          pageSize={10}
        />
      </View>

      {/* Bottom "My Rides" Button */}
      <View style={modernUtilities.bottomContainer}>
        <TouchableOpacity
          style={modernUtilities.myRidesButton}
          onPress={() => setMyRidesModalVisible(true)}
        >
          <Text style={modernUtilities.myRidesButtonText}>My Rides</Text>
        </TouchableOpacity>
      </View>

      {/* My Rides Modal */}
      <UnifiedRidesModal
        visible={myRidesModalVisible}
        onClose={() => setMyRidesModalVisible(false)}
        token={token}
        onRideSelect={handleRideSelect}
        mode="my"
        pageSize={10}
      />
    </View>
  );
};

export default RiderPage;