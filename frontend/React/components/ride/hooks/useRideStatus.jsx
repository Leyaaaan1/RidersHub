import {useEffect, useRef, useState} from 'react';
import {getRideStatus} from '../../../services/startService';

/** * Ride status codes — values must match the backend RideStatus enum strings exactly. */
export const RIDE_STATUS = {
  NOT_STARTED: 'INACTIVE',
  ACTIVE: 'STARTED',
  FINISHED: 'FINISHED',
  STOPPED: 'STOPPED',
  PERSONAL_FINISHED: 'RIDER_FINISHED',
};

const useRideStatus = ({
  generatedRidesId,
  username,
  resolvedCurrentUsername,
  participants,
  isRideStarted = false,
}) => {
  const ownerUsername =
    typeof username === 'object' && username !== null
      ? username?.username
      : username;

  const deriveLocalFlags = () => {
    const isOwner = ownerUsername === resolvedCurrentUsername;
    const hasJoined =
      !isOwner &&
      Array.isArray(participants) &&
      participants.some(p =>
        typeof p === 'string'
          ? p === resolvedCurrentUsername
          : p.username === resolvedCurrentUsername,
      );
    return {isOwner, hasJoined};
  };
  const [actionStatus, setActionStatus] = useState(() => {
    const {isOwner, hasJoined} = deriveLocalFlags();
    return {
      isOwner,
      hasJoined,
      hasPendingRequest: false,
      rideStatus: isRideStarted ? RIDE_STATUS.ACTIVE : RIDE_STATUS.NOT_STARTED,
      rideStarted: isRideStarted ?? false,
    };
  });

  const [loading, setLoading] = useState(false);
  const fetchCount = useRef(0);

  const fetchStatus = async () => {
    if (!generatedRidesId) return;
    setLoading(true);
    try {
      const data = await getRideStatus(generatedRidesId);

      const backendStatus = data?.currentStatus;
      const {isOwner, hasJoined} = deriveLocalFlags();


      const currentUserRiderStatus = data?.riderStatuses?.find(
        rs => rs.riderUsername === resolvedCurrentUsername,
      );
      const participantFinished =
        currentUserRiderStatus?.status === RIDE_STATUS.PERSONAL_FINISHED;

      let effectiveStatus = backendStatus || RIDE_STATUS.NOT_STARTED;
      if (
        backendStatus === RIDE_STATUS.ACTIVE &&
        hasJoined &&
        participantFinished
      ) {
        effectiveStatus = RIDE_STATUS.PERSONAL_FINISHED;
      }

      const nextState = {
        isOwner,
        hasJoined,
        hasPendingRequest: false,
        rideStatus: effectiveStatus,
        rideStarted:
          effectiveStatus === RIDE_STATUS.ACTIVE ||
          effectiveStatus === RIDE_STATUS.PERSONAL_FINISHED,
      };
      setActionStatus(nextState);
    } catch (_err) {
      const {isOwner, hasJoined} = deriveLocalFlags();
      setActionStatus({
        isOwner,
        hasJoined,
        hasPendingRequest: false,
        rideStatus: isRideStarted
          ? RIDE_STATUS.ACTIVE
          : RIDE_STATUS.NOT_STARTED,
        rideStarted: isRideStarted ?? false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount.current += 1;
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedRidesId, ownerUsername, resolvedCurrentUsername]);

  const participantKey = Array.isArray(participants)
    ? participants.map(p => (typeof p === 'string' ? p : p.username)).join(',')
    : '';

  useEffect(() => {
    setActionStatus(prev => {
      const {isOwner, hasJoined} = deriveLocalFlags();
      return {...prev, isOwner, hasJoined};
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantKey]);

  return {actionStatus, loading, refresh: fetchStatus};
};export default useRideStatus;
