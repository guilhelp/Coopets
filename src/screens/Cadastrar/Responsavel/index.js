// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';

// Importando o componente de DateTimePicker do react-native-modal-datetime-picker
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Importando as funções do date-fns
import { differenceInYears, format } from 'date-fns';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando as variáveis do Firebase
import { auth, db } from '../../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

// Auth
import { fetchSignInMethodsForEmail } from '@firebase/auth';

// Estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Expo
import { useFonts, LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importando imagens
import Background from '../../../assets/Background/Background.png';

// Importando componentes
import Input from '../../../components/Input';
import Header from '../../../components/Header';
import TermosDeUsoPopup from '../../../components/TermoDeUso';

// Configurando cores do react native paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',
  },
};

export default function CadastrarResponsavel() {
  let [fontsLoaded, fontError] = useFonts({
    LuckiestGuy_400Regular,
    Roboto_900Black,
  });

  const navigation = useNavigation();

  // Estados que armazenam as informações obtidas pelos inptus
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cpf, setCPF] = useState('');
  const [rg, setRG] = useState('');

  // Estado que armazena se o DatePicker está visivel ou não
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Estado que armazena a data de nascimento do responsável
  const [dataNascimentoResp, setDataNascimentoResp] = useState('');

  // Estado que armazena se o Termos de Uso está visivel ou não
  const [showTermosDeUso, setShowTermosDeUso] = useState(true);

  // Função para mostrar o DatePicker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Função para esconder o DatePicker
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Função para fechar os termos de uso quando clicar em fechar
  const handleAcceptTermosDeUso = () => {
    setShowTermosDeUso(false);
  };

  // Variável que armaezna a data atual
  const maxDate = new Date();

  // Função que verifica se o email já existe na base dados
  const checkEmailExistence = async () => {
    try {
      // Verifica se já existem métodos de autenticação associados a este e-mail no Firebase Authentication.
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods && methods.length > 0) {
        // Se métodos existirem, o e-mail já está registrado, então exibe um alerta.
        alert('Este email já está registrado em uma conta.');
        return false; // Retorna false para indicar que o e-mail não está disponível.
      }

      // Se nenhum método estiver associado ao e-mail, ele está disponível para cadastro.
      return true;
    } catch (error) {
      // Em caso de erro, registra-o no console e retorna false.
      console.error('Erro ao verificar email:', error);
      return false;
    }
  };

  const checkCpfRgExistence = async () => {
    try {
      // Consulta o Firestore para verificar se já existe algum documento com o mesmo CPF.
      const cpfQuery = await getDocs(
        query(collection(db, 'responsaveis'), where('cpf', '==', cpf))
      );

      // Consulta o Firestore para verificar se já existe algum documento com o mesmo RG.
      const rgQuery = await getDocs(
        query(collection(db, 'responsaveis'), where('rg', '==', rg))
      );

      if (!cpfQuery.empty || !rgQuery.empty) {
        // Se qualquer uma das consultas retornar resultados, CPF ou RG já estão associados a outra conta, então exibe um alerta.
        alert('CPF ou RG já estão associados a outra conta.');
        return false; // Retorna false para indicar que CPF ou RG não estão disponíveis.
      }

      // Se ambas as consultas não retornarem resultados, CPF e RG estão disponíveis para cadastro.
      return true;
    } catch (error) {
      // Em caso de erro, registra-o no console e retorna false.
      console.error('Erro ao verificar CPF e RG:', error);
      return false;
    }
  };

  // Função para validar um CPF
  function validarCPF(cpf) {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpfLimpo.length !== 11) {
      return false; // CPF inválido
    }

    // Validação do CPF
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
      return false; // CPF inválido
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
      return false; // CPF inválido
    }

    return true; // CPF válido
  }

  // Função para validar um RG
  function validarRG(rg) {
    // Remove caracteres não numéricos
    const rgLimpo = rg.replace(/\D/g, '');

    // Verifica se o RG tem 9 dígitos
    if (rgLimpo.length !== 9) {
      return false; // RG inválido
    }

    return true; // RG válido
  }

  // Função que valida diversos campos antes de avançar para a próxima tela
  const checkFieldsAndNavigate = async () => {

    // Verifica se todos os campos foram preenchidos
    if (
      !nome ||
      !email ||
      !senha ||
      !confirmarSenha ||
      !cpf ||
      !rg ||
      !dataNascimentoResp
    ) {
      alert('Por favor, preencha todos os campos antes de avançar.');
      return;
    }

    // Verifica se a senha tem mais de 6 dígitos
    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Verifica se a senha é igual a confirmação de senha
    if (senha !== confirmarSenha) {
      alert('A senha e a confirmação da senha não coincidem.');
      return;
    }

    // Verifica se é um email válido
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      alert('Digite um email válido.');
      return;
    }

    // Chama a função de verificação de email existente
    if (!(await checkEmailExistence())) {
      return;
    }

    // Chama a função de validar CPF
    if (!validarCPF(cpf)) {
      alert('CPF inválido. Verifique o formato do CPF.');
      return;
    }

    // Chama a função de validarRG
    if (!validarRG(rg)) {
      alert('RG inválido. Verifique o formato do RG.');
      return;
    }

    // Chama a função de verificar se o CPF e RG já existem na base de dados
    if (!(await checkCpfRgExistence())) {
      return;
    }

    // Variável que armazena os dados do responsável para ser enviado para a próxima tela
    const dadosResp = {
      nome,
      email,
      senha,
      confirmarSenha,
      cpf,
      rg,
      dataNascimentoResp: dataNascimentoResp.toISOString(),
    };

    // Envia os dados tanto do responsável quanto do pet obtidos para a tela de CadastrarPet2
    navigation.navigate('CadastrarPet1', { dadosResp });
  };

  if (!fontsLoaded && !fontError) {
    return null;
  } // Condição caso as fontes não carreguem

  return (
    <PaperProvider theme={theme}>
      <ImageBackground source={Background} style={styles.background}>
        <Header title="RESPONSÁVEL" iconName="supervised-user-circle" />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.inputText}>CADASTRAR</Text>

            <View style={styles.inputContainer}>
              <Input
                label="Nome"
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setNome}
              />

              <Input
                label="E-mail"
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Senha"
                placeholder="Digite sua senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />

              <Input
                label="Confirme a Senha"
                placeholder="Confirme sua senha"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />

              <Input
                label="CPF"
                placeholder="Digite seu CPF"
                value={cpf}
                onChangeText={(text) => {
                  const formattedCPF = text.replace(
                    /(\d{3})(\d{3})(\d{3})(\d{2})/,
                    '$1.$2.$3-$4'
                  );
                  setCPF(formattedCPF);
                }}
                keyboardType="numeric"
                maxLength={14}
              />

              <Input
                label="RG"
                placeholder="Digite seu RG"
                value={rg}
                onChangeText={(text) => {
                  const formattedRG = text.replace(
                    /(\d{2})(\d{3})(\d{3})(\d{1})/,
                    '$1.$2.$3-$4'
                  );
                  setRG(formattedRG);
                }}
                keyboardType="numeric"
                maxLength={12}
              />

              <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>
                  {dataNascimentoResp ? format(dataNascimentoResp, 'dd/MM/yyyy') : 'Data de Nascimento'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  const selectedDate = new Date(date);
                  const today = new Date();
                  const age = differenceInYears(today, selectedDate);

                  if (age >= 18) {
                    setDatePickerVisible(false);
                    setDataNascimentoResp(selectedDate);
                  } else {
                    alert('Você deve ter pelo menos 18 anos.');
                    setDatePickerVisible(false);
                  }
                }}
                onCancel={hideDatePicker}
                maximumDate={maxDate}
              />

              <TouchableOpacity
                style={styles.botaoAvancar}
                onPress={checkFieldsAndNavigate}
              >
                <Text style={styles.botaoAvancarText}>Avançar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
      {/* Renderize o pop-up de termos de uso se showTermosDeUso for verdadeiro */}
      {showTermosDeUso && (
        <TermosDeUsoPopup visible={showTermosDeUso} onAccept={handleAcceptTermosDeUso} />
      )}
    </PaperProvider>
  );
}
