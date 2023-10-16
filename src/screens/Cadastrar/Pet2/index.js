// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import { 
    View, 
    Text, 
    ImageBackground, 
    TouchableOpacity, 
    Image, 
    KeyboardAvoidingView, 
    ScrollView 
} from 'react-native';

// Importando os componentes do react-navigation
import { useRoute, useNavigation } from '@react-navigation/native';

// Importando os estilos
import { styles } from './styles';

// Importando componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Importando ícones
import Icon from 'react-native-vector-icons/FontAwesome';

//  Importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importando componente de imagem do expo
import * as ImagePicker from 'expo-image-picker';

// Importanto imagens
import Background from '../../../assets/Background/Background.png'

// Importanto componentes
import Header from '../../../components/Header';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function CadastrarPet2() {
    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto


    const navigation = useNavigation(); // Variável de navegação
    const route = useRoute(); // Variável que envia parâmtros pelas rotas

    const { dadosResp, dadosPet1 } = route.params; // Recebe os parâmetros

    // Estados que armazenam as duas imagens que serão capturadas 
    const [pedigreeImage, setPedigreeImage] = useState(null);
    const [vacinaCardImage, setVacinaCardImage] = useState(null);

    // Função useEffect que solicita permissões do usuário para ter acesso aos arquivos do dispositivo
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos das permissões da biblioteca de mídia para isso funcionar!');
            }
        })();
    }, []);

    // Função que busca e seleciona a imagem capturada pelo ImagePicker do expo
    const selectImage = async (type) => {
        
        // Abre a galeria de imagens do dispositivo
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Permite selecionar apenas imagens
            allowsEditing: true, // Permite ao usuário editar a imagem antes de selecioná-la
            aspect: [4, 3], // Define a proporção de aspecto da imagem
            quality: 1, // Define a qualidade da imagem (valor de 1 a 0)
        });
    
        // Verifica se o usuário não cancelou a seleção de imagem
        if (!result.canceled) {
            // Verifica o tipo de imagem (pedigree ou vacinaCard) e atualiza o estado e a URL da imagem correspondente
            if (type === 'pedigree') {
                setPedigreeImage(result.assets[0].uri); // Define a imagem do pedigree no estado
                pedigreeImageUrl = result.assets[0].uri; // Define a URL da imagem do pedigree
            } else if (type === 'vacinaCard') {
                setVacinaCardImage(result.assets[0].uri); // Define a imagem do cartão de vacina no estado
                vacinaCardImageUrl = result.assets[0].uri; // Define a URL da imagem do cartão de vacina
            }
        }
    };

    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="PET" iconName="pets" />
                <KeyboardAvoidingView
                    behavior={'padding'}
                    style={styles.container}>
                    <ScrollView style={styles.scrollContainer}>
                    <Text style={styles.inputText}>DOCUMENTOS</Text>
                    <View style={styles.inputContainer}>

                        {/* Input de imagem para o pedigree */}
                        <Text style={styles.inputTitle}>PEDIGREE</Text>
                        <TouchableOpacity
                            style={styles.imageInput}
                            onPress={() => selectImage('pedigree')}
                        >
                            {pedigreeImage ? (
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
                            {vacinaCardImage ? (
                                <Image source={{ uri: vacinaCardImage }} style={styles.selectedImage} />
                            ) : (
                                <Icon name="plus-circle" size={50} color="black" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.botaoAvancar}
                            onPress={() => {
                                if (pedigreeImage && vacinaCardImage) {
                                    const imagensPet = {
                                        imagem1: pedigreeImage,
                                        imagem2: vacinaCardImage,
                                      };
                                    navigation.navigate('CadastrarPet3', { dadosResp, dadosPet1, dadosPet2: imagensPet });
                                } else {
                                    alert('Por favor, selecione as duas imagens antes de avançar.');
                                }
                            }}
                        >
                            <Text style={styles.botaoAvancarText}>Avançar</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </PaperProvider>

    );
}