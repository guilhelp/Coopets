import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
const DenunciaPopup = ({ visible, onClose, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption);
      Alert.alert('Denúncia enviada com sucesso!');
    } else {
      Alert.alert('Selecione um motivo de denúncia válido');
    }

    
  };

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
            optionText="Perfil com foto ou nome indevido"
            isSelected={selectedOption === 'Perfil com foto ou nome indevido'}
            style={styles.optionText}
          />
          <Option
            optionText="Perfil com foto de pedigree e/ou vacinação indevido"
            isSelected={selectedOption === 'Perfil com foto de pedigree e/ou vacinação indevido'}
          />
          <Option
            optionText="Perfil com nome ou algum dado abusivo"
            isSelected={selectedOption === 'Perfil com nome ou algum dado abusivo'}
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
