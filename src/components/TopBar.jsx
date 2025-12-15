import { useContext, useEffect, useState } from "react";
import { ExamContext } from "../store/myStore";
import "./header.css";

const TopBar = () => {
  const { ExamTitle, Timer, sendEvent, submitExam, checkProceed } = useContext(ExamContext);
  const [tabWarning, setTabWarning] = useState(false);
  const [networkLost, setNetworkLost] = useState(!navigator.onLine);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setTabWarning(true);
        sendEvent?.("tab-switch");
      } else {
        setTimeout(() => setTabWarning(false), 2000);
      }
    };

    const handleOffline = () => {
      setNetworkLost(true);
      sendEvent?.("network-offline");
    };
    const handleOnline = () => setNetworkLost(false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [sendEvent]);

  const handleSubmit = async () => {
    const ok = window.confirm("Submit exam now? You cannot change answers after submit.");
    if (!ok) return;
    await submitExam?.();
  };

  return (
    <div className="topBar">
      <div className="examName">{ExamTitle?.title || "Exam"}</div>

      <div className={`timer ${Timer?.color || "neutral"}`}>{Timer?.formatted || "00:00:00"}</div>

      <div className="topWarnings">
        {networkLost && <span className="warning">⚠️ Connection lost</span>}
        {tabWarning && <span className="warning">⚠️ Tab switched</span>}
      </div>

      <div className="submitArea">
        <button className="submitBtn" disabled={!checkProceed} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TopBar;
