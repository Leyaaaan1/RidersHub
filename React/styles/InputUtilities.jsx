
const InputUtilities = {
    // Layout Containers
    containerWhite: {
        flex: 1,
        backgroundColor: '#000000',
    },

    // Navigation Bar
    navbarContainerPrimary: {
        backgroundColor: '#151515',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    // Cards and Sections
    cardContainer: {
        backgroundColor: '#151515',
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },

    // Typography
    textWhite: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    sectionTitle: {
        color: '#e3e0e0',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    label: {
        color: '#cbd6e4',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Input Fields
    inputCenter: {
        backgroundColor: '#f1f5f9',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1e293b',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        transition: 'all 0.2s ease',
    },

    inputCenterFocused: {
        borderColor: '#8c2323',
        backgroundColor: '#ffffff',
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },

    inputCenterDescription: {
        backgroundColor: '#f1f5f9',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1e293b',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        minHeight: 120,
    },

    inputLocationName: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1e293b',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Buttons
    button: {
        backgroundColor: '#8c2323',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Ride Type Selection
    rideTypeOption: {
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        marginHorizontal: 4,
        transition: 'all 0.2s ease',
    },

    selectedRiderType: {
        backgroundColor: '#8c2323',
        borderColor: '#8c2323',
        shadowColor: '#8c2323',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },

    // Search and Results
    searchResultsList: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 8,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },

    searchResultItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },

    searchResultName: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    searchResultAddress: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    resultItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },

    // Participants Table
    participantsTable: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    tableHeader: {
        backgroundColor: '#8c2323',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    tableHeaderText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },

    tableRowEven: {
        backgroundColor: '#f8fafc',
    },

    tableRowOdd: {
        backgroundColor: '#ffffff',
    },

    participantName: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Map Instructions
    mapInstructions: {
        backgroundColor: '#8c2323',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 16,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Search UI
    searchingText: {
        color: '#64748b',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Location Info
    locationInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },

    locationName: {
        color: '#1e293b',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Date Display
    dateDisplay: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },

    dateText: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    timeText: {
        color: '#64748b',
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Error States
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    errorBorder: {
        borderColor: '#ef4444',
    },

    // Calendar Button
    calendarButton: {
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',

    },

    calendarButtonError: {
        borderWidth: 2,
        borderColor: '#ef4444',
    },

    // Chip/Tag styles for selected riders
    riderChip: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },

    riderChipText: {
        color: '#8c2323',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },

    // Progress indicators
    progressContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    progressText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
};

export default InputUtilities;