import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    backgroundColor: '#F1F5F9',
    width: '90%',
    maxWidth: 380,
    borderRadius: 20,
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 19,
    color: '#334155',
    marginVertical: 8,
    fontWeight: '500',
  },
});