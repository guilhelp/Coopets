import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(87, 60, 53, 0.93)',
      width: wp('100%'),
      height: hp('100%'),
      borderRadius: 50,
      borderColor: '#EEE1D3',
      borderWidth: 5,
      position: 'absolute',
      
    },
    matchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 30,
    },
    image: {
      width: wp('40%'),
      height: hp('21%'),
      borderRadius: 100,
      borderColor: '#EEE1D3',
      borderWidth: 5,
      marginHorizontal: -40, // Reduzir o valor da margem horizontal
      zIndex: 1, // Defina um valor de zIndex menor
    },
    heartIcon: {
      width: wp('25%'),
      height: hp('13%'),
      zIndex: 2, // Defina um valor de zIndex maior
      shadowColor: 'black', // Cor da sombra
      shadowOpacity: 0.9,   // Opacidade da sombra
      shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
      shadowRadius: 5,      // Raio da sombra
    },
    matchText: {
      marginTop: 10,
      fontSize: wp('8%'),
      color: 'white',
      textAlign: 'center',
      height: '65%',
      fontFamily: 'LuckiestGuy_400Regular',
    },
    closeButton: {
      borderColor: '#EEE1D3',
      borderRadius: 17,
      backgroundColor: '#FFF'
    },
    closeButtonText: {
      fontSize: 16,
      color: 'white',
    },
  });