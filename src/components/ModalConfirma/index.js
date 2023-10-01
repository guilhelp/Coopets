import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import styles from './styles';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../config/Firebase';

const ConfirmationModal = ({
  visible,
  user, // O usuário autenticado do Firebase
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
    } catch (error) {
      setError('Senha incorreta. Tente novamente.');
      console.error('Erro de reautenticação:', error);
    }
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
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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
