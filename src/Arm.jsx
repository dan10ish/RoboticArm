import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Arm = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF(
    process.env.PUBLIC_URL + "/assets/Arm.glb"
  );
  const skinnedMeshRef = useRef();
  const [bones, setBones] = useState({});
  const [movements, setMovements] = useState({});

  const MOVEMENT_LIMITS = {
    base: { min: -Math.PI / 2, max: Math.PI / 2, axis: "z" },
    upper: { min: -Math.PI / 4, max: Math.PI / 2, axis: "x" },
    lower: { min: -Math.PI / 3, max: Math.PI / 2, axis: "x" },
  };

  useEffect(() => {
    const skeleton = nodes["4DOF_Robotic_Arm"].skeleton;
    const bonesMap = {};
    skeleton.bones.forEach((bone) => {
      bonesMap[bone.name] = bone;
    });
    setBones(bonesMap);
  }, [nodes]);

  useFrame(() => {
    if (!bones.base) return;

    Object.entries(movements).forEach(([joint, movement]) => {
      if (!movement) return;

      const { direction, speed } = movement;
      const baseSpeed = 0.05 * speed;

      switch (joint) {
        case "base": {
          const newRotation =
            bones.base.rotation.z +
            (direction === "right" ? baseSpeed : -baseSpeed);
          bones.base.rotation.z = Math.max(
            MOVEMENT_LIMITS.base.min,
            Math.min(MOVEMENT_LIMITS.base.max, newRotation)
          );
          break;
        }
        case "lower": {
          const newRotation =
            bones.LowerArm.rotation.x +
            (direction === "up" ? baseSpeed : -baseSpeed);
          bones.LowerArm.rotation.x = Math.max(
            MOVEMENT_LIMITS.lower.min,
            Math.min(MOVEMENT_LIMITS.lower.max, newRotation)
          );
          break;
        }
        case "upper": {
          const newRotation =
            bones.UpperArm.rotation.x +
            (direction === "up" ? baseSpeed : -baseSpeed);
          bones.UpperArm.rotation.x = Math.max(
            MOVEMENT_LIMITS.upper.min,
            Math.min(MOVEMENT_LIMITS.upper.max, newRotation)
          );
          break;
        }
        default: {
          console.warn(`Unexpected joint value: ${joint}`);
          break;
        }
      }
    });
  });

  useImperativeHandle(
    ref,
    () => ({
      startMovement: (joint, direction, speed) => {
        setMovements((prev) => ({
          ...prev,
          [joint]: { direction, speed },
        }));
      },

      stopMovement: (joint) => {
        setMovements((prev) => ({
          ...prev,
          [joint]: null,
        }));
      },

      resetToHome: () => {
        if (!bones.base) return;

        const animate = (startTime) => {
          const duration = 1000;
          const progress = Math.min(
            (performance.now() - startTime) / duration,
            1
          );
          const ease = (t) => t * (2 - t); // Ease out quad
          const smoothProgress = ease(progress);

          bones.base.rotation.z = (1 - smoothProgress) * bones.base.rotation.z;
          bones.UpperArm.rotation.x =
            (1 - smoothProgress) * bones.UpperArm.rotation.x;
          bones.LowerArm.rotation.x =
            (1 - smoothProgress) * bones.LowerArm.rotation.x;

          if (progress < 1) {
            requestAnimationFrame(() => animate(startTime));
          }
        };

        setMovements({});
        requestAnimationFrame((time) => animate(time));
      },
    }),
    [bones]
  );

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
});

export default Arm;

useGLTF.preload(process.env.PUBLIC_URL + "/assets/Arm.glb");
