import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    // Configurando o Keyboard container
    container:{
        flex: 1,
        width: wp('100%'),
        height: hp('100%'),
    },
    background:{
        width: wp('100%'),
        height: hp('110%'),
    },
    fundoContainer:{
        backgroundColor: 'rgba(87,60,53, 0.75)',
        width: wp('100%'),
        height: hp('90%'),
        borderColor: '#573C35',
        borderWidth: 5,
        borderRadius: 20,
        marginTop: '15%'

    },
    inputContainer: {
        marginTop: 8,
        justifyContent: 'center',
        alignItems: 'center',  
    },
    titleFilterPets:{
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: wp('10%'),
        color: '#FFF',
        margin: 10,
    },

    // Configurando dropdown
    sexoContainer:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      padding: 10
      
    },
    sexoContainerText:{
      fontFamily: 'LuckiestGuy_400Regular',
      fontSize: wp('6%'),
      color: '#FFF',
      paddingHorizontal: 30,
      marginTop: 10,
    },

    tipoContainer:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      padding: 10
      
    },
    tipoContainerText:{
      fontFamily: 'LuckiestGuy_400Regular',
      fontSize: wp('6%'),
      color: '#FFF',
      paddingHorizontal: 33,
      marginTop: 10,
    },

    racaContainer:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      padding: 10
      
    },
    racaContainerText:{
      fontFamily: 'LuckiestGuy_400Regular',
      fontSize: wp('6%'),
      color: '#FFF',
      paddingHorizontal: 30,
      marginTop: 10,
    },

    dropdownButton: {
        width: 160,
        height: 61,
        backgroundColor: '#FFF',
        borderRadius: 5,
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
        borderWidth: 3,
        borderColor: '#573C35',
    },
    dropdownButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'left'
    },
    customButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 10,
    },
    dropdownContainer: {
        width: 160,
        height: 130,
        marginTop: '-10%',
        borderRadius: 5,
        backgroundColor: 'white',
        elevation: 5,
    },


    // Configurando distâncias
    textInside: {
        fontSize: wp('5%'),
        color: '#000000',
        fontFamily: 'LuckiestGuy_400Regular',
      },
      titleFilter: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('10%'),
        color: '#FFFFFF',
        marginRight: 20,
        marginLeft: -50,
      },
      titleDistance: {
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: wp('7%'),
        color: '#FFF',
        paddingTop: 5,
      },
      filtroDistanciaContainer:{
        paddingTop: 40,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
      },
      baseDistance: {
        height: 15,
        width: wp('60%'),
        backgroundColor: "#EEE1D3",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 45,
        
      },
      buttonDistance5: {
        height: 70,
        width: 70,
        backgroundColor: "#FFFFFF",
        borderColor: "#573C35",
        borderWidth: 5,
        borderRadius: 200,
        position: 'absolute',
        left: -3,
        alignItems: 'center',
        justifyContent: 'center',
      },
      selectedButtonDistance:{
        backgroundColor: "#573C35",
        borderColor: "#FFF",
      },
      textInsideSelected:{
        color: '#FFF'
      },
      buttonDistance10: {
        height: 70,
        width: 70,
        backgroundColor: "#FFFFFF",
        borderColor: "#573C35",
        borderWidth: 5,
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonDistance15: {
        height: 70,
        width: 70,
        backgroundColor: "#FFFFFF",
        borderColor: "#573C35",
        borderWidth: 5,
        borderRadius: 200,
        position: 'absolute',
        right: -3,
        alignItems: 'center',
        justifyContent: 'center',
      },

      limparContainer:{
        marginTop: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
      },
      botaoLimpar:{
        width: wp('30%'),
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 17,
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#573C35',
      },
      botaoLimparText:{
        fontFamily: 'Roboto_900Black',
        fontSize: wp('3%'),
        color: '#000000',
      },

      // Configurando botão Avançar
      botaoAvancar: {
        width: wp('50%'),
        height: 70,
        backgroundColor: '#FFF',
        borderRadius: 17,
        borderWidth: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 50,
        borderColor: '#573C35',
        
    },
    botaoAvancarText: {
        fontFamily: 'Roboto_900Black',
        fontSize: wp('5%'),
        color: '#000000',
       
    },
    

});