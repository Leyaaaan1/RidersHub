// React/components/ride/rideStepStyle.js
import { StyleSheet } from 'react-native';
import colors from "./colors";

const rideStepStyle = StyleSheet.create({
    relative: { position: 'relative' },
    flex1: { flex: 1 },

    fullscreenMap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },

    navbarOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginTop: 20,
        top: 0,
    },
    navbarBackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    navbarBackIcon: {
        marginRight: 8,
    },

    stopPointPromptModal: {
        position: 'absolute',
        top: 120,
        left: 30,
        right: 30,
        zIndex: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    stopPointPromptTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    stopPointPromptInput: {
        width: 80,
        textAlign: 'center',
        marginBottom: 10,
    },
    stopPointPromptButton: {
        backgroundColor: colors.primary,
        width: 120,
    },

    searchBox: {
        position: 'absolute',
        top: 150,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
        zIndex: 10,
    },
    searchBoxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchButton: {
        marginLeft: 8,
        backgroundColor: colors.primary,
        padding: 8,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchResultsListBox: {
        maxHeight: 200,
        backgroundColor: 'white',
    },
    searchResultNameColor: { color: '#333' },
    searchResultAddressColor: { color: '#666' },

    mapInstructionsBox: {
        top: 95,
        left: 20,
        right: 20,
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 8,
        position: 'absolute',
        zIndex: 5,
        color: '#fff',
        textAlign: 'center',
    },

    progressIndicatorsWrapper: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
    },
    progressStepActive: { backgroundColor: '#4CAF50' },
    progressStepCurrent: { backgroundColor: colors.primary },
    progressStepInactive: { backgroundColor: '#ccc' },
    progressConnectorActive: { backgroundColor: '#4CAF50' },
    progressConnectorInactive: { backgroundColor: '#ccc' },
    progressStepStartingPoint: { flex: 1, marginRight: 10 },
    progressStepStartingPointText: { color: '#000', fontWeight: 'bold' },
    progressStepEndingPoint: { flex: 1 },
    progressStepEndingPointText: { color: '#000', fontWeight: 'bold' },

    finalizeSelectionButtonWrapper: {
        position: 'absolute',
        bottom: 70,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    finalizeSelectionButton: {
        backgroundColor: colors.primary,
    },

    createRideButtonWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createRideButton: {
        backgroundColor: '#4CAF50',
    },
});

export default rideStepStyle;