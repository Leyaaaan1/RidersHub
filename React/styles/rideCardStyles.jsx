// styles/rideCardStyles.js
import { StyleSheet } from 'react-native';
import colors from "./colors";

const PRIMARY_COLOR = '#8c2323';
const CARD_BACKGROUND = '#151515';
const DARK_CARD_BACKGROUND = '#1a1a1a';
const BORDER_COLOR = '#e0e0e0';
const DARK_BORDER_COLOR = '#333';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = '#666';
const TEXT_LIGHT = '#999';
const WHITE = '#ffffff';

export const rideCardStyles = StyleSheet.create({
    // Container Styles
    container: {
        backgroundColor: '#000000',
    },

    flatListContent: {
    },

    // Card Styles
    cardContainer: {
        borderRadius: 16,
        backgroundColor: CARD_BACKGROUND,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },

    cardContent: {
        padding: 15,
    },

    // Header Section
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    rideTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: TEXT_PRIMARY,
        flex: 1,
        marginRight: 12,
    },

    rideIdBadge: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 60,
        alignItems: 'center',
    },

    rideIdText: {
        color: WHITE,
        fontSize: 12,
        fontWeight: '600',
    },

    // Location Section
    locationSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,

    },

    locationIcon: {
        marginRight: 8,
    },

    locationText: {
        fontSize: 16,
        fontWeight: '600',
        color: TEXT_PRIMARY,
    },

    // Owner Section
    ownerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    ownerIcon: {
        marginRight: 6,
    },

    ownerText: {
        fontSize: 13,
        color: TEXT_SECONDARY,
    },

    // Route Section
    routeSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },

    routeText: {
        fontSize: 14,
        fontWeight: '600',
        color: TEXT_PRIMARY,
        flex: 1,
        textAlign: 'center',
    },

    routeArrow: {
        marginHorizontal: 12,
        color: WHITE,
    },

    // Info Section
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    leftInfo: {
        flex: 1,
    },

    dateText: {
        fontSize: 13,
        color: TEXT_SECONDARY,
        marginBottom: 4,
    },

    distanceBadge: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },

    distanceIcon: {
        marginRight: 6,
    },

    distanceText: {
        color: WHITE,
        fontSize: 12,
        fontWeight: '600',
    },

    // Map Container
    mapContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },

    mapImage: {
        width: '100%',
        height: 180,
    },

    // Description Section
    descriptionSection: {
        backgroundColor: '#151515',
        padding: 12,
        borderRadius: 8,
    },

    descriptionText: {
        fontSize: 14,
        color: TEXT_SECONDARY,
        lineHeight: 20,
    },

    // Utility Styles
    separator: {
        height: 12,
    },

    // Footer & Empty States
    footerContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },

    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyText: {
        fontSize: 16,
        color: TEXT_LIGHT,
        marginTop: 12,
        textAlign: 'center',
    },

    // Error States
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    errorText: {
        color: 'red',
        fontSize: 16,
        marginVertical: 12,
        textAlign: 'center',
    },

    retryButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 8,
    },

    retryButtonText: {
        color: WHITE,
        fontSize: 14,
        fontWeight: '600',
    },
});

// Dark Theme Variant (Optional)
export const darkRideCardStyles = StyleSheet.create({
    ...rideCardStyles,

    container: {
        ...rideCardStyles.container,
        backgroundColor: '#121212',
    },

    cardContainer: {
        ...rideCardStyles.cardContainer,
        backgroundColor: DARK_CARD_BACKGROUND,
        borderColor: DARK_BORDER_COLOR,
    },

    rideTitle: {
        ...rideCardStyles.rideTitle,
        color: WHITE,
    },

    locationText: {
        ...rideCardStyles.locationText,
        color: WHITE,
    },

    ownerText: {
        ...rideCardStyles.ownerText,
        color: '#ccc',
    },

    routeSection: {
        ...rideCardStyles.routeSection,
        backgroundColor: '#2a2a2a',
    },

    routeText: {
        ...rideCardStyles.routeText,
        color: WHITE,
    },

    dateText: {
        ...rideCardStyles.dateText,
        color: '#ccc',
    },

    descriptionSection: {
        ...rideCardStyles.descriptionSection,
        backgroundColor: '#2a2a2a',
    },

    descriptionText: {
        ...rideCardStyles.descriptionText,
        color: '#ccc',
    },

    emptyText: {
        ...rideCardStyles.emptyText,
        color: '#666',
    },
});