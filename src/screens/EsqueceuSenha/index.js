import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { auth } from '../../config/Firebase';
import Header from '../../components/Header';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import Background from '../../assets/Background/Background.png'
import Input from '../../components/Input';

// Estilos
import styles from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Expo
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
    });

    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (email.trim() === '') {
            Alert.alert('Erro', 'Por favor, digite um email válido.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Sucesso',
                'Um email com instruções para redefinir sua senha foi enviado para o seu endereço de email.'
            );
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao enviar o email de redefinição de senha. Por favor, tente novamente mais tarde.'
            );
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="SENHA" iconName="mode-edit" />
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView>
                        <View style={styles.textoContainer}>
                            <Text style={styles.textInfo}>Digite seu Email para ser enviado um código de recuperação:</Text>
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
