import React, { useState } from 'react';
import {View, Text, StatusBar, Animated, TouchableOpacity, ScrollView} from 'react-native';
import { modernUtilities as styles } from '../styles/modernUtilities';
import rideRoutesPageUtilities from '../styles/RideRoutesPageUtilities';
import RouteMapView from '../utilities/route/RouteMapView';
import startedRideStyles from '../styles/StartedRideStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {processRideCoordinates} from '../utilities/route/CoordinateUtils';

const StartedRide = ({ route, navigation }) => {
  const { activeRide, token } = route.params || {};
  const [showRouteInfo, setShowRouteInfo] = useState(false);


  if (!activeRide) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No ride data available</Text>
      </View>
    );
  }

  const mapData = processRideCoordinates(activeRide);

  const handleSwipeToDetails = () => {
    navigation.navigate('RideStep4', {
      generatedRidesId: activeRide.generatedRidesId || activeRide.id,
      rideName: activeRide.rideName,
      locationName: activeRide.locationName,
      riderType: activeRide.riderType,
      date: activeRide.date,
      startingPoint: activeRide.startingPoint,
      endingPoint: activeRide.endingPoint,
      participants: activeRide.participants,
      description: activeRide.description,
      token: token,
      distance: activeRide.distance,
      username: activeRide.username,
      stopPoints: activeRide.stopPoints,
      currentUsername: activeRide.username,
      rideDetailsWithCoords: null,
    });
  };

  return (
    <View style={[startedRideStyles.contentContainer, { flex: 1 }]}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <Animated.View style={[rideRoutesPageUtilities.mapSection, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }} />

        <RouteMapView
          generatedRidesId={activeRide.generatedRidesId || activeRide.id}
          startingPoint={mapData.startingPoint}
          endingPoint={mapData.endingPoint}
          stopPoints={mapData.stopPoints}
          token={token}
          style={{ flex: 1 }}
          isDark={true}
        />

        {/* Route Info Overlay - Fixed Size with ScrollView */}
        <View style={startedRideStyles.routeInfoOverlay}>
          {/* Header - Always Visible */}
          <TouchableOpacity
            onPress={() => setShowRouteInfo(!showRouteInfo)}
            style={[
              startedRideStyles.routeInfoHeader,
              showRouteInfo && startedRideStyles.routeInfoHeaderExpanded,
            ]}
          >
            <View style={startedRideStyles.routeInfoHeaderContent}>
              <FontAwesome name="map-marker" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={startedRideStyles.routeInfoTitle}>
                Route Information
              </Text>
            </View>
            <FontAwesome
              name={showRouteInfo ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Collapsible Content with Fixed Height and Scrolling */}
          {showRouteInfo && (
            <ScrollView
              style={startedRideStyles.routeInfoScrollContainer}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={startedRideStyles.routeInfoScrollContent}
            >
              {/* Starting Point */}
              <View style={startedRideStyles.routePointContainer}>
                <View style={startedRideStyles.routeRow}>
                  <View style={[startedRideStyles.routeMarker, startedRideStyles.startMarker]}>
                    <Text style={startedRideStyles.routeMarkerEmoji}>🚀</Text>
                  </View>
                  <Text style={startedRideStyles.routeLabel}>
                    STARTING POINT
                  </Text>
                </View>
                <Text style={startedRideStyles.routeLocationText}>
                  {mapData.startingPoint?.name ||
                    activeRide.startingPointName ||
                    'Starting Location'}
                </Text>
              </View>

              {/* Stop Points */}
              {mapData.stopPoints && mapData.stopPoints.length > 0 && (
                <View style={startedRideStyles.routePointContainer}>
                  {mapData.stopPoints.map((stop, index) => (
                    <View key={index} style={startedRideStyles.stopPointWrapper}>
                      <View style={startedRideStyles.routeRow}>
                        <View style={[startedRideStyles.routeMarker, startedRideStyles.stopMarker]}>
                          <Text style={startedRideStyles.routeMarkerNumber}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={startedRideStyles.routeLabel}>
                          STOP POINT {index + 1}
                        </Text>
                      </View>
                      <Text style={startedRideStyles.routeLocationText}>
                        {stop.name || `Stop ${index + 1}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Ending Point */}
              <View style={startedRideStyles.routePointContainer}>
                <View style={startedRideStyles.routeRow}>
                  <View style={[startedRideStyles.routeMarker, startedRideStyles.endMarker]}>
                    <Text style={startedRideStyles.routeMarkerEmoji}>🏁</Text>
                  </View>
                  <Text style={startedRideStyles.routeLabel}>
                    ENDING POINT
                  </Text>
                </View>
                <Text style={startedRideStyles.routeLocationText}>
                  {mapData.endingPoint?.name ||
                    activeRide.endingPointName ||
                    'Ending Location'}
                </Text>
              </View>

              {/* Participants Section */}
              <View style={startedRideStyles.participantsContainer}>
                <View style={startedRideStyles.participantsHeader}>
                  <FontAwesome name="users" size={16} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={startedRideStyles.participantsTitle}>
                    PARTICIPANTS ({activeRide.participants.length})
                  </Text>
                </View>

                {activeRide.participants.length > 0 ? (
                  activeRide.participants.map((participant, index) => (
                    <View key={index} style={startedRideStyles.participantItem}>
                      <View style={startedRideStyles.participantAvatar}>
                        <Text style={startedRideStyles.participantInitial}>
                          {(participant.username || participant.name || 'U')[0].toUpperCase()}
                        </Text>
                      </View>
                      <View style={startedRideStyles.participantInfo}>
                        <Text style={startedRideStyles.participantName}>
                          {participant.username || participant.name || 'Unknown User'}
                        </Text>
                        {participant.status && (
                          <Text style={startedRideStyles.participantStatus}>
                            {participant.status}
                          </Text>
                        )}
                      </View>
                      <View style={[
                        startedRideStyles.participantStatusDot,
                        participant.isActive && startedRideStyles.participantStatusActive
                      ]} />
                    </View>
                  ))
                ) : (
                  <View style={startedRideStyles.emptyParticipants}>
                    <FontAwesome name="user-plus" size={24} color="#666" />
                    <Text style={startedRideStyles.emptyParticipantsText}>
                      No participants yet
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Action Buttons at Bottom */}
        <TouchableOpacity
          style={[startedRideStyles.actionButton, { backgroundColor: 'rgba(140, 35, 35, 0.9)' }]}
          onPress={handleSwipeToDetails}
        >
          <FontAwesome name="info-circle" size={23} color="#fff" />
          <Text style={startedRideStyles.actionButtonText}>Details</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default StartedRide;