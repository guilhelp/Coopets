import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Configurando o modal de senha
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginRight: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});