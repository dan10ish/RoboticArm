import React from "react";
import "./index.css";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Arm from "./Arm.jsx";
import { motion } from "framer-motion-3d";
import { AnimatePresence } from "framer-motion";
import {
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Home,
} from "lucide-react";

const JointToggle = ({ label, active, onClick, color = "#3b82f6" }) => (
  <button
    className={`joint-toggle glass-effect ${active ? "active" : ""}`}
    onClick={onClick}
    style={{
      "--toggle-color": color,
      "--toggle-bg": `${color}22`,
    }}
  >
    <span>{label}</span>
  </button>
);

const DirectionControls = ({ type, onControl, active }) => {
  if (!active) return null;

  return (
    <motion.div
      className={`direction-controls ${type} glass-effect`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      {type === "base" ? (
        <>
          <button
            className="direction-button"
            onMouseDown={() => onControl(type, "left")}
            onMouseUp={() => onControl(type, "stop")}
            onMouseLeave={() => onControl(type, "stop")}
            onTouchStart={() => onControl(type, "left")}
            onTouchEnd={() => onControl(type, "stop")}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="direction-label">Rotate Base</div>
          <button
            className="direction-button"
            onMouseDown={() => onControl(type, "right")}
            onMouseUp={() => onControl(type, "stop")}
            onMouseLeave={() => onControl(type, "stop")}
            onTouchStart={() => onControl(type, "right")}
            onTouchEnd={() => onControl(type, "stop")}
          >
            <ChevronRight size={24} />
          </button>
        </>
      ) : (
        <>
          <button
            className="direction-button"
            onMouseDown={() => onControl(type, "up")}
            onMouseUp={() => onControl(type, "stop")}
            onMouseLeave={() => onControl(type, "stop")}
            onTouchStart={() => onControl(type, "up")}
            onTouchEnd={() => onControl(type, "stop")}
          >
            <ChevronUp size={24} />
          </button>
          <div className="direction-label">
            {type === "upper" ? "Upper Arm" : "Lower Arm"}
          </div>
          <button
            className="direction-button"
            onMouseDown={() => onControl(type, "down")}
            onMouseUp={() => onControl(type, "stop")}
            onMouseLeave={() => onControl(type, "stop")}
            onTouchStart={() => onControl(type, "down")}
            onTouchEnd={() => onControl(type, "stop")}
          >
            <ChevronDown size={24} />
          </button>
        </>
      )}
    </motion.div>
  );
};

const CustomCamera = () => {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 3, 7);
    camera.rotation.set(0, 0, 0);
    camera.fov = 75;
  }, [camera]);

  return null;
};

export default function App() {
  const [showInfo, setShowInfo] = React.useState(false);
  const [activeToggle, setActiveToggle] = React.useState(null);
  const [speed, setSpeed] = React.useState(1);
  const armRef = React.useRef();

  React.useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = (joint) => {
    setActiveToggle((current) => (current === joint ? null : joint));
  };

  const handleControl = (joint, direction) => {
    if (armRef.current) {
      if (direction === "stop") {
        armRef.current.stopMovement(joint);
      } else {
        armRef.current.startMovement(joint, direction, speed);
      }
    }
  };

  const handleReset = () => {
    if (armRef.current) {
      armRef.current.resetToHome();
      setActiveToggle(null);
    }
  };

  const adjustSpeed = (increment) => {
    setSpeed((prev) => Math.min(Math.max(0.5, prev + increment), 2));
  };

  return (
    <div className="app-container noselect">
      <motion.div
        className="header glass-effect"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="name">
          <div className="title">
            d<span className="at"></span>n<span className="exclamation"></span>
            <span className="dollar"></span>
            <span className="hash"></span>
          </div>
          <div className="subTitle">3-DOF Robotic Arm</div>
        </div>

        <button
          className="info-button glass-effect"
          onClick={() => setShowInfo(true)}
        >
          <Info className="info-icon" />
        </button>
      </motion.div>

      <div className="canvas-container">
        <Canvas>
          <CustomCamera />
          <Arm
            ref={armRef}
            scale={0.1}
            position={[0, -2.5, 0]}
            rotation={[0, 0, 0]}
          />
          <Environment preset="city" />
          <OrbitControls
            minDistance={3}
            maxDistance={20}
            enablePan={true}
            panSpeed={2}
            maxPolarAngle={Math.PI / 1.5}
          />
          <gridHelper
            args={[50, 50, 0xff0000, 0x999999]}
            position={[0, -2.5, 0]}
          />
        </Canvas>
      </div>

      <motion.div
        className="controls-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="control-row glass-effect">
          <div className="speed-control">
            <button className="speed-button" onClick={() => adjustSpeed(-0.1)}>
              <Minus size={20} />
            </button>
            <div className="speed-display">
              <div className="speed-label">Speed</div>
              <div className="speed-value">{speed.toFixed(1)}x</div>
            </div>
            <button className="speed-button" onClick={() => adjustSpeed(0.1)}>
              <Plus size={20} />
            </button>
          </div>

          <button className="reset-button" onClick={handleReset}>
            <Home size={20} />
            <span>Reset</span>
          </button>
        </div>

        <div className="joint-controls glass-effect">
          <div className="toggles">
            <JointToggle
              label="Base"
              active={activeToggle === "base"}
              onClick={() => handleToggle("base")}
              color="#ef4444"
            />
            <JointToggle
              label="Lower"
              active={activeToggle === "lower"}
              onClick={() => handleToggle("lower")}
              color="#22c55e"
            />
            <JointToggle
              label="Upper"
              active={activeToggle === "upper"}
              onClick={() => handleToggle("upper")}
              color="#3b82f6"
            />
          </div>

          <AnimatePresence>
            <DirectionControls
              type={activeToggle}
              onControl={handleControl}
              active={!!activeToggle}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="dialog-content glass-effect"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2>About</h2>
              <div className="dialog-body">
                <p>
                  <strong>Controls:</strong>
                </p>
                <ul>
                  <li>
                    Select a joint to control (Base, Lower Arm, or Upper Arm)
                  </li>
                  <li>Use the arrows to move the selected joint</li>
                  <li>Adjust movement speed with + and -</li>
                  <li>Reset position with the home button</li>
                  <li>Use mouse/touch to rotate and zoom the view</li>
                </ul>
                <p>
                  Visit my{" "}
                  <a
                    href="https://dan10ish.github.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    personal website
                  </a>
                </p>
              </div>
              <button
                className="dialog-close"
                onClick={() => setShowInfo(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
