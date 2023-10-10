// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';

// Importando as variáveis do Firebase
import { db, auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    collection,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    onSnapshot,
    addDoc,
    updateDoc
} from 'firebase/firestore';


// Importando os componentes do react navigation
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Importando o componente LinearGradiente do expo-linear-gradient
import { LinearGradient } from 'expo-linear-gradient';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Importando componentes
import PetchScreen from '../../components/Petch';

// Importando os estilos
import { styles } from './styles';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';


export default function Avaliacao() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    const [currentCardIndex, setCurrentCardIndex] = useState(0); // Estado que armazena o pet que mostrará nos cards
    const [userProfileId, setUserProfileId] = useState(null); // Estado que armazena o Id do usuário

    const [pets, setPets] = useState([]); // Estado que armazenará os pets
    const [unratedPets, setUnratedPets] = useState([]); // Estado que armazena os pets sem classificação

    const [showMatchPopup, setShowMatchPopup] = useState(false); // Estado que armazena a condição de aparecer ou não o Pop-U de Match

    // Estados que serão enviadas para o ShowMatchPopUp
    const [pet1Name, setPet1Name] = useState('');
    const [pet1Image, setPet1Image] = useState('');
    const [pet2Name, setPet2Name] = useState('');
    const [pet2Image, setPet2Image] = useState({});

    const [userPreferences, setUserPreferences] = useState({}); // Estado que armazena as preferências do usuário
    const [userPreferencesChanged, setUserPreferencesChanged] = useState(false);

    const [dataFetched, setDataFetched] = useState(false); // Estado que controla se os dados já foram buscados

    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento da tela

    const OPEN_CAGE_API_KEY = '9a786e26fb0c45019985ae5a0d8cad7f' // Variável que armazena a key da API OpenCage

    // O useEffect é usado para executar a função checkNotifications assim que o componente for montado.
    useEffect(() => {
        // Define a função checkNotifications como assíncrona para que possa lidar com operações assíncronas.
        const checkNotifications = async () => {
            try {
                // Obtém o usuário atualmente autenticado.
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;

                    // Define uma consulta para buscar notificações não lidas do usuário.
                    const notificationsQuery = query(
                        collection(db, 'notificacoes'),
                        where('userId', '==', userId),
                        where('lida', '==', false)
                    );
                    // Executa a consulta e aguarda a resposta.
                    const querySnapshot = await getDocs(notificationsQuery);

                    // Verifica se há notificações não lidas.
                    if (!querySnapshot.empty) {
                        // Obtém os dados da primeira notificação não lida.
                        const notificationData = querySnapshot.docs[0].data();
                        // Exibe um alerta com a mensagem da notificação.
                        Alert.alert('Denúncia', 'Você recebeu uma denúncia: ' + notificationData.motivoDenuncia);

                        // Marca a notificação como lida no banco de dados.
                        const notificationId = querySnapshot.docs[0].id;
                        const notificationRef = doc(db, 'notificacoes', notificationId);
                        await updateDoc(notificationRef, { lida: true });
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar notificações:', error);
            }
        };

        // Chama a função checkNotifications assim que o componente for montado.
        checkNotifications();
    }, []);


    // Função que reseta todos os estados do projeto
    const resetState = () => {
        setUserProfileId(null);
        setShowMatchPopup(false);
        setPet1Name('');
        setPet1Image('');
        setPet2Name('');
        setPet2Image({});
        setUserPreferences({});
        setDataFetched(false);
    };

    // Função principal que buscará todas as informações e filtrará todos os pets
    const fetchData = async () => {

        // Define isLoading como true para sinalizar que os dados estão sendo buscados.
        setIsLoading(true);
        console.log('Fetching data...');

        try {
            // Obtém o usuário atualmente autenticado.
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                setUserProfileId(userId); // Define o ID do perfil do usuário.
                console.log('User Profile ID:', userId); // Exibe o ID do perfil do usuário no console.

                // Obtém uma referência ao documento do usuário no banco de dados.
                const userRef = doc(db, 'responsaveis', userId);
                const userDoc = await getDoc(userRef); // Busca os dados do usuário.

                // Obtém uma referência ao pet associado ao usuário.
                const petRef = userDoc.data().petID;

                // Obtém os dados do pet a partir da referência obtida.
                const petDoc = await getDoc(petRef);
                const petCep = petDoc.data().cep;

                // Obtém o endereço do pet a partir do CEP.
                const petAddress = await getAddressFromCep(petCep);
                const petCoordinates = await getCoordinatesFromAddress(petAddress);

                if (petCoordinates) {
                    console.log('Pet Coordinates:', petCoordinates); // Exibe as coordenadas do pet no console.

                    // Define consultas para buscar pets e avaliações de pets.
                    const petsQuery = query(
                        collection(db, 'pets'),
                        where('responsavelID', '!=', userRef)
                    );

                    const petsEvaluatedQuery = query(
                        collection(db, 'avaliacoes'),
                        where('userId', '==', userId)
                    );

                    // Busca as avaliações de pets feitas pelo usuário.
                    const petsEvaluatedSnapshot = await getDocs(petsEvaluatedQuery);
                    const petsEvaluatedIds = petsEvaluatedSnapshot.docs.map(
                        (doc) => doc.data().petIdAvaliado.id
                    );

                    // Obtém as preferências do usuário.
                    const userPreferencesRef = doc(db, 'preferencias', userId);
                    const userPreferencesSnapshot = await getDoc(userPreferencesRef);
                    const userPreferencesData = userPreferencesSnapshot.data();
                    const distancePreference = userPreferencesData?.distancia;

                    // Busca todos os pets no banco de dados.
                    const petsSnapshot = await getDocs(petsQuery);
                    const petsData = petsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Consulta para obter os IDs dos pets avaliados pelo usuário
                    const ratedPetsQuery = query(
                        collection(db, 'avaliacoes'),
                        where('userId', '==', userId)
                    );
                    const ratedPetsSnapshot = await getDocs(ratedPetsQuery);
                    const ratedPetIds = ratedPetsSnapshot.docs.map((doc) =>
                        doc.data().petIdAvaliado.id
                    );

                    // Filtrar os pets pelos campos relevantes (sexo, tipo, raça) e se ainda não foram avaliados
                    const filteredPets = petsData.filter((pet) =>
                        !ratedPetIds.includes(pet.id) &&
                        checkUserPreferences(userPreferencesData, pet)
                    );

                    // Define uma função para calcular a distância entre duas coordenadas geográficas.
                    const calculateDistance = (coordinates1, coordinates2) => {
                        if (!coordinates1 || !coordinates2) {
                            return null;
                        }
                        const R = 6371;
                        const dLat = (coordinates2.lat - coordinates1.lat) * (Math.PI / 180);
                        const dLon = (coordinates2.lng - coordinates1.lng) * (Math.PI / 180);
                        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(coordinates1.lat * (Math.PI / 180)) *
                            Math.cos(coordinates2.lat * (Math.PI / 180)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const distance = R * c;

                        return distance;
                    };

                    // Calcula as distâncias apenas para os pets filtrados
                    const petsWithCoordinates = await Promise.all(
                        filteredPets.map(async (pet) => {
                            const petAddress = await getAddressFromCep(pet.cep);
                            const petCoordinates = await getCoordinatesFromAddress(petAddress);

                            return { ...pet, coordinates: petCoordinates };
                        })
                    );

                    // Filtra os pets com base nas preferências do usuário e distância.
                    const petsNotEvaluatedAndMatchingPreferences = petsWithCoordinates.filter((pet) => {
                        if (!pet.coordinates) {
                            return false;
                        }

                        const distance = calculateDistance(
                            pet.coordinates,
                            petCoordinates
                        );

                        console.log(`Distância para ${pet.nomePet}: ${distance ? distance + ' km' : 'N/A'}`);

                        return (
                            !petsEvaluatedIds.includes(pet.id) &&
                            (!distancePreference || distance <= parseFloat(distancePreference))
                        );
                    });

                    // Define os estados com os pets filtrados e atualiza os estados.
                    setUnratedPets(petsNotEvaluatedAndMatchingPreferences);
                    setUserPreferencesChanged(false);
                    setPets(petsNotEvaluatedAndMatchingPreferences);
                    console.log(
                        'Pets não avaliados com preferências, distância filtrada e dentro da preferência de distância:',
                        petsNotEvaluatedAndMatchingPreferences
                    );
                    console.log('Índice do card atual:', currentCardIndex);
                } else {
                    console.log('Coordenadas do usuário não encontradas.');
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error); // Exibe erros no console, se houver algum.
        } finally {
            setIsLoading(false); // Define isLoading como false quando a busca de dados é concluída.
        }
    };

    // Função que busca o endereço do pet com base no cep
    const getAddressFromCep = async (cep) => {
        try {
            // Faz uma requisição pelo axios para a api ViaCep, onde armazena em uma variável um endereço
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            // Busca o logradouro, bairro, a localidade e o uf com base no cep do pet
            if (response.status === 200) {
                const data = response.data;
                if (!data.erro) {
                    const { logradouro, bairro, localidade, uf } = data;
                    return `${logradouro}, ${bairro}, ${localidade}, ${uf}`;
                } else {
                    console.error('CEP inválido ou não encontrado');
                    return null;
                }
            } else {
                console.error('Erro ao buscar endereço pelo CEP:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar endereço pelo CEP:', error);
            return null;
        }
    };

    // Função assíncrona que obtém as coordenadas geográficas a partir de um endereço.
    const getCoordinatesFromAddress = async (address) => {
        try {
            console.log('adress: ', address); // Exibe o endereço no console.

            // Faz uma solicitação HTTP para a API de geocodificação com o endereço fornecido.
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    q: address,
                    key: OPEN_CAGE_API_KEY, // Chave de API para autenticar a consulta.
                },
            });

            if (response.status === 200) {
                const data = response.data;

                if (data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry;
                    return { lat, lng }; // Retorna as coordenadas latitudinais e longitudinais.
                } else {
                    console.error('Coordenadas não encontradas para o endereço:', address);
                    return null;
                }
            } else {
                console.error('Erro ao buscar coordenadas do endereço:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar coordenadas do endereço:', error);
            return null;
        }
    };

    // Função que verifica se as preferências do usuário coincidem com as informações do pet.
    const checkUserPreferences = (userPreferences, pet) => {
        if (!userPreferences) {
            return true; // Retorna true se não houver preferências definidas.
        }

        const { tipo, sexo, raca } = userPreferences;

        if (tipo && pet.tipo !== tipo) {
            return false; // Retorna false se o tipo do pet não coincidir com a preferência do usuário.
        }

        if (sexo && pet.sexo !== sexo) {
            return false; // Retorna false se o sexo do pet não coincidir com a preferência do usuário.
        }

        if (raca && pet.raca !== raca) {
            return false; // Retorna false se a raça do pet não coincidir com a preferência do usuário.
        }

        return true; // Retorna true se todas as preferências coincidirem.
    };

    // Função para ouvir as preferências do usuário no banco de dados.
    const listenToUserPreferences = async () => {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const userPreferencesRef = doc(db, 'preferencias', userId);

            // Define uma função de desinscrição que pode ser usada para parar de ouvir as preferências.
            const unsubscribe = onSnapshot(userPreferencesRef, (snapshot) => {
                const updatedPreferences = snapshot.data();
                setUserPreferences(updatedPreferences); // Atualiza as preferências do usuário.

                // Define userPreferencesChanged como true quando as preferências mudarem.
                setUserPreferencesChanged(true);
            });

            return unsubscribe; // Retorna a função de desinscrição para parar de ouvir as preferências.
        }
    };

    // Função para caso as preferências do usuário mudarem
    useEffect(() => {
        let unsubscribeAuth;
        let unsubscribePreferences;

        const setupAuthListener = async () => {
            unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // Chame a função para ouvir as preferências do usuário
                    unsubscribePreferences = await listenToUserPreferences();

                    // Chama o estado de dataFetched para atualizar os dados
                    if (!dataFetched) {
                        setDataFetched(true);
                    }
                } else {
                    resetState();
                }
            });
        };

        setupAuthListener();

        // Certifica de desinscrever o ouvinte de autenticação quando o componente for desmontado
        return () => {
            if (typeof unsubscribeAuth === 'function') {
                unsubscribeAuth();
            }

            // Certifica desinscrever o ouvinte de preferências quando o componente for desmontado
            if (typeof unsubscribePreferences === 'function') {
                unsubscribePreferences();
            }
        };
    }, [dataFetched]);

    // Esta função será chamada quando a tela de Avaliação obtiver foco
    useFocusEffect(
        React.useCallback(() => {
            
            if (userPreferencesChanged) {  // Verifica se as preferências do usuário foram alteradas
                // As preferências do usuário mudaram, busque dados atualizados com base nas novas preferências
                fetchData();
                // Redefina userPreferencesChanged como false após buscar os dados
                setUserPreferencesChanged(false);
            }
        }, [userPreferencesChanged])
    );

    const handleMatchClose = () => {
        // Fechar a tela de match
        setShowMatchPopup(false);

        // Avançar para o próximo card
        setCurrentCardIndex(currentCardIndex + 1);
    };


    // Função chamada quando o usuário clica no botão "Curtir" (like)
    const handleLike = async () => {
        if (currentCardIndex < pets.length) {
            const currentPet = pets[currentCardIndex];
            const likedPetId = currentPet.id;

            // Obtem o documento do pet associado ao responsável logado
            const userRef = doc(db, 'responsaveis', userProfileId);
            const petQuery = query(collection(db, 'pets'), where('responsavelID', '==', userRef));
            const petSnapshot = await getDocs(petQuery);
            const userPet = petSnapshot.docs[0]; // Assumindo que existe apenas um pet associado ao responsável logado

            if (!userPet) {
                console.log('Pet associado ao responsável não encontrado');
                return;
            }

            const userPetRef = userPet.ref; // Referência do pet associado ao responsável logado

            // Salva o "like" no banco de dados e atualiza a lista de pets
            await savePetEvaluation(userProfileId, likedPetId, 'like');

            // Cria um documento na coleção "likes" com as referências corretas dos pets
            await addDoc(collection(db, 'likes'), {
                createdAt: new Date(),
                petIDLike: userPetRef, // Referência do pet que está dando o like (pet do usuário atual)
                petIDRecebeu: doc(db, 'pets', likedPetId), // Referência do pet que recebeu o like (pet que está sendo avaliado)
            });

            // Verifica se houve um match
            const isMutualLike = await checkForMutualLikes(userPet.id, likedPetId); // Aqui, passamos userPet.id em vez de userProfileId
            if (isMutualLike) {
                // Salva o match na coleção "matches"
                await addDoc(collection(db, 'matches'), {
                    createdAt: new Date(),
                    petID1: userPetRef,
                    petID2: doc(db, 'pets', likedPetId),
                });

                // Exibe a tela de match
                const petName = userPet.data().nomePet;
                const petImage = userPet.data().perfilImage;

                // Define os dados na tela de match
                setPet1Name(petName);
                setPet1Image(petImage);

                // Busca informações do pet que deu like de volta
                const likedPet = pets.find((pet) => pet.id === likedPetId);
                if (likedPet) {
                    setPet2Name(likedPet.nomePet);
                    setPet2Image(likedPet.perfilImage);
                }

                // Não avança para o próximo card aqui, aguarda a resposta do usuário na tela de match
                setShowMatchPopup(true);
                return;
            }

            // Avança para o próximo card após a ação de "like"
            setCurrentCardIndex(currentCardIndex + 1);
            // Atualiza a lista de pets não avaliados
            setUnratedPets(unratedPets.slice(1));
        }
    };

    // Função chamada quando o usuário clica no botão "Não Curtir" (dislike)
    const handleDislike = async () => {
        if (currentCardIndex < pets.length) {
            const currentPetId = pets[currentCardIndex].id;

            // Salva o "dislike" no banco de dados e atualiza a lista de pets
            await savePetEvaluation(userProfileId, currentPetId, 'dislike');

            // Obtem o documento do pet associado ao responsável logado
            const userRef = doc(db, 'responsaveis', userProfileId);
            const petQuery = query(collection(db, 'pets'), where('responsavelID', '==', userRef));
            const petSnapshot = await getDocs(petQuery);
            const userPet = petSnapshot.docs[0]; // Assumindo que existe apenas um pet associado ao responsável logado

            if (!userPet) {
                console.log('Pet associado ao responsável não encontrado');
                return;
            }

            const userPetRef = userPet.ref; // Referência do pet associado ao responsável logado

            // Cria um documento na coleção "dislikes" com a referência ao pet atual
            const petRef = doc(db, 'pets', currentPetId);
            await addDoc(collection(db, 'dislikes'), {
                petIDDislike: userPetRef,
                petIDRecebeu: petRef,
                createdAt: new Date(),
            });

            // Avança para o próximo card após a ação de "dislike"
            setCurrentCardIndex(currentCardIndex + 1);
            // Atualiza a lista de pets não avaliados
            setUnratedPets(unratedPets.slice(1));
        }
    };

    // Função para salvar a avaliação do pet no Firestore e atualizar a lista de pets
    const savePetEvaluation = async (userId, petId, evaluation) => {
        try {
            const petRef = doc(db, 'pets', petId);

            // Salvar a avaliação na coleção "avaliacoes"
            await addDoc(collection(db, 'avaliacoes'), {
                userId: userId,
                petIdAvaliado: petRef,
                evaluation: evaluation,
                createdAt: new Date(),
            });

            // Retornar o pet avaliado (não filtrar ainda)
            return petId;
        } catch (error) {
            console.log('Erro ao salvar avaliação do pet:', error);
            return null;
        }
    };

    // Função quer verifica se há likes mútuos para ocorrer um match
    const checkForMutualLikes = async (petId1, petId2) => {
        try {
            // Obtém as referências dos documentos dos dois pets
            const pet1Ref = doc(db, 'pets', petId1);
            const pet2Ref = doc(db, 'pets', petId2);

            // Consulta para verificar se pet1 deu "like" em pet2
            const pet1ToPet2Query = query(
                collection(db, 'likes'),
                where('petIDLike', '==', pet1Ref),
                where('petIDRecebeu', '==', pet2Ref)
            );
            const pet1ToPet2Snapshot = await getDocs(pet1ToPet2Query);

            // Consulta para verificar se pet2 deu "like" em pet1
            const pet2ToPet1Query = query(
                collection(db, 'likes'),
                where('petIDLike', '==', pet2Ref),
                where('petIDRecebeu', '==', pet1Ref)
            );
            const pet2ToPet1Snapshot = await getDocs(pet2ToPet1Query);

            // Verifica se ambos os resultados das consultas não estão vazios,
            // o que significa que pet1 deu "like" em pet2 e pet2 deu "like" em pet1
            const isMutualLike = !pet1ToPet2Snapshot.empty && !pet2ToPet1Snapshot.empty;

            return isMutualLike;
        } catch (error) {
            console.log('Error checking for mutual likes:', error);
            return false;
        }
    };


    // Função para calcular a idade do pet com base na data de nascimento
    const calculatePetAge = (dataNascimentoPet) => {
        // Converter a data de nascimento da string para um objeto Date
        const birthDate = new Date(dataNascimentoPet);

        // Obter a data atual
        const currentDate = new Date();

        // Calcular a diferença em milissegundos entre as duas datas
        const differenceInMillis = currentDate.getTime() - birthDate.getTime();

        // Converter a diferença de milissegundos para anos, meses e dias
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const ageInYears = differenceInMillis / millisecondsPerYear;

        const millisecondsPerMonth = 1000 * 60 * 60 * 24 * 30.44;
        const ageInMonths = differenceInMillis / millisecondsPerMonth;

        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const ageInDays = differenceInMillis / millisecondsPerDay;

        // Escolher um formato de exibição com base no valor calculado
        if (ageInYears >= 1) {
            return `${Math.floor(ageInYears)} anos`;
        } else if (ageInMonths >= 1) {
            return `${Math.floor(ageInMonths)} meses`;
        } else {
            return `${Math.floor(ageInDays)} dias`;
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <ImageBackground source={Background} style={styles.background}>
            {/* Renderize o ActivityIndicator condicionalmente */}
            {isLoading && (
                <View style={[styles.loadingOverlay, StyleSheet.absoluteFillObject]}>
                    <Image source={LogoBranca} style={styles.imagemLogo} />
                    <Text style={styles.carregando}>Carregando</Text>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}
            <View style={styles.cabecalhoPagina}>
                <Image source={require('../../assets/Logo/Logo_FundoBranco.png')} style={styles.logoImage} />
                <Text style={styles.tituloCabecalho}>AVALIAÇÃO</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Filtros')}>
                    <Image source={require('../../assets/Icons/filterButton.png')} style={styles.filterButton} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.cardContainer}>
                    {currentCardIndex < pets.length ? (
                        // Renderizar o card do pet atual
                        <View key={pets[currentCardIndex].id} style={styles.card}>
                            <Image source={{ uri: pets[currentCardIndex].perfilImage }} style={styles.image} />
                            <View style={styles.buttonPerfilContainer}>
                                <TouchableOpacity style={styles.buttonPerfil} onPress={() => {
                                    navigation.navigate('ConsultarPerfil', {
                                        petId: pets[currentCardIndex].id,
                                        petImage: pets[currentCardIndex].perfilImage,
                                        petNome: pets[currentCardIndex].nomePet,
                                        petResp: pets[currentCardIndex].responsavelID.id,
                                        petBio: pets[currentCardIndex].bio,
                                        petSexo: pets[currentCardIndex].sexo,
                                        petIdade: pets[currentCardIndex].dataNascimentoPet,
                                        petPedigree: pets[currentCardIndex].pedigree,
                                        petVac: pets[currentCardIndex].vacina,
                                        petTipo: pets[currentCardIndex].tipo,
                                        petRaca: pets[currentCardIndex].raca,
                                        petCep: pets[currentCardIndex].cep
                                    });
                                }}>
                                    <Text style={styles.buttonPerfilText}>Perfil</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.petInfoContainer}>
                                <View style={styles.overlayContainer}>
                                    <LinearGradient
                                        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}
                                        style={styles.gradient}
                                    />
                                </View>
                                <Text style={styles.name}>{pets[currentCardIndex].nomePet}</Text>
                                <Text style={styles.age}>Idade: {calculatePetAge(pets[currentCardIndex].dataNascimentoPet)}</Text>
                            </View>
                        </View>
                    ) : (
                        // Se não houver mais pets a serem avaliados
                        <View style={styles.messageContainer}>
                            <Text style={styles.messageText}>Não há mais pets para avaliar</Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={require('../../assets/Icons/dislikeIcon.png')} style={styles.dislikeIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={require('../../assets/Icons/like.png')} style={styles.likeIcon} />
                    </TouchableOpacity>


                    {showMatchPopup && (
                        <View style={styles.matchPopup}>
                            <PetchScreen
                                pet1Name={pet1Name}
                                pet1Image={pet1Image}
                                pet2Name={pet2Name}
                                pet2Image={pet2Image}
                                onClose={handleMatchClose}
                            />
                            <TouchableOpacity
                                style={styles.closePopupButton}
                                onPress={handleMatchClose}
                            >
                                <Text style={styles.closePopupButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>

                    )}
                </View>
            </View>
        </ImageBackground>
    );
}
