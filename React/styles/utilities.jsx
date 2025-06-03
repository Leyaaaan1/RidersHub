
import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

const utilities = StyleSheet.create({
    // === Main container ===
    // container: {
    //     flex: 1,
    //     backgroundColor: colors.background,
    //     padding: spacing.md,
    // },

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



    riderTypeOption: {
        minWidth: 80,
        flexGrow: 1,
        flexBasis: '22%',  // Slightly less than 25% to account for margins
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
    //     mapContainer: {
//         height: 250,
//         marginBottom: 16,
//         borderRadius: 8,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     map: {
//         ...StyleSheet.absoluteFillObject,
//     },
    textBox: {
        padding: spacing.sm,
        backgroundColor: colors.white,
        fontSize: 16,
        marginBottom: spacing.md,
    },
    // === Top Navbar ===
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

    textWhite: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        // Use for white text
    },
    textBlack: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        // Use for black text
    },


    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: colors.primary,
    },

    label: {
        marginBottom: 5,
        fontWeight: "bold",
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
    // map: {
    //     width: "100%",
    //     height: 200,
    //     marginBottom: 10,
    // },
    // === Center Content ===
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: spacing.md,
    },
    compactText: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,   // Small line height to remove space between lines
        marginVertical: 0,
        paddingVertical: 0,
        color: colors.primary,

    },
    paragraph: {
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        marginTop: spacing.md,
    },
    // buttonText: {
    //     color: colors.white,
    //     fontSize: 16,
    //     textAlign: 'center',
    // },

    // === Bottom Bar (e.g., Bottom Navigation or Buttons) ===
    bottomBar: {
        height: 56,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.tibetanRed700,
    },
    //     },
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
        // textAlign: 'center',
        alignSelf: 'center',
        width: '80%', // Added to prevent full width while centered
    },
    mapInstructions: {
        position: 'absolute',
        top: 10,
        left: 50,    // Increased from 10 to 50
        right: 30,   // Increased from 10 to 50
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
    smallText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 3,
    },

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
    activeInput: {
        borderColor: '#2196F3',
        borderWidth: 2,
    },
});
export default utilities;
