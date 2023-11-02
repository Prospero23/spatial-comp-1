import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

function useAudio() {
    // Initialization of audio context and other audio-related states
    const synth = useRef<Tone.Synth | null>(null)

    useEffect(() => {
        // Set up Tone.js context and resources on mount
        Tone.start();

        // Define synths, effects, and other Tone.js entities
        synth.current = new Tone.Synth().toDestination();

        // ... set up other necessary audio components or connections

        return () => {
            // Clean up resources when the component using this hook will unmount
            synth.current?.dispose();
            // ... dispose of other resources or disconnect nodes
        };
    }, []);

    const playNote = (note: Tone.Unit.Frequency) => {
        // Trigger a note with Tone.js
        synth.current?.triggerAttackRelease(note, "8n", Tone.now());
    };

    // Expose any actions or state that the components might need
    return { playNote };
}

export default useAudio;
