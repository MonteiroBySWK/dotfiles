import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function BarSpectrum() {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const analyserRef = useRef(null);
    const gainNodeRef = useRef(null);
    const animationFrameIdRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [frequency, setFrequency] = useState(440); // Default to A4
    const [volume, setVolume] = useState(0.5);

    // Function to initialize AudioContext and nodes
    const initializeAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Create Oscillator
        if (!oscillatorRef.current) {
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.type = 'sine';
        }
        oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

        // Create GainNode
        if (!gainNodeRef.current) {
            gainNodeRef.current = audioContextRef.current.createGain();
        }
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);

        // Create AnalyserNode
        if (!analyserRef.current) {
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256; // Number of frequency bins for visualization
        }

        // Connect nodes: Oscillator -> Gain -> Analyser -> Destination
        // Ensure connections are only made once or re-established if nodes are re-created
        oscillatorRef.current.disconnect(); // Disconnect existing to prevent multiple connections
        gainNodeRef.current.disconnect();
        analyserRef.current.disconnect(); // Analyser might be connected to destination if it was playing

        oscillatorRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);

    }, [frequency, volume]); // Depend on frequency and volume to update node values

    // Function to draw visualization
    const drawVisualization = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;

        if (!analyser) return;

        const bufferLength = analyser.frequencyBinCount; // Half of fftSize
        const dataArray = new Uint8Array(bufferLength);

        animationFrameIdRef.current = requestAnimationFrame(drawVisualization);

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        const barWidth = (canvas.width / bufferLength) * 2.5; // Adjust bar width for visual appeal
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            let barHeight = dataArray[i];

            // Tailwind-like colors for bars, or any custom color logic
            ctx.fillStyle = `hsl(${(barHeight / 255) * 360}, 70%, 50%)`; // Hue based on height
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1; // Spacing between bars
        }
    }, []); // No dependencies for the drawing function itself, it reads from analyserRef

    // Effect for handling play/pause logic
    useEffect(() => {
        if (isPlaying) {
            initializeAudio();
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume(); // Resume if context was suspended by browser policy
            }
            if (oscillatorRef.current && oscillatorRef.current.context.state !== 'running') {
                 // Start the oscillator only if not already running.
                 // This ensures it doesn't try to start multiple times if component re-renders.
                 // The 'start()' method can only be called once per OscillatorNode.
                 try {
                    oscillatorRef.current.start();
                 } catch (e) {
                    console.warn("Oscillator already started or error:", e);
                    // Re-create oscillator if it was stopped/disconnected previously
                    oscillatorRef.current = audioContextRef.current.createOscillator();
                    oscillatorRef.current.type = 'sine';
                    oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
                    oscillatorRef.current.connect(gainNodeRef.current); // Reconnect
                    oscillatorRef.current.start();
                 }
            }
            drawVisualization();
        } else {
            if (oscillatorRef.current) {
                // To stop an oscillator correctly, you must disconnect it
                // after calling stop(), or it will keep playing silence
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
                oscillatorRef.current = null; // Clear reference so it can be recreated
            }
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            // Clear canvas when stopped
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Cleanup function for unmounting
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (oscillatorRef.current) {
                oscillatorRef.current.stop();
                oscillatorRef.current.disconnect();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [isPlaying, initializeAudio, drawVisualization, frequency]); // Re-run when playing state or audio setup changes

    // Update frequency when slider changes
    useEffect(() => {
        if (oscillatorRef.current && audioContextRef.current) {
            oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        }
    }, [frequency]);

    // Update volume when slider changes
    useEffect(() => {
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        }
    }, [volume]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-6 text-indigo-400">Analisador de Espectro Senoidal</h1>

            <canvas
                ref={canvasRef}
                width="800"
                height="400"
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-8"
            ></canvas>

            <div className="flex flex-col items-center space-y-4">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                        isPlaying
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {isPlaying ? 'Parar Senoidal' : 'Iniciar Senoidal'}
                </button>

                <div className="flex items-center space-x-4 w-full max-w-md">
                    <label htmlFor="frequencySlider" className="text-lg font-medium text-gray-300 min-w-[120px]">
                        Frequência:
                    </label>
                    <input
                        id="frequencySlider"
                        type="range"
                        min="20"
                        max="20000"
                        value={frequency}
                        onChange={(e) => setFrequency(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-lg font-medium text-indigo-300 min-w-[80px] text-right">
                        {frequency} Hz
                    </span>
                </div>

                <div className="flex items-center space-x-4 w-full max-w-md">
                    <label htmlFor="volumeSlider" className="text-lg font-medium text-gray-300 min-w-[120px]">
                        Volume:
                    </label>
                    <input
                        id="volumeSlider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-lg font-medium text-indigo-300 min-w-[80px] text-right">
                        {volume.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

