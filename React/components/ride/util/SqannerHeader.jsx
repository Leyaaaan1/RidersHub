import React, { useState, useCallback } from 'react';
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
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { joinService } from '../../../services/joinService';
import { scannerStyle } from '../../../styles/ScannerStyle';

const ScannerHeader = ({ token, username }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const handleBarCodeScanned = useCallback(async (data) => {
    if (!scanning || processing || !data) return;

    setScanning(false);
    setProcessing(true);

    try {
      let inviteToken = data;

      if (data.includes('/invite/link/')) {
        inviteToken = data.split('/invite/link/')[1];
      } else if (data.includes('/invite/')) {
        inviteToken = data.split('/invite/')[1];
      }

      if (!inviteToken) {
        Alert.alert(
          'Invalid QR Code',
          'This QR code does not contain a valid invite link.',
        );
        setScannerVisible(false);
        setProcessing(false);
        return;
      }

      const result = await joinService.joinRideByToken(
        inviteToken,
        username,
        token,
      );

      setScannerVisible(false);

      Alert.alert(
        'Request Submitted',
        'Your join request has been submitted! Waiting for the ride creator to approve.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate to a status page
              // navigation.navigate('JoinRequestStatus', { joinRequest: result });
            },
          },
        ],
      );
    } catch (error) {
      setScannerVisible(false);

      let errorMessage = 'Failed to submit join request';

      if (error.message.includes('already have a join request')) {
        errorMessage = 'You already have a pending request for this ride';
      } else if (error.message.includes('already a participant')) {
        errorMessage = 'You are already a participant in this ride';
      } else if (error.message.includes('creator of this ride')) {
        errorMessage = 'You cannot join your own ride';
      } else if (error.message.includes('expired')) {
        errorMessage = 'This invite link has expired';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setProcessing(false);
      setScanning(true);
    }
  }, [scanning, processing, username, token]);

  // Use the built-in code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && scanning && !processing) {
        handleBarCodeScanned(codes[0].value);
      }
    },
  });

  const openScanner = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your device settings to scan QR codes.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }
    setScannerVisible(true);
    setScanning(true);
  };

  if (!device) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={scannerStyle.scanButton}
        onPress={openScanner}
        activeOpacity={0.7}
      >
        <FontAwesome name="qrcode" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={scannerVisible}
        animationType="slide"
        onRequestClose={() => {
          setScannerVisible(false);
          setScanning(true);
        }}
      >
        <View style={scannerStyle.scannerContainer}>
          <View style={scannerStyle.scannerHeader}>
            <TouchableOpacity
              style={scannerStyle.closeButton}
              onPress={() => {
                setScannerVisible(false);
                setScanning(true);
              }}
            >
              <FontAwesome name="times" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={scannerStyle.scannerTitle}>Scan Ride Invite</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={scannerStyle.cameraContainer}>
            {scannerVisible && hasPermission && device && (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={scannerVisible}
                codeScanner={codeScanner}
              />
            )}

            <View style={scannerStyle.scanFrame}>
              <View style={scannerStyle.scanCorner} />
              <View style={[scannerStyle.scanCorner, scannerStyle.scanCornerTopRight]} />
              <View style={[scannerStyle.scanCorner, scannerStyle.scanCornerBottomLeft]} />
              <View style={[scannerStyle.scanCorner, scannerStyle.scanCornerBottomRight]} />
            </View>

            {processing && (
              <View style={scannerStyle.processingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={scannerStyle.processingText}>Processing...</Text>
              </View>
            )}
          </View>

          <View style={scannerStyle.instructionsContainer}>
            <FontAwesome name="qrcode" size={40} color="#8c2323" />
            <Text style={scannerStyle.instructionsTitle}>
              Align QR code within frame
            </Text>
            <Text style={scannerStyle.instructionsText}>
              Point your camera at the ride invite QR code
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ScannerHeader;