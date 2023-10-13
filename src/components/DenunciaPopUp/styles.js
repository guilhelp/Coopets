import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    topo:{
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    popup: {
      backgroundColor: '#573C35',
      padding: 30,
      borderRadius: 10,
      elevation: 5,
      width: wp('95%'),
      height: hp('50%'),
      paddingHorizontal: 20,
      borderWidth: 2,
      borderColor: 'white'
    },
    title: {
      fontSize: wp('9%'),
      marginBottom: 10,
      fontFamily: 'LuckiestGuy_400Regular',
      color: 'white',
    },
    optionSubTitleText:{
  
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    optionText:{
      fontFamily: 'Roboto_900Black',
      fontSize: 20,
      color: '#FFF',
    },
    optionSubTitleText:{
      fontFamily: 'Roboto_900Black',
      fontSize: wp('5%'),
      marginTop: 10,
      marginBottom: 20,
      color: '#FFF',
    },
    header:{
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    submitButton: {
      marginTop: 20,
      backgroundColor: '#FFF',
      color: 'black',
      textAlign: 'center',
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      fontWeight: 'bold',
    },
    submitButtonText:{
      fontFamily: 'Roboto_900Black',
      fontSize: 20,
    },
    closeButton: {
      color: '#000000',
      paddingBottom: 10,
    },
    optionSquare: {
      width: 20,
      height: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'white', // Cor da borda
      borderRadius: 4, // Para criar um visual arredondado
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    selectedOptionSquare: {
      backgroundColor: 'white', // Cor de fundo quando selecionado
    },
  });