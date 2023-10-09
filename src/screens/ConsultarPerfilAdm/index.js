import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DenunciaPopup from '../../components/DenunciaPopUp';
import {
    collection,
    doc,
    query,
    where,
    getDocs,
    deleteDoc,
    getDoc
} from 'firebase/firestore';
import { db, auth } from '../../config/Firebase';
import { deleteUser } from '@firebase/auth';
// Estilos
import styles from './styles';
import Background from '../../assets/Background/Background.png'
import Header from '../../components/Header';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';



// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPerfilAdm({ route }) {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });

    const navigation = useNavigation();
    const { petId } = route.params
    const { petImage } = route.params
    const { petNome } = route.params
    const { petResp } = route.params
    const { petBio } = route.params
    const { petEndereco } = route.params
    const { petSexo } = route.params
    const { petIdade } = route.params
    const { petPedigree } = route.params
    const { petVac } = route.params
    const { petTipo } = route.params
    const { petRaca } = route.params
    const { petCep } = route.params
    const [endereco, setEndereco] = useState('');
    const [isDenunciaPopupVisible, setDenunciaPopupVisible] = useState(false);
    console.log('O pet Id é:', petId)


    const calculateAge = () => {
        const currentDate = new Date();
        const birthDate = new Date(petIdade); // Converter a string em um objeto Date


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

    // Use calculateAge() para obter a idade formatada
    const idadeFormatada = calculateAge();
    console.log(idadeFormatada); // Exibirá a idade formatada


    const getPetAddress = async (petCep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${petCep}/json/`);
            const data = response.data;

            if (!data.erro) {
                // Verifique se não há erros na resposta
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

    // Use getPetAddress() para obter o endereço com base no CEP
    useEffect(() => {
        // Use getPetAddress() para obter o endereço com base no CEP
        getPetAddress(petCep)
            .then((enderecoObtido) => {
                setEndereco(enderecoObtido); // Atualize o estado com o endereço
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Função para bloquear um perfil
    const excluirPerfil = async () => {
        try {
            const perfilRef = doc(db, 'responsaveis', petResp);

            // Exclua os documentos na coleção "likes" que têm uma referência ao perfil do responsável
            const petsQuery = query(collection(db, 'pets'), where('responsavelID', '==', perfilRef));
            const petsSnapshot = await getDocs(petsQuery);

            // Itere pelos documentos encontrados e exclua-os
            petsSnapshot.forEach(async (petDoc) => {
                await deleteDoc(petDoc.ref);
            });

            // Exclua os documentos na coleção "likes" onde o perfil do responsável está envolvido
            const likesQuery = query(collection(db, 'likes'), where('petIDLike', '==', petId));
            const likesSnapshot = await getDocs(likesQuery);

            // Itere pelos documentos encontrados e exclua-os
            likesSnapshot.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como petIDRecebeu
            const likesQuery2 = query(collection(db, 'likes'), where('petIDRecebeu', '==', petId));
            const likesSnapshot2 = await getDocs(likesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            likesSnapshot2.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });

            // Exclua os documentos na coleção "preferencias" que têm uma referência ao perfil do responsável
            const preferenciasQuery = query(collection(db, 'preferencias'), where('userId', '==', petResp));
            const preferenciasSnapshot = await getDocs(preferenciasQuery);

            // Itere pelos documentos encontrados e exclua-os
            preferenciasSnapshot.forEach(async (preferenciaDoc) => {
                await deleteDoc(preferenciaDoc.ref);
            });

            // Exclua os documentos na coleção "avaliacoes" onde o perfil do responsável está envolvido
            const avaliacoesQuery = query(collection(db, 'avaliacoes'), where('userId', '==', petResp));
            const avaliacoesSnapshot = await getDocs(avaliacoesQuery);

            // Itere pelos documentos encontrados e exclua-os
            avaliacoesSnapshot.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como petIDAvaliado
            const avaliacoesQuery2 = query(collection(db, 'avaliacoes'), where('petIdAvaliado', '==', petId));
            const avaliacoesSnapshot2 = await getDocs(avaliacoesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            avaliacoesSnapshot2.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });

            // Exclua os documentos na coleção "dislikes" onde o perfil do responsável está envolvido como "petIDDislike"
            const dislikesQuery = query(collection(db, 'dislikes'), where('petIDDislike', '==', petId));
            const dislikesSnapshot = await getDocs(dislikesQuery);

            // Itere pelos documentos encontrados e exclua-os
            dislikesSnapshot.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como "petIDRecebeu"
            const dislikesQuery2 = query(collection(db, 'dislikes'), where('petIDRecebeu', '==', petId));
            const dislikesSnapshot2 = await getDocs(dislikesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            dislikesSnapshot2.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });

            // Exclua os documentos na coleção "matches" onde o perfil do responsável está envolvido
            const matchesQuery = query(collection(db, 'matches'), where('petID1', '==', petId));
            const matchesSnapshot = await getDocs(matchesQuery);

            // Itere pelos documentos encontrados e exclua-os
            matchesSnapshot.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como petID2
            const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petId));
            const matchesSnapshot2 = await getDocs(matchesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            matchesSnapshot2.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });

            // Consulte a coleção "denuncias" para encontrar todas as denúncias onde o perfil a ser excluído é o denunciante (idDenunciante)
            const denunciasDenuncianteQuery = query(collection(db, 'denuncias'), where('idDenunciante', '==', petResp));
            const denunciasDenuncianteSnapshot = await getDocs(denunciasDenuncianteQuery);

            // Itere pelos documentos encontrados e exclua-os
            denunciasDenuncianteSnapshot.forEach(async (denunciaDoc) => {
                await deleteDoc(denunciaDoc.ref);
            });

            // Consulte a coleção "denuncias" novamente para encontrar todas as denúncias onde o perfil a ser excluído é o denunciado (idRecebidor)
            const denunciasRecebidorQuery = query(collection(db, 'denuncias'), where('idRecebedor', '==', petId));
            const denunciasRecebidorSnapshot = await getDocs(denunciasRecebidorQuery);

            // Itere pelos documentos encontrados e exclua-os
            denunciasRecebidorSnapshot.forEach(async (denunciaDoc) => {
                await deleteDoc(denunciaDoc.ref);
            });

            const perfilDoc = await getDoc(perfilRef);
            const userId = perfilDoc.data().uid; // Suponhamos que o UID esteja armazenado no campo 'uid'

            await deleteUser(petResp);
            await deleteDoc(perfilRef);
            

            console.log('Perfil excluído com sucesso.');
            alert('Perfil excluído com sucesso.');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao excluir o perfil:', error);
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ImageBackground source={Background} style={styles.background}>

            <Header title={petNome} iconName="pets" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.returnButton}>
                            <Ionicons name={'arrow-back'} size={55} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={excluirPerfil} style={styles.blockButton}>
                            <MaterialIcons name={'block'} size={50} color="white" style={styles.blockIcon} />
                        </TouchableOpacity>
                    </View>

                    <Image source={{ uri: petImage }} style={styles.imagemPerfil} />
                    <Text style={styles.nomePerfil}>{petNome}</Text>
                    <View>

                        <Text style={styles.titleView}>Bio</Text>
                        <View style={styles.descricaoPerfil}>
                            <Text style={styles.getTextBio}>{petBio}</Text>
                        </View>


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