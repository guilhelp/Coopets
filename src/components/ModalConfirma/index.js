// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  Alert
} from 'react-native';

// Importando as variáveis do Firebase
import { auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Auth
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Importando os estilos
import { styles }from './styles';

const ConfirmationModal = ({
  visible,
  user, 
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    try {
        const user = auth.currentUser;
      const credentials = EmailAuthProvider.credential(user.email, password);

      // Reautenticação com o email e senha fornecidos
      await reauthenticateWithCredential(user, credentials);

      // A reautenticação foi bem-sucedida, agora podemos confirmar a ação
      onConfirm();
      setPassword('');
    } catch (error) {
      Alert.alert('Senha incorreta. Tente novamente.');
      
    }
  };

  const handleClose = () => {
    setPassword(''); // Limpar o campo de senha
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
          <Text style={styles.modalText}>
            Digite sua senha para confirmar a exclusão da conta:
          </Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
