import { useRef, MutableRefObject, useEffect, useLayoutEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { Sphere, Group } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

export default function Bot() {
  const { camera, gl, size, viewport } = useThree();
  const botRef: MutableRefObject<Group | null> = useRef<Group>(null);

  useFrame(() => {
    const { width, height } = viewport;
    const aspect = width / height;

    if (botRef.current) {
      // Update the scale, position, and rotation of the meshes based on aspect ratio
      const botGroup = botRef.current;

      botGroup.scale.set(0.8 * aspect, 0.8 * aspect, 1);
      botGroup.rotation.y = 0.5;
      botGroup.position.x = -1.5 * aspect;
     

      // Update other meshes in the group similarly

      // Reset scale, position, and rotation of the meshes when aspect ratio changes
      return () => {
        botGroup!.scale.set(1.2, 0.8, 1);
        botGroup!.rotation.y = 0.5;
        // Reset other meshes in the group similarly
      };
    }
  });

  useFrame((state, delta) => {
    if (botRef.current) {
      // botRef.current.rotation.y += 0.01;
      const botGroup = botRef.current;
      botGroup.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      // const botGroupPosition = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      // botGroup.position.x = botGroupPosition;

      // animate eyes blink
      const leftEye = botGroup.children.find(
        (child) => child.name === "left eye"
      );
      const rightEye = botGroup.children.find(
        (child) => child.name === "right eye"
      );
      const leftEyePosition = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      const rightEyePosition = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      leftEye!.scale.y = leftEyePosition;
      rightEye!.scale.y = rightEyePosition;

      // animate arms
      const arm1 = botRef.current.children.find(
        (child) => child.name === "right arm"
      );
      const arm2 = botRef.current.children.find(
        (child) => child.name === "left arm"
      );
      const arm1Rotation = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
      const arm2Rotation = Math.sin(state.clock.elapsedTime * 1.5) * -0.5;
      arm1!.rotation.x = arm1Rotation;
      arm2!.rotation.x = arm2Rotation;
    }
  });

  return (
    <>
      {/* <OrbitControls args={[camera, gl.domElement]}/> */}
      {/* <directionalLight position={[1, 2, 5]} intensity={2} color="#cad2c5"/> */}

      <group ref={botRef} rotation-y={0.3}>
        <mesh name="botGroup" scale={[1.2, 0.8, 1]}>
          <sphereGeometry />
          <meshBasicMaterial color="#cad2c5" />
        </mesh>
        <mesh
          name="left antenna"
          scale={[0.1, 0.5, 0.1]}
          position={[-0.5, 0.5, 0]}
          rotation={[0, 0, 0.5]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#84A98C" />
        </mesh>
        <mesh
          name="right antenna"
          scale={[0.1, 0.5, 0.1]}
          position={[0.5, 0.5, 0]}
          rotation={[0, 0, -0.5]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#84A98C" />
        </mesh>

        <mesh name="face" scale={[0.7, 0.45, 0.1]} position={[0, 0, 0.9]}>
          <sphereGeometry />
          <meshBasicMaterial color="#000000" />
        </mesh>

        <mesh name="right eye" scale={[0.1, 0.2, 0]} position={[0.3, 0.1, 1]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh name="left eye" scale={[0.1, 0.2, 0]} position={[-0.3, 0.1, 1]}>
          <boxGeometry />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh
          name="right blush"
          scale={[0.15, 0.1, 0]}
          position={[0.5, -0.2, 1]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#fab3df" />
        </mesh>

        <mesh
          name="left blush"
          scale={[0.15, 0.1, 0]}
          position={[-0.5, -0.2, 1]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#fab3df" />
        </mesh>

        <mesh
          name="right arm"
          scale={[0.2, 0.5, 0.2]}
          position={[1.2, -0.5, 0]}
          rotation={[0, 0, 0.5]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#84A98C" />
        </mesh>
        <mesh
          name="left arm"
          scale={[0.2, 0.5, 0.2]}
          position={[-1.2, -0.5, 0]}
          rotation={[0, 0, -0.5]}
        >
          <sphereGeometry />
          <meshBasicMaterial color="#84A98C" />
        </mesh>
      </group>
    </>
  );
}
