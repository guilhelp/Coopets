// Importando o React
import React, { useState } from 'react';

// Importando os componentes do React
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground, 
    Alert, 
    KeyboardAvoidingView, 
    ScrollView 
} from 'react-native';

// Importando as variáveis do Firebase
import { auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Auth
import { sendPasswordResetEmail } from "firebase/auth";

// Importando componentes
import Header from '../../components/Header';
import Input from '../../components/Input';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando imagens
import Background from '../../assets/Background/Background.png'

// Importando os estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importando fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function EsqueceuSenha() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Estado de email
    const [email, setEmail] = useState('');

    // Lógica para enviar um email de redefinição de senha
    const handleResetPassword = async () => {

        // Verifica se o campo é válido
        if (email.trim() === '') {
            Alert.alert('Erro', 'Por favor, digite um email válido.');
            return;
        }

        try {
            // Envia um email para redefinir a senha
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Sucesso',
                'Um email com instruções para redefinir sua senha foi enviado para o seu endereço de email.'
            );
            navigation.navigate('Login'); // Navega de volta para a tela de login
        } catch (error) {
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao enviar o email de redefinição de senha. Por favor, tente novamente mais tarde.'
            ); // Caso de errado
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="SENHA" iconName="lock" />
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView>
                        <View style={styles.textoContainer}>
                            <Text style={styles.textInfo}>Digite seu e-mail para ser enviado um código de recuperação:</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Input
                                label="E-mail"
                                placeholder="Digite seu email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address" // Define o teclado apropriado para e-mail
                                autoCapitalize="none" // Desativa a autocapitalização
                            />
                            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                                <Text style={styles.buttonText}>Enviar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                navigation.navigate('Login');
                            }}>
                                <Text style={styles.buttonText}>Voltar</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>
    );
}
