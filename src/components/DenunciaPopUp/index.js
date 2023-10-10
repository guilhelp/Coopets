import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import styles from './styles';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Componente DenunciaPopup que exibe um modal de denúncia
const DenunciaPopup = ({ visible, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Função para lidar com a mudança de opção de denúncia
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Função para lidar com o envio da denúncia
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
          <Text style={styles.title}>DENUNCIAR</Text>
          <Text style={styles.optionSubTitleText}>Selecione a opção de denúncia:</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Perfil com foto ou nome indevido')}
          >
            <Text style={styles.optionText}>Perfil com foto ou nome indevido</Text>
            {selectedOption === 'Perfil com foto ou nome indevido' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Perfil com foto de pedigree e/ou vacinação indevido')}
          >
            <Text style={styles.optionText}>Perfil com foto de pedigree e/ou vacinação indevido</Text>
            {selectedOption === 'Perfil com foto de pedigree e/ou vacinação indevido' && (
              <Text>Selecionado</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionChange('Perfil com nome ou algum dado abusivo')}
          >
            <Text style={styles.optionText}>Perfil com nome ou algum dado abusivo</Text>
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

export default DenunciaPopup;
