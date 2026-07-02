// React/components/common/LoadingScreen.jsx

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import colors from '../styles/tokens/colors';
import {fontSize, fontWeight} from '../styles/tokens/typography';
import spacing from '../styles/tokens/spacing';

// ─────────────────────────────────────────────
// Drop your real logo in here, e.g.:
//   const LOGO_SOURCE = require('../../assets/images/logo.png');
// Leave as `null` to use the built-in circular placeholder mark.
// Works best as a square image — it gets clipped into a circle.
// ─────────────────────────────────────────────
const LOGO_SOURCE = require('../styles/asset/icon-original.png');


const {width: SCREEN_WIDTH} = Dimensions.get('window');
const LOGO_SIZE = Math.round(Math.min(Math.max(SCREEN_WIDTH * 0.26, 84), 132));
const GLOW_SIZE = LOGO_SIZE + 36;

// context: 'boot' (default) | 'creating_ride'
//
// Progress:
//   - Pass a `progress` number (0–1) to drive the bar from real init steps
//     (config fetch, auth check, etc). Update it as each step completes.
//   - Omit `progress` and the bar fills on its own over `duration` ms —
//     handy for previewing the screen or for a flat splash delay.
//   - Either way, reaching 100% triggers a fade+scale exit, then calls
//     `onComplete` once that exit finishes — hook your screen swap there.
const LoadingScreen = ({
                         context = 'boot',
                         logoSource = LOGO_SOURCE,
                         progress,
                         duration = 2400,
                         onComplete,
                       }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  const [percent, setPercent] = useState(0);
  const hasCompleted = useRef(false);

  // Entrance fade
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Continuous logo rotation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Soft breathing glow behind the logo — adds life without moving the mark itself
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Keep a plain-number readout of the bar's animated value
  useEffect(() => {
    const id = barAnim.addListener(({value}) => setPercent(Math.round(value * 100)));
    return () => barAnim.removeListener(id);
  }, []);

  const finishAndTransition = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;

    // brief hold at 100% so the completion actually registers, then exit
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 420,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.04,
          duration: 420,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished && onComplete) onComplete();
      });
    }, 260);
  };

  // Controlled mode — animate toward whatever progress the app reports
  useEffect(() => {
    if (typeof progress !== 'number') return;
    const clamped = Math.min(Math.max(progress, 0), 1);
    Animated.timing(barAnim, {
      toValue: clamped,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished && clamped >= 1) finishAndTransition();
    });
  }, [progress]);

  // Uncontrolled/demo mode — fill on its own over `duration`
  useEffect(() => {
    if (typeof progress === 'number') return;
    Animated.timing(barAnim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) finishAndTransition();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.45],
  });

  const glowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const message =
    context === 'creating_ride' ? 'Creating your ride...' : 'Starting up...';

  return (
    <Animated.View
      style={[styles.root, {opacity: fadeAnim, transform: [{scale: scaleAnim}]}]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={[styles.bgRing, styles.bgRingTopLeft]} />
      <View style={[styles.bgRing, styles.bgRingBottomRight]} />

      <View style={styles.logoWrap}>
        <Animated.View
          style={[styles.glow, {opacity: glowOpacity, transform: [{scale: glowScale}]}]}
        />

        {logoSource ? (
          <Animated.Image
            source={logoSource}
            resizeMode="contain"
            style={[styles.logoImage, {transform: [{rotate: spin}]}]}
          />
        ) : (
          <Animated.View style={[styles.logoPlaceholder, {transform: [{rotate: spin}]}]}>
            <Text style={styles.logoPlaceholderText}>R</Text>
          </Animated.View>
        )}
      </View>

      <Text style={styles.wordmark}>
        RIDE<Text style={styles.wordmarkAccent}>G?</Text>
      </Text>
      <Text style={styles.tagline}>YOUR RIDE, YOUR ROUTE</Text>

      <View style={styles.progressSection}>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, {width: barWidth}]}>
            <View style={styles.barSheen} />
          </Animated.View>
        </View>
        <Text style={styles.percentLabel}>{percent}%</Text>
      </View>

      <Text style={styles.message}>{message}</Text>

      <Text style={styles.version}>v1.0</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bgRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(140, 35, 35, 0.12)',
  },
  bgRingTopLeft: {
    width: 500,
    height: 500,
    top: -230,
    left: -220,
  },
  bgRingBottomRight: {
    width: 340,
    height: 340,
    bottom: -160,
    right: -140,
  },

  // ── Logo ─────────────────────────────────────
  logoWrap: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl + spacing.xs, // 36
  },
  glow: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: GLOW_SIZE / 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
  },
  logoPlaceholder: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: Math.round(LOGO_SIZE * 0.4),
    fontWeight: fontWeight.black,
    color: colors.white,
    letterSpacing: -1,
  },

  // ── Wordmark ─────────────────────────────────
  wordmark: {
    color: colors.white,
    fontSize: 32,
    fontWeight: fontWeight.bold,
    letterSpacing: 3,
    marginBottom: spacing.xs + 2, // 6
  },
  wordmarkAccent: {
    color: colors.primary,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 3,
    marginBottom: spacing.xxl + spacing.lg, // 64
  },

  // ── Progress ─────────────────────────────────
  progressSection: {
    width: 200,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  percentLabel: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },

  message: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: fontSize.sm,
    marginTop: spacing.lg - 4, // 20
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: spacing.xl + spacing.sm, // 40
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    letterSpacing: 1,
  },
});

export default LoadingScreen;