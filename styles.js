import { StyleSheet } from 'react-native';

// Stil ayarları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
    paddingBottom: 10,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    color: '#6200ee',
    fontSize: 26,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 10,
    paddingBottom: 0,
  },
  inputLabel: {
    marginTop: 8,
    marginBottom: 4,
    fontSize: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 15,
  },
  textArea: {
    textAlignVertical: 'top',
    height: 70,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f6f6fa',
    alignItems: 'flex-start',
  },
  addButton: {
    backgroundColor: '#6200ee',
    borderRadius: 6,
    padding: 14,
  },
  list: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 0,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 0,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  appointmentDate: {
    color: '#666',
    marginBottom: 3,
    fontSize: 14,
  },
  appointmentDescription: {
    color: '#666',
    fontSize: 13,
  },
  deleteButton: {
    padding: 8,
  },
  pastAppointment: {
    backgroundColor: '#f8f8f8',
    opacity: 0.8,
  },
  pastAppointmentText: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
    fontSize: 13,
  },
});

export default styles; 