import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, deleteDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { db, auth, storage } from '../../config/Firebase';
import { ref, deleteObject, listAll, uploadString } from 'firebase/storage';
import { deleteUser, signOut } from 'firebase/auth';
import styles from './styles';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'
import ConfirmationModal from '../../components/ModalConfirma';

// Importanto imagens
import LogoBranca from '../../assets/Logo/Logo_FundoBranco.png';

export default function Perfil() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    });
    const navigation = useNavigation();


    const [loading, setLoading] = useState(true);
    const [petData, setPetData] = useState(null);
    const [petCep, setPetCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [petRef, setPetRef] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const handleSignOut = async () => {
        try {
            await signOut(auth).then(() => {
                console.log('saiu')
              }).catch((error) => {
                // An error happened.
              });
            // Navega para a tela de login ou qualquer outra tela desejada
            navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao fazer logout:', error);
            // Trate o erro, se necessário
        }
    };

    const calculateAge = (dataNascimento) => {
        const currentDate = new Date();
        const birthDate = new Date(dataNascimento);

        const ageInMilliseconds = currentDate - birthDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const ageInMonths = ageInMilliseconds / (1000 * 60 * 60 * 24 * 30.44);
        const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24);

        if (ageInYears >= 1) {
            return `${Math.floor(ageInYears)} anos`;
        } else if (ageInMonths >= 1) {
            return `${Math.floor(ageInMonths)} meses`;
        } else {
            return `${Math.floor(ageInDays)} dias`;
        }
    };

    // Função para buscar o endereço do pet com base no CEP
    const getPetAddress = async (petCep) => {
        try {
            console.log(petCep);
            if (!petCep) {
                return 'CEP não definido';
            }

            const response = await axios.get(`https://viacep.com.br/ws/${petCep}/json/`);
            const data = response.data;

            if (!data.erro) {
                const endereco = `${data.bairro}, ${data.localidade}, ${data.uf}`;
                console.log(endereco);
                return endereco;
            } else {
                console.log('Detalhes da resposta da API:', response); // Adicione esta linha para depuração
                return 'CEP não encontrado ou inválido';
            }
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return 'Erro ao buscar endereço. Verifique sua conexão com a internet.';
        }
    };
    useEffect(() => {
        // Verifica se petCep está definido antes de buscar o endereço
        if (petCep) {
            getPetAddress(petCep)
                .then((enderecoObtido) => {
                    setEndereco(enderecoObtido); // Atualize o estado com o endereço
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [petCep]);

    // Função para buscar os dados do pet do Firebase
    const fetchPetData = async () => {
        try {
            const responsavelDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            const responsavelDocSnap = await getDoc(responsavelDocRef);

            if (responsavelDocSnap.exists()) {
                const responsavelData = responsavelDocSnap.data();
                const petRef = responsavelData?.petID;

                if (petRef) {
                    setPetRef(petRef);
                    const petDocSnap = await getDoc(petRef);

                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();
                        const dataNascimento = petData?.dataNascimentoPet;
                        const idade = calculateAge(dataNascimento);
                        const profileImageUrl = petData.perfilImage;
                        setPetCep(petData.cep);
                        if (profileImageUrl) {
                            setPetData({ ...petData, idade, imageUrl: profileImageUrl });
                            setLoading(false);
                            return; // Retorna após definir os dados do pet
                        }
                    }
                }
            }
            setIsLoading(true)
        } catch (error) {
            console.log('Erro ao recuperar os dados do pet:', error);
            setPetData(null); // Define os dados como null em caso de erro
            
        }finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Busca os dados do pet toda vez que a tela é focada
            fetchPetData();
        });

        // Função de limpeza para remover o listener quando o componente é desmontado
        return unsubscribe;
    }, [navigation]);

    // Função para excluir dados do Firestore
    const deleteFirestoreData = async () => {
        try {
            // Exclua o documento do responsável
            const responsavelDocRef = doc(db, 'responsaveis', auth.currentUser.uid);
            await deleteDoc(responsavelDocRef);

            // Exclua os documentos na coleção "pets" que têm uma referência ao perfil do responsável
            const petsQuery = query(collection(db, 'pets'), where('responsavelID', '==', responsavelDocRef));
            const petsSnapshot = await getDocs(petsQuery);
            setPetRef(petsSnapshot.id)

            // Itere pelos documentos encontrados e exclua-os
            petsSnapshot.forEach(async (petDoc) => {
                await deleteDoc(petDoc.ref);
            });

            // Exclua os documentos na coleção "likes" onde o perfil do responsável está envolvido
            const likesQuery = query(collection(db, 'likes'), where('petIDLike', '==', petRef));
            const likesSnapshot = await getDocs(likesQuery);

            // Itere pelos documentos encontrados e exclua-os
            likesSnapshot.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como petIDRecebeu
            const likesQuery2 = query(collection(db, 'likes'), where('petIDRecebeu', '==', petRef));
            const likesSnapshot2 = await getDocs(likesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            likesSnapshot2.forEach(async (likeDoc) => {
                await deleteDoc(likeDoc.ref);
            });

            // Exclua o documento na coleção "preferencias" que tem uma referência ao perfil do responsável
            const preferenciasQuery = query(collection(db, 'preferencias'), where('userId', '==', auth.currentUser.uid));
            const preferenciasSnapshot = await getDocs(preferenciasQuery);

            // Itere pelos documentos encontrados e exclua-os
            preferenciasSnapshot.forEach(async (preferenciaDoc) => {
                await deleteDoc(preferenciaDoc.ref);
            });

            // Exclua os documentos na coleção "avaliações" onde o perfil do responsável está envolvido
            const avaliacoesQuery = query(collection(db, 'avaliacoes'), where('userId', '==', auth.currentUser.uid));
            const avaliacoesSnapshot = await getDocs(avaliacoesQuery);

            // Itere pelos documentos encontrados e exclua-os
            avaliacoesSnapshot.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });

            // Exclua os documentos na coleção "avaliações" onde "petIdAvaliado" é igual a "petRef"
            const avaliacoesQuery2 = query(collection(db, 'avaliacoes'), where('petIdAvaliado', '==', petRef));
            const avaliacoesSnapshot2 = await getDocs(avaliacoesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            avaliacoesSnapshot2.forEach(async (avaliacaoDoc) => {
                await deleteDoc(avaliacaoDoc.ref);
            });

            // Exclua os documentos na coleção "dislikes" onde o perfil do responsável está envolvido como "petIDDislike"
            const dislikesQuery = query(collection(db, 'dislikes'), where('petIDDislike', '==', petRef));
            const dislikesSnapshot = await getDocs(dislikesQuery);

            // Itere pelos documentos encontrados e exclua-os
            dislikesSnapshot.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como "petIDRecebeu"
            const dislikesQuery2 = query(collection(db, 'dislikes'), where('petIDRecebeu', '==', petRef));
            const dislikesSnapshot2 = await getDocs(dislikesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            dislikesSnapshot2.forEach(async (dislikeDoc) => {
                await deleteDoc(dislikeDoc.ref);
            });

            // Exclua os documentos na coleção "matches" onde o perfil do responsável está envolvido
            const matchesQuery = query(collection(db, 'matches'), where('petID1', '==', petRef));
            const matchesSnapshot = await getDocs(matchesQuery);

            // Itere pelos documentos encontrados e exclua-os
            matchesSnapshot.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });

            // Agora, repita o processo para documentos onde o perfil do responsável está como petID2
            const matchesQuery2 = query(collection(db, 'matches'), where('petID2', '==', petRef));
            const matchesSnapshot2 = await getDocs(matchesQuery2);

            // Itere pelos documentos encontrados e exclua-os
            matchesSnapshot2.forEach(async (matchDoc) => {
                await deleteDoc(matchDoc.ref);
            });

            console.log('Dados do Firestore excluídos com sucesso.');
        } catch (error) {
            console.error('Erro ao excluir dados do Firestore:', error);
        }
    };

    // Função para excluir a pasta do responsável e todas as imagens associadas
    const deleteImagesFolder = async (responsavelID) => {
        try {
          // Construa a referência para a "pasta" com o ID do responsável
          const folderPath = `imagens/${responsavelID}`;
          const folderRef = ref(storage, folderPath);
      
          // Liste todos os objetos na "pasta"
          const folderObjects = await listAll(folderRef);
      
          // Exclua cada objeto na "pasta"
          await Promise.all(folderObjects.items.map(async (object) => {
            await deleteObject(object);
            console.log(`Objeto ${object.name} excluído.`);
          }));
      
          // Por fim, exclua a própria "pasta"
          await deleteObject(folderRef);
      
          console.log(`Pasta ${folderPath} e seus conteúdos excluídos com sucesso.`);
        } catch (error) {
          console.error('Erro ao excluir a pasta e seus conteúdos:', error);
        }
      };

    // Chame a função para excluir a pasta de imagens no Firebase Storage antes de deslogar o usuário
    const handleDeleteProfile = async () => {
        try {
            const responsavelID = auth.currentUser.uid
            // Exclua a pasta de imagens no Firebase Storage
            await deleteImagesFolder(responsavelID);

            // Exclua os dados do Firestore
            await deleteFirestoreData();


            const user = auth.currentUser;

            await deleteUser(user);

            // Depois, deslogue o usuário
            await signOut(auth);

            navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao fazer logout ou excluir usuário:', error);
            // Trate o erro, se necessário
        }
    };

    const handleConfirmDelete = () => {
        setShowConfirmationModal(true);
    };

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <ImageBackground source={Background} style={styles.background}>
            <Header title="PERFIL" iconName="supervised-user-circle" />
            {isLoading && (
                <View style={[styles.loadingOverlay, StyleSheet.absoluteFillObject]}>
                    <Image source={LogoBranca} style={styles.imagemLogo} />
                    <Text style={styles.carregando}>Carregando</Text>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            )}
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.containerImagemSair}>
                        {petData && petData.imageUrl && (
                            <Image style={styles.imagemPerfil} source={{ uri: petData.imageUrl }} />
                        )}
                        <View style={styles.buttonEditarContainer}>
                            <TouchableOpacity style={styles.buttonEditar} onPress={() => navigation.navigate('EditarPerfil')}>
                                <MaterialIcons name={'edit'} size={40} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* ... */}
                    </View>
                    <Text style={styles.nomePerfil}>{petData && petData.nomePet}</Text>
                    <View style={styles.bio}>
                        <Text style={styles.titleViewBio}>Bio</Text>
                        <View style={styles.descricaoPerfil}>
                            <Text style={styles.getTextBio}>{petData && petData.bio}</Text>
                        </View>
                    </View>

                    <View>
                        <View style={styles.sexoContainer}>
                            <Text style={styles.titleView}>Sexo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petData && petData.sexo}</Text>
                            </View>
                        </View>

                        <View style={styles.idadeContainer}>
                            <Text style={styles.titleView}>Idade</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{petData && petData.idade}</Text>
                            </View>
                        </View>

                        <View style={styles.tipoContainer}>
                            <Text style={styles.titleView}>Tipo</Text>
                            <View style={styles.viewSexo}>
                                <Text style={styles.getText}>{petData && petData.tipo}</Text>
                            </View>
                        </View>

                        <View style={styles.racaContainer}>
                            <Text style={styles.titleView}>Raça</Text>
                            <View style={styles.viewIdade}>
                                <Text style={styles.getText}>{petData && petData.raca}</Text>
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
                        <TouchableOpacity style={styles.buttonDocs} onPress={() => navigation.navigate('Documentos')}>
                            <Text style={styles.buttonText}>Documentos</Text>
                        </TouchableOpacity>

                    </View>
                    {/* Renderize o modal de confirmação */}
                    <ConfirmationModal
                        visible={showConfirmationModal}
                        password={password}
                        onPasswordChange={setPassword}
                        onCancel={() => setShowConfirmationModal(false)}
                        onConfirm={handleDeleteProfile} // Chame a função de exclusão quando o usuário confirmar
                    />
                    <View style={styles.botoesFinalContainer}>
                        <View style={styles.buttonExcluirContainer}>
                            <TouchableOpacity style={styles.buttonExcluir} onPress={handleConfirmDelete}>
                                <Text style={styles.buttonTextExcluir}>Excluir Conta</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonSairContainer}>
                            <TouchableOpacity style={styles.buttonSair} onPress={handleSignOut}>
                                <Text style={styles.buttonTextSair}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>



                </View>

            </ScrollView>
        </ImageBackground>
    );
}
