
import { StyleSheet } from 'react-native';
import colors from './colors';
import spacing from './spacing';

const utilities = StyleSheet.create({
    // === Main container ===
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    paragraph: {
        fontSize: 16,
        color: colors.text,
        marginBottom: spacing.sm,
    },

    // === Primary Button ===
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        marginTop: spacing.md,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
    },

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
