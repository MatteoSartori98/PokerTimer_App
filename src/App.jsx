import { useState, useEffect } from "react";
import "./App.css";
import AppContainer from "./components/AppContainer";
import SettingsForm from "./components/Settings/SettingsForm";
import { useSettingsStore } from "./components/Settings/store.jsx";

function App() {
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState({});
  const store = useSettingsStore();

  // Carica automaticamente il preset salvato
  useEffect(() => {
    setSettings({
      timerBlinds: store.timerBlinds,
      nextBreak: store.nextBreak,
      blindsMode: store.blindsMode,
      players: store.players,
      initialStack: store.initialStack,
    });
  }, []);

  if (!isReady) {
    return <SettingsForm setIsReady={setIsReady} setSettings={setSettings} />;
  } else {
    return <AppContainer settings={settings} setIsReady={setIsReady} isReady={isReady} />;
  }
}

export default App;
