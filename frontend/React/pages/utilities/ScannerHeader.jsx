import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getRideDetails} from '../../services/rideService';
import {buildRideStep4Params} from '../../utilities/NavigationParamsBuilder';
import {
  resolveInviteLink,
  describeInviteError,
} from '../../utilities/inviteLinkHandler';
import scanner from '../../styles/components/scanner';
import {useAuth} from '../../context/AuthContext';
import RNQRGenerator from 'rn-qr-generator';


const ScannerHeader = forwardRef(({navigation, cardMode}, ref) => {
  const {username} = useAuth();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [scanMode, setScanMode] = useState('invite'); // 'invite' or 'ride'
  const [uploading, setUploading] = useState(false);

  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  const handleBarCodeScanned = useCallback(
    async data => {
      if (!scanning || processing || !data) return;

      setScanning(false);
      setProcessing(true);

      try {
        // ─────────────────────────────────────────────────────────────────
        // MODE 1: INVITE LINK (View ride details from invite QR code)
        // ─────────────────────────────────────────────────────────────────
        if (scanMode === 'invite') {
          // Same resolution path used by the native-camera deep link
          // handler (see DeepLinkProvider.js) — one place defines what
          // "an invite QR code" means.
          const params = await resolveInviteLink(data, username);

          setScannerVisible(false);
          navigation.navigate('RideStep4', params);
        }
        // ─────────────────────────────────────────────────────────────────
        // MODE 2: RIDE ID (View ride details by scanning ride ID QR code)
        // ─────────────────────────────────────────────────────────────────
        else if (scanMode === 'ride') {
          const rideId = data.trim();

          if (!rideId || isNaN(rideId)) {
            Alert.alert(
              'Invalid QR Code',
              'This QR code does not contain a valid ride ID.',
            );
            setScannerVisible(false);
            setProcessing(false);
            return;
          }

          const ride = await getRideDetails(parseInt(rideId));
          const params = buildRideStep4Params(ride, username);

          setScannerVisible(false);
          navigation.navigate('RideStep4', params);
        }
      } catch (error) {
        setScannerVisible(false);
        Alert.alert('Error', describeInviteError(error));
      } finally {
        setProcessing(false);
        setScanning(true);
      }
    },
    [scanning, processing, scanMode, username, navigation],
  );

  // Use the built-in code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && scanning && !processing) {
        handleBarCodeScanned(codes[0].value);
      }
    },
  });

  const uploadQRCode = useCallback(async () => {
    if (uploading || processing) return;
    setUploading(true);
    setProcessing(true);

    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      });

      if (response.didCancel) {
        setUploading(false);
        setProcessing(false);
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        setUploading(false);
        setProcessing(false);
        return;
      }

      const imageUri = response.assets?.[0]?.uri;
      if (!imageUri) {
        Alert.alert('Error', 'No image selected');
        setUploading(false);
        setProcessing(false);
        return;
      }

      try {
        // ─────────────────────────────────────────────────────────────────
        // Decode QR natively (ZXing under the hood on Android). This
        // decodes the JPEG/PNG itself — unlike jsQR, which needs raw RGBA
        // pixel data and can't read a compressed image file directly.
        // ─────────────────────────────────────────────────────────────────
        const {values} = await RNQRGenerator.detect({uri: imageUri});

        if (!values || values.length === 0) {
          Alert.alert(
            'No QR Code Found',
            'Could not find a QR code in this image. Make sure the QR code is clear and fully visible.',
          );
          setProcessing(false);
          setUploading(false);
          return;
        }

        const qrValue = values[0];

        // ─────────────────────────────────────────────────────────────────
        // Process the QR value (same logic as camera scanner)
        // ─────────────────────────────────────────────────────────────────
        if (scanMode === 'invite') {
          const params = await resolveInviteLink(qrValue, username);
          setScannerVisible(false);
          navigation.navigate('RideStep4', params);
        } else if (scanMode === 'ride') {
          const rideId = qrValue.trim();

          if (!rideId || isNaN(rideId)) {
            Alert.alert(
              'Invalid QR Code',
              'This QR code does not contain a valid ride ID.',
            );
            setProcessing(false);
            setUploading(false);
            return;
          }

          const ride = await getRideDetails(parseInt(rideId));
          const params = buildRideStep4Params(ride, username);
          setScannerVisible(false);
          navigation.navigate('RideStep4', params);
        }
      } catch (scanError) {
        console.error('QR Scan Error:', scanError);
        Alert.alert(
          'Scan Error',
          'Could not decode QR code: ' + (scanError.message || 'Unknown error'),
        );
      } finally {
        setProcessing(false);
        setUploading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to upload image');
      setUploading(false);
      setProcessing(false);
    }
  }, [uploading, processing, scanMode, username, navigation]);

  const openScanner = async (mode = 'invite') => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your device settings to scan QR codes.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
          ],
        );
        return;
      }
    }
    setScanMode(mode);
    setScannerVisible(true);
    setScanning(true);
  };
  useImperativeHandle(ref, () => ({openScanner}));

  if (!device) {
    return null;
  }

  return (
    <>
      {!cardMode && (
        <TouchableOpacity
          style={scanner.scanButton}
          onPress={() => openScanner('invite')}
          activeOpacity={0.7}>
          <FontAwesome name="qrcode" size={16} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => {
          setScannerVisible(false);
          setScanning(true);
        }}>
        <View style={scanner.scannerContainer}>
          <View style={scanner.scannerHeader}>
            <TouchableOpacity
              style={scanner.closeButton}
              onPress={() => {
                setScannerVisible(false);
                setScanning(true);
              }}>
              <FontAwesome name="times" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={scanner.scannerTitle}>
              {scanMode === 'invite' ? 'Scan Ride Invite' : 'Scan Ride ID'}
            </Text>
            <View style={{width: 40}} />
          </View>

          <View style={scanner.cameraContainer}>
            {scannerVisible && hasPermission && device && (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={scannerVisible}
                codeScanner={codeScanner}
              />
            )}

            <View style={scanner.scanFrame}>
              <View style={scanner.scanCorner} />
              <View style={[scanner.scanCorner, scanner.scanCornerTopRight]} />
              <View
                style={[scanner.scanCorner, scanner.scanCornerBottomLeft]}
              />
              <View
                style={[scanner.scanCorner, scanner.scanCornerBottomRight]}
              />
            </View>

            {processing && (
              <View style={scanner.processingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={scanner.processingText}>Processing...</Text>
              </View>
            )}
          </View>

          <View style={scanner.instructions}>
            <FontAwesome name="qrcode" size={40} color="#8c2323" />
            <Text style={scanner.instructionsTitle}>
              {scanMode === 'invite'
                ? 'Align invite QR code within frame'
                : 'Align ride QR code within frame'}
            </Text>
            <Text style={scanner.instructionsText}>
              {scanMode === 'invite'
                ? 'Point your camera at the ride invite QR code'
                : 'Point your camera at the ride ID QR code'}
            </Text>
          </View>

          <View style={scanner.uploadButtonContainer}>
            <TouchableOpacity
              style={[
                scanner.uploadButton,
                uploading && scanner.uploadButtonDisabled,
              ]}
              onPress={uploadQRCode}
              disabled={uploading}
              activeOpacity={0.7}>
              <FontAwesome
                name="upload"
                size={16}
                color={uploading ? '#666666' : '#ffffff'}
              />
              <Text style={scanner.uploadButtonText}>
                {uploading ? 'Loading...' : 'Upload QR Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
});

export default ScannerHeader;
