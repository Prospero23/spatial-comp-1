import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody, vec3, } from "@react-three/rapier";
import { Joystick, PlayerState, isHost } from "playroomkit";
import { RefObject, useEffect, useRef } from "react";
import { UserModel } from "./UserModel";
import {Vector3, type Group, DirectionalLight } from "three";
import { Vector } from "@dimforge/rapier3d-compat";

const MOVEMENT_SPEED = 202;

interface CharacterControllerTypes {
    state: any;
    joystick: Joystick;
    userPlayer: any;
    onPlay: (pos: Vector) => void;
    downgradedPerformance: boolean;
}

export const CharacterController = ({
  state,
  joystick,
  userPlayer,
  onPlay,
  downgradedPerformance,
  ...props
}: CharacterControllerTypes) => {
  const group: RefObject<Group> = useRef(null);
  const character: RefObject<Group> = useRef(null);
  const rigidbody: RefObject<RapierRigidBody>= useRef(null);

  const scene = useThree((state) => state.scene);
  const spawnRandomly = () => {
    // const spawns = [];
    // for (let i = 0; i < 1000; i++) {
    //   const spawn = scene.getObjectByName(`spawn_${i}`);
    //   if (spawn) {
    //     spawns.push(spawn);
    //   } else {
    //     break;
    //   }
    // }
    // const spawnPos = spawns[Math.floor(Math.random() * spawns.length)].position;
    // rigidbody.current.setTranslation(spawnPos);
    const spawnPos = new Vector3(0,0,0)
    if (rigidbody.current != null){
    rigidbody.current.setTranslation(spawnPos, true);
    } else {
        throw Error("Error spawning character")
    }

  };

  useEffect(() => {
    if (isHost()) {
      spawnRandomly();
    }
  }, []);

  useFrame((_, delta) => {
    // CAMERA FOLLOW
    if (rigidbody.current === null){
        return
    }
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 2 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    // Update player position based on joystick state
    const angle = joystick.angle();
    if (joystick.isJoystickPressed() && angle && character.current) {
        // show movement
      character.current.rotation.y = angle;

      // move character in its own direction
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };

      rigidbody.current.applyImpulse(impulse, true);
    } else {
      // do nothing
    }
        // Check if fire button is pressed
    if (joystick.isPressed("play")) {
        // TODO: trigger playing anim
          // audio scheduling logic
          if (!state.state.isPlaying){
            state.state.isPlaying = true
            onPlay(rigidbody.current.translation())  
            console.log("boom")            
          }
      } else {
          state.state.isPlaying = false
      }
              // Check if up button is pressed
    if (joystick.isPressed("up")) {
        // trigger playing animation
       
        if (isHost()) {
          // audio scheduling logic
          // onPlay()
          const impulse = {x: 0, y: MOVEMENT_SPEED * delta, z: 0}
          rigidbody.current.applyImpulse(impulse, true)
          
        }
      }

    // Check if down button is pressed
    if (joystick.isPressed("down")) {
      // trigger playing animation
     
      if (isHost()) {
        // audio scheduling logic
        // onPlay()
        const impulse = {x: 0, y: -MOVEMENT_SPEED * delta, z: 0}
        rigidbody.current.applyImpulse(impulse, true)

      }
    }

    if (isHost()) {
      state.setState("pos", rigidbody.current.translation());
    } else {
      const pos = state.getState("pos");
      if (pos) {
        rigidbody.current.setTranslation(pos, true);
      }
    }
  });
  const controls: RefObject<CameraControls> = useRef(null);
  const directionalLight: RefObject<DirectionalLight> = useRef(null);

  useEffect(() => {
    if (character.current && userPlayer && directionalLight.current) {
      directionalLight.current.target = character.current;
    }
  }, [character.current]);

  return (
    <group {...props} ref={group}>
      {userPlayer && <CameraControls ref={controls} />}
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type={isHost() ? "dynamic" : "kinematicPosition"}>
        <group ref={character}>
          <UserModel
            color={state.state.profile?.color}
          />
        </group>
        {userPlayer && (
          // Finally I moved the light to follow the player
          // This way we won't need to calculate ALL the shadows but only the ones
          // that are in the camera view
          <directionalLight
            ref={directionalLight}
            position={[25, 18, -25]}
            intensity={0.3}
            castShadow={!downgradedPerformance} // Disable shadows on low-end devices
            shadow-camera-near={0}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
        )}
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};
