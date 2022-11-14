import {StyleSheet} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {GT} from "../../constants/fonts";

export const styles = StyleSheet.create({
  headerContainer:{
    backgroundColor: '#3772FF', borderRadius: 25, marginTop: normalize(15), paddingTop: normalize(18)
  },
  arrowUp: {
    borderTopWidth: 0,
    borderRightWidth: 30,
    borderBottomWidth: 30,
    borderLeftWidth: 30,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "tomato",
    borderLeftColor: 'transparent',
  },
  arrowRight: {
    borderTopWidth: 30,
    borderRightWidth: 0,
    borderBottomWidth: 30,
    borderLeftWidth: "tomato",
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: "tomato",
  },
  arrowDown: {
    borderTopWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 0,
    borderLeftWidth: 30,
    borderTopColor: "tomato",
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowLeft: {
    borderTopWidth: 30,
    borderRightWidth: "tomato",
    borderBottomWidth: 30,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: "tomato",
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowUpLeft: {
    borderTopWidth: 30,
    borderRightWidth: "tomato",
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopColor: "tomato",
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowUpRight: {
    borderTopWidth: 0,
    borderRightWidth: "tomato",
    borderBottomWidth: 30,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: "tomato",
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  arrowDownLeft: {
    borderTopWidth: 30,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: "tomato",
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: "tomato",
  },
  arrowDownRight: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 30,
    borderLeftWidth: "tomato",
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: "tomato",
    borderLeftColor: 'transparent',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",

  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 22,
    borderTopWidth: normalize(56),
    borderRightColor: "transparent",
    borderTopColor: "#FE7B01",
  },
  triangleDown: {
    transform: [{rotate: "180deg"}],
  },
  parallelogram: {
    height: 56,
    flexDirection: "row",

  },
  parallelogramInner: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#FE7B01",
    width: 230,
    height: 100,
  },
  parallelogramRight: {
    top: 0,
    right: -50,
    position: "absolute",
  },
  parallelogramLeft: {
    top: 0,
    left: -50,
    position: "absolute",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  screenButton: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
  },
  scanButton: {
    backgroundColor: "#FE7B01",
    width: normalize(200),
    height: normalize(56),
    alignItems: "center",
    paddingLeft: 25,
    flexDirection: "row",
    // transform: [{ skewY: "-10deg" }]


  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reserveBlock: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: normalize(25),
    width: "100%",


  },
  reserveRow:{
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#EDEDF1",
    paddingBottom: normalize(14),
  },
  reserveTitle: {
    fontFamily: GT,
    fontSize: normalize(24),
    fontWeight: "500",
  },
  cardDot: {
    width: 4, height: 4, backgroundColor: "#1F1E1D", borderRadius: 10, marginRight: normalize(5)
  },
  reserveButton: {
    borderColor: 'rgba(254, 123, 1, 0.24)',
    borderWidth: 1,
    padding: 16,
    width: '100%',
    marginTop: normalize(35),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reserveButtonText: {
    color: '#EF4E4E',
    fontFamily: GT,
    fontWeight: '500',
    fontSize: normalize(24)
  },
  timerBlock: {
    backgroundColor: '#3772FF',
    paddingLeft: normalize(24),
    paddingRight: normalize(24),
    borderRadius: 5,
    width: normalize(117),
    height: normalize(48),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: normalize(8)
  },
  scooterImg:{
    width: normalize(48), height: normalize(48)
  },
  ongoingText:{
    color: 'white', marginLeft: normalize(18), fontSize: normalize(16)
  },
  stopReserveButton:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    marginTop: normalize(35)
  },
  cancelText:{
    fontSize: normalize(24),
    color: '#EF4E4E',
    fontFamily: GT,
    position: 'absolute'
  }
});
