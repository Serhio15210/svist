import {StyleSheet} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {GT} from "../../constants/fonts";

export const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.48)', alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  modalBlock: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: normalize(24)
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    marginTop: normalize(35)
  },
  buttonText:{
    fontSize: normalize(24),
    color: '#FE7B01',
    fontFamily: GT,
    position: 'absolute'
  },
  title: {
    fontSize: normalize(24),
    color: '#1F1E1D',
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: GT
  },
  text: {
    color: '#1F1E1D',
    fontFamily: GT
  },
  gpsBlock: {
    backgroundColor: '#3772FF',

    width: normalize(38),
    height: normalize(48),
    alignItems: 'center',
    justifyContent: 'center',

    // transform: [{ skewY: "5deg" }]
  }
})
