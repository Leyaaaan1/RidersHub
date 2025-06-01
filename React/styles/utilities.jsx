
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
        padding: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.tibetanRed700,
    },

    locationContainer: {
        marginBottom: 20,
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
    mapContainer: {
        height: 200,
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    // map: {
    //     ...StyleSheet.absoluteFillObject,
    // },



    // === Top Navbar ===
    navbar: {
        height: 56,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.tibetanRed700,
    },
    textBox: {
        padding: spacing.sm,
        backgroundColor: colors.white,
        fontSize: 16,
        marginBottom: spacing.md,
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

    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    label: {
        marginBottom: 5,
        fontWeight: "bold",
    },
    button: {
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
    map: {
        width: "100%",
        height: 200,
        marginBottom: 10,
    },
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

    // === Primary Button ===
    // button: {
    //     backgroundColor: colors.primary,
    //     paddingVertical: spacing.sm,
    //     paddingHorizontal: spacing.lg,
    //     borderRadius: 8,
    //     marginTop: spacing.md,
    // },
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
});
export default utilities;
