import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

// === StyleSheet Definitions ===
const utilities = StyleSheet.create({

    // === Containers ===
    container: {
        flexGrow: 1,
        backgroundColor: "#885c5c"
    },
    containerWhite: {
        flexGrow: 1,
         backgroundColor: "#000000",
    },
    containerWhiteCreate: {
        flexGrow: 1,
        backgroundColor: "#3a3636",
        padding: spacing.md,
    },
    navbarContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3e1616',
        height: 70,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#2a0e0e',
    },
    navbarContainerPrimary: {
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#151515",
        height: 60,
        paddingHorizontal: 16,
    },

    navbarContainerTransparent: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent black
        position: 'absolute',
        top: -2,
        left: 0,
        right: 0,
        zIndex: 100,
    },

    centeredContainer: {
        marginTop: 6,
        backgroundColor: "#3a3636",

    },


    listContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
        backgroundColor: colors.background,
        padding: spacing.md,
    },


    bottomAreaContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.tibetanRed700,
    },

    bottomAreaContainerLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 'auto',
        position: 'absolute',
        bottom: 20,
        right: 20,
        left: 20
    },

    locationContainer: {
        marginBottom: 20,
    },

    fullScreenContainer: {
        top: -200,
        flex: 1,
        width: '100%',
        height: '100%',
    },
    searchSection: {
        alignItems: 'center',
    },

    // === Rider Type Option Styles ===
    riderTypeOption: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        padding: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        alignSelf: 'flex-start',
    },

    selectedRiderType: {
        backgroundColor: colors.primary,
        borderWidth: 1,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },

    // === Search Results ===
    searchResults: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 5,
    },

    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    // === Text Input and Box ===
    textBox: {
        padding: spacing.sm,
        backgroundColor: colors.white,
        fontSize: 16,
        marginBottom: spacing.md,
    },

    input: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },

    inputCenter: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignSelf: 'center',
        width: '80%',
    },
    inputCenterDescription: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        alignSelf: 'center',
        width: '80%',
    },
    inputLocationName: {
        borderColor: colors.primary,
        borderRadius: 8,
        alignSelf: 'center',
        width: '100%',
    },

    activeInput: {
        borderColor: '#2196F3',
        borderWidth: 2,
    },

    // === Navbar ===
    navbar: {
        height: 56,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.tibetanRed700,
    },

    navbarTextWhite: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },

    navbarTextDark: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
    },

    // === Text Styles ===
    textWhite: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },

    textBlack: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: colors.primary,
    },

    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: spacing.md,
    },
    titleTextBlack: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: spacing.md,
    },


    label: {
        marginBottom: 5,
        fontWeight: "bold",
    },

    paragraph: {
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    compactText: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
        marginVertical: 0,
        paddingVertical: 0,
        color: colors.primary,
    },


    smallText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 3,
    },
    smallTextBlack: {
        fontSize: 12,
        color: '#000',
        marginTop: 3,
    },
    // === Buttons ===
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        marginTop: spacing.md,
    },

    buttonWhite: {
        backgroundColor: colors.white,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
    },


    buttonBack: {
        backgroundColor: "#007AFF",
        padding: 12,
        marginTop: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },

    // === Bottom Bar ===
    bottomBar: {
        height: 56,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.tibetanRed700,
    },

    // === Centering Layouts ===
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // === Search Section ===
    searchingText: {
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },

    searchResultsList: {
        maxHeight: 200,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 8,
    },

    searchResultItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
    },

    searchResultName: {
        fontWeight: 'bold',
        color: colors.white,
    },

    searchResultAddress: {
        fontSize: 12,
        color: '#fff',
    },

    // === Map & Geolocation ===
    mapInstructions: {
        position: 'absolute',
        top: 10,
        left: 50,
        right: 30,
        padding: 8,
        borderRadius: 1,
        zIndex: 1,
        textAlign: 'center',
        backgroundColor: colors.primary,
        color: colors.white,
    },

    coordinatesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    mapContainer: {
        height: 510,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    // === Progress Indicators ===
    progressIndicatorVertical: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        position: 'absolute',
        right: 0,
        bottom: 80,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: 6,
        zIndex: 10,
        maxHeight: 300,
    },
    progressStepConnector: {
        width: 2,
        height: 24,
        backgroundColor: '#fff',
        alignSelf: 'left',
        opacity: 0.5,
    },
    progressStepSmall: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 6,
        minWidth: 60,
        backgroundColor: '#444',
    },
    progressStepSmallSelected: {
        backgroundColor: colors.primary,
    },
    progressTextSmall: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    // === Form Styles ===
    formGroup: {
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    value: {
        fontSize: 16,
        color: colors.text,
        marginTop: 4,
        paddingLeft: spacing.sm,
    },

    // === Tabs ===
    tabButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },

    activeTab: {
        backgroundColor: '#2196F3',
    },

    tabButtonText: {
        fontWeight: 'bold',
    },

    // === Image container===

    mapboxImage: {
        width: '100%',
        height: 250,
        borderRadius: 8,
    },
    imageContainer: {
        marginVertical: 10,
        padding: 10,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    oblongImageContainer: {
        width: '100%',
        height: 120,
        alignItems: 'left',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 8,
    },
    oblongImage: {
        width: 120,
        height: 120,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    oblongPointerCurve: {
        position: 'absolute',
        bottom: -12,
        left: '50%',
        marginLeft: -16,
        width: 32,
        height: 16,

    },
    currentRideItem: {
        marginVertical: 6,
        backgroundColor: "#1c1c1e",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        elevation: 2,
    },
    currentRideLabel: {
        color: '#d0d3d4',
        fontSize: 14,
        marginBottom: 3,
        textAlign: 'left',
    },
    currentRideLabelMiddle: {
        color: '#bfc9d1',
        fontSize: 13,
        marginBottom: 2,
        textAlign: 'left',
    },
    currentRideValue: {
        color: colors.white,
        fontWeight: 'bold',
    },
    currentRideValueMiddle: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 13,
    },
    currentRideError: {
        color: 'red',
        textAlign: 'center',
        fontSize: 13,
        marginVertical: 6,
    },
    currentRideEmpty: {
        color: '#9eaab5',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 13,
        marginTop: 6,
    },


});

export default utilities;
