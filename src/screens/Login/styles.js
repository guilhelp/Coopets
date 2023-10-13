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

    // Container Imagem e Título COOPETS
    logoContainer: {
        width: wp('100%'),
        height: hp('50%'),
        backgroundColor: '#573C35',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemLogo: {
        marginTop: 10,
        width: wp('62%'),
        height: hp('32%'),
        marginBottom: 1,
    },
    textLogo: {
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: wp('19%'),
        color: '#FFF'
    },

    // Container de Inputs
    inputContainer: {
        alignItems: 'center',
    },
    entrarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('9%'),
        color: '#000000',
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 5,
    },

    botaoEnviar: {
        width: wp('70%'),
        height: hp('8%'),
        backgroundColor: '#573C35',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    botaoEnviarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#FFF',
    },

    // Container dos botões cadastrar e esqueci senha

    botoesContainer: {
        marginTop: '7%',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    botaoCadastro: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    botaoEsqueciSenha: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cadastroText: {
        paddingHorizontal: 5,
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
    },
    esqueciSenhaText: {
        paddingHorizontal: 5,
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
    }
})