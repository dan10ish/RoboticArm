import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Arm(props) {
  const { nodes, materials } = useGLTF("./assets/Arm.glb");

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

  useFrame(() => {
    if (animationStarted) {
      const currentTime = performance.now();

      animateBone(bones.base, 0, 1000, Math.PI / 1.7, "z");
      animateBone(bones.LowerArm, 1000, 1500, -Math.PI / 4, "x");
      animateBone(bones.UpperArm, 2500, 2000, Math.PI / 2, "x");

      if (currentTime - animationStartTime >= 10000) {
        setAnimationStarted(true);
      }
    }
  });

  // Function to animate a bone
  function animateBone(bone, delay, duration, targetAngle, axis) {
    if (!bone) return;

    if (performance.now() - animationStartTime >= delay) {
      const elapsedTime = performance.now() - animationStartTime - delay;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const newRotation = targetAngle * progress;
        bone.rotation[axis] = newRotation;
      } else {
        bone.rotation[axis] = targetAngle;
      }
    }
  }

  return (
    <group {...props} dispose={null}>
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

useGLTF.preload("./assets/Arm.glb");
