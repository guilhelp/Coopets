import { View, Text, ImageBackground, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import { db, auth } from '../../config/Firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estilos
import { styles } from './styles';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Expo
import { useFonts, LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_900Black } from '@expo-google-fonts/roboto';

// Importanto imagens
import Background from '../../assets/Background/Background.png'

// Importanto componentes
import Header from '../../components/Header';

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
    });

    const [sexo, setSexo] = useState('');
    const [tipo, setTipo] = useState('');
    const [raca, setRaca] = useState('');
    const [distancia, setDistancia] = useState(0);
    const sexoOptions = ['Macho', 'Fêmea'];
    const [showRacaDropdown, setShowRacaDropdown] = useState(false);
    const [racaOptions, setRacaOptions] = useState([])
    const [filtroDistanciaAtivado, setFiltroDistanciaAtivado] = useState(true);

    const updateRacaOptions = (selectedTipo) => {
        if (selectedTipo === 'Cão') {
            setRacaOptions(['Pug', 'Shih Tzu', 'Bulldog Francês', 'Pomerânia', 'Golden Retriever']);
        } else if (selectedTipo === 'Gato') {
            setRacaOptions(['Persa', 'Siamês', 'Angorá', 'Ashera', 'Sphynx']);
        } else {
            setRacaOptions([]); // Se nenhum tipo estiver selecionado, não há opções de raça
        }
    };


    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserPreferences = async () => {
            if (!auth.currentUser) {
                console.log("User not logged in");
                return;
            }

            try {
                const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);
                const preferencesDoc = await getDoc(preferencesRef);

                if (preferencesDoc.exists()) {
                    const preferencesData = preferencesDoc.data();
                    // Preencha os campos com os dados do documento de preferências
                    setSexo(preferencesData.sexo || '');
                    setTipo(preferencesData.tipo || '');
                    setRaca(preferencesData.raca || '');
                    setDistancia(preferencesData.distancia || 0);

                    // Chame a função updateRacaOptions com o tipo existente para preencher as opções de raça
                    updateRacaOptions(preferencesData.tipo || '');
                }
            } catch (error) {
                console.error('Error fetching user preferences:', error);
            }
        };

        fetchUserPreferences();
    }, []);

    const savePreferences = async () => {
        if (!auth.currentUser) {
            console.log("User not logged in");
            return;
        }

        // Crie um objeto que contenha todos os filtros
        const filters = {
            sexo: sexo,
            tipo: tipo,
            raca: raca,
            distancia: distancia,
            userId: auth.currentUser.uid,
        };

        // Adicione o filtro de distância apenas se estiver ativado
        if (filtroDistanciaAtivado) {
            filters.distancia = distancia;
        } else {
            filters.distancia = 99999; // Um valor alto para mostrar todos os pets
        }

        try {
            // Salve os filtros no AsyncStorage
            await AsyncStorage.setItem('userFilters', JSON.stringify(filters));

            // Salve os filtros no Firestore
            const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);
            await setDoc(preferencesRef, filters, { merge: true });

            // Navegue de volta para a tela de Avaliação
            navigation.navigate('BottomTabs');
            console.log('Preferences saved successfully!');
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    const limparFiltros = async () => {
        if (!auth.currentUser) {
            console.log("User not logged in");
            return;
        }
    
        try {
            // Referência ao documento de filtro no Firestore
            const preferencesRef = doc(db, 'preferencias', auth.currentUser.uid);
    
            // Verifique se o documento existe antes de tentar excluí-lo
            const preferencesDoc = await getDoc(preferencesRef);
    
            if (preferencesDoc.exists()) {
                // Use a função deleteDoc para excluir o documento
                await deleteDoc(preferencesRef);
    
                // Navegue de volta para a tela de Avaliação
                navigation.navigate('BottomTabs');
                console.log('Filters cleared successfully!');
            } else {
                // Exiba uma mensagem ao usuário informando que os filtros já foram limpos
                Alert.alert('Filtros já limpos', 'Os filtros já foram limpos anteriormente.');
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
        }
    };
    

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <ImageBackground source={Background} style={styles.background}>
                <Header title="FILTROS" iconName="supervised-user-circle" />
                <ScrollView>
                    <View style={styles.fundoContainer}>
                        <View style={styles.limparContainer}>
                            <TouchableOpacity
                                style={styles.botaoLimpar}
                                onPress={limparFiltros}
                            >
                                <Text style={styles.botaoLimparText}>Limpar Filtros</Text>
                            </TouchableOpacity>
                        </View>

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
                                        updateRacaOptions(selectedItem); // Atualize as opções de raça com base no tipo selecionado
                                        setShowRacaDropdown(true); // Mostrar o dropdown de raças quando um tipo é selecionado
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
                            </View>

                            <View style={styles.filtroDistanciaContainer}>
                                <Text style={styles.titleDistance}>Filtrar por Distância</Text>
                                <Switch
                                    value={filtroDistanciaAtivado}
                                    onValueChange={(newValue) => setFiltroDistanciaAtivado(newValue)}
                                />
                            </View>

                            {filtroDistanciaAtivado && (
                                <View style={styles.baseDistance}>
                                    <TouchableOpacity
                                        style={[styles.buttonDistance5, distancia === 5 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(5)}
                                    >
                                        <Text style={[styles.textInside, distancia === 5 && styles.textInsideSelected]}>5 km</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.buttonDistance10, distancia === 10 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(10)}
                                    >
                                        <Text style={[styles.textInside, distancia === 10 && styles.textInsideSelected]}>10 km</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.buttonDistance15, distancia === 15 && styles.selectedButtonDistance]}
                                        onPress={() => setDistancia(15)}
                                    >
                                        <Text style={[styles.textInside, distancia === 15 && styles.textInsideSelected]}>15 km</Text>
                                    </TouchableOpacity>
                                </View>
                            )}


                            <TouchableOpacity
                                style={styles.botaoAvancar}
                                onPress={savePreferences} // Adicione isso para chamar a função ao pressionar o botão
                            >
                                <Text style={styles.botaoAvancarText}>Salvar</Text>
                            </TouchableOpacity>

                        </View>

                    </View>
                </ScrollView>
            </ImageBackground>
        </PaperProvider>

    );
}