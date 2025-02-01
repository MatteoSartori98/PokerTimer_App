/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useMemo } from "react";
import { formatTime } from "../utils/time-utils";
import SettingsModal from "../components/Settings/SettingsModal.jsx";
import { useSettingsStore } from "./Settings/store.jsx";

// Audio Blinds
import blindAudioFile1 from "../assets/blindAudio1.ogg";
import blindAudioFile2 from "../assets/blindAudio2.ogg";
import blindAudioFile3 from "../assets/blindAudio3.ogg";

// Audio Break
import breakAudioFile1 from "../assets/breakAudio1.ogg";
import breakAudioFile2 from "../assets/breakAudio2.ogg";
import breakAudioFile3 from "../assets/breakAudio3.ogg";

// Audio Professional Blinds/Break
import blindAudioProfessional from "../assets/blindAudioProfessional.mp3";
import breakAudioProfessional from "../assets/breakAudioProfessional.mp3";

const ONE_SECOND = 1000;

const audioSets = {
  funny: {
    blind: [blindAudioFile1, blindAudioFile2, blindAudioFile3],
    break: [breakAudioFile1, breakAudioFile2, breakAudioFile3],
  },
  professional: {
    blind: [blindAudioProfessional],
    break: [breakAudioProfessional],
  },
};
// Logica aumento bui
const generateBlinds = (level) => {
  let smallBlind = 10;
  let bigBlind = 20;

  for (let i = 2; i <= level; i++) {
    let increase = i <= 5 ? 10 : 50;
    smallBlind += increase;
    bigBlind = smallBlind * 2;
  }

  return { smallBlind, bigBlind };
};

// Logica Audio files

export default function AppContainer({ settings, setIsReady }) {
  const store = useSettingsStore();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blindLevel, setBlindLevel] = useState(1);
  const initialTimer = settings.timerBlinds * 60;
  const initialNextBreak = settings.nextBreak * 60;
  const [timer, setTimer] = useState(initialTimer);
  const [realTime, setRealTime] = useState(new Date().toLocaleTimeString("it-IT", { hour12: false }));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [nextBreakTimer, setNextBreakTimer] = useState(initialNextBreak);

  const timerRef = useRef(null);
  const realTimeRef = useRef(null);
  const nextBreakRef = useRef(null);

  const formattedElapsedTime = useMemo(() => formatTime(elapsedTime), [elapsedTime]);
  const formattedNextBlindTime = useMemo(() => formatTime(timer), [timer]);
  const formattedNextBreakTime = useMemo(() => formatTime(nextBreakTimer), [nextBreakTimer]);

  const stopTimer = () => {
    setIsPaused(true);
    clearInterval(timerRef.current);
    clearInterval(nextBreakRef.current);
  };

  const resumeTimer = () => {
    if (nextBreakTimer <= 0) {
      setNextBreakTimer(initialNextBreak);
    }
    setIsPaused(false);
  };

  // Gestione Logica Audio
  function playRandomBlindAudio() {
    if (!isAudioEnabled) return;
    const audioSet = audioSets[store.audioSet];
    const nextAudio = audioSet.blind[Math.floor(Math.random() * audioSet.blind.length)];
    new Audio(nextAudio).play();
  }

  function playRandomBreakAudio() {
    if (!isAudioEnabled) return;
    const audioSet = audioSets[store.audioSet];
    const nextAudio = audioSet.break[Math.floor(Math.random() * audioSet.break.length)];
    new Audio(nextAudio).play();
  }

  // Gestione Timer e Blinds
  useEffect(() => {
    if (!gameStarted || isPaused) return;

    if (timer > 0) {
      timerRef.current = setInterval(() => setTimer((prev) => prev - 1), ONE_SECOND);
    } else {
      if (nextBreakTimer === 0) {
        return;
      } else {
        isAudioEnabled ? playRandomBlindAudio() : null;
      }
      setTimer(initialTimer);
      setBlindLevel((prev) => prev + 1);
    }

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, isPaused, gameStarted]);

  // Gestione Next Break
  useEffect(() => {
    if (!gameStarted || isPaused) return;

    if (nextBreakTimer > 0) {
      nextBreakRef.current = setInterval(() => setNextBreakTimer((prev) => prev - 1), ONE_SECOND);
    } else {
      isAudioEnabled ? playRandomBreakAudio() : null;
      clearInterval(nextBreakRef.current);
      setIsPaused(true);
    }

    return () => clearInterval(nextBreakRef.current);
  }, [nextBreakTimer, isPaused, gameStarted]);

  // Gestione Tempo Reale e Tempo Trascorso
  useEffect(() => {
    if (!gameStarted) return;

    realTimeRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      setRealTime(new Date().toLocaleTimeString("it-IT", { hour12: false }));
    }, ONE_SECOND);

    return () => clearInterval(realTimeRef.current);
  }, [realTime, elapsedTime, gameStarted]);

  const { smallBlind, bigBlind } = generateBlinds(blindLevel);

  function toggleAudio() {
    setIsAudioEnabled((prev) => !prev);
  }

  // Gestione modale settings (Reset)
  const handleResetTournament = () => {
    setTimer(initialTimer);
    setBlindLevel(1);
    setElapsedTime(0);
    setNextBreakTimer(initialNextBreak);
    setIsPaused(false);
    setGameStarted(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="container">
        <div>
          <span className="level">
            Level
            <span
              style={{
                marginLeft: "8px",
                fontSize: "1.6rem",
                fontWeight: "500",
              }}
            >
              {blindLevel}°
            </span>
          </span>
          {/* AUDIO ICON */}
          <div style={{ display: "flex" }}>
            <button
              onClick={toggleAudio}
              style={{ fontSize: "24px", border: "none", background: "transparent", width: "60px", color: "black", cursor: "pointer" }}
            >
              {isAudioEnabled ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M18.36 5.64a9 9 0 0 1 0 12.72"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="22" y1="9" x2="16" y2="15"></line>
                  <line x1="16" y1="9" x2="22" y2="15"></line>
                </svg>
              )}
            </button>
            {/* FINE AUDIO ICON*/}
            <button className="settings-button" onClick={() => setIsModalOpen(true)}>
              <img src="/settings-icon.png" alt="" />
            </button>
          </div>
          {/* <span>Ore: {realTime}</span> */}
        </div>
        <div className="container-timer-display">
          <div className="timer-display">
            {formattedNextBlindTime.hours > 0 ? formattedNextBlindTime.hours + ":" : null}
            {formattedNextBlindTime.minutes}:{formattedNextBlindTime.seconds}
          </div>
          <div style={{ fontSize: "1.1rem" }}>Next Level</div>
          <div className="info-section">
            <div>
              <div className="info-value">
                {smallBlind}/{bigBlind}
              </div>
              <div className="info-label">Current Blinds</div>
            </div>
            <div>
              <div className="info-value" style={{ color: "var(--color-gray-600)", fontWeight: "500" }}>
                {generateBlinds(blindLevel + 1).smallBlind}/{generateBlinds(blindLevel + 1).bigBlind}
              </div>
              <div className="info-label">Next Blinds</div>
            </div>
          </div>
        </div>
        <div className="game-info-grid">
          <div className="info-section">
            <div>
              <div className="info-value" style={{ fontSize: "3rem" }}>
                {formattedNextBreakTime.hours > 0 ? formattedNextBreakTime.hours + ":" : null}
                {formattedNextBreakTime.minutes}:{formattedNextBreakTime.seconds}
              </div>
              <div className="info-label">Next Break</div>
            </div>
          </div>
          <div className="info-section" style={{ backgroundColor: "#ffffff" }}>
            <div>
              <div className="info-value" style={{ fontSize: "3rem", color: "var(--color-gray-600)" }}>
                {formattedElapsedTime.hours > 0 ? formattedElapsedTime.hours + ":" : null}
                {formattedElapsedTime.minutes}:{formattedElapsedTime.seconds}
              </div>
              <div className="info-label">Elapsed Time</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "var(--spacing-6)", backgroundColor: "var(--color-gray-200)" }}>
          {gameStarted ? (
            isPaused && nextBreakTimer <= 0 ? (
              <div className="breakContainer">
                <div className="breakModal">
                  <h2>Tournament Break!</h2>
                  <button onClick={resumeTimer}>Resume</button>
                </div>
              </div>
            ) : isPaused ? (
              <div className="breakContainer">
                <div className="breakModal">
                  <h2>Tournament Paused!</h2>
                  <button onClick={resumeTimer}>Resume</button>
                </div>
              </div>
            ) : (
              <button onClick={stopTimer}>Pause Game</button>
            )
          ) : (
            <button onClick={() => setGameStarted(true)}>Start Game</button>
          )}
        </div>
      </div>
      <SettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onReset={handleResetTournament} onGoToSettings={() => setIsReady(false)} />
    </>
  );
}
{
  /* <div className="stats-row">
          {settings.players > 1 ? (
            <div className="stat-item">
              <div className="info-label">Players</div>
              <div className="info-value">{settings.players}</div>
            </div>
          ) : null}

          {settings.initialStack > 1 ? (
            <div className="stat-item">
              <div className="info-label">Total Stack</div>
              <div className="info-value">{settings.initialStack * settings.players}</div>
            </div>
          ) : null}
        </div> */
}
