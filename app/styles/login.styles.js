import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#2544AD',
    paddingVertical: 40,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    marginTop: 30,
  },
  resumeText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  formContainer: {
    backgroundColor: '#E9F0F8',
    padding: 25,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#1E2937',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2544AD',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#2544AD',
    fontWeight: '600',
  },
});