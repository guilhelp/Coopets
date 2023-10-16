// Importando o React
import React from 'react';

// Importando os componentes do React
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';

// Importando os estilos
import { styles } from './styles';

const PasswordModal = ({
  visible, // Propriedade que controla a visibilidade do modal
  onDismiss, // Função para fechar o modal
  senhaAtual, // Estado que armazena a senha atual
  setSenhaAtual, // Função para atualizar o estado da senha atual
  confirmarAlteracoesPerfil, // Função para confirmar as alterações no perfil
}) => {
  return (
    // Componente de Modal que exibe um formulário para confirmar a senha atual
    <Modal
      transparent
      animationType="slide"
      visible={visible} // Define se o modal está visível ou não
      onRequestClose={onDismiss} // Função a ser chamada ao solicitar o fechamento do modal
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirme sua senha</Text>

          {/* Input de senha */}
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senhaAtual} // Valor do campo de senha obtido do estado
            onChangeText={(text) => setSenhaAtual(text)} // Função para atualizar o estado da senha atual com o texto digitado
            secureTextEntry // Define que o texto inserido deve ser ocultado (senha)
          />

          {/* Container para botões de ação */}
          <View style={styles.buttonsContainer}>
            {/* Botão "Confirmar" que chama a função confirmarAlteracoesPerfil ao ser pressionado */}
            <TouchableOpacity onPress={confirmarAlteracoesPerfil} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>

            {/* Botão "Cancelar" que chama a função onDismiss ao ser pressionado para fechar o modal */}
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
