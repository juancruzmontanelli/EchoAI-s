import React from "react";
import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import { motion } from "framer-motion";

function EchoCtf() {
  const [echoCtf, setEchoCtf] = useState(null);
  const [prediction, setPrediction] = useState(0);
  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    // Función para cargar el modelo y hacer una predicción
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          "../public/model/echoctf/model.json"
        );
        setEchoCtf(loadedModel);
        console.log("Modelo cargado correctamente");
      } catch (error) {
        console.error("Error cargando el modelo:", error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    makePrediction(inputValue);
  }, [inputValue]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Actualiza el estado con el valor del input
  };

  // Función para hacer una predicción cuando el modelo esté listo
  const makePrediction = async (input) => {
    if (echoCtf) {
      // Aquí necesitas crear un tensor adecuado para la predicción
      const t2d = tf.tensor2d([[parseFloat(input)]]); // Por ejemplo, un tensor 2D con el valor 100
      const output = echoCtf.predict(t2d);

      // Para obtener el valor real, necesitas llamar a .data() o .array()
      const predictionResult = await output.array();
      setPrediction(predictionResult);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className=""
    >


      <div className="card">
        <p>Celsius: {inputValue}</p>
        <input
          className=" range-slider appearance-none w-full h-2 rounded-lg cursor-pointer"
          type="range"
          min={0}
          max={100}
          step={1}
          value={inputValue}
          onChange={handleInputChange}
        />

        <div className="flex justify-center gap-2">
          <p> Resultado de la predicción: </p>
          {prediction && <p>{JSON.stringify(prediction[0][0].toFixed(2))}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default EchoCtf;
