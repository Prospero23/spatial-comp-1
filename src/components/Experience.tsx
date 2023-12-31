import { insertCoin, onPlayerJoin, Joystick, PlayerState, myPlayer,  } from "playroomkit";
import { useEffect, useState } from "react";
import { CharacterController} from "./UserController";
import useAudio from "./useAudio";
import { Vector3 } from "three";
import { Vector } from "@dimforge/rapier3d-compat";


interface Player {
  state: PlayerState;
  joystick: Joystick
}
export const Experience = ({downgradedPerformance = false}) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const start = async () => {
    // Start the game
    await insertCoin();

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "play", label: "Play" }, {id: "down", label: "Down"}, {id: "up", label: "Up"}],
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

  const {playNote} = useAudio();

  const onPlay = (pos: Vector) => {
    const freq = pos.y * 100
    playNote(freq)
  };

  return (
    <>
        {players.map(({ state, joystick }, index) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === myPlayer()?.id}
          joystick={joystick}
          onPlay={onPlay}
          downgradedPerformance={downgradedPerformance}
        />
      ))}

    </>
  );
};
