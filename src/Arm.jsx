import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Arm(props) {
  const { nodes, materials } = useGLTF(
    process.env.PUBLIC_URL + "/assets/Arm.glb"
  );

  const skinnedMeshRef = useRef();
  const [bones, setBones] = useState({});
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState(null);

  useEffect(() => {
    const skeleton = nodes["4DOF_Robotic_Arm"].skeleton;
    const bonesMap = {};
    skeleton.bones.forEach((bone) => {
      bonesMap[bone.name] = bone;
    });
    setBones(bonesMap);
  }, [nodes]);

  useEffect(() => {
    if (!animationStarted) {
      setTimeout(() => {
        setAnimationStarted(true);
        setAnimationStartTime(performance.now());
      }, 2000);
    }
  }, [animationStarted]);

  // Simplified useFrame since we're using handleCubePress for animations
  useFrame(() => {
    if (animationStarted) {
      // Frame updates can be added here if needed
    }
  });

  // Function to animate a bone with delay and duration
  function animateBoneWithDelay(bone, delay, duration, targetAngle, axis) {
    setTimeout(() => {
      if (bone) {
        const startTime = performance.now();
        const startRotation = bone.rotation[axis];

        function update() {
          const currentTime = performance.now();
          const progress = (currentTime - startTime) / duration;
          if (progress < 1) {
            bone.rotation[axis] =
              startRotation + (targetAngle - startRotation) * progress;
            requestAnimationFrame(update);
          } else {
            bone.rotation[axis] = targetAngle;
          }
        }

        update();
      }
    }, delay);
  }

  // Function to handle cube press
  function handleCubePress(
    targetAngleBase,
    targetAngleLowerArm,
    targetAngleUpperArm,
    axisBase,
    axisLowerArm,
    axisUpperArm,
    delayBase,
    durationBase,
    delayLowerArm,
    durationLowerArm,
    delayUpperArm,
    durationUpperArm
  ) {
    animateBoneWithDelay(
      bones.base,
      delayBase,
      durationBase,
      targetAngleBase,
      axisBase
    );
    animateBoneWithDelay(
      bones.LowerArm,
      delayLowerArm,
      durationLowerArm,
      targetAngleLowerArm,
      axisLowerArm
    );
    animateBoneWithDelay(
      bones.UpperArm,
      delayUpperArm,
      durationUpperArm,
      targetAngleUpperArm,
      axisUpperArm
    );
  }

  return (
    <group {...props} dispose={null}>
      {/* Cube 1 */}
      <mesh
        onClick={() =>
          handleCubePress(
            -Math.PI / 1.3,
            Math.PI / 2.1,
            Math.PI / 4,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[-22, 0, -22]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="red" />
      </mesh>
      {/* Cube 2 */}
      <mesh
        onClick={() =>
          handleCubePress(
            Math.PI / 2,
            Math.PI / 2.5,
            Math.PI / 2,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[20, 0, 0]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="green" />
      </mesh>
      {/* Cube 3 */}
      <mesh
        onClick={() =>
          handleCubePress(
            Math.PI / 1.3,
            Math.PI / 2,
            Math.PI / 5,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[20, 0, -30]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      {/* Cube 4 */}
      <mesh
        onClick={() =>
          handleCubePress(
            Math.PI / 1.1,
            Math.PI / 4,
            -Math.PI / 9,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[10, 50, -30]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="yellow" />
      </mesh>
      {/* Cube 5 */}
      <mesh
        onClick={() =>
          handleCubePress(
            -Math.PI / 1.1,
            Math.PI / 10,
            Math.PI / 2,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[-10, 30, -30]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="black" />
      </mesh>
      {/* Cube 6 */}
      <mesh
        onClick={() =>
          handleCubePress(
            -Math.PI / 6,
            Math.PI / 2.35,
            Math.PI / 2.5,
            "z",
            "x",
            "x",
            0,
            2000,
            500,
            1500,
            1000,
            2500
          )
        }
        position={[-10, 0, 25]}
      >
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicMaterial color="violet" />
      </mesh>
      <group scale={10}>
        <primitive object={nodes.root} />
        <skinnedMesh
          ref={skinnedMeshRef}
          geometry={nodes["4DOF_Robotic_Arm"].geometry}
          material={materials["Material.001"]}
          skeleton={nodes["4DOF_Robotic_Arm"].skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/Arm.glb");
