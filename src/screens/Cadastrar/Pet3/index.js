// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator
} from 'react-native';

// Importando os componentes do react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';

// Importando as variáveis do Firebase
import { db, storage, auth } from '../../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    addDoc,
    collection,
    doc,
    setDoc,
    updateDoc
} from 'firebase/firestore';

// Storage
import {
    ref,
    getDownloadURL,
    uploadBytesResumable
} from 'firebase/storage';

// Auth
import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importando ícones
import Icon from 'react-native-vector-icons/FontAwesome';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';
import * as ImagePicker from 'expo-image-picker';

// Importanto imagens
import Background from '../../../assets/Background/Background.png'
import LogoBranca from '../../../assets/Logo/Logo_FundoBranco.png';

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


export default function CadastrarPet3() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto


    const navigation = useNavigation(); // Variável de navegação
    const route = useRoute(); // Variável que envia parâmtros pelas rotas

    const { dadosResp, dadosPet1, dadosPet2 } = route.params; // Recebe os parâmetros

    // Armazena os dados do responsavel em variáveis
    const responsavelData = {
        email: dadosResp.email,
        cpf: dadosResp.cpf,
        rg: dadosResp.rg,
        nome: dadosResp.nome,
        dataNascimentoResp: dadosResp.dataNascimentoResp
    };

    // Estado que definirá quando a tela estará bloqueada ou não
    const [telaBloqueada, setTelaBloqueada] = useState(false);

    // Estado que define o momento de cadastro
    const [cadastrando, setCadastrando] = useState(false);

    // Estados que armazenam as informações obtidas
    const [perfilImage, setPerfilImage] = useState(null);
    const [bio, setBio] = useState('');

    // Função useEffect que solicita permissões do usuário para ter acesso aos arquivos do dispositivo
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);

    // Função que busca e seleciona a imagem capturada pelo ImagePicker do expo
    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite selecionar apenas imagens
            allowsEditing: true, // Permite ao usuário editar a imagem antes de selecioná-la
            aspect: [1, 1], // Define a proporção de aspecto da imagem
            quality: 1, // Define a qualidade da imagem (valor de 1 a 0)
        });

        // Verifica se o usuário não cancelou a seleção de imagem
        if (!result.canceled) {
            setPerfilImage(result.assets[0].uri);
        }
    };

    const cadastrarDados = async () => {
        try {

            // Verifica se as informações dos inputs da tela foram preenchidos
            if (!perfilImage || !bio) {
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
                return;
            }

            setCadastrando(true); // Inicia o indicador de carregamento
            setTelaBloqueada(true); // Bloqueia a tela

            // Cadastro do responsável no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, dadosResp.email, dadosResp.senha);
            const userId = userCredential.user.uid;

            // Cadastro do responsável na coleção "responsaveis"
            const responsaveisRef = collection(db, 'responsaveis');
            const responsavelDocRef = doc(responsaveisRef, userId);
            await setDoc(responsavelDocRef, responsavelData);

            // Cadastro do pet na coleção "pets"
            const petsRef = collection(db, 'pets');
            const petData = {
                ...dadosPet1,
                ...dadosPet2,
                perfilImage,
                bio,
                responsavelID: responsavelDocRef,
            };
            const petDocRef = await addDoc(petsRef, petData);

            // Upload e obtenção de URLs das imagens no Firebase Storage
            const storageRef = ref(storage, `imagens/${userId}/${petDocRef.id}`);

            // Upload da imagem de perfil para o Firebase Storage
            if (perfilImage) {
                const perfilImageUrl = await uploadImageToStorage(perfilImage, storageRef, 'perfilImage.jpg');
                petData.perfilImage = perfilImageUrl;
            }

            if (dadosPet2.imagem1) {
                const imagem1Url = await uploadImageToStorage(dadosPet2.imagem1, storageRef, 'pedigreeImage.jpg');
                petData.imagem1 = imagem1Url;
            }

            if (dadosPet2.imagem2) {
                const imagem2Url = await uploadImageToStorage(dadosPet2.imagem2, storageRef, 'vacinaImage.jpg');
                petData.imagem2 = imagem2Url;
            }

            // Criação da referência ao documento do pet
            const petRef = doc(collection(db, 'pets'), petDocRef.id);

            // Atualização do campo petID no documento responsável
            await updateDoc(responsavelDocRef, { petID: petRef });

            // Atualização dos campos de imagens no documento do pet
            await updateDoc(petDocRef, {
                perfilImage: petData.perfilImage,
                pedigree: petData.imagem1,
                vacina: petData.imagem2
            });

            // Envia uma email de verificação
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                console.log('E-mail de verificação enviado.');
            }

            // Mostra uma mensagem na tela e volta para a tela de Login
            Alert.alert(
                'Confirmação',
                'E-mail de verificação enviado.',
                [{
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Login'); // Navega para a tela de login
                    },
                }]
            );
        } catch (error) {
            console.error('Erro ao cadastrar dados:', error);
        } finally {
            setTelaBloqueada(false); // Desbloqueia a tela
            setCadastrando(false); // Finaliza o indicador de carregamento
        }
    };

    // Função para cadastrar as imagens no storage
    const uploadImageToStorage = async (imageUri, storageRef, imageName) => {
        console.log('o nome da imagem é', imageName);

        try {
            // Faz uma requisição para obter a imagem como um Blob
            const response = await axios.get(imageUri, {
                responseType: 'blob', // Define o responseType como 'blob' para obter um objeto Blob
            });

            // Obtém o Blob da resposta
            const blob = response.data;

            // Cria uma referência ao local de armazenamento da imagem no Firebase Storage
            const imageStorageRef = ref(storageRef, imageName);

            // Inicia uma tarefa de upload de bytes resumível para a referência
            const uploadTask = uploadBytesResumable(imageStorageRef, blob);

            // Retorna uma Promise que resolve quando o upload estiver completo
            return new Promise((resolve, reject) => {
                // Registra um ouvinte para o evento 'state_changed' da tarefa de upload
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.log('Erro ao fazer upload da imagem:', error);
                        reject(error); // Rejeita a Promise em caso de erro
                    },
                    async () => {
                        // Quando o upload estiver completo, obtém a URL de download da imagem
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadUrl); // Resolve a Promise com a URL de download
                    }
                );
            });
        } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
            throw error; // Lança o erro em caso de falha
        }
    };


    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="PET" iconName="pets" />
                {telaBloqueada && (
                    <View style={styles.loadingOverlay}>
                        <Image source={LogoBranca} style={styles.imagemLogo} />
                        <Text style={styles.carregando}>Carregando</Text>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                )}
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView style={styles.scrollContainer}>
                        <Text style={styles.inputText}>PERFIL</Text>
                        <View style={styles.inputContainer}>

                            {/* Input de imagem para o perfil */}
                            <Text style={styles.inputTitle}>FOTO DE PERFIL</Text>
                            <TouchableOpacity
                                style={styles.imageInput}
                                onPress={selectImage}
                            >
                                {perfilImage ? (
                                    <Image source={{ uri: perfilImage }} style={styles.selectedImage} />
                                ) : (
                                    <Icon name="plus-circle" size={80} color="black" />
                                )}
                            </TouchableOpacity>

                            <Input
                                label="Bio"
                                placeholder="Digite a biografia"
                                value={bio}
                                onChangeText={setBio}
                            />

                            <TouchableOpacity style={styles.botaoAvancar} onPress={cadastrarDados} disabled={cadastrando}>
                                {cadastrando ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={styles.botaoAvancarText}>Concluir</Text>
                                )}
                            </TouchableOpacity>

                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>

    );
}