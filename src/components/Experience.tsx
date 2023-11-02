import { insertCoin, onPlayerJoin, Joystick, PlayerState, myPlayer,  } from "playroomkit";
import { useEffect, useState } from "react";
import { CharacterController} from "./UserController";

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


  const onPlay = () => {
    // do something w the audio to trigger it
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


// sound central to the space? 
// need two joysticks
