import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingVertical: 35,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1E40AF',
  },
  headerText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#1E40AF',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});