// captureRideSnapshot.js
import {captureRef} from 'react-native-view-shot';

// In-flight guard — prevents double-capture if called twice quickly
const captureInFlight = new Set();

export async function captureRideSnapshot({containerRef, generatedRidesId}) {
  if (!generatedRidesId) {
    return {skipped: true, reason: 'NO_RIDE_ID'};
  }

  if (captureInFlight.has(generatedRidesId)) {
    return {skipped: true, reason: 'IN_FLIGHT'};
  }

  if (!containerRef?.current) {
    return {skipped: true, reason: 'NO_CONTAINER'};
  }

  captureInFlight.add(generatedRidesId);

  try {
    const snapshotUri = await captureRef(containerRef, {
      format: 'png', // ← PNG preserves alpha channel (transparent BG)
      quality: 1, // ignored for PNG, set for clarity
      result: 'data-uri', // "data:image/png;base64,…" — no temp file needed
      // useRenderInContext: false (default) — use the platform's native
      // screenshot path; sufficient for an off-screen SVG view.
    });

    return {skipped: false, snapshotUri};
  } catch (e) {
    return {skipped: true, reason: 'CAPTURE_ERROR'};
  } finally {
    captureInFlight.delete(generatedRidesId);
  }
}
