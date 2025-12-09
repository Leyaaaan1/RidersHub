// styles/modernRideStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const modernRideStyles = StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },

    // ===== NEW MODERN HEADER STYLES =====
    modernHeader: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },

    modernBackButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modernHeaderCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
    },

    modernHeaderTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 2,
    },

    modernHeaderSubtitle: {
        color: '#666',
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },

    modernHeaderRight: {
        alignItems: 'flex-end',
    },

    modernJoinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8c2323',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },

    modernJoinButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    modernStartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8c2323',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ===== HERO CARD STYLES =====
    heroCard: {
        backgroundColor: '#111',
      margin: 8,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#222',
    },

    heroCardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    heroCardTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -0.5,
    },

    heroCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    heroCardMetaText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '600',
    },

    rideTypeBadge: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ===== INFO CARDS =====
    infoRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },

    infoCard: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
    },

    infoCardLabel: {
        color: '#888',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },

    infoCardValue: {
        color: '#8c2323',
        fontSize: 13,
      fontStyle: 'italic',

        fontWeight: '600',
        lineHeight: 18,
    },

    // ===== ROUTE SUMMARY =====
    routeSummary: {
        backgroundColor: '#0a0a0a',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#222',
    },

    routePoint: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },

    routePointDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8c2323',
        marginTop: 6,
    },

    routePointLabel: {
        color: '#666',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },

    routePointText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    routeConnector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        paddingVertical: 8,
    },

    routeConnectorLine: {
        width: 1,
        height: 20,
        backgroundColor: '#333',
        marginRight: 8,
    },

    // ===== SECTION STYLES =====
    sectionContainer: {
        marginBottom: 8,
    },

    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    sectionIndicator: {
        width: 4,
        height: 20,
        backgroundColor: '#8c2323',
        borderRadius: 2,
        marginRight: 12,
    },



    mapBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },

    mapBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },

    mapWrapper: {
        height: 350,
        borderRadius: 16,
        overflow: 'hidden',
    },

    // ===== DESCRIPTION CARD =====
    descriptionCard: {
        borderRadius: 8,
        padding: 8,


    },

    descriptionCardText: {
        color: '#ccc',
        fontSize: 15,
        fontWeight: '400',
      justifyContent: 'space-between',
      fontStyle: 'italic',
    },

    // ===== MODERN BOTTOM NAV =====
    modernBottomNav: {
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },

    modernBottomNavButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },

    modernBottomNavDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#333',
    },

    modernBottomNavText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },

    // ===== OLD STYLES (KEPT FOR COMPATIBILITY) =====
    header: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
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
        borderRadius: 25,
    },

    scrollContent: {
        flex: 1,
    },

    heroSection: {
        backgroundColor: '#151515',
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },

    rideTitle: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 0.3,
    },

    dateContainer: {
        backgroundColor: 'rgba(140, 35, 35, 0.1)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        alignSelf: 'center',
    },

    dateText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

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

    imageScrollView: {
        marginTop: 12,
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

    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
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
        borderRadius: 20,
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
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#8c2323',
    },

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

    bottomNav: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

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

    fadeContainer: {
        flex: 1,
    },

    slideContainer: {
        flex: 1,
    },

    pulseContainer: {
        transform: [{ scale: 1 }],
    },

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
