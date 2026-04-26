import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingVertical: 25,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  titleContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E2937',
  },
  textDetectedContainer: {
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1E40AF',
  },
  textDetectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2937',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  buttons: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginTop: 12,
    gap: 12,
  },
  button: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
    button1: {
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2937',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 8,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E2937',
  },
});