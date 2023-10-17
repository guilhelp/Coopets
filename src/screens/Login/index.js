// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';

// Importando configurações da splash screen
import { preventAutoHideAsync } from 'expo-splash-screen';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando as variáveis do Firebase
import { auth, db } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    collection,
    doc,
    query,
    where,
    getDocs,
    deleteDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

// Auth
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';

// Importando o Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importando os estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importandos os ícones
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

// Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Evita que a tela de abertura seja automaticamente ocultada
preventAutoHideAsync();

// Importanto imagens
import Background from '../../assets/Background/Background.png'
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';

// Importanto componentes
import Input from '../../components/Input';


// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};


export default function Login() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Estados de login
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Lógica para autenticar automaticamente um usuário
    useEffect(() => {
        // Verifique se há dados de usuário no AsyncStorage
        const checkAuthentication = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);

                if (user && user.uid === 'isWQePETZqPPT83Cy0bB5AwYXnw2') {
                    // O usuário é 'isWQePETZqPPT83Cy0bB5AwYXnw2', então não faça nada
                    return;
                }

                // Verificar se a conta está bloqueada
                const responsavelDocRef = doc(db, 'responsaveis', user.uid);
                const responsavelDocSnap = await getDoc(responsavelDocRef);

                if (responsavelDocSnap.exists()) {
                    const responsavelData = responsavelDocSnap.data();


                    // Obtém a referência para o documento do pet
                    const petRef = responsavelData.petID;
                    const petDocSnap = await getDoc(petRef);

                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();

                        if (petData.bloqueado) {
                            const dataDesbloqueio = new Date(petData.dataDesbloqueio.toDate());
                            const dataAtual = new Date();

                            if (dataAtual < dataDesbloqueio) {
                                // Pet bloqueado. Mostrar a data de desbloqueio e não permitir o login.
                                Alert.alert('Pet Bloqueado', `Seu pet está bloqueado até ${dataDesbloqueio.toLocaleString()}.`, [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Redirecione para a tela de login ou execute a ação apropriada, por exemplo:
                                        },
                                    },
                                ]);
                                return;
                            }
                        }
                    }
                }

                onAuthStateChanged(auth, (userAuth) => {
                    if (userAuth && userAuth.emailVerified) {
                        navigation.navigate('BottomTabs'); // Redireciona para a tela principal após o login
                    }
                });
            }
        };

        checkAuthentication();
    }, []);

    // Lógica para logar 
    const handleLogin = async () => {
        try {


            // Verifica se todos os campos foram preenchidos
            if (!email || !senha) {
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                return;
            }

            // Autentica um usuário
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Verifica se o usuário não é o isWQePETZqPPT83Cy0bB5AwYXnw2
            if (user.uid === 'isWQePETZqPPT83Cy0bB5AwYXnw2') {

                // Redirecionar diretamente para a tela de validação de denúncias
                navigation.navigate('ValidarDenuncias');
                return;
            }

            // Verifica se o usuário tem o email verificado
            if (user && user.emailVerified) {

                // Verificar se a conta está bloqueada
                const responsavelDocRef = doc(db, 'responsaveis', user.uid);
                const responsavelDocSnap = await getDoc(responsavelDocRef);

                if (responsavelDocSnap.exists()) {
                    const responsavelData = responsavelDocSnap.data();


                    // Obtém a referência para o documento do pet
                    const petRef = responsavelData.petID;
                    const petDocSnap = await getDoc(petRef);

                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();

                        if (petData.bloqueado) {
                            const dataDesbloqueio = new Date(petData.dataDesbloqueio.toDate());
                            const dataAtual = new Date();

                            if (dataAtual < dataDesbloqueio) {
                                // Pet bloqueado. Mostrar a data de desbloqueio e não permitir o login.
                                Alert.alert('Pet Bloqueado', `Seu pet está bloqueado até ${dataDesbloqueio.toLocaleString()}.`)
                                
                                return;

                            }
                        }
                    }
                }

                // Armazena as informações do usuário no AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify(user));

                // Verifica se é a primeira vez do usuário logando
                const isFirstLogin = user.metadata.creationTime === user.metadata.lastSignInTime;

                // Se for a primeira vez do usuário logando
                if (isFirstLogin) {
                    navigation.navigate('Filtros'); // Mostra a tela de filtros na primeira vez
                } else {
                    navigation.navigate('BottomTabs'); // Mostra a tela normalmente após o primeiro login
                }

            } else {
                Alert.alert('E-mail não verificado', 'Por favor, verifique seu e-mail antes de fazer login.'); // Se o email não estiver verificado
            }
        } catch (error) {
            Alert.alert('Credenciais incorretas', 'E-mail ou senha incorretos. Verifique suas credenciais.'); // Caso as informações estejam incorretas
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView>

                        {/* Container para imagem de logo e texto do COOPETS */}
                        <View style={styles.logoContainer}>

                            <Image source={LogoBranca} style={styles.imagemLogo} />
                            <Text style={styles.textLogo}>COOPETS</Text>

                        </View>

                        <Text style={styles.entrarText}>ENTRAR</Text>

                        {/* Container para os inputs */}

                        <View style={styles.inputContainer}>

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

                            <TouchableOpacity style={styles.botaoEnviar} onPress={handleLogin}>
                                <Text style={styles.botaoEnviarText}>ENTRAR</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.botoesContainer}>

                            <TouchableOpacity style={styles.botaoCadastro} onPress={() => { navigation.navigate('CadastrarResponsavel'); }}>
                                <FontAwesome name="user-circle" size={25} color="black" />
                                <Text style={styles.cadastroText}>Criar Conta</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botaoEsqueciSenha} onPress={() => { navigation.navigate('EsqueceuSenha'); }}>
                                <MaterialCommunityIcons name="email" size={25} color="black" />
                                <Text style={styles.esqueciSenhaText}>Esqueci Senha</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>

    );
}