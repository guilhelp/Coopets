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
    cardContainer: {
        width: wp('95%'),
        height:  hp('65%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 140,

    },
    messageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,

    },
    messageText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('7%'),
        justifyContent: 'center',
        alignItems: 'center',
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
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    petInfoContainer: {
        position: 'absolute',
        bottom: 50,
        width: 1000,
        height: 150,
        padding: 16,
        fontFamily: 'Roboto_900Black',
    },
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
        width: wp('20%'),
        height: hp('10%'),
    },
    dislikeIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('13%'),
        height: hp('6%'),
    },
    matchPopup: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo semi-transparente

    },
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
        paddingHorizontal: 20
    },
    petImage: {
        width: 80,
        height: 80,
        marginTop: 20,
    },
    filterButton: {
        width: 70,
        height: 70,
        marginTop: 20,

    },
    closePopupButton: {
        borderRadius: 8,
        backgroundColor: '#FFF',
        width: 150,
        height: 70,
        alignContent: 'center',
        justifyContent: 'center',
        borderColor: "#EEE1D3",
        marginBottom: 10
    },
    closePopupButtonText: {
        fontSize: 20,
        marginLeft: 40,
        color: 'black',
        fontFamily: 'Roboto_900Black',
        alignContent: 'center',
        justifyContent: 'center',
    },
    petchMatch: {
        fontFamily: 'Roboto_900Black',
        fontSize: 20,
    }
});