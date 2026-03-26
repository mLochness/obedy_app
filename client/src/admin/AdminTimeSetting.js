import { API_URL } from '../config/env';
import { useState, useEffect } from "react";

const AdminTimeSetting = ({ cutoffConfig, modalMsg, onCutoffChange }) => {

    const [cutoffHour, setCutoffHour] = useState(7);
    const [cutoffMinute, setCutoffMinute] = useState(30);

    // Sync with parent config (important if admin reopens modal)
    useEffect(() => {
        if (cutoffConfig) {
            setCutoffHour(cutoffConfig.cutoffHour);
            setCutoffMinute(cutoffConfig.cutoffMinute);
        }
    }, [cutoffConfig]);

    const handleTimeChange = (e) => {
        const [hour, minute] = e.target.value.split(":");
        setCutoffHour(parseInt(hour, 10));
        setCutoffMinute(parseInt(minute, 10));
    };

    const handleSave = () => {
        modalMsg(
            `Nastaviť nový čas uzávierky na ${String(cutoffHour).padStart(2, "0")}:${String(cutoffMinute).padStart(2, "0")}?`,
            async () => {
                try {
                    const response = await fetch(`${API_URL}/api/cutoff`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            cutoffHour: cutoffHour,
                            cutoffMinute: cutoffMinute
                        })
                    });

                    if (!response.ok) {
                        throw new Error("Update failed");
                    }

                    // Update parent state only after DB success
                    onCutoffChange({
                        cutoffHour,
                        cutoffMinute
                    });

                } catch (err) {
                    console.error("Cutoff update failed:", err);
                }
            }
        );
    };

    return (
        <div id="adminTimeSet">
            <h3>Nastavenie času uzávierky</h3>

            <input
                type="time"
                value={`${String(cutoffHour).padStart(2, "0")}:${String(cutoffMinute).padStart(2, "0")}`}
                onChange={handleTimeChange}
            />

            <button onClick={handleSave} style={{ marginLeft: "10px" }}>
                Uložiť
            </button>
        </div>
    );
};

export default AdminTimeSetting;
