import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    header:{
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#573C35',
        width: wp('100%'),
        height: hp('22%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText:{
        marginTop: '8%',
        fontSize: wp('10%'),
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#FFF',
        paddingHorizontal: 20
    },
    button:{
        marginTop: '8%',
       
    }
});