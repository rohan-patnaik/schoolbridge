import { useState, useRef } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface Props {
  url: string;
}

export default function AudioButton({ url }: Props) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      return;
    }

    setLoading(true);
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.oncanplaythrough = () => {
      setLoading(false);
      setPlaying(true);
      audio.play();
    };

    audio.onended = () => setPlaying(false);
    audio.onerror = () => {
      setLoading(false);
      setPlaying(false);
    };

    audio.load();
  };

  return (
    <div className="flex justify-center">
      <button onClick={toggle} className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500 dark:bg-accent-600 text-white rounded-xl font-medium shadow-md hover:bg-accent-600 dark:hover:bg-accent-500 active:bg-accent-700 dark:active:bg-accent-700 transition-all text-sm">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : playing ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        {playing ? "Stop Reading" : "Read Aloud"}
      </button>
    </div>
  );
}
