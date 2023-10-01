import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { collection, addDoc, doc, query, where, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../config/Firebase';
import PetchScreen from '../../components/Petch';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function Avaliacao() {
    const navigation = useNavigation();
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [userProfileId, setUserProfileId] = useState(null);
    const [pets, setPets] = useState([]);
    const [showMatchPopup, setShowMatchPopup] = useState(false);
    const [likedPetId, setLikedPetId] = useState(null);
    const [pet1Name, setPet1Name] = useState('');
    const [pet1Image, setPet1Image] = useState('');
    const [pet2Name, setPet2Name] = useState('');
    const [pet2Image, setPet2Image] = useState('');
    const [userPreferences, setUserPreferences] = useState({});


    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const OPEN_CAGE_API_KEY = '9a786e26fb0c45019985ae5a0d8cad7f';


    const getAddressFromCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

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


    const getCoordinatesFromAddress = async (address) => {
        try {
            console.log('adress: ', address)
            const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
                params: {
                    q: address,
                    key: OPEN_CAGE_API_KEY,
                },
            });

            if (response.status === 200) {
                const data = response.data;

                if (data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry;
                    return { lat, lng };
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


    const fetchData = async () => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.uid;
                setUserProfileId(userId);
                console.log('User Profile ID:', userId);
    
                const userRef = doc(db, 'responsaveis', userId);
                const userDoc = await getDoc(userRef);
    
                const petRef = userDoc.data().petID;
                // Obter o ID do pet a partir da referência
                const petIdAssociado = petRef.id;
    
                // Obter o documento do pet associado ao responsável logado
                const petDoc = await getDoc(petRef);
    
                const petCep = petDoc.data().cep;
    
                // Obter o endereço a partir do CEP
                const petAddress = await getAddressFromCep(petCep);
    
                // Obter as coordenadas (latitude e longitude) do endereço do pet usando o OpenCage Geocoding API
                const petCoordinates = await getCoordinatesFromAddress(petAddress);
    
                if (petCoordinates) {
                    console.log('Pet Coordinates:', petCoordinates);
    
                    const petsQuery = query(
                        collection(db, 'pets'),
                        where('responsavelID', '!=', userRef)
                    );
    
                    // Verificar os pets avaliados pelo usuário
                    const petsEvaluatedQuery = query(
                        collection(db, 'avaliacoes'),
                        where('userId', '==', userId)
                    );
                    const petsEvaluatedSnapshot = await getDocs(petsEvaluatedQuery);
                    const petsEvaluatedIds = petsEvaluatedSnapshot.docs.map(
                        (doc) => doc.data().petIdAvaliado.id
                    );
    
                    // Consultar as preferências do usuário
                    const userPreferencesRef = doc(db, 'preferencias', userId);
                    const userPreferencesSnapshot = await getDoc(userPreferencesRef);
                    const userPreferencesData = userPreferencesSnapshot.data();
                    const distancePreference = userPreferencesData?.distancia;
    
                    // Filtrar apenas os pets não avaliados pelo usuário
                    const petsSnapshot = await getDocs(petsQuery);
                    const petsData = petsSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
    
                    // Função para calcular a distância entre o usuário e um pet
                    const calculateDistance = (coordinates1, coordinates2) => {
                        if (!coordinates1 || !coordinates2) {
                            return null; // Lida com coordenadas ausentes
                        }
    
                        const R = 6371; // Raio da Terra em quilômetros
                        const dLat = (coordinates2.lat - coordinates1.lat) * (Math.PI / 180);
                        const dLon = (coordinates2.lng - coordinates1.lng) * (Math.PI / 180);
                        const a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(coordinates1.lat * (Math.PI / 180)) *
                            Math.cos(coordinates2.lat * (Math.PI / 180)) *
                            Math.sin(dLon / 2) *
                            Math.sin(dLon / 2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        const distance = R * c;
    
                        return distance;
                    };
    
                    // Obter as coordenadas (latitude e longitude) de todos os pets filtrados
                    const petsWithCoordinates = await Promise.all(
                        petsData.map(async (pet) => {
                            const petAddress = await getAddressFromCep(pet.cep);
                            const petCoordinates = await getCoordinatesFromAddress(petAddress);
                           
                            return { ...pet, coordinates: petCoordinates };
                        })
                    );
    
                    // Filter pets based on user preferences and distance
                    const petsNotEvaluatedAndMatchingPreferences = petsWithCoordinates.filter((pet) => {
                        if (!pet.coordinates) {
                            return false; // Ignore pets without coordinates
                        }
    
                        // Calculate the distance between the user and the pet
                        const distance = calculateDistance(
                            pet.coordinates,
                            petCoordinates
                        );

                        console.log(`Distância para ${pet.nomePet}: ${distance ? distance + ' km' : 'N/A'}`);
    
                        // Check if the distance preference is defined and the distance is within the user's preference
                        return (
                            !petsEvaluatedIds.includes(pet.id) &&
                            checkUserPreferences(userPreferencesData, pet) &&
                            (!distancePreference || distance <= parseFloat(distancePreference))
                        );
                    });
    
                    setPets(petsNotEvaluatedAndMatchingPreferences);
                    console.log(
                        'Pets não avaliados com preferências, distância filtrada e dentro da preferência de distância:',
                        petsNotEvaluatedAndMatchingPreferences
                    );
    
                } else {
                    console.log('Coordenadas do usuário não encontradas.');
                    // Lida com o caso em que as coordenadas do usuário não foram encontradas
                }
            } else {
                // Lidar com o caso em que o usuário não está autenticado
            }
        });
        return unsubscribe;
    };
    


    useEffect(() => {
        fetchData();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            // Coloque aqui o código que você deseja executar quando a tela obtiver o foco
            fetchData(); // Chame a função fetchData() para buscar os novos cards com os filtros atualizados
        }, [])
    );

    const checkUserPreferences = (userPreferences, pet) => {
        if (!userPreferences) {
            return true; // Se não houver preferências definidas, mostrar o pet
        }

        const { tipo, sexo, raca } = userPreferences;

        if (tipo && pet.tipo !== tipo) {
            return false; // Verificar o tipo do pet
        }

        if (sexo && pet.sexo !== sexo) {
            return false; // Verificar o sexo do pet
        }

        if (raca && pet.raca !== raca) {
            return false; // Verificar a raça do pet
        }

        return true; // Todas as preferências coincidem
    };

    // Função para verificar se um pet recebeu like ou dislike do usuário logado
    const checkForPetFeedback = async (userId, petId) => {
        try {
            const userPetRef = doc(db, 'pets', petId);

            // Verificar se o usuário logado deu like no pet
            const likeQuery = query(collection(db, 'likes'), where('userId', '==', userId), where('petIDLike', '==', userPetRef));
            const likeSnapshot = await getDocs(likeQuery);

            // Verificar se o usuário logado deu dislike no pet
            const dislikeQuery = query(collection(db, 'dislikes'), where('userId', '==', userId), where('petIDDislike', '==', userPetRef));
            const dislikeSnapshot = await getDocs(dislikeQuery);

            const hasFeedback = !likeSnapshot.empty || !dislikeSnapshot.empty;
            console.log(`User ${userId} feedback for pet ${petId}: ${hasFeedback ? 'Given' : 'Not Given'}`); // Added

            return hasFeedback;
        } catch (error) {
            console.log('Erro ao verificar feedback do pet:', error);
            return false;
        }
    };
    if (!fontsLoaded && !fontError) {
        return null;
    }

    // Verifica se ainda está buscando os dados dos pets
    if (pets.length === 0) {
        console.log('Número de pets disponíveis:', pets.length); // Added
        return (
            <ImageBackground source={Background} style={styles.background}>
                <View style={styles.cabecalhoPagina}>
                    <Image source={require('../../assets/Logo/Logo_FundoBranco.png')} style={styles.petImage} />
                    <Text style={styles.tituloCabecalho}>AVALIAÇÃO</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Filtros')}>
                        <Image source={require('../../assets/Icons/filterButton.png')} style={styles.filterButton} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>Não há mais pets para avaliar</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }
    if (!fontsLoaded && !fontError) {
        return null;
    }

    // Verifica se todos os pets já foram avaliados
    if (currentCardIndex >= pets.length) {
        return (
            <ImageBackground source={Background} style={styles.background}>
                <View style={styles.cabecalhoPagina}>
                    <Image source={require('../../assets/Logo/Logo_FundoBranco.png')} style={styles.petImage} />
                    <Text style={styles.tituloCabecalho}>AVALIAÇÃO</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Filtros')}>
                        <Image source={require('../../assets/Icons/filterButton.png')} style={styles.filterButton} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>Não há mais pets para avaliar</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }

    const handleLike = async () => {
        if (currentCardIndex < pets.length) {
            const currentPet = pets[currentCardIndex];
            const likedPetId = currentPet.id;

            // Verificar se o usuário logado deu like ou dislike no pet atual
            const hasFeedback = await checkForPetFeedback(userProfileId, likedPetId);
            if (hasFeedback) {
                console.log('O usuário já deu like ou dislike neste pet');
                return;
            }

            // Obter o documento do pet associado ao responsável logado
            const userRef = doc(db, 'responsaveis', userProfileId);
            const petQuery = query(collection(db, 'pets'), where('responsavelID', '==', userRef));
            const petSnapshot = await getDocs(petQuery);
            const userPet = petSnapshot.docs[0]; // Assumindo que existe apenas um pet associado ao responsável logado

            if (!userPet) {
                console.log('Pet associado ao responsável não encontrado');
                return;
            }

            const userPetRef = userPet.ref; // Referência do pet associado ao responsável logado

            // Salvar o "like" no banco de dados e atualizar a lista de pets
            await savePetEvaluation(userProfileId, likedPetId, 'like');

            // Criar um documento na coleção "likes" com as referências corretas dos pets
            await addDoc(collection(db, 'likes'), {
                createdAt: new Date(),
                petIDLike: userPetRef, // Referência do pet que está dando o like (pet do usuário atual)
                petIDRecebeu: doc(db, 'pets', likedPetId), // Referência do pet que recebeu o like (pet que está sendo avaliado)
            });

            // Verificar se houve match
            const isMutualLike = await checkForMutualLikes(userPet.id, likedPetId); // Aqui, passamos userPet.id em vez de userProfileId
            if (isMutualLike) {
                // Salvar o match na coleção "matches"
                await addDoc(collection(db, 'matches'), {
                    createdAt: new Date(),
                    petID1: userPetRef,
                    petID2: doc(db, 'pets', likedPetId),
                });

                // Exibir a tela de match
                const petName = userPet.data().nomePet;
                const petImage = userPet.data().perfilImage;

                // Mostrar os dados na tela de match
                setPet1Name(petName);
                setPet1Image(petImage);

                // Buscar informações do pet que deu like de volta
                const likedPet = pets.find((pet) => pet.id === likedPetId);
                if (likedPet) {
                    setPet2Name(likedPet.nomePet);
                    setPet2Image(likedPet.perfilImage);
                }

                // Não avançar para o próximo card aqui, vamos aguardar a resposta do usuário na tela de match
                setShowMatchPopup(true);
                return;
            }
            console.log('Índice do card atual:', currentCardIndex);
            // Avançar para o próximo card
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const handleDislike = async () => {
        if (currentCardIndex < pets.length) {
            const currentPetId = pets[currentCardIndex].id;

            // Verificar se o usuário logado deu like ou dislike no pet atual
            const hasFeedback = await checkForPetFeedback(userProfileId, currentPetId);
            if (hasFeedback) {
                console.log('O usuário já deu like ou dislike neste pet');
                return;
            }

            // Salvar o "dislike" no banco de dados e atualizar a lista de pets
            await savePetEvaluation(userProfileId, currentPetId, 'dislike');

            // Obter o documento do pet associado ao responsável logado
            const userRef = doc(db, 'responsaveis', userProfileId);
            const petQuery = query(collection(db, 'pets'), where('responsavelID', '==', userRef));
            const petSnapshot = await getDocs(petQuery);
            const userPet = petSnapshot.docs[0]; // Assumindo que existe apenas um pet associado ao responsável logado

            if (!userPet) {
                console.log('Pet associado ao responsável não encontrado');
                return;
            }

            const userPetRef = userPet.ref; // Referência do pet associado ao responsável logado

            // Criar um documento na coleção "dislikes" com a referência ao pet atual
            const petRef = doc(db, 'pets', currentPetId);
            await addDoc(collection(db, 'dislikes'), {
                petIDDislike: userPetRef,
                petIDRecebeu: petRef,
                createdAt: new Date(),
            });
            console.log('Índice do card atual:', currentCardIndex);
            // Avançar para o próximo card
            setCurrentCardIndex(currentCardIndex + 1);
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
    // Função para calcular a idade do pet com base no timestamp da data de nascimento
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


    const checkForMutualLikes = async (petId1, petId2) => {
        try {
            // Create references to the documents of the two pets
            const pet1Ref = doc(db, 'pets', petId1);
            const pet2Ref = doc(db, 'pets', petId2);

            // Query to check if pet1 liked pet2
            const pet1ToPet2Query = query(
                collection(db, 'likes'),
                where('petIDLike', '==', pet1Ref),
                where('petIDRecebeu', '==', pet2Ref)
            );
            const pet1ToPet2Snapshot = await getDocs(pet1ToPet2Query);

            // Query to check if pet2 liked pet1
            const pet2ToPet1Query = query(
                collection(db, 'likes'),
                where('petIDLike', '==', pet2Ref),
                where('petIDRecebeu', '==', pet1Ref)
            );
            const pet2ToPet1Snapshot = await getDocs(pet2ToPet1Query);

            const isMutualLike = !pet1ToPet2Snapshot.empty && !pet2ToPet1Snapshot.empty;

            return isMutualLike;
        } catch (error) {
            console.log('Error checking for mutual likes:', error);
            return false;
        }
    };

    const handleMatchClose = () => {
        // Fechar a tela de match
        setShowMatchPopup(false);

        // Avançar para o próximo card
        setCurrentCardIndex(currentCardIndex + 1);
    };



    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ImageBackground source={Background} style={styles.background}>
            <View style={styles.cabecalhoPagina}>
                <Image source={require('../../assets/Logo/Logo_FundoBranco.png')} style={styles.petImage} />
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

                {/* Botões de curtir e não curtir */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={require('../../assets/Icons/dislikeIcon.png')} style={styles.dislikeIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={require('../../assets/Icons/like.png')} style={styles.likeIcon} />
                    </TouchableOpacity>
                    {/* Botão para reexibir os pets para avaliação */}


                    {/* Pop-up da tela de match */}
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
