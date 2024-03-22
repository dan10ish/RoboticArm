import React from "react";
import "./index.css";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Arm from "./Arm.jsx";
import { motion } from "framer-motion-3d";

export default function App() {
  // Fix Height Bug in IOS
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", appHeight);
  appHeight();

  const [visible, setVisible] = React.useState(false);

  const CustomCamera = () => {
    const { camera } = useThree();
    camera.position.set(0, 3, 7); // Set camera position
    camera.rotation.set(0, 0, 0); // Set camera rotation
    camera.fov = 75; // Set camera field of view
  };

  return (
    <>
      <main>
        <motion.group
          dispose={null}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0,
            duration: 0,
          }}
        >
          <div id="name" className="name">
            <div className="title">
              d<span className="at"></span>n
              <span className="exclamation"></span>
              <span className="dollar"></span>
              <span className="hash"></span>
            </div>
            <div className="subTitle">3-DOF Robotic Arm</div>
          </div>

          <div className="i">
            <div className="i-icon" onClick={() => setVisible(true)}>
              i
            </div>
          </div>
        </motion.group>
        <div id="arm">
          <Canvas>
            <CustomCamera />
            <Arm scale={0.1} position={[0, -2.5, 0]} rotation={[0, 0, 0]} />
            <Environment preset="city" />
            <OrbitControls
              // minAzimuthAngle={-Math.PI / 4}
              // maxAzimuthAngle={Math.PI / 4}
              // minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
              enablePan={true}
            />
            <gridHelper
              args={[50, 50, 0xff0000, 0x999999]}
              position={[0, -2.5, 0]}
              rotation={[0, 0, 0]}
            />
          </Canvas>
        </div>
      </main>
      {visible && (
        <div className="three">
          <div className="buttonThree" onClick={() => setVisible(false)}>
            X
          </div>
          <div className="info-text">
            <b>Click on the cubes!</b> <br /> <br />
            Click{" "}
            <a
              href="https://github.com/dan10ish/RoboticArm"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{" "}
            to visit this project's github repo. <br />
            Click{" "}
            <a
              href="https://danishansari.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>{" "}
            to visit my website.
          </div>
        </div>
      )}
    </>
  );
}
