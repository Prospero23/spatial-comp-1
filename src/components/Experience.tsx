import { OrbitControls } from "@react-three/drei";
import { insertCoin, onPlayerJoin, Joystick } from "playroomkit";
import { useEffect, useState } from "react";


export const Experience = () => {
  const [players, setPlayers] = useState([]);
  const start = async () => {
    // Start the game
    await insertCoin();

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "play", label: "Play" }],
      });
      const newPlayer = { state, joystick };
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);
  return (
    <>
      <OrbitControls/>
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
};


// sound central to the space? 
// need two joysticks