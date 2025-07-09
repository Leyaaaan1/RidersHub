// styles/modernRideStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const modernRideStyles = StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },

    // Header Styles
    header: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },

    headerCenter: {
        flex: 2,
        alignItems: 'center',
    },

    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
    },

    backButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },

    locationTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 0.5,
    },

    rideId: {
        color: '#8c2323',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 2,
        opacity: 0.9,
    },

    joinButton: {
        backgroundColor: '#8c2323',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },

    joinButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },

    startButton: {
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
        padding: 8,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#8c2323',
    },

    // Main Content Styles
    scrollContent: {
        flex: 1,
    },

    heroSection: {
        backgroundColor: '#151515',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },

    rideTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.3,
    },

    dateContainer: {
        backgroundColor: 'rgba(140, 35, 35, 0.1)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(140, 35, 35, 0.3)',
    },

    dateText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Images Section
    imagesSection: {
        marginBottom: 20,
    },

    locationImagesContainer: {
        marginBottom: 16,
    },

    imageContainer: {
        width: width * 0.8,
        height: 200,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    locationImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    imageMetaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    imageMeta: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '500',
        opacity: 0.9,
    },

    mapContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    mapImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },

    // Stats Section
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 4,
    },

    statsLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },

    statsRight: {
        flex: 1,
        alignItems: 'flex-end',
    },

    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        minWidth: 120,
    },

    statIcon: {
        marginRight: 8,
    },

    statText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },

    ownerText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '600',
    },

    distanceContainer: {
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#8c2323',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },

    distanceText: {
        color: '#8c2323',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },

    rideTypeContainer: {
        backgroundColor: 'rgba(140, 35, 35, 0.1)',
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#8c2323',
    },

    // Description Section
    descriptionSection: {
        padding: 20,
        backgroundColor: '#0f0f0f',
    },

    descriptionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 0.3,
    },

    descriptionText: {
        color: '#ccc',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '400',
    },

    // Bottom Navigation
    bottomNav: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#333',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    bottomNavItem: {
        flex: 1,
        alignItems: 'center',
    },

    bottomNavButton: {
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#8c2323',
        elevation: 2,
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

    bottomNavText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Loading States
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    loadingText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 12,
    },

    // Error States
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(140, 35, 35, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(140, 35, 35, 0.3)',
    },

    errorText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },

    // Animation Containers
    fadeContainer: {
        flex: 1,
    },

    slideContainer: {
        flex: 1,
    },

    pulseContainer: {
        transform: [{ scale: 1 }],
    },

    // Utility Classes
    shadow: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },

    glowEffect: {
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },

    // Responsive adjustments
    smallScreen: {
        fontSize: 12,
        padding: 8,
    },

    mediumScreen: {
        fontSize: 14,
        padding: 12,
    },

    largeScreen: {
        fontSize: 16,
        padding: 16,
    },
});

export default modernRideStyles;