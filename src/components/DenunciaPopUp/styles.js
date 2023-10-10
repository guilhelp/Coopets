import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    popup: {
      backgroundColor: 'white',
      padding: 30,
      borderRadius: 10,
      elevation: 5,
      width: wp('95%'),
      height: hp('45%'),
    },
    title: {
      fontSize: wp('7%'),
      fontWeight: 'bold',
      marginBottom: 10,
      fontFamily: 'Roboto_900Black',
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
      fontSize: wp('4%'),
    },
    optionSubTitleText:{
      fontFamily: 'Roboto_900Black',
      fontSize: wp('5%'),
      marginTop: 10,
      marginBottom: 20,
    },
    submitButton: {
      marginTop: 15,
      backgroundColor: '#573C35',
      color: 'white',
      padding: 10,
      textAlign: 'center',
      borderRadius: 5,
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: 10,
      color: '#000000',
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });