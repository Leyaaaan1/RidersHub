// File: frontend/React/pages/FinishedRide/FinishedRideParticipants.jsx

import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import colors from '../../styles/tokens/colors';
import finishedRideStyles from '../../styles/screens/finishedRideStyles';


const rankParticipants = list => {
  return [...list]
    .sort((a, b) => {
      const aComplete = a.status ? a.status === 'COMPLETED' : false;
      const bComplete = b.status ? b.status === 'COMPLETED' : false;

      if (aComplete !== bComplete) return aComplete ? -1 : 1;

      if (aComplete && bComplete) {
        if (!a.arrivalTime) return 1;
        if (!b.arrivalTime) return -1;
        return new Date(a.arrivalTime) - new Date(b.arrivalTime);
      }

      return (b.checkpointsReached ?? 0) - (a.checkpointsReached ?? 0);
    })
    .map((p, idx) => ({...p, rank: idx + 1}));
};


const formatArrivalTime = iso => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return null;
  }
};

// Completed riders first (earliest arrival wins), then in-progress riders
// ranked by checkpoints reached. Missing arrivalTime sorts last within
// its group.

const FinishedRideParticipants = ({participants, participantCount}) => {
  const rankedParticipants = rankParticipants(participants || []);
  const hasParticipants = rankedParticipants.length > 0;

  return (
    <View style={finishedRideStyles.section}>
      {/* Section header */}
      <View style={finishedRideStyles.sectionHeader}>
        <Text style={finishedRideStyles.sectionTitle}>Participants</Text>
        {participantCount > 0 && (
          <View style={finishedRideStyles.sectionBadge}>
            <Text style={finishedRideStyles.sectionBadgeText}>
              {participantCount}
            </Text>
          </View>
        )}
      </View>

      {hasParticipants ? (
        <View style={finishedRideStyles.participantsList}>
          {rankedParticipants.map((participant, idx) => {
            const pct =
              participant.totalCheckpoints > 0
                ? Math.round(
                    (participant.checkpointsReached /
                      participant.totalCheckpoints) *
                      100,
                  )
                : 0;
            // Prefer backend `status` when present (finished-ride path),
            // fall back to percentage-based completion (live-arrivals path,
            // where status hasn't been computed yet).
            const isComplete = participant.status
              ? participant.status === 'COMPLETED'
              : pct === 100;
            const isLast = idx === participants.length - 1;
            const arrivalLabel = formatArrivalTime(participant.arrivalTime);

            return (
              <View
                key={participant.username ?? `participant-${idx}`}
                style={[
                  finishedRideStyles.participantItem,
                  isLast && finishedRideStyles.participantItemLast,
                ]}>
                {/* Avatar */}
                <View
                  style={[
                    finishedRideStyles.participantAvatar,
                    participant.rank <= 3 &&
                      finishedRideStyles.participantAvatarTop3,
                  ]}>
                  {participant.rank <= 3 ? (
                    <View style={finishedRideStyles.rankTop3Row}>
                      <FontAwesome
                        name="trophy"
                        size={13}
                        color={
                          participant.rank === 1
                            ? '#FFD700'
                            : participant.rank === 2
                            ? '#C0C0C0'
                            : '#CD7F32'
                        }
                      />
                      <Text style={finishedRideStyles.participantInitial}>
                        {participant.rank}
                      </Text>
                    </View>
                  ) : (
                    <Text style={finishedRideStyles.participantInitial}>
                      {participant.rank}
                    </Text>
                  )}
                </View>
                {/* Info */}
                <View style={finishedRideStyles.participantInfo}>
                  <Text style={finishedRideStyles.participantName}>
                    {participant.username}
                  </Text>
                  <Text style={finishedRideStyles.participantCheckpoints}>
                    {participant.checkpointsReached} /{' '}
                    {participant.totalCheckpoints} checkpoints
                    {arrivalLabel ? `  ·  ${arrivalLabel}` : ''}
                  </Text>
                </View>
                {/* Completion badge */}
                <View
                  style={[
                    finishedRideStyles.completionBadge,
                    isComplete && finishedRideStyles.completionBadgeFull,
                  ]}>
                  {isComplete ? (
                    <FontAwesome name="check" size={12} color="#4CAF50" />
                  ) : null}
                  <Text
                    style={[
                      finishedRideStyles.completionPercent,
                      isComplete && finishedRideStyles.completionPercentFull,
                    ]}>
                    {pct}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={finishedRideStyles.emptyContainer}>
          <View style={finishedRideStyles.emptyIconWrap}>
            <FontAwesome name="users" size={22} color={colors.textSecondary} />
          </View>
          <Text style={finishedRideStyles.emptyText}>No participants</Text>
        </View>
      )}
    </View>
  );
};

export default FinishedRideParticipants;
