import React, { useState } from 'react';
import {View, Text, StatusBar, Animated, TouchableOpacity} from 'react-native';
import { modernUtilities as styles } from '../styles/modernUtilities';
import rideRoutesPageUtilities from '../styles/RideRoutesPageUtilities';
import RouteMapView from '../utilities/route/RouteMapView';
import startedRideStyles from '../styles/StartedRideStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const StartedRide = ({ route }) => {
  const { activeRide, token, username } = route.params || {};
  const [showRouteInfo, setShowRouteInfo] = useState(false);

  if (!activeRide) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No ride data available</Text>
      </View>
    );
  }

  console.log('active', activeRide);

  return (
    <View style={startedRideStyles.contentContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#151515" />

      <Animated.View style={[rideRoutesPageUtilities.mapSection, { width: '100%', height: 770 }]}>
        <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }} />

        <RouteMapView
          {...activeRide}
          token={token}
          style={{ flex: 1 }}
          isDark={true}
          focusOnUserLocation={true}
        />

        {/* Route Info Overlay - Collapsible */}
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

          {/* Collapsible Content */}
          {showRouteInfo && (
            <View style={startedRideStyles.routeInfoContent}>
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
                  {activeRide.startingPoint?.name ||
                    activeRide.startingPoint?.address ||
                    activeRide.startingPointName ||
                    'Starting Location'}
                </Text>
              </View>

              {/* Stop Points */}
              {activeRide.stopPoints && activeRide.stopPoints.length > 0 && (
                <View style={startedRideStyles.routePointContainer}>
                  {activeRide.stopPoints.map((stop, index) => (
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
                        {stop.name || stop.address || `Stop ${index + 1}`}
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
                  {activeRide.endingPoint?.name ||
                    activeRide.endingPoint?.address ||
                    activeRide.endingPointName ||
                    'Ending Location'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons at Bottom */}
        <View style={startedRideStyles.actionButtonsContainer}>
          <TouchableOpacity style={startedRideStyles.actionButton}>
            <FontAwesome name="stop-circle" size={23} color="#fff" />
            <Text style={startedRideStyles.actionButtonText}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={startedRideStyles.actionButton}>
            <FontAwesome name="users" size={23} color="#fff" />
            <Text style={startedRideStyles.actionButtonText}>Riders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={startedRideStyles.actionButton}>
            <FontAwesome name="info-circle" size={23} color="#fff" />
            <Text style={startedRideStyles.actionButtonText}>Info</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Text style={styles.activeRideLocation}>{activeRide.ridesName}</Text>
      <Text style={styles.activeRideName}>{activeRide.locationName}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
        <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.riderType}</Text>
        <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.distance} km</Text>
        <Text style={{ color: '#95a5a6', fontSize: 12 }}>{activeRide.date}</Text>
      </View>

      <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
        <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Starting Point</Text>
        <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.startingPointName || activeRide.startingPoint || '—'}</Text>
      </View>

      <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
        <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Ending Point</Text>
        <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.endingPointName || activeRide.endingPoint || '—'}</Text>
      </View>

      <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
        <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Participants</Text>
        <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.participants ?? '—'}</Text>
      </View>

      <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.03)', marginBottom: 6 }}>
        <Text style={{ color: '#7f8c8d', fontSize: 12, marginBottom: 4 }}>Description</Text>
        <Text style={{ color: '#ffffff', fontSize: 14 }}>{activeRide.description || '—'}</Text>
      </View>

      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <Text style={{ color: '#95a5a6', fontSize: 12 }}>Ride created by: {activeRide.username || username || '—'}</Text>
      </View>
    </View>
  );
};

export default StartedRide;
