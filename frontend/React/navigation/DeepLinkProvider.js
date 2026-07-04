// frontend/React/navigation/DeepLinkProvider.js
//
// Handles Universal Links (iOS) / App Links (Android) so a QR code
// scanned with the phone's native Camera app lands the user on
// RideStep4 — the same destination the in-app scanner already uses.
//
// This intentionally does NOT use React Navigation's declarative
// `linking` prop, because resolving an invite requires two async API
// calls (invite lookup -> ride details) before we know the destination
// params. The `linking` prop is built for static path -> screen maps;
// fighting it to do async resolution is more trouble than it's worth.
// Instead, this component listens to raw URLs directly.
//
// Mount once, anywhere under both <AuthProvider> and
// <NavigationContainer ref={navigationRef}>:
//
//   const navigationRef = createNavigationContainerRef();
//   <NavigationContainer ref={navigationRef}>...</NavigationContainer>
//   <DeepLinkProvider navigationRef={navigationRef} />

import {useEffect, useRef} from 'react';
import {Linking, Alert} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {
  resolveInviteLink,
  describeInviteError,
} from '../utilities/inviteLinkHandler';

const isInviteUrl = url =>
  !!url && (url.includes('/invite/link/') || url.includes('/invite/'));

const DeepLinkProvider = ({navigationRef}) => {
  const {username, ready} = useAuth();
  const processingRef = useRef(false);

  useEffect(() => {
    const handleUrl = async url => {
      if (!isInviteUrl(url) || processingRef.current) return;
      processingRef.current = true;

      try {
        const params = await resolveInviteLink(url, username);

        // On a cold start (app launched directly by tapping the link)
        // the navigator may not be mounted yet — wait briefly for it.
        const navigateWhenReady = () => {
          if (navigationRef.current?.isReady()) {
            navigationRef.current.navigate('RideStep4', params);
          } else {
            setTimeout(navigateWhenReady, 100);
          }
        };
        navigateWhenReady();
      } catch (error) {
        Alert.alert('Invite Error', describeInviteError(error));
      } finally {
        processingRef.current = false;
      }
    };

    // Cold start: app was launched by tapping the link.
    Linking.getInitialURL().then(url => {
      if (url) handleUrl(url);
    });

    // Warm start: app was already running (foreground or background).
    const subscription = Linking.addEventListener('url', ({url}) =>
      handleUrl(url),
    );
    return () => subscription.remove();

    // Not gating on `ready`/`username` here on purpose — see note below
    // about auth. Re-runs when username changes so a just-logged-in user
    // picks up the current identity for any link tapped after login.
  }, [username, ready, navigationRef]);

  return null;
};

export default DeepLinkProvider;
