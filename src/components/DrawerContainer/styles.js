import {Dimensions, StyleSheet} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {GT, GT_BOLD} from "../../constants/fonts";

export const styles = StyleSheet.create({
  container:{
    padding: normalize(24),
    flex: 1,
    height: Dimensions.get('window').height,
    paddingTop: normalize(50)
  },
  label:{
    position:'absolute',width:normalize(90),height:normalize(48),left:'108.7%',zIndex:-1
  },
  rowContainer:{
    flexDirection:'row',alignItems:'center'
  },
  title:{
    color:'#1F1E1D',fontSize:normalize(24),fontFamily:GT_BOLD
  },
  menuItem:{
    flexDirection:'row',alignItems:'center',marginTop:normalize(40)
  },
  menuItemText:{
    color:'#1F1E1D',fontSize:normalize(16),marginLeft:normalize(15),fontFamily:GT_BOLD
  },
  languageBlock:{
    alignItems:'center',justifyContent:'center', left:0,position:'absolute',bottom:normalize(80)
  }

})
