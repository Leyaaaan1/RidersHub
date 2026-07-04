import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Linking, Alert} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {resolveInviteLink, describeInviteError} from './inviteLinkHandler';

export const useDeepLinking = () => {
  const navigation = useNavigation();
  const {username} = useAuth();

  useEffect(() => {
    const handleDeepLink = async ({url}) => {
      if (!url) return;

      if (url.includes('verify-email')) {
        const token = new URL(url).searchParams.get('token');
        if (token) {
          navigation.navigate('VerifyEmailLink', {token});
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

    const subscription = Linking.addEventListener('url', handleDeepLink);

    const checkInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url != null) {
        handleDeepLink({url});
      }
    };

    checkInitialURL();

    return () => {
      subscription.remove();
    };
  }, [navigation, username]);
};
