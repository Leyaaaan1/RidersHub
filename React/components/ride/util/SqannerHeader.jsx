import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {joinService} from '../../../services/joinService';
import {scannerStyle} from '../../../styles/ScannerStyle';
import { PermissionsAndroid } from 'react-native';

const ScannerHeader = ({ token, username }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);


  useEffect(() => {
    (async () => {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      setHasPermission(permission === PermissionsAndroid.RESULTS.GRANTED);
    })();
  }, []);
  const handleBarCodeScanned = async ({data}) => {
    if (!scanning || processing) {return;}

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
        '✅ Request Submitted',
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
  };

  const openScanner = () => {
    if (hasPermission === null) {
      Alert.alert('Permission Required', 'Requesting camera permission...');
      return;
    }
    if (hasPermission === false) {
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
    setScannerVisible(true);
    setScanning(true);
  };

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
            <RNCamera
              style={scannerStyle.camera}
              type={RNCamera.Constants.Type.back}
              onBarCodeRead={scanning ? handleBarCodeScanned : undefined}
              barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            >
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
            </RNCamera>
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
