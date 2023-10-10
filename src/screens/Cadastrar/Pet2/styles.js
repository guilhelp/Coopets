import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    background: {
        width: wp('100%'),
        height: hp('110%'),
    },

    // Configurando o texto de título
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

    // Configurando os inputs de imagens
    inputTitle:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
        textAlign: 'left',
        alignItems: 'center'
    },
    imageInput:{
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
    selectedImage:{
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
    buttonImage:{
        justifyContent: 'center',
        alignItems: 'center'
    },

    // Configurando o botão de avançar
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


});