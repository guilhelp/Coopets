// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ImageBackground, 
    ScrollView, 
    ActivityIndicator, 
    Image, 
    StyleSheet, 
    KeyboardAvoidingView
} from 'react-native';

// Importando as variáveis do Firebase
import { auth, db, storage } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import { 
    doc, 
    setDoc, 
    collection, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    updateDoc 
} from 'firebase/firestore';

// Auth
import { 
    fetchSignInMethodsForEmail, 
    reauthenticateWithCredential, 
    EmailAuthProvider, 
    sendEmailVerification,
    updateEmail
} from "firebase/auth";

// Realtime Database
import { 
    getDownloadURL, 
    ref, 
    uploadBytesResumable, 
    deleteObject 
} from '@firebase/storage';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

// Importando o componente de dropdown do react-native-select-dropdown
import SelectDropdown from 'react-native-select-dropdown';

// Importando o componente de DateTimePicker do react-native-modal-datetime-picker
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Importando componente de imagem do expo
import * as ImagePicker from 'expo-image-picker';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Importando as funções do date-fns
import { format, isAfter, isBefore } from 'date-fns';

// Importando os estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider, Modal } from 'react-native-paper';

// Importando as fontes
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
        primary: 'black', 
    },
};


export default function EditarPerfil() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Estados com as informações do responsável
    const [userNome, setUserNome] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userCPF, setUserCPF] = useState('');
    const [userRG, setUserRG] = useState('');
    const [dataNascimentoResp, setDataNascimentoResp] = useState('');
    const [loadingVisible, setLoadingVisible] = useState(false);


    // Estados com as informações do pet
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

    const [petData, setPetData] = useState({});  // Estado que armazena todas as informações do pet
    const [senhaAtual, setSenhaAtual] = useState(''); // Estado que armazena a senha atual
    const [emailAlterado, setEmailAlterado] = useState(false); // Estado que armazena o email alterado
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false); // Estado que armazena se o modal de senha deve aparecer ou não

    const [newPerfilImage, setNewPerfilImage] = useState(null); // Estado para a nova imagem de perfil
    const [newPedigreeImage, setNewPedigreeImage] = useState(null); // Estado para a nova imagem de pedigree
    const [newVacinaCardImage, setNewVacinaCardImage] = useState(null); // Estado para a nova imagem de carteira de vacinação

    // Função que busca e seleciona a imagem capturada pelo ImagePicker do expo
    const selectImage = async (type) => {
        // Solicita permissão para acessar a biblioteca de mídia
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        // Verifica se a permissão foi concedida
        if (status !== 'granted') {
            alert('A permissão para acessar a biblioteca de mídia é necessária!');
            return;
        }
    
        // Se for iOS, solicita também permissão para acessar a câmera
        if (Platform.OS === 'ios') {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus !== 'granted') {
                alert('A permissão para acessar a câmera é necessária!');
                return;
            }
        }
    
        // Permite ao usuário escolher uma imagem da biblioteca
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        // Verifica se o usuário escolheu uma imagem e atualiza o estado com a imagem selecionada
        if (!result.canceled && result.assets.length > 0) {
            const selectedImageUri = result.assets[0].uri;
    
            // Com base no tipo especificado, atualiza o estado com a imagem correta
            if (type === 'perfilImage') {
                setNewPerfilImage(selectedImageUri);
            } else if (type === 'pedigree') {
                setNewPedigreeImage(selectedImageUri);
            } else if (type === 'vacinaCard') {
                setNewVacinaCardImage(selectedImageUri);
            }
        }
    };
    
    // Função para fazer o upload de uma imagem no storage
    const uploadImageToStorage = async (imageUri, imageName) => {
        try {
            // Obtém o ID do usuário atualmente logado
            const user = auth.currentUser.uid;
    
            // Cria uma referência para o local de armazenamento da imagem no Firebase Storage
            const storageRef = ref(storage, `imagens/${user}/${petId}/${imageName}`);
    
            // Tenta excluir uma imagem anterior no mesmo local, se existir
            try {
                await deleteObject(storageRef);
                console.log('Imagem anterior excluída com sucesso:', imageName);
            } catch (error) {
                // Se a imagem anterior não existir, ou houver um erro diferente de "object-not-found," ele é tratado aqui
                if (error.code !== 'storage/object-not-found') {
                    console.log('Erro ao excluir imagem anterior:', error);
                    throw error;
                }
                console.log('Imagem anterior não encontrada:', imageName);
            }
    
            // Faz o download da imagem selecionada (URI) como um blob
            const response = await axios.get(imageUri, {
                responseType: 'blob',
            });
    
            const blob = response.data;
    
            // Inicia o processo de upload da imagem para o Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, blob);
    
            // Aguarda até que o upload seja concluído
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
    
            // Obtém a URL de download da imagem após o upload bem-sucedido
            const downloadUrl = await getDownloadURL(snapshot.ref);
            console.log('URL da imagem:', downloadUrl);
    
            return downloadUrl;
        } catch (error) {
            console.log('Erro ao fazer upload da imagem:', error);
            throw error;
        }
    };
    
    // Função para puxar as informações do pet já existentes no banco de dados
    const loadPetData = async () => {
        try {
            setLoadingVisible(true);
            console.log("Iniciando a carga de dados do pet...");

            // Armazena o id do usuário logado
            const user = auth.currentUser;
            const responsavelId = user ? user.uid : null;

            console.log("Responsável ID:", responsavelId);

            // Consulta os pets filtrando pelo responsável associado a eles
            const petsRef = collection(db, 'pets');
            const querySnapshot = await getDocs(query(petsRef, where('responsavelID', '==', doc(db, 'responsaveis', responsavelId))));

            if (!querySnapshot.empty) {
                
                // Busca as informações do pet que pertence ao responsável logado
                const petDocSnap = querySnapshot.docs[0];
                const petData = petDocSnap.data();

                console.log("Dados do pet:", petData);

                // Armazenando em cada estado as informações puxadas
                setPetData(petData);
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

                // Verifica se as URLs das imagens existem antes de tentar carregá-las
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
                    // Renderiza o SelectDropdown aqui
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

    // Lógica para adicionar uma idade mínima para o responsável
    const minIdadeResp = new Date();
    minIdadeResp.setFullYear(minIdadeResp.getFullYear() - 18);

    // Função para validar o cep
    const validarCep = async () => {
        try {
            // Verifica se o cep foi digitada corretamente
            if (!cep) {
                alert('Digite um CEP válido antes de salvar as alterações.');
                return false; // Retorna falso se o CEP estiver em branco
            }

            // Verifica se o cep realmente existe
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

    // Função para puxar as informações do responsável já existentes no banco de dados
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Se o usuário estiver logado, busque os dados do usuário no banco de dados
                const userProfileRef = doc(db, 'responsaveis', user.uid);
                const userProfileSnapshot = await getDoc(userProfileRef);

                if (userProfileSnapshot.exists()) {
                   
                    // Armazenando em cada estado as informações puxadas
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

    // Função que verifica se o email já existe no banco
    const checkEmailExists = async (email) => {
        try {
            const providers = await fetchSignInMethodsForEmail(auth, email);
            return providers.length > 0;
        } catch (error) {
            console.log('Erro ao verificar e-mail:', error);
            return false;
        }
    };

    const sexoOptions = ['Macho', 'Fêmea']; // Armazena as informações do sexo
    const [racaOptions, setRacaOptions] = useState([]) // Estado que armazena as opções de raça

    // Condição, para mostrar diferentes tipos de raça dependendo do tipo de pet
    const updateRacaOptions = (selectedTipo) => {
        if (selectedTipo === 'Cão') { // Se for cão
             // Atualiza o estado de raça com um vetor de pets do tipo cão
            const optionsCao = ['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']
            setRacaOptions(optionsCao)
        } else if (selectedTipo === 'Gato') { // Se for gato
             // Atualiza o estado de raça com um vetor de pets do tipo gato
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]); // Se nenhum tipo estiver selecionado, não há opções de raça]

        }
    };

    // Função para mostrar o Date Picker do Pet
    const showDatePickerPet = () => {
        setDatePickerVisiblePet(true);
    };

     // Função para mostrar o Date Picker do Responsável
    const showDatePickerResp = () => {
        setDatePickerVisibleResp(true);
    };

    // Função para fechar o Date Picker do Pet
    const hideDatePickerPet = () => {
        setDatePickerVisiblePet(false);
    };

     // Função para fechar o Date Picker do Responsável
    const hideDatePickerResp = () => {
        setDatePickerVisibleResp(false);
    };

    // Função para confirmar a data escolhida do Pet
    const handleConfirmPet = (date) => {
        hideDatePickerPet();
        const formattedDate = format(date, 'yyyy-MM-dd'); // Formata a data como desejar
        setDataNascimentoPet(formattedDate); // Atualiza dataNascimentoPet com a data formatada

    };

     // Função para confirmar a data escolhida do  Responsavel
    const handleConfirmResp = (date) => {
        hideDatePickerResp();
        const formattedDate = format(date, 'yyyy-MM-dd'); // Formata a data como desejar
        setDataNascimentoResp(formattedDate); // Atualiza dataNascimentoPet com a data formatada
    };

    // Verifica se o CPF e o RG já existem no banco de dados
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

    const maxDate = new Date(); // Variável que armazena a data atual

    // Lógica que solicita a permissão de uso do armazenamento do dispositivo
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);


    // Função de editar perfil
    const editarPerfil = async () => {
        try {
            setLoadingVisible(true);

            // Verifica se todos os campos estão preenchidos
            if (!userNome || !userEmail || !userCPF || !userRG || !dataNascimentoResp || !nomePet || !sexo || !tipoPet || !racaPet || !cor || !dataNascimentoPet || !cep) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                setLoadingVisible(false);
                return;
            }

            // Verifica se é um email válido
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

            // Armazena a Data de Nascimento do responsável
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

            // Consulta o Firestore para obter os dados do usuário com base no ID do usuário atual
            const userDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const dadosAtuaisDoUsuario = userDoc.data();

                // Verifica se CPF e RG foram alterados e precisam ser validados
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

            // Verifica se o email foi alterado
            const oldEmail = auth.currentUser.email;
            if (userEmail !== oldEmail) {
                // Verifica se o novo email já existe no banco de dados
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

                    // Se a reautenticação for bem-sucedida, atualiza o email
                    await updateEmail(user, userEmail);
                    setPasswordModalVisible(false);
                } catch (reauthError) {
                    
                    setLoadingVisible(false);
                    return;
                }
            }

            // Atualiza as imagens apenas se novas imagens foram selecionadas
            if (newPerfilImage || newPedigreeImage || newVacinaCardImage) {
                const updatedPetData = {}; // Um objeto para armazenar os dados atualizados do pet

                // Verifica e atualiza a imagem de perfil, se necessário
                if (newPerfilImage && newPerfilImage !== perfilImage) {
                    const perfilImageName = `perfilImage.jpg`;
                    const perfilImageUrl = await uploadImageToStorage(newPerfilImage, perfilImageName);
                    updatedPetData.perfilImage = perfilImageUrl;
                }

                // Verifica e atualiza a imagem de pedigree, se necessário
                if (newPedigreeImage && newPedigreeImage !== pedigreeImage) {
                    const pedigreeImageName = `pedigreeImage.jpg`;
                    const pedigreeImageUrl = await uploadImageToStorage(newPedigreeImage, pedigreeImageName);
                    updatedPetData.pedigree = pedigreeImageUrl;
                }

                // Verifica e atualiza a imagem da carteira de vacinação, se necessário
                if (newVacinaCardImage && newVacinaCardImage !== vacinaCardImage) {
                    const vacinaCardImageName = `vacinaImage.jpg`;
                    const vacinaCardImageUrl = await uploadImageToStorage(newVacinaCardImage, vacinaCardImageName);
                    updatedPetData.vacina = vacinaCardImageUrl;
                }

                // Atualiza os dados do pet no Firestore com as URLs das novas imagens
                const petRef = doc(db, 'pets', petId);
                await updateDoc(petRef, updatedPetData);
            }

            // Atualiza os dados do responsável no Firestore
            const responsavelRef = doc(db, 'responsaveis', auth.currentUser.uid);
            await setDoc(responsavelRef, {
                nome: userNome,
                email: userEmail,
                cpf: userCPF,
                rg: userRG,
                dataNascimentoResp: dataNascimentoResp,
            }, { merge: true });

            // Atualiza os dados do pet no Firestore
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
            }, { merge: true });


            setLoadingVisible(false);
            alert('Perfil editado com sucesso!');
            navigation.navigate('BottomTabs'); // Navega para a tela de perfil
        } catch (error) {
            console.error('Erro ao editar o perfil:', error);
            alert('Ocorreu um erro ao editar o perfil. Por favor, tente novamente mais tarde.');
            setLoadingVisible(false);
        }
    };

    // Função para mostrar a caixa de texto da senha
    const showPasswordModal = () => {
        setPasswordModalVisible(true);
    };

    // Função para atualziar o email no auth
    const atualizarEmailNoAuth = async (newEmail) => {
        try {
            const user = auth.currentUser;
            const oldEmail = user.email;

            // Reautentica o usuário com a senha atual
            const credential = EmailAuthProvider.credential(oldEmail, senhaAtual);
            await reauthenticateWithCredential(user, credential);

            // Se a reautenticação for bem-sucedida, atualiza o email
            await updateEmail(user, newEmail);
        } catch (reauthError) {
            console.error('Erro de reautenticação:', reauthError);
          
            throw reauthError; // Relança o erro para que ele possa ser tratado no chamador
        }
    };

    // Função para confirmar as alterações do perfil
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
    } // Condição caso as fontes não carreguem

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

                {loadingVisible && (
                    <View style={[styles.loadingOverlay, StyleSheet.absoluteFillObject]}>
                        <Image source={LogoBranca} style={styles.imagemLogo} />
                        <Text style={styles.carregando}>Carregando</Text>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                )}

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
                                    value={userNome}
                                    onChangeText={setUserNome}
                                />

                                <Input
                                    label="E-mail"
                                    style={styles.input}
                                    placeholder="Digite seu Email"
                                    value={userEmail}
                                    onChangeText={(newEmail) => {
                                        setUserEmail(newEmail);
                                        setEmailAlterado(true); 
                                    }}
                                />

                                <Input
                                    label="CPF"
                                    style={styles.input}
                                    placeholder="Digite seu CPF"
                                    type={'cpf'}
                                    value={userCPF}
                                    onChangeText={(text) => {
                                        const formattedCPF = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                                        setUserCPF(formattedCPF);
                                    }} 
                                    keyboardType="numeric"
                                    maxLength={14}
                                />
                                <Input
                                    label="RG"
                                    style={styles.input}
                                    placeholder="Digite seu RG"
                                    type={'custom'}
                                    options={{ mask: '99.999.999-9' }}
                                    value={userRG}
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
                                        maxLength={20}
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
                                            updateRacaOptions(selectedItem);
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
