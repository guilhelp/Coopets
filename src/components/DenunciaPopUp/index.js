// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';

// Importando os estilos
import { styles } from './styles';


// Componente funcional para um pop-up de denúncia
const DenunciaPopup = ({ visible, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Função para lidar com a alteração de opção selecionada
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Função para lidar com o envio da denúncia
  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption); // Chama a função de envio da denúncia com a opção selecionada
      Alert.alert('Denúncia enviada com sucesso!');
    } else {
      Alert.alert('Selecione um motivo de denúncia válido');
    }
  };

  // Componente de opção que pode ser selecionado
  const Option = ({ optionText, isSelected }) => {
    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && styles.selectedOption, // Aplica estilo quando selecionado
        ]}
        onPress={() => handleOptionChange(optionText)}
      >
        <View
          style={[
            styles.optionSquare,
            isSelected && styles.selectedOptionSquare, // Quadrado branco quando selecionado
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="black" />
          )}
        </View>
        <Text style={styles.optionText}>{optionText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <View style={styles.topo}>
            <Text style={styles.title}>DENUNCIAR</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={40} color="white" style={styles.closeButtonIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.optionSubTitleText}>Selecione a opção de denúncia:</Text>
          <Option
            optionText="Perfil com foto de perfil indevida"
            isSelected={selectedOption === 'Perfil com foto de perfil indevida'}
            style={styles.optionText}
          />
          <Option
            optionText="Perfil com foto de pedigree e/ou vacinação indevido(s)"
            isSelected={selectedOption === 'Perfil com foto de pedigree e/ou vacinação indevido(s)'}
          />
          <Option
            optionText="Perfil com algum dado abusivo"
            isSelected={selectedOption === 'Perfil com algum dado abusivo'}
          />
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DenunciaPopup;
