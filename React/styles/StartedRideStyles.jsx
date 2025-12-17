// React/styles/StartedRideStyles.jsx
import { StyleSheet } from 'react-native';
import colors from './colors';
import utilities from './utilities';

const styles = StyleSheet.create({
  ...utilities, // Import all utility styles

  container: {
    ...utilities.containerWhite,
    flex: 1,
  },

  contentContainer: {

  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    marginLeft: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  rideInfoContainer: {
    backgroundColor: "#151515",
    borderWidth: 2,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  rideTitle: {
    ...utilities.title,
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  rideId: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  infoCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#ddd',
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 20,
  },
  routeCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  routeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeIcon: {
    marginRight: 10,
  },
  routeText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },

  // New Route Info Overlay Styles
  routeInfoOverlay: {
    position: 'absolute',
    top: 35,
    right: 12,
    backgroundColor: '#151515',
    borderRadius: 12,
    borderColor: '#333',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#1a1a1a',
  },
  routeInfoHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  routeInfoHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  routeInfoContent: {
    padding: 14,
    paddingTop: 10,
  },
  routePointContainer: {
    marginBottom: 14,
  },
  stopPointWrapper: {
    marginBottom: 10,
  },
  routeMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  startMarker: {
    backgroundColor: '#16a34a',
  },
  stopMarker: {
    backgroundColor: '#d97706',
  },
  endMarker: {
    backgroundColor: '#dc2626',
  },
  routeMarkerEmoji: {
    fontSize: 14,
  },
  routeMarkerNumber: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  routeLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  routeLocationText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 38,
    marginTop: 2,
    lineHeight: 20,
  },

  // Action Buttons Container
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#151515',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 12,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export default styles;