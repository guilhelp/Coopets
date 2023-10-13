import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(116, 81, 70, 0.3)',
    borderColor: '#EEE1D3',
    borderWidth: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  background: {
    width: '100%',
    height: '100%',
  },

  // Cabeçalho da página
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
  chatImage: {
    width: 80,
    height: 80,
    marginTop: 30,
    paddingLeft: 10,
  },


  buttonContainer: {
    marginTop: 30,
  },
  chatItemContent: {
    backgroundColor: '#E8CBC1',
    flexDirection: 'row',
    alignItems: 'center',
    width: 370,
    marginTop: 15,
    borderRadius: 30,
    borderColor: '#EEE1D3',
    borderWidth: 5,
  },
  chatItemImage: {
    width: 80,
    height: 80,
    borderRadius: 200,
    margin: 10,
  },
  chatDetailsContent: {

  },
  chatItemName: {
    fontFamily: 'Roboto_900Black',
    fontSize: 22,
    color: '#000000',
    marginBottom: 1,
  },
  chatItemLastMessage: {
    fontFamily: 'Roboto_900Black',
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 1,
  },
  lastMessageText: {
    fontSize: 100,
  },
  chatLastMessage: {
    fontSize: 15,
  },


});