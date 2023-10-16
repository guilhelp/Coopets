// Importando o React
import React from 'react';

// Importando os componentes do React
import { 
  View, 
  TouchableOpacity, 
  Text 
} from 'react-native';

// Importando o modal do react-native-modal
import Modal from 'react-native-modal';

// Importando os estilos
import { styles } from './styles';

export default function ChatOptionsMenu({ onDesfazerMatchPress, isVisible, onClose }) {
  return (
    // Componente Modal que exibe opções de menu para um chat
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        {/* Opção para desfazer um "match" (Petch) */}
        <TouchableOpacity onPress={onDesfazerMatchPress} style={styles.optionItem}>
          <Text style={styles.optionText}>Desfazer Petch</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
