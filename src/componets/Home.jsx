import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x:0 }}
      className="flex flex-col items-center gap-8"
    >
      <h1 className="text-center text-4xl font-bold">Welcome to Echo</h1>
      <div className="">
        <ul className="hexagon-container">
          <li className="hexagon hex_1"></li>
          <li className="hexagon hex_2"></li>
          <li className="hexagon hex_3"></li>
          <li className="hexagon hex_4"></li>
          <li className="hexagon hex_5"></li>
          <li className="hexagon hex_6"></li>
          <li className="hexagon hex_7"></li>
        </ul>
      </div>
      <NavLink
        to="/echohands"
        className=" text-center bg-zinc-950 p-2 rounded-2xl border border-zinc-950 hover:border-white transition duration-300 ease-in-out"
      >
        See more
      </NavLink>
    </motion.div>
  );
}
