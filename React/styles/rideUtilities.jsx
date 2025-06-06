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
        backgroundColor: colors.background,
        padding: 2,
    },

// Add this style to apply to each column item
    columnItem: {
        width: '48%', // Slightly less than 50% to account for spacing
        marginBottom: spacing.sm,
    },

    detailText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.tibetanRed50 || '#333',
    },

    formGroup: {
        marginBottom: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
        backgroundColor: colors.primary,
        borderColor: '#e89898',
        borderWidth: 1,
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },

    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.md,
    },






});

export default rideUtilities;
