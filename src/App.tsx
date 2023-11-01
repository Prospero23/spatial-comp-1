
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <main className="h-screen w-screen">
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
    </main>
  );
}

export default App;
// vitest