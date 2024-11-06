import React from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Home from "./componets/Home";
import EchoCtf from "./componets/EchoCtf";
import { EchoDigiter } from "./componets/EchoDigiter";
import EchoHands from "./componets/EchoHands";

export const AppContent = () => {
  const location = useLocation();

  return (
    <div className="full-screen-div relative flex bg-slate-900 w-full  justify-center items-center  rounded-2xl">
      {location.pathname != "/" ? (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          iv
          className="absolute top-4 left-4 z-10"
        >
          <NavLink to="/">
            <FiArrowLeft size={50} className="text-white cursor-pointer" />
          </NavLink>
        </motion.div>
      ) : (
        ""
      )}

      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/echoctf" element={<EchoCtf />} />
        <Route path="/echodigiter" element={<EchoDigiter />} />
        <Route path="/echohands" element={<EchoHands />} />
      </Routes>
    </div>
  );
};
