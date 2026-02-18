import { useState, useEffect } from "react";

const AdminSort = () => {
  const [kids, setKids] = useState([]);
  const [sortField, setSortField] = useState("kid_surname");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetch("/api/sortall")
      // .then(res => res.json())
      // .then(data => setKids(data));
      .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    setKids(data); // Update state with data
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
  }, []);

  const sortedKids = [...kids].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <button onClick={() => handleSort("kid_surname")}>Priezvisko</button>
        <button onClick={() => handleSort("kid_birth")}>Dátum narodenia</button>
        <button onClick={() => handleSort("total_skips")}>Počet odhlásení</button>
      </div>

      {sortedKids.map(kid => (
        <div
          key={kid.kid_id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
            background: "#fff"
          }}
        >
          <strong>{kid.kid_name} {kid.kid_surname}</strong>
          <div>Rodič: {kid.username}</div>
          <div>Narodenie: {kid.kid_birth.slice(0, 10)}</div>
          <div>Odhlásení: {kid.total_skips || 0}</div>
          <div>Naposledy: {kid.last_skip?.slice(0, 10) || "-"}</div>
        </div>
      ))}
    </div>
  );
}
export default AdminSort;