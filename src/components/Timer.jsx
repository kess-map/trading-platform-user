// src/components/LiveSessionTimer.jsx
 
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useOrderStore } from "../store/orderStore";
 
const LiveSessionTimer = ({otherStyles}) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const {setIsLive} = useOrderStore()
 
  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSession?.mode === "ongoing") {
      setIsLive(true);
    } else {
      setIsLive(false);
    }
  }, [currentSession]);
 
  const fetchSessions = async () => {
    try {
      const res = await axios.get("/live-sessions");
      setSessions(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (sessions.length > 0) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [sessions]);
 
  const updateTimer = () => {
    const now = new Date();
    const todaySessions = sessions.map(session => {
      const [hours, minutes] = session.startTime.split(":").map(Number);
      const start = new Date();
      start.setHours(hours, minutes, 0, 0);
 
      const end = new Date(start.getTime() + session.durationInMinutes * 60000);
 
      return { ...session, start, end };
    });
 
    const ongoing = todaySessions.find(session => now >= session.start && now <= session.end);
    if (ongoing) {
      setCurrentSession({ mode: "ongoing", session: ongoing, endTime: ongoing.end });
      setTimer(ongoing.end - now);
      return;
    }
 
    const upcoming = todaySessions.find(session => now < session.start);
    if (upcoming) {
      setCurrentSession({ mode: "upcoming", session: upcoming, startTime: upcoming.start });
      setTimer(upcoming.start - now);
      return;
    }
 
    const tomorrowFirstSession = todaySessions[0];
    if (tomorrowFirstSession) {
      const tomorrowStart = new Date(tomorrowFirstSession.start);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      setCurrentSession({ mode: "upcoming", session: tomorrowFirstSession, startTime: tomorrowStart });
      setTimer(tomorrowStart - now);
    }
  };
 
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };
 
  if (loading) return <div className="text-white">Loading sessions...</div>;
 
  if (sessions.length === 0) {
    return (
      <div className="bg-red-400 p-6 rounded-lg text-center text-white font-semibold">
        No live sessions yet
      </div>
    );
  }
 
  if (!timer || !currentSession) return null;
 
  const { hours, minutes, seconds } = formatTime(timer);
 
  return (
    <div className={`p-6 rounded-lg text-center font-semibold ${currentSession.mode === "ongoing" ? "bg-green-400" : "bg-red-400"} text-white ${otherStyles}`}>
      {currentSession.mode === "ongoing" ? "Live session ends in:" : "Next live session starts in:"}
      <div className="flex justify-center gap-4 mt-4 text-2xl font-bold">
        {[{ label: "Hours", value: hours }, { label: "Minutes", value: minutes }, { label: "Seconds", value: seconds }].map((item) => (
          <div key={item.label} className="flex flex-col items-center bg-white text-black rounded px-4 py-2">
            <div className={`${currentSession.mode === "ongoing" ? "text-green-500" : "text-red-500"} text-3xl font-bold`}>
              {item.value}
            </div>
            <span className="text-xs font-normal text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default LiveSessionTimer;