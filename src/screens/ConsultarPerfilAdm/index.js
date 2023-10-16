// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    ImageBackground,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';

// Importando as variáveis do Firebase
import { db, database, auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    collection,
    doc,
    query,
    where,
    getDocs,
    deleteDoc,
    getDoc
} from 'firebase/firestore';

// Realtime Database 
import { ref, get, remove } from 'firebase/database';

// Auth
import { deleteUser, getAuth } from 'firebase/auth';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Importando os estilos
import { styles } from './styles';

// Importando imagens
import Background from '../../assets/Background/Background.png'

// Importando os componentes
import Header from '../../components/Header';

// Importando ícones
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPerfilAdm({ route }) {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Variáveis que recebem como parâmetro
    const { petId } = route.params
    const { petImage } = route.params
    const { petNome } = route.params
    const { petResp } = route.params
    const { petBio } = route.params
    const { petSexo } = route.params
    const { petIdade } = route.params
    const { petPedigree } = route.params
    const { petVac } = route.params
    const { petTipo } = route.params
    const { petRaca } = route.params
    const { petCep } = route.params

    const [endereco, setEndereco] = useState(''); // Estado que armazena o endereço

    // Função para calcular a idade com base na data de nascimento
    const calculateAge = () => {
        const currentDate = new Date();
        const birthDate = new Date(petIdade); // Converte a data de nascimento em um objeto Date

        // Realiza cálculos para obter a idade em anos, meses ou dias
        const ageInMilliseconds = currentDate - birthDate;
        const ageInSeconds = ageInMilliseconds / 1000;
        const ageInMinutes = ageInSeconds / 60;
        const ageInHours = ageInMinutes / 60;
        const ageInDays = ageInHours / 24;

        if (ageInDays >= 365.25) {
            const ageInYears = ageInDays / 365.25;
            return `${Math.floor(ageInYears)} anos`;
        } else if (ageInDays >= 30.44) {
            const ageInMonths = ageInDays / 30.44;
            return `${Math.floor(ageInMonths)} meses`;
        } else {
            return `${Math.floor(ageInDays)} dias`;
        }
    };

    // Chama a função para calcular a idade formatada
    const idadeFormatada = calculateAge();

    // Função para obter o endereço com base no CEP usando uma API
    const getPetAddress = async (petCep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${petCep}/json/`);
            const data = response.data;

            if (!data.erro) {
                // Se não há erro na resposta da API, monta o endereço
                const endereco = `${data.bairro}, ${data.localidade}, ${data.uf}`;
                return endereco;
            } else {
                return 'Endereço não encontrado';
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return 'Erro ao buscar endereço';
        }
    };

    // Use useEffect para buscar o endereço com base no CEP quando o componente é montado
    useEffect(() => {
        getPetAddress(petCep)
            .then((enderecoObtido) => {
                setEndereco(enderecoObtido); // Atualiza o estado com o endereço
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Função para excluir as mensagens do realtime database
    const deleteRoomsForUser = (responsavelID) => {
        const roomsRef = ref(database, 'messages');

        get(roomsRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((roomSnapshot) => {
                    const roomId = roomSnapshot.key;

                    // Verifica se o usuário logado está envolvido na sala
                    if (roomId.includes(responsavelID)) {
                        // Se usuário faz parte exclui o room
                        remove(roomSnapshot.ref, (error) => {
                            if (error) {
                                console.error('Erro ao excluir a sala:', error);
                            } else {
                                console.log('Sala excluída com sucesso.');
                            }
                        });
                    }
                });
            }
        }).catch((error) => {
            console.error('Erro ao excluir os rooms:', error);
        });
    };

    // Função para excluir um perfil
    const excluirPerfil = async () => {
        try {

            // Obtenha a instância de autenticação (auth) usando `getAuth`
            const authInstance = getAuth();

            // Exclua o usuário no Firebase Authentication com base no UID petResp
            await deleteUser(authInstance, petResp);

            // Busca as informações do responsável logado
            const responsavelDocRef = doc(db, 'responsaveis', petResp);
            const responsavelDocSnap = await getDoc(responsavelDocRef);

            const responsavelData = responsavelDocSnap.data();
            const responsavelId = responsavelDocRef.id;

            // Armazena o id do pet que pertence ao responsável logado
            const petRefPerfil = responsavelData?.petID;

            // Chama a funcao para excluir os "rooms" do usuário
            deleteRoomsForUser(petResp);


            // Exclui os documentos na coleção "likes" onde o perfil do responsável está envolvido

            const likesQuery = query(collection(db, 'likes'), where('petIDLike', '==', petRefPerfil));
            const likesSnapshot = await getDocs(likesQuery);

            likesSnapshot.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });

            const likesQuery2 = query(collection(db, 'likes'), where('petIDRecebeu', '==', petRefPerfil));
            const likesSnapshot2 = await getDocs(likesQuery2);

            likesSnapshot2.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });


            // Exclui os documentos na coleção "preferencias" que têm uma referência ao perfil do responsável


            const preferenciasQuery = query(collection(db, 'preferencias'), where('userId', '==', petResp));
            const preferenciasSnapshot = await getDocs(preferenciasQuery);


            preferenciasSnapshot.forEach(async (preferenciaDoc) => {
                await deleteDoc(preferenciaDoc.ref);
            });


            // Exclui os documentos na coleção "avaliacoes" onde o perfil do responsável está envolvido


            const avaliacoesQuery = query(collection(db, 'avaliacoes'), where('userId', '==', petResp));
            const avaliacoesSnapshot = await getDocs(avaliacoesQuery);

            avaliacoesSnapshot.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });

            const avaliacoesQuery2 = query(collection(db, 'avaliacoes'), where('petIdAvaliado', '==', petRefPerfil));
            const avaliacoesSnapshot2 = await getDocs(avaliacoesQuery2);

            avaliacoesSnapshot2.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });


            // Exclui os documentos na coleção "dislikes" onde o perfil do responsável está envolvido


            const dislikesQuery = query(collection(db, 'dislikes'), where('petIDDislike', '==', petRefPerfil));
            const dislikesSnapshot = await getDocs(dislikesQuery);

            dislikesSnapshot.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });

            const dislikesQuery2 = query(collection(db, 'dislikes'), where('petIDRecebeu', '==', petRefPerfil));
            const dislikesSnapshot2 = await getDocs(dislikesQuery2);

            dislikesSnapshot2.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });


            // Exclui os documentos na coleção "matches" onde o perfil do responsável está envolvido


            const matchesQuery = query(collection(db, 'matches'), where('petID1', '==', petRefPerfil));
            const matchesSnapshot = await getDocs(matchesQuery);

            matchesSnapshot.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });

            const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petRefPerfil));
            const matchesSnapshot2 = await getDocs(matchesQuery2);


            matchesSnapshot2.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });


            // Exclui os documentos na coleção "denuncias" onde o perfil do responsável está envolvido


            const denunciasDenuncianteQuery = query(collection(db, 'denuncias'), where('idDenunciante', '==', petResp));
            const denunciasDenuncianteSnapshot = await getDocs(denunciasDenuncianteQuery);

            denunciasDenuncianteSnapshot.forEach(async (denunciaDoc) => {
                await deleteDoc(denunciaDoc.ref);
            });

            const denunciasRecebidorQuery = query(collection(db, 'denuncias'), where('idRecebedor', '==', petId));
            const denunciasRecebidorSnapshot = await getDocs(denunciasRecebidorQuery);

            denunciasRecebidorSnapshot.forEach(async (denunciaDoc) => {
                await deleteDoc(denunciaDoc.ref);
            });

            // Exclui o documento do perfil de responsável
            await deleteDoc(responsavelDocRef);

            // Exclui o documento do perfil do pet
            const petDocRef = doc(db, 'pets', petId); // Certifique-se de usar a referência correta para o documento do pet
            await deleteDoc(petDocRef);



            console.log('Perfil excluído com sucesso.');
            alert('Perfil excluído com sucesso.');
            navigation.navigate('ValidarDenuncias') // Navega para a tela de validar denuncias

        } catch (error) {
            console.error('Erro ao excluir o perfil:', error);
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <ImageBackground source={Background} style={styles.background}>

            <Header title={petNome} iconName="pets" />
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
                            <Ionicons name={'arrow-back'} size={55} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={excluirPerfil} style={styles.blockButton}>
                            <MaterialIcons name={'delete-forever'} size={50} color="white" style={styles.blockIcon} />
                        </TouchableOpacity>
                    </View>

                    <Image source={{ uri: petImage }} style={styles.imagemPerfil} />
                    <Text style={styles.nomePerfil}>{petNome}</Text>

                    <View style={styles.bio}>

                        <Text style={styles.titleViewBio}>Bio</Text>
                        <View style={styles.descricaoPerfil}>
                            <Text style={styles.getTextBio}>{petBio}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={styles.sexoContainer}>
                            <Text style={styles.titleView}>Sexo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petSexo}</Text>
                            </View>
                        </View>

                        <View style={styles.idadeContainer}>
                            <Text style={styles.titleView}>Idade</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{idadeFormatada}</Text>
                            </View>
                        </View>

                        <View style={styles.tipoContainer}>
                            <Text style={styles.titleView}>Tipo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petTipo}</Text>
                            </View>
                        </View>

                        <View style={styles.racaContainer}>
                            <Text style={styles.titleView}>Raça</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{petRaca}</Text>
                            </View>
                        </View>

                    </View>
                    <View style={styles.tituloInfo}>
                        <Text style={styles.tituloText}>Local</Text>
                    </View>
                    <View style={styles.localizacaoPerfil}>
                        <Text style={styles.getTextLocal}>{endereco}</Text>
                    </View>
                    <View style={styles.buttonScreensContainer}>
                        <TouchableOpacity style={styles.buttonDocs} onPress={() => navigation.navigate('ConsultarDocumentos', { petPedigree, petVac })}>
                            <Text style={styles.buttonText}>Documentos</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
        </ImageBackground>

    );
}