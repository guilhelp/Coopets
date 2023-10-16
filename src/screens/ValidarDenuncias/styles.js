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

    // Configurando cabeçalho da página
    cabecalhoPagina: {
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('20%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tituloCabecalho: {
        marginTop: '8%',
        fontSize: wp('10%'),
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#FFF',
        paddingHorizontal: 30
    },
    logoAdm: {
        width: 80,
        height: 80,
        marginTop: 20,
        paddingLeft: 20
    },
    sairButton: {
        width: 70,
        height: 70,
        marginTop: 20,
    },

    // Configurando a view dos cards
    denunciasCard:{
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Configurando o título de denúncias
    tituloDenuncias:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('9%'),
        color: '#000000',
        marginTop: 20,
        marginLeft: 20,
        marginBottom: 15,
    },

})