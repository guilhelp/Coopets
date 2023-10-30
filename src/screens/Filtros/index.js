// Importando o React
import React, { useState, useEffect } from 'react';

// Importando os componentes do React
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';

// Importando as variáveis do Firebase
import { db, auth } from '../../config/Firebase';

// Importando as funções do Firebase

// Firestore
import {
    doc,
    setDoc,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

// Importando os componentes do react navigation
import { useNavigation } from '@react-navigation/native';

// Importando componente de dropdown
import SelectDropdown from 'react-native-select-dropdown';

// Importando Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importando os estilos
import { styles } from './styles';

// Importando os componentes do react-native-paper
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// importando as fontes
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importando imagens
import Background from '../../assets/Background/Background.png'

// Importando os componentes
import Header from '../../components/Header';

// Importando os ícones
import { Ionicons } from '@expo/vector-icons';

// Configurando cores do react native paper
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'black',
    },
};

export default function Filtros() {

    let [fontsLoaded, fontError] = useFonts({
        LuckiestGuy_400Regular,
        Roboto_900Black,
    }); // Estado que armazena as fontes do projeto

    const navigation = useNavigation(); // Variável de navegação

    // Estados que armazenam as informações de filtros
    const [sexo, setSexo] = useState('');
    const [tipo, setTipo] = useState('');
    const [raca, setRaca] = useState('');
    const [distancia, setDistancia] = useState(0);

    // Estado que armazena as opções de sexo
    const sexoOptions = ['Macho', 'Fêmea'];

    // Estado que armazena se o dropdown de raça deve aparecer ou não
    const [showRacaDropdown, setShowRacaDropdown] = useState(false);

    // Estado que armazena as opções de raça
    const [racaOptions, setRacaOptions] = useState([])

    // Estado que armazena se os filtros de distância devem aparecer ou não
    const [filtroDistanciaAtivado, setFiltroDistanciaAtivado] = useState(true);

    // Função que atualiza a raça dependendo do tipo de pet
    const updateRacaOptions = (selectedTipo) => {
        // Verifica se o campo "Raça" já tem um valor definido
        if (raca != '') {
            // O campo "Raça" está vazio, então você pode definir a raça com base no tipo
            if (selectedTipo === 'Cão') {
                setRaca('Pug');
            } else if (selectedTipo === 'Gato') {
                setRaca('Persa');
            }
        }
        // Atualiza o estado de racaOptions com base no tipo selecionado
        if (selectedTipo === 'Cão') {
            setRacaOptions(['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']);
        } else if (selectedTipo === 'Gato') {
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]);
        }
    };


    // Lógica que puxa as preferências já definidas de um usuário
    useEffect(() => {
        const fetchUserPreferences = async () => {

            // Verifica se o usuário está logado
            if (!auth.currentUser) {
                console.log("User not logged in");
                return;
            }

            try {
                // Busca na coleção de preferencias
                const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);
                const preferencesDoc = await getDoc(preferencesRef);

                if (preferencesDoc.exists()) {
                    const preferencesData = preferencesDoc.data();
                    // Preenche os campos com os dados do documento de preferências
                    setSexo(preferencesData.sexo || '');
                    setTipo(preferencesData.tipo || '');
                    setRaca(preferencesData.raca || '');
                    setDistancia(preferencesData.distancia || 0);
                    if (racaOptions.length > 0) {
                        // Renderiza o SelectDropdown
                    }
                    // Chama a função updateRacaOptions com o tipo existente para preencher as opções de raça
                    updateRacaOptions(preferencesData.tipo || '');
                }
            } catch (error) {
                console.error('Error fetching user preferences:', error);
            }
        };

        fetchUserPreferences();

    }, []);



    // Função que salva as preferências do usuário
    const savePreferences = async () => {

        // Cria um objeto que contenha todos os filtros
        const filters = {
            sexo: sexo,
            tipo: tipo,
            raca: raca,
            distancia: distancia,
            userId: auth.currentUser.uid,
        };

        // Adiciona o filtro de distância apenas se estiver ativado
        if (filtroDistanciaAtivado) {
            filters.distancia = distancia;
        } else {
            filters.distancia = 999999999999; // Um valor alto para mostrar todos os pets
        }

        try {
            // Salva os filtros no AsyncStorage
            await AsyncStorage.setItem('userFilters', JSON.stringify(filters));

            // Salva os filtros no Firestore
            const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);
            await setDoc(preferencesRef, filters, { merge: true });

            // Navega de volta para a tela de Avaliação
            navigation.navigate('BottomTabs');
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    // Função para limpar os filtros
    // Função para limpar os filtros
    const limparFiltros = async () => {
        try {
            // Referência ao documento de filtro no Firestore
            const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);

            // Crie um objeto vazio para definir todos os campos como null ou vazio
            const clearedFilters = {
                sexo: null,
                tipo: null,
                raca: null,
                distancia: null,
            };

            // Atualize o documento de preferências com os campos nulos ou vazios
            await setDoc(preferencesRef, clearedFilters, { merge: true });

            // Atualiza os estados dos campos para refletir as alterações
            setSexo('');
            setTipo('');
            setRaca('');
            setDistancia(0);

            // Navega de volta para a tela de Avaliação
            navigation.navigate('BottomTabs');
        } catch (error) {
            console.error('Error clearing filters:', error);
        }
    };


    if (!fontsLoaded && !fontError) {
        return null;
    } // Condição caso as fontes não carreguem

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="FILTROS" iconName="filter-alt" />
                <ScrollView>
                    <View style={styles.cabecalho}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomTabs')} style={styles.returnButton}>
                            <Ionicons name={'arrow-undo'} size={40} color="white" style={styles.returnIcon} />
                        </TouchableOpacity>
                        <View style={styles.limparContainer}>
                            <TouchableOpacity
                                style={styles.botaoLimpar}
                                onPress={limparFiltros}
                            >
                                <Text style={styles.botaoLimparText}>Limpar Filtros</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.fundoContainer}>


                        <View style={styles.inputContainer}>
                            <Text style={styles.titleFilterPets}>FILTRANDO PETS</Text>
                            <View style={styles.sexoContainer}>
                                <Text style={styles.sexoContainerText}>Sexo</Text>
                                <SelectDropdown
                                    data={sexoOptions}
                                    onSelect={(selectedItem, index) => setSexo(selectedItem)}
                                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                    rowTextForSelection={(item, index) => item}
                                    dropdownIconPosition="right"
                                    defaultButtonText="Selecione"
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                    defaultValue={sexo} // Defina o valor inicial aqui
                                />
                            </View>
                            <View style={styles.tipoContainer}>
                                <Text style={styles.tipoContainerText}>Tipo</Text>
                                <SelectDropdown
                                    data={['Cão', 'Gato']}
                                    onSelect={(selectedItem, index) => {
                                        setTipo(selectedItem);



                                        updateRacaOptions(selectedItem);
                                        setShowRacaDropdown(true);
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                    rowTextForSelection={(item, index) => item}
                                    dropdownIconPosition="right"
                                    defaultButtonText="Selecione"
                                    buttonStyle={styles.dropdownButton}
                                    buttonTextStyle={styles.dropdownButtonText}
                                    dropdownStyle={styles.dropdownContainer}
                                    defaultValue={tipo}
                                />
                            </View>

                            <View style={styles.racaContainer}>

                                {racaOptions.length > 0 && (
                                    <>
                                        <Text style={styles.racaContainerText}>Raça</Text>
                                        <SelectDropdown
                                            data={racaOptions} // Use o estado racaOptions como fonte de dados
                                            onSelect={(selectedItem, index) => setRaca(selectedItem)} // Atualize a raça selecionada
                                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                            rowTextForSelection={(item, index) => item}
                                            dropdownIconPosition="right"
                                            defaultButtonText="Selecione"
                                            buttonStyle={styles.dropdownButton}
                                            buttonTextStyle={styles.dropdownButtonText}
                                            dropdownStyle={styles.dropdownContainer}
                                            defaultValue={raca}
                                        />
                                    </>
                                )}
                            </View>

                            <View style={styles.filtroDistanciaContainer}>
                                <Text style={styles.titleDistance}>Filtrar por Distância</Text>
                            </View>

                            {filtroDistanciaAtivado && (
                                <View style={styles.baseDistance}>


                                    <TouchableOpacity
                                        style={[styles.buttonDistance5, distancia === 5 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(5)}
                                    >
                                        <Text style={[styles.textInside, distancia === 5 && styles.textInsideSelected]}>5 km</Text>
                                        {distancia === 5 && (
                                            <Ionicons
                                                name="close-circle" // Nome do ícone de "X"
                                                size={30} // Tamanho do ícone
                                                style={styles.closefilter} // Estilo para posicionar o ícone "X"
                                                color={'#573C35'}
                                                onPress={() => setDistancia(0)} // Adicione a ação para desmarcar o botão
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.buttonDistance10, distancia === 10 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(10)}
                                    >
                                        <Text style={[styles.textInside, distancia === 10 && styles.textInsideSelected]}>10 km</Text>
                                        {distancia === 10 && (
                                            <Ionicons
                                                name="close-circle" // Nome do ícone de "X"
                                                size={30} // Tamanho do ícone
                                                style={styles.closefilter} // Estilo para posicionar o ícone "X"
                                                color={'#573C35'}
                                                onPress={() => setDistancia(0)} // Adicione a ação para desmarcar o botão
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.buttonDistance15, distancia === 15 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(15)}
                                    >
                                        <Text style={[styles.textInside, distancia === 15 && styles.textInsideSelected]}>15 km</Text>
                                        {distancia === 15 && (
                                            <Ionicons
                                                name="close-circle" // Nome do ícone de "X"
                                                size={30} // Tamanho do ícone
                                                style={styles.closefilter} // Estilo para posicionar o ícone "X"
                                                color={'#573C35'}
                                                onPress={() => setDistancia(0)} // Adicione a ação para desmarcar o botão
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}


                            <TouchableOpacity
                                style={styles.botaoSalvar}
                                onPress={savePreferences} // Adicione isso para chamar a função ao pressionar o botão
                            >
                                <Text style={styles.botaoSalvarText}>Salvar</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
            </ImageBackground>
        </PaperProvider>

    );
}