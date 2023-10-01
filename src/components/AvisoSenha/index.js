import React from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './styles'; // Certifique-se de criar estilos adequados

const PasswordModal = ({
  visible,
  onDismiss,
  senhaAtual,
  setSenhaAtual,
  confirmarAlteracoesPerfil,
}) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirme sua senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senhaAtual}
            onChangeText={(text) => setSenhaAtual(text)}
            secureTextEntry
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={confirmarAlteracoesPerfil} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDismiss} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordModal;