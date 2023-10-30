import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    
    // Configurando o cabeçalho personalizado da página
    cabecalhoPagina: {
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('22%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    tituloCabecalho: {
        marginTop: '8%',
        fontSize: wp('10%'),
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#FFF',
        paddingHorizontal: 20
    },
    logoImage: {
        width: 80,
        height: 80,
        marginTop: 30,
        paddingLeft: 10,
    },
    filterButton: {
        width: 70,
        height: 70,
        marginTop: 20,

    },

    // Configurando os cards dos pets
    cardContainer: {
        width: wp('95%'),
        height:  hp('65%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 140,
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Configurando o botão de perfil
    buttonPerfilContainer:{
        padding: 10,
        marginLeft: '67%',
        position: 'absolute',
        fontFamily: 'Roboto_900Black',
    },
    buttonPerfil:{
        backgroundColor: '#573C35',
        width: wp('25%'),
        height:  hp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
    },
    buttonPerfilText:{
        color: '#FFF',
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
    },
    
    // Configurando as informações card
    petInfoContainer: {
        position: 'absolute',
        bottom: 50,
        width: 1000,
        height: 150,
        padding: 16,
        fontFamily: 'Roboto_900Black',
    },
    name: {
        fontSize: wp('7%'),
        color: 'white',
        marginBottom: 10,
        marginTop: 50,
        fontFamily: 'Roboto_900Black',
    },
    age: {
        fontSize: wp('5%'),
        color: 'white',
        fontFamily: 'Roboto_900Black',
    },
    card: {
        borderColor: "#573C35",
        borderWidth: 4,
        borderRadius: 20,
        overflow: 'hidden',
        width: wp('95%'),
        height:  hp('60%'),
    },

    // Configurando efeito de gradiente do card
    overlayContainer: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('30%'),
        justifyContent: 'flex-end',
        padding: 16,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    
    // Configurando o não há mais pets
    messageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    messageText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5.5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Configurando botões de like e dislike
    button: {
        backgroundColor: '#573C35',
        width: 140,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 110,
    },
    likeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('17%'),
        height: hp('8%'),
    },
    dislikeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('10%'),
        height: hp('5%'),
    },

    // Configurando pop-up do match
    matchPopup: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    closePopupButton: {
        borderRadius: 8,
        backgroundColor: '#FFF',
        width: 150,
        height: 50,
        alignContent: 'center',
        justifyContent: 'center',
        borderColor: "#EEE1D3",
        marginBottom: 50,
        textAlign: 'center',
        borderColor: '#573C35',
        borderWidth: 3,
    },
    closePopupButtonText: {
        fontSize: 20,
        paddingLeft: 40,
        color: 'black',
        fontFamily: 'Roboto_900Black',
        alignContent: 'center',
        justifyContent: 'center',
        
    },
    petchMatch: {
        fontFamily: 'Roboto_900Black',
        fontSize: 20,
    },

    // Configurando tela de bloqueio
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
        zIndex: 4,
      },
      overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
});