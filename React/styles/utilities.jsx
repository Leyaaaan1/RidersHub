import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

// === StyleSheet Definitions ===
const utilities = StyleSheet.create({

    // === Containers ===
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 2,
    },

    gradientContainer: {
        flex: 1,
        padding: spacing.md,
    },

    containerPrimary: {
        flex: 1,
        backgroundColor: colors.secondary,
        padding: spacing.md,
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

    // === Rider Type Option Styles ===
    riderTypeOption: {
        minWidth: 80,
        flexGrow: 1,
        flexBasis: '22%',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginHorizontal: 5,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },

    selectedRiderType: {
        backgroundColor: colors.primary,
        borderColor: '#2980b9',
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
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: '80%',
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
        color: colors.primary,
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

    // === Buttons ===
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        marginTop: spacing.md,
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
        borderColor: '#ddd',
        borderRadius: 8,
    },

    searchResultItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    searchResultName: {
        fontWeight: 'bold',
    },

    searchResultAddress: {
        fontSize: 12,
        color: '#666',
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
    progressIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },

    progressStep: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        alignItems: 'center',
    },

    progressConnector: {
        height: 3,
        width: 40,
    },

    progressText: {
        color: '#fff',
        fontWeight: 'bold',
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

});

export default utilities;
