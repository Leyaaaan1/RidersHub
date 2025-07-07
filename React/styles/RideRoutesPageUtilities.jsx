import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import colors from "./colors";

const { width, height } = Dimensions.get('window');

const rideRoutesPageUtilities = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerGradient: {
        paddingTop: (StatusBar.currentHeight || 24) + 16,
        paddingBottom: 24,
    },
    header: {
        paddingHorizontal: 20,
    },
    headerContent: {
        alignItems: 'flex-start',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
    },
    backButtonText: {
        fontSize: 18,
        color: '#fff',
    },
    routeStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#8c2323',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8c2323',
        marginRight: 8,
    },
    statusText: {
        color: '#8c2323',
        fontSize: 12,
        fontWeight: '600',
    },
    routeDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    routePoint: {
        flex: 1,
        alignItems: 'center',
    },
    startDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8c2323',
        marginBottom: 8,
    },
    endDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10b981',
        marginBottom: 8,
    },
    routePointText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    routeConnection: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    routeLine: {
        height: 2,
        backgroundColor: '#333',
        width: '100%',
        marginBottom: 8,
    },
    routeArrowContainer: {
        backgroundColor: '#8c2323',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    routeArrow: {
        color: colors.primary,
        fontSize: 40,
        fontWeight: 'bold',
    },
    imageSection: {
        backgroundColor: '#000',
        paddingTop: 20,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIndicator: {
        width: 4,
        height: 20,
        backgroundColor: '#8c2323',
        borderRadius: 2,
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: -0.5,
        flex: 1,
    },
    sectionBadge: {
        backgroundColor: '#8c2323',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sectionBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    mapBadge: {
        backgroundColor: '#10b981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    mapBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    countBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    countBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    switchButton: {
        backgroundColor: 'rgba(140, 35, 35, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#8c2323',
    },
    switchButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',

    },
    imageCard: {
        marginHorizontal: 8,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#111',
    },
    image: {
        width: width - 40,
        height: height * 0.32,
        backgroundColor: '#222',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    imageMetaContainer: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    imageMeta: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    imageCounter: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageCounterText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    imagesList: {
        paddingHorizontal: 12,
    },
    loadingContainer: {
        height: height * 0.32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        marginHorizontal: 20,
        borderRadius: 16,
    },
    loadingDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8c2323',
        marginBottom: 12,
    },
    loadingText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        height: height * 0.32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        marginHorizontal: 20,
        borderRadius: 16,
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    errorText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },
    mapSection: {
        backgroundColor: '#000',
        marginTop: 32,
    },
    mapContainer: {
        paddingHorizontal: 20,
    },
    stopPointsSection: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    stopPointsList: {
        marginTop: 8,
    },
    stopPointCard: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#8c2323',
    },
    stopPointHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stopPointNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#8c2323',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stopPointNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    stopPointInfo: {
        flex: 1,
    },
    stopPointName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    stopPointCoords: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
    stopPointConnector: {
        width: 2,
        height: 20,
        backgroundColor: '#333',
        marginLeft: 15,
        marginTop: 8,
    },
    emptyStateContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 16,
        marginTop: 8,
    },
    emptyStateIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    emptyStateText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default rideRoutesPageUtilities;