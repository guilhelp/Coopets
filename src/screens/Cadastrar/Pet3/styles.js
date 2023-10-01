import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    // Configurando o Keyboard container
    container: {
        flex: 1,

    },
    // Configurações da página
    background: {
        width: wp('100%'),
        height: hp('110%'),
    },

    // Configurando os inputs
    inputText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('7%'),
        color: '#000000',
        margin: 28,
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    botaoAvancar: {
        width: wp('80'),
        height: hp('8%'),
        backgroundColor: '#573C35',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    botaoAvancarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('6%'),
        color: '#FFF',
    },

    // Configurando as imagens
    inputTitle:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
        textAlign: 'left',
        alignItems: 'center'
    },
    imageInput:{
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
    selectedImage:{
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
    buttonImage:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Tela Bloqueada
    imagemLogo:{
        width: wp('60%'),
        height: hp('30%'),
    },
    carregando:{
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
        width: wp('100%'),
        height: hp('110%'),
      },
      overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },


});