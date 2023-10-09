import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, KeyboardAvoidingView, ScrollView, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/Firebase';
import { collection, query, getDocs, where, doc, getDoc , deleteDoc} from 'firebase/firestore';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import Background from '../../assets/Background/Background.png';
import DenunciaCard from '../../components/DenunciaCard';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function ValidarDenuncias() {
    const navigation = useNavigation();

    const [denuncias, setDenuncias] = useState([]);

    useEffect(() => {
        const loadDenuncias = async () => {
            try {
                const q = query(collection(db, 'denuncias'));
                const querySnapshot = await getDocs(q);

                const denunciasData = [];
                for (const docSnap of querySnapshot.docs) {
                    const denuncia = docSnap.data();
                    const idRecebedor = denuncia.idRecebedor;

                    // Log para verificar o ID do recebedor
                    console.log('ID do Recebedor:', idRecebedor);

                    // Busque informações do pet (recebedor)
                    const petDocRef = doc(db, 'pets', idRecebedor);

                    // Log para verificar a referência do documento do pet
                    console.log('Referência do Documento do Pet:', petDocRef);

                    const petDocSnap = await getDoc(petDocRef);
                    if (petDocSnap.exists()) {
                        const petData = petDocSnap.data();

                        // Log para verificar os dados do pet
                        console.log('Dados do Pet:', petData);
                        console.log('foto', petData.perfilImage)
                        denunciasData.push({
                            id: docSnap.id,
                            motivo: denuncia.motivo,
                            dataDenuncia: denuncia.data.toDate(),
                            fotoPerfil: petData.perfilImage,
                            nomePerfil: petData.nomePet,
                            petBio: petData.bio,
                            petId: idRecebedor,
                            petResp: petData.responsavelID.id,
                            petSexo: petData.sexo,
                            petIdade: petData.dataNascimentoPet,
                            petPedigree: petData.pedigree,
                            petVac: petData.vacina,
                            petTipo: petData.tipo,
                            petRaca: petData.raca,
                            petCep: petData.cep,
                            idDenuncia: denuncia.id
                        });
                    }
                }

                // Log para verificar as denúncias carregadas
                console.log('Denúncias Carregadas:', denunciasData);

                setDenuncias(denunciasData);
            } catch (error) {
                console.error('Erro ao carregar denúncias:', error);
            }
        };

        loadDenuncias();
    }, []);

    const countDenunciasRecebidas = async (petId) => {
        try {
          const q = query(collection(db, 'denuncias'), where('idRecebedor', '==', petId));
          const querySnapshot = await getDocs(q);
          return querySnapshot.size; // Retorna o número de documentos que correspondem à consulta
        } catch (error) {
          console.error('Erro ao contar denúncias recebidas:', error);
          return 0; // Em caso de erro, retorna 0
        }
      };

      const handleExcluirDenunciaExcluir = async (denunciaId) => {
        try {
          // Referência para o documento da denúncia
          const denunciaRef = doc(db, 'denuncias', denunciaId);
      
          // Exclua o documento da denúncia
          await deleteDoc(denunciaRef);
      
          // Atualize a lista de denúncias localmente (remova a denúncia excluída)
          setDenuncias((prevDenuncias) =>
            prevDenuncias.filter((denuncia) => denuncia.id !== denunciaId)
          );
      
          console.log('Denúncia excluída com sucesso.');
        } catch (error) {
          console.error('Erro ao excluir a denúncia:', error);
        }
      };
      
         

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <View style={styles.cabecalhoPagina}>
                    <MaterialIcons name={'admin-panel-settings'} size={65} color="white" style={styles.logoAdm} />
                    <Text style={styles.tituloCabecalho}>ADMIN</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <MaterialCommunityIcons name={'logout'} size={60} color="white" style={styles.sairButton} />
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
                    <Text style={styles.tituloDenuncias}>DENÚNCIAS</Text>
                    <FlatList
                        data={denuncias}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <DenunciaCard 
                            denuncia={item} 
                            handleExcluirDenunciaExcluirCard={handleExcluirDenunciaExcluir} 
                            countDenunciasRecebidas={countDenunciasRecebidas}/>
                        )}
                    />

                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>
    );
}
