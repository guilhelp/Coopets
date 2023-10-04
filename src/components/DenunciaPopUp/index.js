import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const DenunciaPopup = ({ visible, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <Text style={styles.title}>Denunciar</Text>
          <Text>Selecione a opção de denúncia:</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Opção 1')}
          >
            <Text>Opção 1</Text>
            {selectedOption === 'Opção 1' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Opção 2')}
          >
            <Text>Opção 2</Text>
            {selectedOption === 'Opção 2' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Opção 3')}
          >
            <Text>Opção 3</Text>
            {selectedOption === 'Opção 3' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitButton}>Enviar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 70,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default DenunciaPopup;
