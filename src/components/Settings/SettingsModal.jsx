/* eslint-disable react/prop-types */
import { useState } from "react";

export default function SettingsModal({ isOpen, onClose, onReset, onGoToSettings }) {
  const [isConfirmed, setIsConfirmed] = useState(null);

  const handleConfirm = () => {
    if (isConfirmed === "reset") {
      onReset();
    } else if (isConfirmed === "settings") {
      onGoToSettings();
    }
    setIsConfirmed(null);
    onClose();
  };
  return isOpen ? (
    !isConfirmed ? (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">Tournament Settings</h2>
          <div className="modal-buttons-vertical">
            <button onClick={() => setIsConfirmed("reset")} className="modal-btn btn-icon">
              🔄 Reset
            </button>

            <button onClick={() => setIsConfirmed("settings")} className="modal-btn btn-icon">
              ⚙️ Settings
            </button>

            <button onClick={onClose} className="modal-btn btn-icon">
              ❌ Close
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3 className="modal-title">Are you sure?</h3>
          <p className="modal-text">{isConfirmed === "reset" ? "Do you want to reset the tournament?" : "Do you want to go back to settings?"}</p>
          <div className="modal-buttons">
            <button onClick={() => setIsConfirmed(null)} className="modal-btn btn-cancel">
              No
            </button>
            <button onClick={handleConfirm} className="modal-btn btn-confirm">
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  ) : null;
}
