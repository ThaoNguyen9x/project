import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ playState, setPlayState }) => {
  const player = useRef(null);

  const closePlayer = (e) => {
    if (e.target === player.current) {
      setPlayState(false);
    }
  };

  useEffect(() => {
    if (!playState && player.current) {
      const iframe = player.current.querySelector("iframe");
      if (iframe) {
        iframe.src = "";
      }
    }
  }, [playState]);

  return (
    <div
      className={`${
        playState ? "" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.9)] z-50 flex items-center justify-center`}
      ref={player}
      onClick={closePlayer}
    >
      {playState && (
        <iframe
          className="w-[90%] max-w-[900px] aspect-video h-auto"
          src="https://www.youtube.com/embed/MQOUO6an-zA?autoplay=1"
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;
