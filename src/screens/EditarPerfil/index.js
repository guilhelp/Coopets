import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, ScrollView, ActivityIndicator, Image, StyleSheet, KeyboardAvoidingView, Button } from 'react-native';
import { auth, db, storage } from '../../config/Firebase';
import { fetchSignInMethodsForEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable, uploadBytes, deleteObject } from '@firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { updateEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
// Importando as funções do date-fns
import { format, isAfter, isBefore } from 'date-fns';

// Estilos
import styles from './styles';
import { DefaultTheme, Provider as PaperProvider, Modal } from 'react-native-paper';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';

// Importanto componentes
import Input from '../../components/Input';
import Header from '../../components/Header';
import PasswordModal from '../../components/AvisoSenha';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black', // Aqui você define a cor desejada para o rótulo
    },
};


export default function EditarPerfil() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });
    const navigation = useNavigation();

    // Responsável
    const [userNome, setUserNome] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userCPF, setUserCPF] = useState('');
    const [userRG, setUserRG] = useState('');
    const [dataNascimentoResp, setDataNascimentoResp] = useState('');
    const [loadingVisible, setLoadingVisible] = useState(false);


    // Pet
    const [petId, setPetId] = useState('');
    const [nomePet, setNomePet] = useState('');
    const [sexo, setSexo] = useState('');
    const [tipoPet, setTipoPet] = useState('');
    const [racaPet, setRacaPet] = useState('');
    const [cor, setCor] = useState('');
    const [dataNascimentoPet, setDataNascimentoPet] = useState('');
    const [isDatePickerVisiblePet, setDatePickerVisiblePet] = useState(false);
    const [isDatePickerVisibleResp, setDatePickerVisibleResp] = useState(false);
    const [pedigreeImage, setPedigreeImage] = useState(null);
    const [vacinaCardImage, setVacinaCardImage] = useState(null);
    const [perfilImage, setPerfilImage] = useState(null);
    const [bio, setBio] = useState('');
    const [cep, setCep] = useState('');
    const [petData, setPetData] = useState({});
    const [senhaAtual, setSenhaAtual] = useState('');
    const [emailAlterado, setEmailAlterado] = useState(false);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);


    const [newPerfilImage, setNewPerfilImage] = useState(null); // Estado para a nova imagem de perfil
    const [newPedigreeImage, setNewPedigreeImage] = useState(null); // Estado para a nova imagem de pedigree
    const [newVacinaCardImage, setNewVacinaCardImage] = useState(null); // Estado para a nova imagem de carteira de vacinação

    const selectImage = async (type) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('A permissão para acessar a biblioteca de mídia é necessária!');
            return;
        }

        if (Platform.OS === 'ios') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus !== 'granted') {
                alert('A permissão para acessar a câmera é necessária!');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;

            if (type === 'perfilImage') {
                setNewPerfilImage(selectedImageUri);
            } else if (type === 'pedigree') {
                setNewPedigreeImage(selectedImageUri);
            } else if (type === 'vacinaCard') {
                setNewVacinaCardImage(selectedImageUri);
            }
        }
    };

    const uploadImageToStorage = async (imageUri, imageName) => {
        try {
            const user = auth.currentUser.uid;
            console.log('O user é', user)
            // Verificar se a imagem anterior existe no Storage e excluir, se necessário
            const storageRef = ref(storage, `imagens/${user}/${petId}/${imageName}`);

            try {
                await deleteObject(storageRef);
                console.log('Imagem anterior excluída com sucesso:', imageName);
            } catch (error) {
                if (error.code !== 'storage/object-not-found') {
                    // Se o erro não for "object-not-found", algo deu errado
                    console.log('Erro ao excluir imagem anterior:', error);
                    throw error;
                }
                console.log('Imagem anterior não encontrada:', imageName);
            }

            // Restante do código de upload da nova imagem...
            // (o código abaixo permanece o mesmo)

            const response = await axios.get(imageUri, {
                responseType: 'blob',
            });

            const blob = response.data;
            const uploadTask = uploadBytesResumable(storageRef, blob);

            const snapshot = await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,
                    (error) => {
                        console.log('Erro ao fazer upload da imagem:', error);
                        reject(error);
                    },
                    () => {
                        resolve(uploadTask.snapshot);
                    }
                );
            });

            const downloadUrl = await getDownloadURL(snapshot.ref);
            console.log('URL da imagem:', downloadUrl);

            return downloadUrl;
        } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    };


    const loadPetData = async () => {
        try {
            setLoadingVisible(true);
            console.log("Iniciando a carga de dados do pet...");

            const user = auth.currentUser;
            const responsavelId = user ? user.uid : null;

            console.log("Responsável ID:", responsavelId);

            // Consulte os pets filtrando pelo responsável associado a eles
            const petsRef = collection(db, 'pets');
            const querySnapshot = await getDocs(query(petsRef, where('responsavelID', '==', doc(db, 'responsaveis', responsavelId))));

            if (!querySnapshot.empty) {
                // Supondo que cada responsável tenha apenas um pet associado
                const petDocSnap = querySnapshot.docs[0];
                const petData = petDocSnap.data();

                console.log("Dados do pet:", petData);

                setPetData(petData);
                // Preencha os campos com as informações do pet
                setPetId(petDocSnap.id);
                setNomePet(petData.nomePet);
                setSexo(petData.sexo);
                setTipoPet(petData.tipo);
                setRacaPet(petData.raca);
                setCor(petData.cor);
                setDataNascimentoPet(petData.dataNascimentoPet);
                setBio(petData.bio);
                setCep(petData.cep)
                updateRacaOptions(petData.tipo);

                // Verifique se as URLs das imagens existem antes de tentar carregá-las
                if (petData.pedigree) {
                    try {
                        const pedigreeUrl = await getDownloadURL(ref(storage, petData.pedigree));
                        setPedigreeImage(pedigreeUrl);
                    } catch (error) {
                        console.error('Erro ao carregar imagem do pedigree:', error);
                    }
                }

                if (petData.vacina) {
                    try {
                        const vaccinationUrl = await getDownloadURL(ref(storage, petData.vacina));
                        setVacinaCardImage(vaccinationUrl);
                    } catch (error) {
                        console.error('Erro ao carregar imagem da vacinação:', error);
                    }
                }

                if (petData.perfilImage) {
                    try {
                        const profileUrl = await getDownloadURL(ref(storage, petData.perfilImage));
                        setPerfilImage(profileUrl);
                    } catch (error) {
                        console.error('Erro ao carregar imagem do perfil:', error);
                    }
                }

                if (racaOptions.length > 0) {
                    // Renderize o SelectDropdown aqui ou dispare a exibição em outra função.
                }

            } else {
                console.log('Pet não encontrado para o responsável logado.');
                alert('Pet não encontrado para o responsável logado.');
            }
            setLoadingVisible(false);
        } catch (error) {
            console.error('Erro ao carregar os dados do pet:', error);
            alert('Ocorreu um erro ao carregar os dados do pet.');
            setLoadingVisible(false);
        }
    };

    // Lógica para adicionar uma idade máxima para o pet
    const limiteIdade = new Date();
    limiteIdade.setFullYear(limiteIdade.getFullYear() - 40);

    // Lógica para adicionar uma idade mínima para o pet
    const minIdade = new Date();
    minIdade.setFullYear(minIdade.getFullYear() - 2);

    // Lógica para adicionar uma idade mínima para o pet
    const minIdadeResp = new Date();
    minIdadeResp.setFullYear(minIdadeResp.getFullYear() - 18);

    const validarCep = async () => {
        try {
            if (!cep) {
                alert('Digite um CEP válido antes de salvar as alterações.');
                return false; // Retorna falso se o CEP estiver em branco
            }

            const formattedCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos do CEP
            const response = await axios.get(`https://viacep.com.br/ws/${encodeURIComponent(formattedCep)}/json/`);
            const data = response.data;

            if (data.erro) {
                alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                return false; // Retorna falso se o CEP não for encontrado
            }

            return true; // Retorna verdadeiro se o CEP for válido
        } catch (error) {

            alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
            return false; // Retorna falso em caso de erro
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Se o usuário estiver logado, busque os dados do usuário no banco de dados
                const userProfileRef = doc(db, 'responsaveis', user.uid);
                const userProfileSnapshot = await getDoc(userProfileRef);

                if (userProfileSnapshot.exists()) {
                    // Se o documento do usuário existir, atualize os estados com as informações do usuário
                    const userData = userProfileSnapshot.data();
                    setUserNome(userData.nome);
                    setUserEmail(userData.email);
                    setUserCPF(userData.cpf);
                    setUserRG(userData.rg);
                    setDataNascimentoResp(userData.dataNascimentoResp)
                } else {
                    console.log('Documento do usuário não encontrado no banco de dados');
                }
            } else {
                console.log('Usuário não está logado');
            }
        });

        console.log("Chamando loadPetData...");
        loadPetData();
        // Retorne a função de limpeza do useEffect
        return unsubscribe;
    }, []);

    const checkEmailExists = async (email) => {
        try {
            const providers = await fetchSignInMethodsForEmail(auth, email);
            return providers.length > 0;
        } catch (error) {
            console.log('Erro ao verificar e-mail:', error);
            return false;
        }
    };

    const sexoOptions = ['Macho', 'Fêmea'];
    const [racaOptions, setRacaOptions] = useState([])

    const updateRacaOptions = (selectedTipo) => {

        if (selectedTipo === 'Cão') {
            const optionsCao = ['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']
            setRacaOptions(optionsCao)
            console.log(racaOptions)
        } else if (selectedTipo === 'Gato') {
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]); // Se nenhum tipo estiver selecionado, não há opções de raça]

        }
    };


    const showDatePickerPet = () => {
        setDatePickerVisiblePet(true);
    };

    const showDatePickerResp = () => {
        setDatePickerVisibleResp(true);
    };

    const hideDatePickerPet = () => {
        setDatePickerVisiblePet(false);
    };

    const hideDatePickerResp = () => {
        setDatePickerVisibleResp(false);
    };

    const handleConfirmPet = (date) => {
        hideDatePickerPet();
        const formattedDate = format(date, 'yyyy-MM-dd'); // Formate a data como desejar
        setDataNascimentoPet(formattedDate); // Atualize dataNascimentoPet com a data formatada

    };

    const handleConfirmResp = (date) => {
        hideDatePickerResp();
        const formattedDate = format(date, 'yyyy-MM-dd'); // Formate a data como desejar

        setDataNascimentoResp(formattedDate);
    };

    const checkCpfRgExistence = async () => {
        try {
            // Consulta o Firestore para verificar se já existe algum documento com o mesmo CPF.
            const cpfQuery = await getDocs(
                query(collection(db, 'responsaveis'), where('cpf', '==', userCPF))
            );

            // Consulta o Firestore para verificar se já existe algum documento com o mesmo RG.
            const rgQuery = await getDocs(
                query(collection(db, 'responsaveis'), where('rg', '==', userRG))
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

    const maxDate = new Date(); // Data atual

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);

    const editarPerfil = async () => {
        try {
            setLoadingVisible(true);

            if (!userNome || !userEmail || !userCPF || !userRG || !dataNascimentoResp || !nomePet || !sexo || !tipoPet || !racaPet || !cor || !dataNascimentoPet || !cep) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                setLoadingVisible(false);
                return;
            }

            // Validar se é um email válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userEmail)) {
                alert('Por favor, insira um email válido');
                setLoadingVisible(false);
                return;
            }

            // Armazena a Data de Nascimento do pet
            const dataNascimentoPetDate = new Date(dataNascimentoPet);

            // Verifica se a idade do pet é superior a 40 anos
            if (isBefore(dataNascimentoPetDate, limiteIdade)) {
                setLoadingVisible(false);
                alert('A idade do pet não pode ser superior a 40 anos.');
                return;
            }

            // Verifica se a idade do pet é inferior a 2 anos
            if (isAfter(dataNascimentoPetDate, minIdade)) {
                setLoadingVisible(false);
                alert('A idade do pet deve ser superior a 2 anos.');
                return;
            }

            const dataNascimentoRespDate = new Date(dataNascimentoResp);

            // Verifica se a idade do responsável é superior a 18 anos 
            if (isAfter(dataNascimentoRespDate, minIdadeResp)) {
                setLoadingVisible(false);
                alert('O responsável deve ser maior de 18 anos.');
                return;
            }


            // Validar se o CEP existe
            const cepValido = await validarCep();

            if (!cepValido) {
                setLoadingVisible(false);
                return; // Retorna se o CEP não for válido
            }

            // Chama a função de validar CPF
            if (!validarCPF(userCPF)) {
                setLoadingVisible(false);
                alert('CPF inválido. Verifique o formato do CPF.');
                return;
            }

            // Chama a função de validarRG
            if (!validarRG(userRG)) {
                setLoadingVisible(false);
                alert('RG inválido. Verifique o formato do RG.');
                return;
            }

            // Consultar o Firestore para obter os dados do usuário com base no ID do usuário atual
            const userDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const dadosAtuaisDoUsuario = userDoc.data();

                // Verificar se CPF e RG foram alterados e precisam ser validados
                const oldCpf = dadosAtuaisDoUsuario.cpf;
                const oldRg = dadosAtuaisDoUsuario.rg;

                if (userCPF !== oldCpf || userRG !== oldRg) {
                    // Chama a função de verificar se o CPF e RG já existem na base de dados
                    if (!(await checkCpfRgExistence())) {
                        setLoadingVisible(false);
                        return;
                    }
                }
            }

            // Verificar se o email foi alterado
            const oldEmail = auth.currentUser.email;
            if (userEmail !== oldEmail) {
                // Verificar se o novo email já existe no banco de dados
                const emailExists = await checkEmailExists(userEmail);
                if (emailExists) {
                    alert('O email já está em uso');
                    setLoadingVisible(false);
                    return;
                }

                // Exiba o aviso de senha apenas se o email for alterado
                if (emailAlterado) {

                    setPasswordModalVisible(true); // Mostre o modal de senha
                    setLoadingVisible(false);
                    return;
                }
                try {
                    // Reautentique o usuário com a senha atual
                    const user = auth.currentUser;
                    const credential = EmailAuthProvider.credential(oldEmail, senhaAtual);
                    await reauthenticateWithCredential(user, credential);

                    // Se a reautenticação for bem-sucedida, atualize o email
                    await updateEmail(user, userEmail);
                    setPasswordModalVisible(false);
                } catch (reauthError) {
                    alert('Senha atual incorreta. As alterações de email não foram feitas.');
                    setLoadingVisible(false);
                    return;
                }
            }


            // Atualize as imagens apenas se novas imagens foram selecionadas
            if (newPerfilImage || newPedigreeImage || newVacinaCardImage) {
                const updatedPetData = {}; // Um objeto para armazenar os dados atualizados do pet

                // Verifique e atualize a imagem de perfil, se necessário
                if (newPerfilImage && newPerfilImage !== perfilImage) {
                    const perfilImageName = `perfilImage.jpg`;
                    const perfilImageUrl = await uploadImageToStorage(newPerfilImage, perfilImageName);
                    updatedPetData.perfilImage = perfilImageUrl;
                }

                // Verifique e atualize a imagem de pedigree, se necessário
                if (newPedigreeImage && newPedigreeImage !== pedigreeImage) {
                    const pedigreeImageName = `pedigreeImage.jpg`;
                    const pedigreeImageUrl = await uploadImageToStorage(newPedigreeImage, pedigreeImageName);
                    updatedPetData.pedigree = pedigreeImageUrl;
                }

                // Verifique e atualize a imagem da carteira de vacinação, se necessário
                if (newVacinaCardImage && newVacinaCardImage !== vacinaCardImage) {
                    const vacinaCardImageName = `vacinaImage.jpg`;
                    const vacinaCardImageUrl = await uploadImageToStorage(newVacinaCardImage, vacinaCardImageName);
                    updatedPetData.vacina = vacinaCardImageUrl;
                }

                // Atualize os dados do pet no Firestore com as URLs das novas imagens
                const petRef = doc(db, 'pets', petId);
                await updateDoc(petRef, updatedPetData);
            }



            // Atualize os dados do responsável no Firestore
            const responsavelRef = doc(db, 'responsaveis', auth.currentUser.uid);
            await setDoc(responsavelRef, {
                nome: userNome,
                email: userEmail,
                cpf: userCPF,
                rg: userRG,
                dataNascimentoResp: dataNascimentoResp,
            }, { merge: true });

            // Atualize os dados do pet no Firestore
            const petRef = doc(db, 'pets', petId);
            await setDoc(petRef, {
                nomePet: nomePet,
                sexo: sexo,
                tipo: tipoPet,
                raca: racaPet,
                cor: cor,
                dataNascimentoPet: dataNascimentoPet,
                bio: bio,
                cep: cep,
                // Outros campos do pet aqui...
            }, { merge: true });


            setLoadingVisible(false);
            alert('Perfil editado com sucesso!');
            navigation.navigate('BottomTabs');
        } catch (error) {
            console.error('Erro ao editar o perfil:', error);
            alert('Ocorreu um erro ao editar o perfil. Por favor, tente novamente mais tarde.');
            setLoadingVisible(false);
        }
    };

    const showPasswordModal = () => {
        setPasswordModalVisible(true);
    };

    const atualizarEmailNoAuth = async (newEmail) => {
        try {
            const user = auth.currentUser;
            const oldEmail = user.email;

            // Reautentique o usuário com a senha atual
            const credential = EmailAuthProvider.credential(oldEmail, senhaAtual);
            await reauthenticateWithCredential(user, credential);

            // Se a reautenticação for bem-sucedida, atualize o email
            await updateEmail(user, newEmail);
        } catch (reauthError) {
            console.error('Erro de reautenticação:', reauthError);
            alert('Senha atual incorreta. O email não foi alterado.');
            throw reauthError; // Relança o erro para que ele possa ser tratado no chamador
        }
    };

    const confirmarAlteracoesPerfil = async () => {
        try {
            // Verifique se o email foi alterado
            if (emailAlterado) {
                // Chame a função para atualizar o email no Firebase Authentication
                await atualizarEmailNoAuth(userEmail);

                // Se a atualização do email tiver sucesso, chame a função para editar o perfil
                await editarPerfil();

                // Após a edição do perfil, envie um e-mail de verificação para o novo e-mail
                const user = auth.currentUser;
                await sendEmailVerification(user);
            } else {
                // Se o email não foi alterado, chame diretamente a função para editar o perfil
                await editarPerfil();
            }

            // Feche o modal de senha, se estiver aberto
            setPasswordModalVisible(false);
        } catch (error) {
            alert('Ocorreu um erro. Verifique sua senha ou tente novamente mais tarde.');
        }
    };



    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="EDITAR PERFIL" iconName="topic" />

                <PasswordModal
                    visible={isPasswordModalVisible}
                    onDismiss={() => setPasswordModalVisible(false)}
                    senhaAtual={senhaAtual}
                    setSenhaAtual={setSenhaAtual}
                    confirmarAlteracoesPerfil={confirmarAlteracoesPerfil}
                />

                {/* Renderize o ActivityIndicator condicionalmente */}
                {loadingVisible && (
                    <View style={[styles.loadingOverlay, StyleSheet.absoluteFillObject]}>
                        <Image source={LogoBranca} style={styles.imagemLogo} />
                        <Text style={styles.carregando}>Carregando</Text>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                )}

                {/* Bloqueio de tela enquanto o ActivityIndicator estiver visível */}
                <View style={[styles.overlay, { display: loadingVisible ? 'flex' : 'none' }]} />
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
                                    <Ionicons name={'arrow-back'} size={55} color="white" style={styles.returnIcon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainerPerfil}>
                                <TouchableOpacity
                                    style={styles.imageInputPerfil}
                                    onPress={() => selectImage('perfilImage')}
                                >
                                    {newPerfilImage ? (
                                        <Image source={{ uri: newPerfilImage }} style={styles.selectedImagePerfil} />
                                    ) : perfilImage ? (
                                        <Image source={{ uri: perfilImage }} style={styles.selectedImagePerfil} />
                                    ) : (
                                        <Icon name="plus-circle" size={50} color="black" style={styles.buttonImage} />
                                    )}
                                </TouchableOpacity>


                                <Input
                                    label="Bio"
                                    placeholder="Digite a biografia"
                                    value={bio}
                                    onChangeText={setBio}
                                />
                            </View>
                            <View style={styles.inputContainerResp}>
                                <Text style={styles.inputText}>RESPONSÁVEL</Text>
                                <Input
                                    label="Nome"
                                    style={styles.input}
                                    placeholder="Digite seu Nome"
                                    value={userNome} // Preencha o campo com o valor do estado userNome
                                    onChangeText={setUserNome} // Atualize o estado userNome quando o campo for editado
                                />

                                <Input
                                    label="E-mail"
                                    style={styles.input}
                                    placeholder="Digite seu Email"
                                    value={userEmail} // Preencha o campo com o valor do estado userEmail
                                    onChangeText={(newEmail) => {
                                        setUserEmail(newEmail);
                                        setEmailAlterado(true); // Defina emailAlterado como true quando o email for editado
                                    }}
                                />

                                <Input
                                    label="CPF"
                                    style={styles.input}
                                    placeholder="Digite seu CPF"
                                    type={'cpf'}
                                    value={userCPF} // Preencha o campo com o valor do estado userCPF
                                    onChangeText={(text) => {
                                        const formattedCPF = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                                        setUserCPF(formattedCPF);
                                    }} // Atualize o estado userCPF quando o campo for editado
                                    keyboardType="numeric"
                                    maxLength={14}
                                />
                                <Input
                                    label="RG"
                                    style={styles.input}
                                    placeholder="Digite seu RG"
                                    type={'custom'}
                                    options={{ mask: '99.999.999-9' }}
                                    value={userRG} // Preencha o campo com o valor do estado userRG
                                    onChangeText={(text) => {
                                        const formattedRG = text.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
                                        setUserRG(formattedRG);
                                    }}
                                    keyboardType="numeric"
                                    maxLength={12}
                                />

                                <TouchableOpacity onPress={showDatePickerResp} style={styles.datePickerButton}>
                                    <Text style={styles.datePickerText}>
                                        {dataNascimentoResp ? format(new Date(dataNascimentoResp), 'dd/MM/yyyy') : 'Data de Nascimento'}
                                    </Text>
                                </TouchableOpacity>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisibleResp}
                                    mode="date"
                                    onConfirm={handleConfirmResp}
                                    onCancel={hideDatePickerResp}
                                    maximumDate={maxDate}
                                />

                                <View style={styles.inputContainerPet}>
                                    <Text style={styles.inputText}>PET</Text>

                                    <Input
                                        label="Nome do Pet"
                                        style={styles.input}
                                        placeholder="Digite o nome do pet"
                                        value={nomePet}
                                        onChangeText={setNomePet}
                                    />

                                    <SelectDropdown
                                        data={sexoOptions}
                                        onSelect={(selectedItem, index) => setSexo(selectedItem)}
                                        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                        rowTextForSelection={(item, index) => item}
                                        dropdownIconPosition="right"
                                        defaultButtonText="Selecione o Sexo"
                                        buttonStyle={styles.dropdownButton}
                                        buttonTextStyle={styles.dropdownButtonText}
                                        dropdownStyle={styles.dropdownContainer}
                                        defaultValue={sexo}
                                    />

                                    <SelectDropdown
                                        data={['Cão', 'Gato']}
                                        onSelect={(selectedItem, index) => {
                                            setTipoPet(selectedItem);
                                            updateRacaOptions(selectedItem); // Atualize as opções de raça com base no tipo selecionado
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                        rowTextForSelection={(item, index) => item}
                                        dropdownIconPosition="right"
                                        defaultButtonText="Selecione"
                                        buttonStyle={styles.dropdownButton}
                                        buttonTextStyle={styles.dropdownButtonText}
                                        dropdownStyle={styles.dropdownContainer}
                                        defaultValue={tipoPet}
                                    />

                                    {racaOptions.length > 0 && (
                                        <SelectDropdown
                                            data={racaOptions}
                                            onSelect={(selectedItem, index) => setRacaPet(selectedItem)}
                                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                            rowTextForSelection={(item, index) => item}
                                            dropdownIconPosition="right"
                                            defaultButtonText="Selecione"
                                            buttonStyle={styles.dropdownButton}
                                            buttonTextStyle={styles.dropdownButtonText}
                                            dropdownStyle={styles.dropdownContainer}
                                            defaultValue={racaPet}
                                        />
                                    )}

                                    <Input
                                        style={styles.input}
                                        placeholder="Digite a cor do pet"
                                        value={cor}
                                        onChangeText={setCor}
                                    />

                                    <TouchableOpacity onPress={showDatePickerPet} style={styles.datePickerButton}>
                                        <Text style={styles.datePickerText}>
                                            {dataNascimentoPet ? format(new Date(dataNascimentoPet), 'dd/MM/yyyy') : 'Data de Nascimento'}
                                        </Text>
                                    </TouchableOpacity>

                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisiblePet}
                                        mode="date"
                                        onConfirm={handleConfirmPet}
                                        onCancel={hideDatePickerPet}
                                        maximumDate={maxDate}
                                    />



                                    <Input
                                        label="CEP"
                                        placeholder="Digite o CEP"
                                        value={cep.toString()}
                                        onChangeText={setCep}
                                        keyboardType="numeric"
                                        maxLength={9}

                                    />

                                </View>

                                <View style={styles.inputContainerDocs}>
                                    <Text style={styles.inputText}>DOCUMENTOS</Text>

                                    <Text style={styles.inputTitle}>PEDIGREE</Text>
                                    <TouchableOpacity
                                        style={styles.imageInput}
                                        onPress={() => selectImage('pedigree')}
                                    >
                                        {newPedigreeImage ? (
                                            <Image source={{ uri: newPedigreeImage }} style={styles.selectedImage} />
                                        ) : pedigreeImage ? (
                                            <Image source={{ uri: pedigreeImage }} style={styles.selectedImage} />
                                        ) : (
                                            <Icon name="plus-circle" size={50} color="black" style={styles.buttonImage} />
                                        )}
                                    </TouchableOpacity>

                                    {/* Input de imagem para a carteira de vacinação */}
                                    <Text style={styles.inputTitle}>CARTEIRA DE VACINAÇÃO</Text>
                                    <TouchableOpacity
                                        style={styles.imageInput}
                                        onPress={() => selectImage('vacinaCard')}
                                    >
                                        {newVacinaCardImage ? (
                                            <Image source={{ uri: newVacinaCardImage }} style={styles.selectedImage} />
                                        ) : vacinaCardImage ? (
                                            <Image source={{ uri: vacinaCardImage }} style={styles.selectedImage} />
                                        ) : (
                                            <Icon name="plus-circle" size={50} color="black" style={styles.buttonImage} />
                                        )}
                                    </TouchableOpacity>

                                </View>


                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={editarPerfil}
                                >
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>



                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>
    );
}
