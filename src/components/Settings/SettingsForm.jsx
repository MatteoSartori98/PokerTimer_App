/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSettingsStore } from "./store.jsx";

export default function SettingsForm({ setIsReady, setSettings }) {
  const store = useSettingsStore();
  const [presetName, setPresetName] = useState("");
  const [errors, setErrors] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  console.log(store);

  // Logica errors
  const validateForm = () => {
    let newErrors = {};

    if (!store.timerBlinds || store.timerBlinds <= 0) {
      newErrors.timerBlinds = "La durata dei blinds deve essere maggiore di 0.";
    }

    if (!store.nextBreak || store.nextBreak <= 0) {
      newErrors.nextBreak = "La pausa deve essere maggiore di 0.";
    }

    // if (!store.players || store.players <= 0) {
    //   newErrors.players = "Il numero di giocatori deve essere maggiore di 0.";
    // }

    // if (!store.initialStack || store.initialStack <= 0) {
    //   newErrors.initialStack = "Lo stack iniziale deve essere maggiore di 0.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Logica submit form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;
    setSettings({
      timerBlinds: store.timerBlinds,
      nextBreak: store.nextBreak,
      blindsMode: store.blindsMode,
      players: store.players,
      initialStack: store.initialStack,
    });

    setIsReady(true);
  };

  // Logica save dei presets
  const handleConfirm = (event) => {
    event.preventDefault();
    setIsClicked(true);
  };
  const handleSavePreset = (event) => {
    event.preventDefault();
    if (presetName.trim() && presetName.trim().length >= 1) {
      store.savePreset(presetName);
      setPresetName("");
      setIsClicked(false);
    }
  };
  const handleSelection = (preset) => {
    store.loadPreset(preset);
    setIsSelected(false);
  };

  const handleDelete = (event, preset) => {
    event.preventDefault();
    event.stopPropagation();
    store.deletePreset(preset);
    setIsSelected(true);
    setPresetToDelete(null);

    console.log(isSelected);
  };
  console.log(isSelected);
  return (
    <>
      <h1 className="header">Settings</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          {/* Presets */}
          <div className="dropdown-container">
            <button
              className="dropdown-trigger"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                setIsSelected(!isSelected);
              }}
            >
              <span>Load a preset</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isSelected && (
              <div className="dropdown-menu">
                {Object.keys(store.presets).map((preset) => (
                  <div
                    key={preset}
                    className="preset-item"
                    onClick={(event) => {
                      event.preventDefault();
                      handleSelection(preset);
                    }}
                  >
                    <span className="preset-name">{preset}</span>
                    {preset !== "Default" && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setPresetToDelete(preset);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {presetToDelete && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="modal-title">Delete Preset</h3>
                  <p className="modal-text">
                    Do you want to delete <strong>&ldquo;{presetToDelete}&ldquo;</strong>?
                  </p>
                  <div className="modal-buttons">
                    <button type="button" className="modal-btn btn-cancel" onClick={() => setPresetToDelete(null)}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="modal-btn btn-confirm"
                      style={{ backgroundColor: "#dc2626" }}
                      onClick={(event) => {
                        handleDelete(event, presetToDelete);
                        setPresetToDelete(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Fields */}
        <div className="input-container">
          <label className="input-label" htmlFor="timerBlinds">
            Level Duration:
          </label>
          <input
            className="form-input"
            type="number"
            id="timerBlinds"
            name="timerBlinds"
            placeholder="Insert minutes"
            value={store.timerBlinds || ""}
            onChange={(event) => store.updateTimerBlinds(Number(event.target.value))}
          />
          {errors.timerBlinds && <p className="error-text">{errors.timerBlinds}</p>}
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="nextBreak">
            Next Break:
          </label>
          <input
            className="form-input"
            type="number"
            name="nextBreak"
            id="nextBreak"
            placeholder="Insert minutes"
            value={store.nextBreak || ""}
            onChange={(event) => store.updateNextBreak(event.target.value)}
          />
          {errors.nextBreak && <p className="error-text">{errors.nextBreak}</p>}
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="blindsMode">
            Blinds Structure:
          </label>
          <select
            className="form-select"
            name="blindsMode"
            id="blindsMode"
            value={store.blindsMode}
            onChange={(event) => store.updateBlindsMode(event.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="turbo">Turbo</option>
          </select>
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="audioSet">
            Audio Set:
          </label>
          <select className="form-select" name="audioSet" id="audioSet" value={store.audioSet} onChange={(event) => store.updateAudioSet(event.target.value)}>
            <option value="funny">Funny</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleConfirm} className="btn">
            Save Preset
          </button>
          <button type="submit" className="btn btn-confirm">
            Confirm
          </button>
        </div>
      </form>

      {/* Save Preset Modal */}
      {isClicked && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Save Preset</h3>
            <div className="input-container" style={{ margin: "0" }}>
              <label className="input-label" htmlFor="presetName">
                Preset Name:
              </label>
              <input
                className="form-input"
                type="text"
                id="presetName"
                placeholder="Preset name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              <div className="modal-buttons" style={{ marginTop: "20px" }}>
                <button type="button" className="modal-btn btn-cancel" onClick={() => setIsClicked(false)}>
                  Cancel
                </button>
                <button type="button" className="modal-btn btn-confirm" onClick={handleSavePreset}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <div className="input-container">
          <label className="input-label" htmlFor="blindsMode">
            New Blinds Audio:
          </label>
          <select name="newBlindsAudio" id="newBlindsAudio">
            <option value="Funny">Funny</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="blindsMode">
            Break Audio:
          </label>
          <select name="breakAudio" id="breakAudio">
            <option value="Funny">Funny</option>
            <option value="Professional">Professional</option>
          </select>
        </div> */
}
{
  /* <div className="input-container">
          <label className="input-label" htmlFor="players">
            Players:
          </label>
          <input
            className="form-input"
            type="number"
            placeholder="Inserisci numero giocatori"
            name="players"
            id="players"
            value={store.players || ""}
            onChange={(event) => store.updatePlayers(event.target.value)}
          />
          {errors.players && <p className="error-text">{errors.players}</p>} 
        </div>

        <div className="input-container">
          <label className="input-label" htmlFor="initialStack">
            Initial Stack:
          </label>
          <input
            className="form-input"
            type="number"
            placeholder="Inserisci stack iniziale"
            name="initialStack"
            id="initialStack"
            value={store.initialStack || ""}
            onChange={(event) => store.updateInitialStack(event.target.value)}
          />
           {errors.initialStack && <p className="error-text">{errors.initialStack}</p>} 
        </div> */
}
