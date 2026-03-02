import { useEffect, useMemo, useState } from "react";

const Countdown = ({ dateUpdate, cutoffConfig }) => {
  const [now, setNow] = useState(new Date());

  // ✅ Proper interval (runs once)
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Calculate next working cutoff safely
  const nextCutoff = useMemo(() => {
    const current = new Date(now);

    const cutoffToday = new Date(current);
    cutoffToday.setHours(
      cutoffConfig.cutoffHour,
      cutoffConfig.cutoffMinute,
      0,
      0
    );

    const day = current.getDay(); // 0 = Sunday, 6 = Saturday

    // If weekday and before cutoff → today 7:30
    if (day !== 0 && day !== 6 && current < cutoffToday) {
      return cutoffToday;
    }

    // Otherwise calculate next working day
    let daysToAdd = 1;

    if (day === 5) daysToAdd = 3; // Friday → Monday
    else if (day === 6) daysToAdd = 2; // Saturday → Monday
    else if (day === 0) daysToAdd = 1; // Sunday → Monday

    const next = new Date(current);
    next.setDate(current.getDate() + daysToAdd);
    next.setHours(
      cutoffConfig.cutoffHour,
      cutoffConfig.cutoffMinute,
      0,
      0
    );


    return next;
  }, [now, cutoffConfig]);

  // ✅ Notify parent when date changes
  useEffect(() => {
    const formatted =
      nextCutoff.getFullYear() +
      "-" +
      String(nextCutoff.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(nextCutoff.getDate()).padStart(2, "0");

    dateUpdate(formatted);
  }, [nextCutoff, dateUpdate]);

  // ✅ Countdown display
  const distance = nextCutoff - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  const pad = (n) => String(n).padStart(2, "0");

  const dayNames = [
    "Nedeľa",
    "Pondelok",
    "Utorok",
    "Streda",
    "Štvrtok",
    "Piatok",
    "Sobota",
  ];

  return (
    <div className="countDown">
      <p>
        Do najbližšieho termínu:{" "}
        <strong>{dayNames[nextCutoff.getDay()]}{"\u00A0"}
        {pad(nextCutoff.getDate())}-
        {pad(nextCutoff.getMonth() + 1)}-
        {nextCutoff.getFullYear()}{" • "}
        {cutoffConfig.cutoffHour}: {cutoffConfig.cutoffMinute}</strong>
        {" "}ostáva
      </p>

      <h1>
        {days}d {hours}h {pad(minutes)}m {pad(seconds)}s
      </h1>
    </div>
  );
};

export default Countdown;
