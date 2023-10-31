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

  // Configurando o cabeçalho personalizado da página
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  returnButton: {
    width: 60,
    height: 60,
    borderRadius: 200,
    backgroundColor: '#573C35',
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },

  // Configurando o fundo transparente da página
  fundoContainer: {
    backgroundColor: 'rgba(87,60,53, 0.75)',
    width: '100%',
    height: '150%',
    borderColor: '#573C35',
    borderWidth: 5,
    borderRadius: 20,
    marginTop: 20,

  },

  // Configurando o container de inputs
  inputContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Configurando o título de filtrando pets
  titleFilterPets: {
    fontFamily: 'LuckiestGuy_400Regular',
    fontSize: wp('10%'),
    color: '#FFF',
    margin: 10,
  },

  // Configurando os dropdown
  sexoContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  sexoContainerText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#FFF',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  tipoContainerText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#FFF',
    paddingHorizontal: 33,
    marginTop: 10,
  },
  racaContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10
  },
  racaContainerText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('6%'),
    color: '#FFF',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  dropdownButton: {
    width: 146,
    height: 53,
    backgroundColor: '#FFF',
    borderRadius: 10,
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


  // Configurando as distâncias
  textInside: {
    fontSize: wp('5%'),
    color: '#000000',
    fontFamily: 'LuckiestGuy_400Regular',
  },
  closefilter: {
    position: 'absolute',
    bottom: 40,
    left: 38,
    zIndex: 1
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
  },
  filtroDistanciaContainer: {
    paddingTop: 30,
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
  selectedButtonDistance: {
    backgroundColor: "#FFF",
    borderColor: "#FFF",
  },
  textInsideSelected: {
    color: '#000000'
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

  // Configurando o botão de limpar 
  limparContainer: {
    marginTop: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  botaoLimpar: {
    width: wp('30%'),
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 17,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#573C35',
  },
  botaoLimparText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('3%'),
    color: '#000000',
  },

  // Configurando botão Salvar
  botaoSalvar: {
    width: 202,
    height: 62,
    backgroundColor: '#FFF',
    borderRadius: 17,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 60,
    borderColor: '#573C35',
    
  },
  botaoSalvarText: {
    fontFamily: 'Roboto_900Black',
    fontSize: wp('5%'),
    color: '#000000',

  },


});