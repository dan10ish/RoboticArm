import React from "react";
import "./index.css";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Arm from "./Arm.jsx";
import { motion } from "framer-motion-3d";
import { Info } from "lucide-react";

export default function App() {
  // Fix Height Bug in IOS
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };
  window.addEventListener("resize", appHeight);
  appHeight();

  const [showInfo, setShowInfo] = React.useState(false);

  const CustomCamera = () => {
    const { camera } = useThree();
    camera.position.set(0, 3, 7);
    camera.rotation.set(0, 0, 0);
    camera.fov = 75;
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

          {/* Info Button */}
          <button className="info-button" onClick={() => setShowInfo(true)}>
            <Info className="info-icon" />
          </button>

          {/* Info Dialog */}
          {showInfo && (
            <div className="dialog-overlay">
              <div className="dialog-content">
                <h2>About This Project</h2>
                <div className="dialog-body">
                  <p>
                    <strong>Click on the cubes!</strong>
                  </p>
                  <p>
                    Visit my{" "}
                    <a
                      href="https://dan10ish.github.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      personal website
                    </a>{" "}
                    to see more of my work.
                  </p>
                  <p>
                    Check out the{" "}
                    <a
                      href="https://github.com/dan10ish/RoboticArm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      source code
                    </a>{" "}
                    on GitHub.
                  </p>
                </div>
                <button
                  className="dialog-close"
                  onClick={() => setShowInfo(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.group>

        <div id="arm">
          <Canvas>
            <CustomCamera />
            <Arm scale={0.1} position={[0, -2.5, 0]} rotation={[0, 0, 0]} />
            <Environment preset="city" />
            <OrbitControls maxPolarAngle={Math.PI / 2} enablePan={true} />
            <gridHelper
              args={[50, 50, 0xff0000, 0x999999]}
              position={[0, -2.5, 0]}
              rotation={[0, 0, 0]}
            />
          </Canvas>
        </div>
      </main>
    </>
  );
}
