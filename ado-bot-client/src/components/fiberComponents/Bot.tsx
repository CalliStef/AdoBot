import { useRef, MutableRefObject, forwardRef, useImperativeHandle, RefObject } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

interface BotProps {  
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;

}

const Bot = forwardRef<THREE.Group | null, BotProps>((props, ref)  => {
  const { camera, gl, size, viewport, mouse } = useThree();
  const botRef = ref as RefObject<THREE.Group | null>;

  useFrame(() => {
    const { width, height } = viewport;
    const aspect = width / height;

    if (botRef?.current) {
      // Update the scale, position, and rotation of the meshes based on aspect ratio

      const {positionX, positionY, positionZ} = props;

      const botGroup = botRef.current;
      
      botGroup.scale.set(0.8 * aspect, 0.8 * aspect, 1);

      botGroup.position.x = (positionX ?? 0) * aspect;
      botGroup.position.y = positionY ?? 0;
      botGroup.position.z = (positionZ ?? 0) * aspect;

      botGroup.rotation.y = (props.rotationY ?? 0) * aspect;
      botGroup.rotation.x = props.rotationX ?? 0;
      botGroup.rotation.z = (props.rotationZ ?? 0) * aspect;
      
    }
  });

  useFrame((state, delta) => {
    if (botRef.current) {
      // botRef.current.rotation.y += 0.01;
      const botGroup = botRef.current;
      if(!props.positionY){
        botGroup.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      }

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

  const animateBotToY = (targetY: number) => {
    const velocity = new THREE.Vector3(0, -0.01, 0); // Define the velocity of the bot

    useFrame(() => {
      if (botRef.current && botRef.current.position.y > targetY) {
        // Move the bot until it reaches the target y position
        botRef.current.position.add(velocity);
      }
    });
  };

  return (
    <>
      {/* <OrbitControls args={[camera, gl.domElement]}/> */}
      {/* <directionalLight position={[1, 2, 5]} intensity={2} color="#cad2c5"/> */}

      <group ref={ref}>
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
})

export default Bot;