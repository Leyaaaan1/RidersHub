import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking, Alert} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {resolveInviteLink, describeInviteError} from './inviteLinkHandler';

export const useDeepLinking = () => {
  const navigation = useNavigation();
  const {username, ready, token} = useAuth();
  const pendingUrlRef = useRef(null);

  const processUrl = async url => {
    if (!url) return;

    if (url.includes('verify-email')) {
      const parsedToken = new URL(url).searchParams.get('token');
      if (parsedToken) {
        navigation.navigate('VerifyEmailLink', {token: parsedToken});
      }
      return;
    }

    if (url.includes('/invite/')) {
      try {
        const params = await resolveInviteLink(url, username);
        navigation.navigate('RideStep4', params);
      } catch (err) {
        Alert.alert('Error', describeInviteError(err));
      }
      return;
    }
  };

  // Capture URLs immediately (cold start or app already running),
  // but don't act on them until auth has finished restoring.
  useEffect(() => {
    const handleDeepLink = ({url}) => {
      if (!ready || !token) {
        pendingUrlRef.current = url; // stash it, auth isn't ready yet
        return;
      }
      processUrl(url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({url});
    });

    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once auth becomes ready, flush any URL we stashed earlier.
  useEffect(() => {
    if (ready && token && pendingUrlRef.current) {
      const url = pendingUrlRef.current;
      pendingUrlRef.current = null;
      processUrl(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, token]);
};
