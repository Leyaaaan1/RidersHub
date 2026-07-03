// ─────────────────────────────────────────────
// components/scanner.js
// QR scanner screen styles.
// ─────────────────────────────────────────────

import {StyleSheet} from 'react-native';
import colors from '../tokens/colors';
import spacing from '../tokens/spacing';
import {fontSize, fontWeight} from '../tokens/typography';

const scanner = StyleSheet.create({
  // ── Header Button (in header/card) ─────────
  scanButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Modal ─────────────────────────────────
  scannerContainer: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
  },

  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  closeButton: {
    padding: spacing.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scannerTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semi,
    flex: 1,
    textAlign: 'center',
  },

  // ── Camera ────────────────────────────────
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    position: 'absolute',
  },

  scanCorner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: colors.primary,
    borderWidth: 3,
    top: -5,
    left: -5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },

  scanCornerTopRight: {
    left: 'auto',
    right: -5,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
  },

  scanCornerBottomLeft: {
    top: 'auto',
    bottom: -5,
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 8,
  },

  scanCornerBottomRight: {
    top: 'auto',
    left: 'auto',
    right: -5,
    bottom: -5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 8,
  },

  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  processingText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    marginTop: spacing.md,
    fontWeight: fontWeight.semi,
  },

  // ── Instructions / Footer ─────────────────
  instructions: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  instructionsTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semi,
    marginTop: spacing.md,
    textAlign: 'center',
  },

  instructionsText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Upload Button ─────────────────────────
  uploadButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  uploadButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  uploadButtonText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semi,
  },

  uploadButtonDisabled: {
    backgroundColor: colors.textDisabled,
    opacity: 0.6,
  },
});

export default scanner;
