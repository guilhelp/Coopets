import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const DenunciaPopup = ({ visible, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    // Verifique se uma opção foi selecionada antes de chamar onSubmit
    if (selectedOption !== null) {
      onSubmit(selectedOption);
    } else {
      // Se nenhum motivo for selecionado, você pode exibir uma mensagem de erro ou tomar outra ação apropriada.
      console.error('Selecione um motivo de denúncia válido');
    }

    // Feche o popup após o envio (independentemente de uma opção ser selecionada ou não)
    onClose();
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
            onPress={() => handleOptionChange('Perfil com foto ou nome indevido')}
          >
            <Text>Perfil com foto ou nome indevido</Text>
            {selectedOption === 'Perfil com foto ou nome indevido' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Perfil com foto de pedigree e/ou vacinação indevido')}
          >
            <Text>Perfil com foto de pedigree e/ou vacinação indevido</Text>
            {selectedOption === 'Perfil com foto de pedigree e/ou vacinação indevido' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Perfil com nome ou algum dado abusivo')}
          >
            <Text>Perfil com nome ou algum dado abusivo</Text>
            {selectedOption === 'Perfil com nome ou algum dado abusivo' && (
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
