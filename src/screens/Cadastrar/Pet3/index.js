import { View, Text, ImageBackground, TouchableOpacity, Image, Alert, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage, auth } from '../../../config/Firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native';

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
        primary: 'black', // Aqui você define a cor desejada para o rótulo
    },
};


export default function CadastrarPet3() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const route = useRoute();
    const { dadosResp, dadosPet1, dadosPet2 } = route.params;

    const responsavelData = {
        email: dadosResp.email,
        cpf: dadosResp.cpf,
        rg: dadosResp.rg,
        nome: dadosResp.nome,
        dataNascimentoResp: dadosResp.dataNascimentoResp
    };

    const [telaBloqueada, setTelaBloqueada] = useState(false);
    const [cadastrando, setCadastrando] = useState(false);
    const [perfilImage, setPerfilImage] = useState(null);
    const [bio, setBio] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);

    const selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPerfilImage(result.assets[0].uri);
        }
    };

    const cadastrarDados = async () => {
        try {

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

            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                console.log('E-mail de verificação enviado.');
            }
            Alert.alert('Confirmação', 'E-mail de verificação enviado.');
            navigation.navigate('Login'); // Navega para a tela de login
        } catch (error) {
            console.error('Erro ao cadastrar dados:', error);
        } finally {
            setTelaBloqueada(false); // Desbloqueia a tela
            setCadastrando(false); // Finaliza o indicador de carregamento
        }
    };
    const uploadImageToStorage = async (imageUri, storageRef, imageName) => {
        console.log('o nome da imagem é', imageName);
        try {
            const response = await axios.get(imageUri, {
                responseType: 'blob', // Set the responseType to 'blob' to get a Blob object
            });

            const blob = response.data;
            const imageStorageRef = ref(storageRef, imageName);
            const uploadTask = uploadBytesResumable(imageStorageRef, blob);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.log('Erro ao fazer upload da imagem:', error);
                        reject(error);
                    },
                    async () => {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadUrl);
                    }
                );
            });
        } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

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