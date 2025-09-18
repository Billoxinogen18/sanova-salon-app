import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Re-export colors for convenience
export { colors };

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.light,
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: colors.text.light,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingHorizontal: 20,
  },
  bottomNav: {
    backgroundColor: colors.primary,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: colors.background.primary,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.text.primary,
  },
  navLabelInactive: {
    color: colors.text.light,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statusBar: {
    height: 44,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  statusTime: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
