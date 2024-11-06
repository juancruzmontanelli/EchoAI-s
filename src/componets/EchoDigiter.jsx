import React, { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import Canva from "./Canva";
import { motion } from "framer-motion";

export const EchoDigiter = () => {
  const [echodigiter, setEchoDigiter] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const canvasRef = useRef(null);
  const smallCanvasRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          "../public/model/echodigiter/model.json"
        );
        setEchoDigiter(loadedModel);
        console.log("Modelo cargado correctamente");
      } catch (error) {
        console.error("Error cargando el modelo:", error);
      }
    };

    loadModel();
  }, []);

  const handlePredict = async () => {
    // Visualizar el canvas original antes de redimensionar
    const originalCanvas = canvasRef.current;
    const originalCtx = originalCanvas.getContext("2d");
    // console.log("Valores del canvas original:");
    const originalData = originalCtx.getImageData(
      0,
      0,
      originalCanvas.width,
      originalCanvas.height
    );
    // console.log(
    //   "Primeros 10 valores de píxeles originales:",
    //   Array.from(originalData.data).slice(0, 40)
    // );

    // Redimensionar el canvas grande al tamaño 28x28
    resample_single(originalCanvas, 28, 28, smallCanvasRef.current);

    //Crear y visualizar la imagen redimensionada (28x28) en el DOM
    const smallCanvas = smallCanvasRef.current;

    // Visualizar los valores de píxeles en el canvas redimensionado
    const smallCtx = smallCanvas.getContext("2d");
    const smallData = smallCtx.getImageData(0, 0, 28, 28);
    // console.log(
    //   "Primeros 10 valores de píxeles en el canvas redimensionado:",
    //   Array.from(smallData.data).slice(0, 40)
    // );

    // Normalizar los valores de los píxeles y preparar la entrada para el modelo
    // Asegúrate de usar solo el canal de rojo para imágenes en escala de grises
    const input = Array.from(smallData.data)
      .filter((_, i) => i % 4 === 0)
      .map((value) => value / 255.0);

    //Verificar los valores normalizados
    // console.log("Numero de valores en el input :", input.length);
    // console.log("Primeros 10 valores normalizados:", input.slice(0, 10));

    // Convertir a un tensor adecuado para el modelo y realizar la predicción
    const tensorInput = tf.tensor(input).reshape([1, 28, 28]); // Tensor de 3 dimensiones
    const prediction = await echodigiter.predict(tensorInput);
  
    const probabilities = tf.softmax(prediction).arraySync()[0];

    // Mostrar las probabilidades de cada clase
    // probabilities.forEach((prob, index) => {
    //   console.log(`${index}: ${prob}`);
    // });

    // Mostrar la clase predicha
    const predictedClass = probabilities.indexOf(Math.max(...probabilities));
    // console.log("Clase predicha:", predictedClass);
    setPrediction(predictedClass);
  };
  const resample_single = (
    sourceCanvas,
    targetWidth,
    targetHeight,
    targetCanvas
  ) => {
    const ctx = targetCanvas.getContext("2d");

    // Establecer el tamaño del canvas destino
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;

    // Llenar el canvas con blanco para que el fondo sea claro
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Dibujar la imagen redimensionada encima del fondo blanco
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

    // Obtener los datos de píxeles de la imagen redimensionada
    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels = imageData.data;

    // Recorrer cada píxel y hacer la inversión de colores
    for (let i = 0; i < pixels.length; i += 4) {
      // Invertir el color: blanco (255) a negro (0) y negro (0) a blanco (255)
      pixels[i] = 255 - pixels[i]; // Rojo
      pixels[i + 1] = 255 - pixels[i + 1]; // Verde
      pixels[i + 2] = 255 - pixels[i + 2]; // Azul
      // El canal alpha permanece igual
    }

    // Poner los datos de píxeles invertidos de vuelta en el canvas
    ctx.putImageData(imageData, 0, 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8"
    >
      <Canva width={400} height={400} style={" bg-white"} ref={canvasRef} />
      <Canva
        width={28}
        height={28}
        style={" bg-white hidden "}
        ref={smallCanvasRef}
      />

      <h1>El valor Predecido es: <p className=" font-bold">{prediction}</p></h1>
      <div className="flex gap-8">
        <button
          onClick={handleClear}
          className="text-center bg-zinc-950 p-2 rounded-2xl border border-zinc-950 hover:border-white transition duration-300 ease-in-out"
        >
          Limpiar
        </button>
        <button
          onClick={handlePredict}
          className="text-center bg-zinc-950 p-2 rounded-2xl border border-zinc-950 hover:border-white transition duration-300 ease-in-out"
        >
          Predecir
        </button>
      </div>
    </motion.div>
  );
};
