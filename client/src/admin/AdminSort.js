import { useState, useEffect } from "react";

const AdminSort = () => {
  const [kids, setKids] = useState([]);
  const [sortField, setSortField] = useState("kid_surname");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSave = async (id) => {
    const response = await fetch(`/api/editkid/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (!response.ok) {
      console.error("Update failed");
      return;
    }

    // Update local state instead of refetching
    setKids(prev =>
      prev.map(k =>
        k.kid_id === id ? { ...k, ...editForm } : k
      )
    );

    setEditingId(null);
  };


  useEffect(() => {
    fetch("/api/sortall")
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
    <div>
      <p>Zoradiť podľa:</p>
      <div className="sortBtnCon">
        <button onClick={() => handleSort("kid_surname")}>Priezvisko</button>
        <button onClick={() => handleSort("kid_birth")}>Vek</button>
        <button onClick={() => handleSort("total_skips")}>Počet odhlásení</button>
        <button onClick={() => handleSort("added_time")}>Pridané dňa</button>
      </div>

      {sortedKids.map((kid, index) => (
        <div className="kid-card"
          key={kid.kid_id}
        >
          <div className="kid-card-number">
            {String(index + 1).padStart(3, "0")}
          </div>

          {editingId === kid.kid_id ? (
            <>
              <input value={editForm.kid_name} onChange={(e) =>
                setEditForm({ ...editForm, kid_name: e.target.value })
              }
              />

              <input value={editForm.kid_surname} onChange={(e) =>
                setEditForm({ ...editForm, kid_surname: e.target.value })
              }
              />

              <input type="date" value={editForm.kid_birth?.slice(0, 10)} onChange={(e) =>
                setEditForm({ ...editForm, kid_birth: e.target.value })
              }
              />

              <button onClick={() => handleSave(kid.kid_id)}>Uložiť</button>
              <button onClick={() => setEditingId(null)}>Zrušiť</button>
            </>
          ) : (
            <>
              <strong className="kid-name">{kid.kid_name} {kid.kid_surname}</strong>
              <div className="kid-info">
                <div>Nar.: {kid.kid_birth.slice(0, 10)}</div>
                <div>Rodič: {kid.username}</div>
                <div>Odhlásení: {kid.total_skips || 0}</div>
                <div>Naposledy: {kid.last_skip?.slice(0, 10) || "-"}</div>
                <div>Pridané: {kid.added_time.slice(0, 10
                  
                )}</div>
                <button onClick={() => {
                  setEditingId(kid.kid_id);
                  setEditForm({
                    kid_name: kid.kid_name,
                    kid_surname: kid.kid_surname,
                    kid_birth: kid.kid_birth?.slice(0, 10)
                  });
                }}>
                  Upraviť
                </button>
              </div>
            </>
          )}

        </div>
      ))}

    </div>
  );
}
export default AdminSort;