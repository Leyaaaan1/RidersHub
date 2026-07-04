

import {getRideDetails} from '../services/rideService';
import {inviteService} from '../services/inviteService';
import {buildRideStep4Params} from './NavigationParamsBuilder';


export const extractInviteToken = value => {
  if (!value) return null;
  const clean = value.split(/[?#]/)[0];
  if (clean.includes('/invite/link/')) {
    return clean.split('/invite/link/')[1] || null;
  }
  if (clean.includes('/invite/')) {
    return clean.split('/invite/')[1] || null;
  }
  return clean;
};

// Translates a raw error into the same friendly copy ScannerHeader
// already shows via Alert.alert.
export const describeInviteError = error => {
  const msg = error?.message || '';
  if (msg.includes('not found')) return 'Invite or ride not found';
  if (msg.includes('expired')) return 'This invite link has expired';
  return msg || 'Failed to process invite link';
};

// Resolves a token into the exact params RideStep4 expects.
export const resolveInviteToken = async (inviteToken, currentUsername) => {
  if (!inviteToken) {
    throw new Error('This link does not contain a valid invite.');
  }
  const inviteDetails = await inviteService.getInviteDetailsByToken(
    inviteToken,
  );
  const ride = await getRideDetails(inviteDetails.generatedRidesId);
  return buildRideStep4Params(ride, currentUsername);
};

// One-call convenience wrapper for callers that just have a raw scanned
// value or URL and want RideStep4 params back.
export const resolveInviteLink = async (rawValue, currentUsername) => {
  const token = extractInviteToken(rawValue);
  return resolveInviteToken(token, currentUsername);
};
