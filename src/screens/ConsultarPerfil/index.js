// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    ImageBackground,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
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
    setDoc,
} from 'firebase/firestore';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando a biblioteca axios para requisições
import axios from 'axios';

// Importando os componentes
import DenunciaPopup from '../../components/DenunciaPopUp';
import Header from '../../components/Header';

// Importando os estilos
import { styles } from './styles';

// Importando imagens
import Background from '../../assets/Background/Background.png';

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';

// Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

export default function ConsultarPerfil({ route }) {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Variáveis que recebem como parâmetro
    const { petId } = route.params
    const { petImage } = route.params
    const { petNome } = route.params
    const { petBio } = route.params
    const { petSexo } = route.params
    const { petIdade } = route.params
    const { petPedigree } = route.params
    const { petVac } = route.params
    const { petTipo } = route.params
    const { petRaca } = route.params
    const { petCep } = route.params

    const [endereco, setEndereco] = useState(''); // Estado que armazena o endereço
    const [isDenunciaPopupVisible, setDenunciaPopupVisible] = useState(false); // Estado que armazena se o modal de denúncia deve aparecer ou não

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

    // Função para lidar com a denúncia de um perfil
    const handleDenunciar = async () => {
        try {
            // Consulta o banco de dados para verificar se o usuário já denunciou este perfil
            const denunciaQuery = query(
                collection(db, 'denuncias'),
                where('idDenunciante', '==', auth.currentUser.uid),
                where('idRecebedor', '==', petId)
            );

            const denunciaSnapshot = await getDocs(denunciaQuery);

            if (denunciaSnapshot.size > 0) {
                // Se já houver denúncia registrada, exibe um alerta ao usuário
                Alert.alert('Aviso', 'Você já denunciou este perfil anteriormente.');
            } else {
                // Caso contrário, permite que o usuário faça uma nova denúncia
                setDenunciaPopupVisible(true);
            }
        } catch (error) {
            console.error('Erro ao verificar denúncia:', error);
        }
    };

    // Função para enviar uma denúncia com motivo específico
    const enviarDenuncia = async (motivoDenuncia, idUsuarioQueDenunciou, idUsuarioQueRecebeu) => {
        try {
            if (motivoDenuncia && typeof motivoDenuncia === 'string' && motivoDenuncia !== '[object Object]') {
                // Cria uma nova referência para a denúncia
                const novaDenunciaRef = doc(collection(db, 'denuncias'));

                // Gera um ID para a denúncia
                const idDenuncia = novaDenunciaRef.id;

                // Registra a denúncia no banco de dados
                await setDoc(novaDenunciaRef, {
                    id: idDenuncia,
                    motivo: motivoDenuncia,
                    idDenunciante: idUsuarioQueDenunciou,
                    idRecebedor: idUsuarioQueRecebeu,
                    data: new Date(),
                });

                console.log('Denúncia enviada com sucesso. ID da denúncia:', idDenuncia);
            } else {
                // Se o motivo da denúncia for inválido, exibe um erro
                console.error('Selecione um motivo de denúncia válido');
            }
        } catch (error) {
            console.error('Erro ao enviar a denúncia:', error);
        }
    };

    // Função para lidar com o envio de uma denúncia
    const handleSubmitDenuncia = (motivoDenuncia) => {
        if (motivoDenuncia) {
            // Se houver um motivo de denúncia válido
            const idDoUsuarioQueDenunciou = auth.currentUser.uid;
            const idDoUsuarioQueRecebeu = petId;
            const motivoDenunciaString = motivoDenuncia.toString();
            enviarDenuncia(motivoDenunciaString, idDoUsuarioQueDenunciou, idDoUsuarioQueRecebeu);
            setDenunciaPopupVisible(false);
        } else {
            // Se o motivo da denúncia for inválido, exibe um erro
            motivoDenuncia = null;
            console.error('Selecione um motivo de denúncia válido');
        }
    };

    // Função para fechar o popup de denúncia
    const handleCloseDenunciaPopup = () => {
        setDenunciaPopupVisible(false);
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
                        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
                            <Ionicons name={'arrow-undo'} size={40} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDenunciar} style={styles.denunciarButton}>
                            <Ionicons name={'alert'} size={50} color="white" style={styles.denunciarIcon} />
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
                    <DenunciaPopup
                        visible={isDenunciaPopupVisible}
                        onClose={handleCloseDenunciaPopup}
                        onSubmit={handleSubmitDenuncia}
                    />
                </View>

            </ScrollView>
        </ImageBackground>

    );
}