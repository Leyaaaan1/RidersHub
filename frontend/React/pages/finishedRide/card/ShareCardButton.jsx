import React, {useCallback, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useRideShareCard} from './useRideShareCard';
import colors from '../../../styles/tokens/colors';
import {buttonStyles as ss} from '../../../styles/screens/shareCard';

const ShareCardButton = ({
  shareData,
  format = 'story',
  initialPhotoUri = null,
  onBeforeShare = null, // NEW
}) => {
  const {
    CardNode,
    triggerShare,
    triggerSave,
    sharing,
    saving,
    pickPhoto,
    clearPhoto,
    photoUri,
    picking,
  } = useRideShareCard({data: shareData, format, initialPhotoUri});

  const [preparing, setPreparing] = useState(false);

  const isLocked = sharing || saving;

  const withPreparedData = useCallback(
    async action => {
      if (onBeforeShare) {
        setPreparing(true);
        try {
          const rank = await onBeforeShare();
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        } finally {
          setPreparing(false);
        }
      }
      action();
    },
    [onBeforeShare],
  );
  return (
    <>
      {/* Offscreen card — must be mounted for capture to work */}
      {CardNode}

      {/* ── Background photo picker ── */}
      <View style={ss.photoRow}>
        <TouchableOpacity
          style={[ss.photoBtn, photoUri && ss.photoBtnActive]}
          onPress={pickPhoto}
          activeOpacity={0.75}
          disabled={isLocked || picking}>
          {picking ? (
            <ActivityIndicator
              size="small"
              color={photoUri ? colors.white : colors.primary}
            />
          ) : (
            <FontAwesome
              name="image"
              size={14}
              color={photoUri ? colors.white : colors.primary}
            />
          )}
          <Text style={[ss.photoBtnText, photoUri && ss.photoBtnTextActive]}>
            {picking
              ? 'Opening…'
              : photoUri
              ? 'Change photo'
              : 'Add background photo'}
          </Text>
        </TouchableOpacity>

        {/* ✕ chip — only shown when a photo is selected */}
        {photoUri ? (
          <TouchableOpacity
            style={ss.clearChip}
            onPress={clearPhoto}
            activeOpacity={0.75}
            disabled={isLocked}>
            <FontAwesome
              name="times"
              size={13}
              color="rgba(255,255,255,0.55)"
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Share / Save row ── */}
      <View style={ss.row}>
        <TouchableOpacity
          style={[ss.btn, ss.btnPrimary, isLocked && ss.btnDisabled]}
          onPress={() => withPreparedData(triggerShare)}
          activeOpacity={0.75}
          disabled={isLocked}>
          {sharing || preparing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <FontAwesome name="share-alt" size={15} color={colors.white} />
          )}
          <Text style={ss.btnTextPrimary}>
            {preparing
              ? 'Loading…'
              : sharing
              ? 'Preparing…'
              : 'Share Ride Summary'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ss.btn, ss.btnSecondary, isLocked && ss.btnDisabled]}
          onPress={() => withPreparedData(triggerSave)}
          activeOpacity={0.75}
          disabled={isLocked}>
          {saving || preparing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <FontAwesome name="download" size={14} color={colors.primary} />
          )}
          <Text style={ss.btnTextSecondary}>
            {preparing ? 'Loading…' : saving ? 'Saving…' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={ss.hint}>
        {format === 'story' ? '9:16 Story format' : '1:1 Feed format'}
      </Text>
    </>
  );
};

export default ShareCardButton;