import { StyleSheet, Dimensions } from 'react-native';
import colors from "./colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const rideStepsUtilities = StyleSheet.create({
    // Container styles
    containerWhite: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Modern floating navbar - Reduced height and optimized spacing
    navbarContainerPrimary: {
        position: 'absolute',
        top: 20,
        left: 12,
        right: 12,
        height: 56, // Reduced from 60
        borderRadius: 18, // Slightly reduced
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16, // Reduced from 20
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 }, // Reduced shadow
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 10,
    },

    // Floating search card - Better responsive sizing
    searchContainer: {
        position: 'absolute',
        top: 80, // Reduced gap
        left: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20, // Slightly reduced
        elevation: 12,
        zIndex: 50,
    },

    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 14, // Slightly reduced
        paddingHorizontal: 14, // Reduced from 16
        height: 48, // Reduced from 52
        borderWidth: 1,
        borderColor: '#e8eaed',
    },

    searchInputFocused: {
        borderColor: '#8c2323',
        backgroundColor: '#fafafa',
    },

    // Input styles - Better text sizing
    inputLocationName: {
        flex: 1,
        fontSize: 15, // Reduced from 16
        fontWeight: '500',
        color: '#1a1a1a',
        paddingVertical: 0,
    },

    searchButton: {
        width: 36, // Reduced from 40
        height: 36, // Reduced from 40
        backgroundColor: '#8c2323',
        borderRadius: 10, // Reduced from 12
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 3 }, // Reduced shadow
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },

    // Modern search results - Optimized for mobile
    searchResultsList: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 14, // Reduced from 16
        marginTop: 12, // Reduced from 16
        maxHeight: 220, // Reduced from 240
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // Reduced shadow
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 6,
    },

    resultItem: {
        paddingHorizontal: 10, // Reduced from 20
        paddingVertical: 5, // Reduced from 16
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    resultItemLast: {
        borderBottomWidth: 0,
    },

    resultIconContainer: {
        width: 20, // Reduced from 40
        height: 36, // Reduced from 40
        borderRadius: 10, // Reduced from 12
        justifyContent: 'center',
        alignItems: 'center',
    },

    resultTextContainer: {
        flex: 1,
    },

    searchResultName: {
        fontSize: 15, // Reduced from 16
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 3, // Reduced from 4
    },

    searchResultAddress: {
        fontSize: 13, // Reduced from 14
        color: '#5f6368',
        lineHeight: 17, // Reduced from 18
    },

    // Text styles - Better mobile typography
    textWhite: {
        color: '#1a1a1a',
        fontSize: 16, // Reduced from 18
        fontWeight: '700',
        letterSpacing: -0.2,
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 15, // Reduced from 16
        fontWeight: '600',
        letterSpacing: -0.1,
    },

    buttonTextDark: {
        color: '#1a1a1a',
        fontSize: 15, // Reduced from 16
        fontWeight: '600',
        letterSpacing: -0.1,
    },

    searchingText: {
        color: '#5f6368',
        fontSize: 13, // Reduced from 14
        fontWeight: '500',
        marginTop: 12, // Reduced from 16
        textAlign: 'center',
    },

    // Modern button styles - Better touch targets
    button: {
        paddingHorizontal: 20, // Reduced from 24
        paddingVertical: 12, // Reduced from 14
        borderRadius: 14, // Reduced from 16
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44, // Added minimum touch target
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Reduced shadow
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
    },

    primaryButton: {
        backgroundColor: '#8c2323',
    },

    secondaryButton: {
        backgroundColor: '#4285f4',
    },

    successButton: {
        backgroundColor: '#34a853',
    },

    outlineButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: '#dadce0',
    },

    // Floating bottom card - Better positioning
    bottomCard: {
        position: 'absolute',
        bottom: 24, // Reduced from 32
        left: 12,
        right: 12,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 20, // Reduced from 24
        padding: 20, // Reduced from 24
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 }, // Reduced shadow
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 16,
        zIndex: 40,
    },

    // Location info card - Optimized sizing
    locationInfoCard: {
        position: 'absolute',
        bottom: 24, // Reduced from 32
        left: 12,
        right: 12,
        elevation: 16,
        zIndex: 40,
    },

    label: {
        fontSize: 12, // Reduced from 13
        fontWeight: '600',
        color: '#5f6368',
        marginBottom: 6, // Reduced from 8
        letterSpacing: 0.4,
    },

    locationName: {
        color: '#1a1a1a',
        fontSize: 20, // Reduced from 22
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 25, // Reduced from 28
        backgroundColor: 'rgba(255,255,255,0.85)',

        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },

    // Floating instruction pill - Better mobile sizing
    instructionPill: {
        position: 'absolute',
        top: 135, // Reduced from 220
        left: 12,
        right: 12,
        elevation: 10,
        zIndex: 45,
    },

    instructionText: {
        color: colors.primary,
        fontSize: 14, // Reduced from 15
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: -0.1,
        opacity: 0.9,
    },

    // Progress container - Better mobile layout



    progressBarToggleText: {
        color: '#1a1a1a',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: -0.1,
        marginLeft: 8,
        // top: 200, // Remove this line
    },
    mainActionContainer: {
        position: 'absolute',
        bottom: 24, // Reduced from 32
        left: 12,
        right: 12,
        zIndex: 40,
    },

    // Navigation buttons - Better touch targets
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14, // Reduced from 16
        paddingVertical: 8, // Reduced from 10
        borderRadius: 10, // Reduced from 12
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e8eaed',
        minHeight: 40, // Added minimum touch target
    },

    nextButton: {
        backgroundColor: '#8c2323',
        borderColor: '#8c2323',
    },
    backButton: {
        backgroundColor: '#8c2323',
        borderColor: '#8c2323',
    },

    // Status indicators - Slightly larger for better visibility
    statusIndicator: {
        width: 10, // Increased from 8
        height: 10, // Increased from 8
        borderRadius: 5,
        marginRight: 8,
    },

    statusActive: {
        backgroundColor: '#34a853',
    },

    statusInactive: {
        backgroundColor: '#dadce0',
    },

    // Disabled state
    disabledButton: {
        opacity: 0.5,
    },

    disabledText: {
        opacity: 0.5,
    },

    // Step 3 specific styles - Optimized spacing
    step3Container: {
        position: 'absolute',
        top: 120, // Reduced from 140
        left: 12,
        right: 12,
        borderRadius: 20, // Reduced from 24
        padding: 16, // Reduced from 20
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 }, // Reduced shadow
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 12,
        zIndex: 50,
    },

    step3Instructions: {
        position: 'absolute',
        top: 260, // Reduced from 280
        left: 12,
        right: 12,
        backgroundColor: '#8c2323',
        borderRadius: 16, // Reduced from 20
        paddingVertical: 10, // Reduced from 12
        paddingHorizontal: 16, // Reduced from 20
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 6 }, // Reduced shadow
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 45,
    },
    progressContainer: {
        marginTop:  470,
    },

    // Top row container for Start/Finish points
    topRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 5,
        marginBottom: 3,
    },

    halfWidthCard: {
        flex: 1,
        margin: 3,
        paddingBottom: 3,
    },

    fullWidthCard: {

        flex: 1,
        marginLeft: 3,
        marginRight: 3,
    },

    // Modern card base style
    modernCard: {
        backgroundColor: "rgba(58,54,54,0.85)",
        borderRadius: 16,
        padding: 6,
    },



    // Card header layout
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    // Icon containers
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },




    // Card title
    cardTitle: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.white,
        padding: 4,
    },

    // Location text
    locationText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 30,
    },

    // Change button styles
    changeButton: {
        alignItems: 'center',
        borderColor: 'rgba(255,255,255,0.85)',
    },




    changeButtonText: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
    },

    // Stop points specific styles
    stopScrollView: {
        maxHeight: 140,
    },

    stopScrollContent: {
        paddingBottom: 4,
    },

    stopItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.85)',
    },

    stopNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    stopNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },

    stopName: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        fontWeight: '500',
        flex: 1,
    },

    stopCounter: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
    },

    stopCounterText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },

    // Legacy styles (keeping for backward compatibility)
    pointSelectionCard: {
        borderRadius: 16,
        padding: 10,
        top: 200,
    },

    actionButtonsContainer: {
        position: 'absolute',
        bottom: 120,
        left: 12,
        right: 12,
        zIndex: 30,
    },

    pointTitle: {
        fontSize: 13,
        color: '#ffffff',
        marginBottom: 6,
    },

    pointSubtitle: {
        fontSize: 15,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 10,
    },

    // Floating action button
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#8c2323',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
        zIndex: 50,
    },

    // Modern loading state
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },

    loadingText: {
        color: '#5f6368',
        fontSize: 13,
        fontWeight: '500',
        marginLeft: 8,
    },

    // Chip styles for tags
    chip: {
        backgroundColor: '#f1f3f4',
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 6,
        marginBottom: 6,
        minHeight: 28,
    },

    chipText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#5f6368',
    },

    chipActive: {
        backgroundColor: '#e8f0fe',
    },

    chipActiveText: {
        color: '#1a73e8',
        fontSize: 11,
    },

    // Additional responsive utilities
    compactContainer: {
        paddingHorizontal: screenWidth < 375 ? 8 : 12,
    },

    responsiveText: {
        fontSize: screenWidth < 375 ? 13 : 15,
    },
    routeInfoContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#1e40af',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Route info text styling
    routeInfoText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },routeInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    routeStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
    },

    // Individual route stat item
    routeStatItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },

    // Route stat label
    routeStatLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
        marginBottom: 2,
    },

    // Route stat value
    routeStatValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },

    // Info button style (for instruction messages)
    infoButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },

    // Additional utility styles you might need



    responsiveButton: {
        paddingHorizontal: screenWidth < 375 ? 16 : 20,
        paddingVertical: screenWidth < 375 ? 10 : 12,
    },

});

export default rideStepsUtilities;