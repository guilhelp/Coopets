import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'blue'
    },

    background: {
        flex: 1,
    },

    // Container Imagem e Título COOPETS
    logoContainer: {
        flex: 1,
        height: wp('110%'),
        backgroundColor: '#573C35',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemLogoBranca: {
        marginTop: 40,
        width: 280,
        height: 280,
        marginBottom: 1,
    },
    textLogo: {
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: wp('20%'),
        color: '#FFF'
    },

    entrarTextView: {
        paddingTop: 20,
        paddingBottom: 10,
        paddingLeft: 20,
    },

    // Container de Inputs
    inputContainer: {
        flex: 1,
        alignItems: 'center',
    },
    entrarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('9%'),
        color: '#000000',

    },

    // Configurando botão de enviar
    botaoEnviar: {
        width: wp('80%'),
        height: hp('8%'),
        backgroundColor: '#573C35',
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderColor: '#EEE1D3',
        borderWidth: 3,
    },
    botaoEnviarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#FFF',
    },

    // Container dos botões cadastrar e esqueci senha
    botoesContainer: {
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 30,
        marginTop: 10,
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
    },

    // Tela de carregamento
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
        zIndex: 4,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },

})