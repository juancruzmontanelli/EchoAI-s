import { useRef, useEffect, useState } from "react";
// import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
// import * as tf from "@tensorflow/tfjs-core";
// // Register WebGL backend.
// import "@tensorflow/tfjs-backend-webgl";
// import { canvas } from "framer-motion/client";

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"; // Importa las clases necesarias desde "@mediapipe/tasks-vision"

const EchoHands = () => {
  const [isCamaraOn, setIsCamaraOn] = useState(false);
  const [model, setModel] = useState(null);
  const [runningMode, setRunningMode] = useState("IMAGE");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const creatHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: "GPU",
        },
        runningMode: runningMode,
        numHands: 2,
      });

      setModel(handLandmarker);
    };
  
    return () => {
      creatHandLandmarker();
      stopCamaraWeb();
    };
  }, []);

  const startCamaraweb = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCamaraOn(true);
    } catch (error) {
      console.error("Error al acceder a la cámara web:", error);
    }
  };

  const stopCamaraWeb = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop()); // Detiene cada track de video
      videoRef.current.srcObject = null;
    }
    setIsCamaraOn(false);
  };

  const toggleCamera = () => {
    if (isCamaraOn) {
      stopCamaraWeb();
    } else {
      startCamaraweb();
    }
  };

  return (
    <div>
      <h1>Camara Web</h1>
      <video ref={videoRef} autoPlay playsInline width="100%" />
      <canvas ref={canvasRef} />
      <button
        onClick={toggleCamera}
        className="text-center bg-zinc-950 p-2 m-2 rounded-2xl border border-zinc-950 hover:border-white transition duration-300 ease-in-out"
      >
        {isCamaraOn ? "Apagar Cámara" : "Encender Cámara"}
      </button>
    </div>
  );
};

export default EchoHands;
