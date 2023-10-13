import { preventAutoHideAsync } from 'expo-splash-screen';
import { View, Text, ImageBackground, Image, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, isEmailVerified, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';


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
        primary: 'black', // Aqui você define a cor desejada para o rótulo
    },
};


export default function Login() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
    
                onAuthStateChanged(auth, (userAuth) => {
                    if (userAuth && userAuth.emailVerified) {
                        navigation.navigate('BottomTabs'); // Redireciona para a tela principal após o login
                    }
                });
            }
        };
    
        checkAuthentication();
    }, []);

    const handleLogin = async () => {
        try {
            if (!email || !senha) {
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                return;
            }
    
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            if ( user.uid === 'isWQePETZqPPT83Cy0bB5AwYXnw2') {
                // Redirecionar diretamente para a tela de validação de denúncias
                navigation.navigate('ValidarDenuncias');
                return;
            }
    
            if (user && user.emailVerified) {

                // Armazene informações do usuário no AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify(user));
    
    
                
                    navigation.navigate('BottomTabs'); // Mostra a tela normalmente após o primeiro login
                
            } else {
                Alert.alert('E-mail não verificado', 'Por favor, verifique seu e-mail antes de fazer login.');
            }
        } catch (error) {
            Alert.alert('Credenciais incorretas', 'E-mail ou senha incorretos. Verifique suas credenciais.');
        }
    };
    

    if (!fontsLoaded && !fontError) {
        return null;
    }

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