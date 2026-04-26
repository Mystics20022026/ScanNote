import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  topBar: {
    backgroundColor: "#1E40AF",
    height: 90,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: 10,
  },

  iconButton: {
    padding: 10,
  },

  camera: {
    flex: 1,
  },

  overlayText: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
  },

  previewTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 6,
  },

  previewSubtitle: {
    fontSize: 15,
    color: "#ddd",
    textAlign: "center",
  },

  bottomBar: {
    backgroundColor: "#1E40AF",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  bottomButton: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#3B82F6",
  },

  captureInner: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#EF4444",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 40,
  },

  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },

  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});