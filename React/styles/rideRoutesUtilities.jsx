import { StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const rideRoutesUtilities = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#000',
    },

    // Minimal Header (Strava-style)
    header: {
        paddingTop: (StatusBar.currentHeight || 24) + 16,
        paddingHorizontal: 20,
        paddingBottom: 24,
        backgroundColor: '#000',
    },
    headerContent: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    routeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    routeText: {
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
        maxWidth: width * 0.35,
    },
    routeArrow: {
        width: 16,
        height: 1,
        backgroundColor: '#666',
        marginHorizontal: 12,
    },

    // Clean Image Section
    imageSection: {
        backgroundColor: '#000',
        paddingTop: 8,
    },
    imageHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    locationIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    locationLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: -0.3,
    },
    locationSubtitle: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        marginLeft: 18,
    },

    // Minimal Images Container
    image: {
        width: width - 40,
        height: height * 0.28,
        borderRadius: 8,
        marginHorizontal: 8,
        backgroundColor: '#111',
    },
    imagesList: {
        paddingHorizontal: 12,
    },

    // Clean Loading/Error States
    loadingContainer: {
        height: height * 0.28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        marginHorizontal: 20,
        borderRadius: 8,
    },
    loadingText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        height: height * 0.28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
        marginHorizontal: 20,
        borderRadius: 8,
    },
    errorText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
    },

    // Minimal Switch Button
    switchButton: {
        backgroundColor: '#8c2323',
        marginHorizontal: 20,
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    switchButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.2,
    },

    // Clean Map Section
    mapSection: {
        backgroundColor: '#000',
        marginTop: 32,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: -0.3,
    },
    swapperSection: {
        paddingHorizontal: 20,
    },
});

export default rideRoutesUtilities;