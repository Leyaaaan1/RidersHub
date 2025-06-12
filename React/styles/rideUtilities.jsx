import colors from "./colors";
import spacing from "./spacing";
import {StyleSheet} from "react-native";
import utilities from "./utilities";

const rideUtilities = StyleSheet.create({


        textCentered: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            backgroundColor: colors.primary,
            padding: spacing.sm, // Reduced padding
            width: '80%', // Reduced from 90%
            minHeight: 80, // Reduced from 100
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 6, // Slightly smaller radius
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 }, // Reduced shadow offset
            shadowOpacity: 0.1,
            shadowRadius: 2, // Reduced shadow radius
            elevation: 1, // Reduced elevation
            alignSelf: 'center',
        },

    container: {
        flexGrow: 1,
        backgroundColor: colors.white,
        padding: 2,
    },

    label: {
        fontWeight: "bold",
    },


// Add this style to apply to each column item
    columnItem: {
        width: '48%', // Slightly less than 50% to account for spacing
        marginBottom: spacing.sm,
    },

    detailText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: colors.primary,
    },

    topContainer: {
        minWidth: 80,
        flexGrow: 1,
        flexBasis: '22%',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },

    middleContainer: {
        backgroundColor: colors.white,
        borderColor: '#e89898',
        borderWidth: 1,
        borderRadius: 8,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        padding: spacing.sm,

    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
    },

    customBottomContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,

        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',

    },

    customBottomText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 5,
    },

    customBottomSubText: {
        color: colors.white,
        fontSize: 12,
        opacity: 0.8,
        textAlign: 'center',
    },

    // Alternative style - more compact
    compactBottomContainer: {
        backgroundColor: 'rgba(42, 14, 14, 0.9)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 5,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Another alternative - notification style
    notificationContainer: {
        backgroundColor: '#2a5d31',
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
        flexDirection: 'row',
        alignItems: 'center',
    },





});

export default rideUtilities;
