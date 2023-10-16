import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        width: wp('100%'),
        height: hp('110%'),
    },

    // Configurando o botão de Retornar
    returnButton: {
        width: 60,
        height: 60,
        borderRadius: 200,
        backgroundColor: '#573C35',
        marginLeft: -180,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },

    // Configurando o container dos input de perfil
    inputContainerPerfil: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageInputPerfil: {
        width: 259,
        height: 259,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#000000',
        borderRadius: 1000,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedImagePerfil: {
        width: 259,
        height: 259,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#000000',
        borderRadius: 1000,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Configurando o container dos input do responsável
    inputContainerResp: {
        marginBottom: 10,
        marginTop: 20,
    },

    // Configurando o date modal picker
    datePickerButton: {
        width: 336,
        height: 61,
        color: '#000000',
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#FFF',
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#717171',
        borderRadius: 5,
    },
    datePickerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10,
    },

    // Configurando o container dos input do pet
    inputContainerPet: {
        marginBottom: 10,
        marginTop: 20,
    },
    inputText: {
        fontSize: wp('8%'),
        color: '#000000',
        fontFamily: 'Roboto_900Black',
        marginBottom: 20,
        marginTop: 10,
    },

    // Configurando o container dos input de documentos
    inputContainerDocs: {
        marginBottom: 10,
        marginTop: 20,
    },

    // Configurando as imagens
    inputTitle: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
        textAlign: 'left',
        alignItems: 'center'
    },
    imageInput: {
        width: 336,
        height: 101,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#000000',
        borderRadius: 17,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedImage: {
        width: 336,
        height: 101,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#000000',
        borderRadius: 17,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonImage: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Configurando o select dropdown
    dropdownButton: {
        width: 336,
        height: 61,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#000000',
        margin: 5,
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#717171',
    },
    dropdownButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left'
    },
    customButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10,
    },
    dropdownContainer: {
        width: 336,
        height: 100,
        marginTop: '-10%',
        borderRadius: 5,
        backgroundColor: 'white',
        elevation: 5,
    },

    // Configurando o botão de salvar
    button: {
        backgroundColor: '#573C35',
        width: 350,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 20,
        marginBottom: 230,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Roboto_900Black',
    },

    // Configurando tela bloqueada
    imagemLogo: {
        width: wp('60%'),
        height: hp('30%'),
    },
    carregando: {
        color: '#FFFFFF',
        fontSize: 30,
        fontFamily: 'Roboto_900Black',
        marginBottom: 10,
    },
    loadingOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});
