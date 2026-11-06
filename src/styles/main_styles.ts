import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 46,
    //paddingVertical: 16,
    width: "60%",
    height: 60,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    alignSelf: "center",
    borderColor: "#FFFFFF", //"#07199C",
    borderWidth: 3
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonsContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50
  },
  bigHeader: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  imageStyle: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    width: width,
    height: height,
    resizeMode: "cover"
  },
  box: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  selModalCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "70%"
  },
  sModalBox: {
    borderWidth: 4,
    borderColor: "#07199C",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(7, 25, 156, 0.1)"
  },
  modalBoxTxt: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#07199C",
    textAlign: "center",
  },
  boxTxt: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: "center"
  },
  playerTxt: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center"
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
  },
  scoreContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20
  },
  eogModalCont: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: "70%"
  },
  eogText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#07199C",
    textAlign: "center",
  },
  eogButton: {
    backgroundColor: "#07199C",
    width: "70%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  eogButtonTxt: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  boardSizeTxt: {
    position: "absolute",
    top: 40,
    right: 20
  }
});

export default styles;