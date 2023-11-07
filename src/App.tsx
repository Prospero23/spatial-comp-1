
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <main className="h-screen w-screen">
    <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <Physics gravity={[0,0,0]}>
      <Experience />
      </Physics>
    </Canvas>
    </main>
  );
}

export default App;
// vitest


{/* <PerformanceMonitor
// Detect low performance devices
onDecline={(fps) => {
  setDowngradedPerformance(true);
}}
/> */}