import { View, Text, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { differenceInYears, format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../config/Firebase';
import { fetchSignInMethodsForEmail } from '@firebase/auth';
import TermosDeUsoPopup from '../../../components/TermoDeUso';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../../assets/Background/Background.png'

// Importanto componentes
import Input from '../../../components/Input';
import Header from '../../../components/Header';

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
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cpf, setCPF] = useState('');
    const [rg, setRG] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [dataNascimentoResp, setDataNascimentoResp] = useState('');
    const [showTermosDeUso, setShowTermosDeUso] = useState(true);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    // Função para aceitar os termos de uso
    const handleAcceptTermosDeUso = () => {
        // Faça o que for necessário quando o usuário aceitar os termos de uso
        setShowTermosDeUso(false); // Feche o pop-up
    };

    const maxDate = new Date();

    const checkEmailExistence = async () => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods && methods.length > 0) {
                alert('Este email já está registrado em uma conta.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Erro ao verificar email:', error);
            return false;
        }
    };

    const checkFieldsAndNavigate = async () => {
        if (!nome || !email || !senha || !confirmarSenha || !cpf || !rg || !dataNascimentoResp) {
            alert('Por favor, preencha todos os campos antes de avançar.');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('A senha e a confirmação da senha não coincidem.');
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            alert('Digite um email válido.');
            return;
        }

        if (!(await checkEmailExistence())) {
            return;
        }

        const dadosResp = {
            nome,
            email,
            senha,
            confirmarSenha,
            cpf,
            rg,
            dataNascimentoResp: dataNascimentoResp.toISOString(),
        };

        navigation.navigate('CadastrarPet1', { dadosResp });
    }



    if (!fontsLoaded && !fontError) {
        return null;
    }

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
                                keyboardType="email-address" // Define o teclado apropriado para e-mail
                                autoCapitalize="none" // Desativa a autocapitalização
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
                                    const formattedCPF = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
                                    const formattedRG = text.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
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