import React, { useState } from 'react';
import './App.css';

const SECTIONS = ["INF221", "INF222", "INF223", "INF224", "INF225", "INF226"];

function getEquivalent(grade) {
  const gradeNumber = Number(grade);
  if (gradeNumber >= 96) return 4.0;
  if (gradeNumber >= 90) return 3.5;
  if (gradeNumber >= 84) return 3.0;
  if (gradeNumber >= 78) return 2.5;
  if (gradeNumber >= 72) return 2.0;
  if (gradeNumber >= 66) return 1.5;
  if (gradeNumber >= 60) return 1.0;
  return "R";
}

function App() {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    image: "",
    section: "",
    grade: ""
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const clearForm = () => {
    setForm({ name: "", image: "", section: "", grade: "" });
    setEditId(null);
  };

  const validate = () => {
    if (!form.name || !form.image || !form.section || form.grade === "") {
      alert("All fields are required.");
      return false;
    }
    if (!SECTIONS.includes(form.section)) {
      alert("Invalid section.");
      return false;
    }
    const gradeNumber = Number(form.grade);
    if (isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100) {
      alert("Grade must be between 0 and 100.");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validate()) return;
    const newStudent = {
      id: Date.now(),
      name: form.name,
      image: form.image,
      section: form.section,
      grade: form.grade,
      equivalent: getEquivalent(form.grade)
    };
    setStudents([...students, newStudent]);
    clearForm();
  };

  const handleUpdate = () => {
    if (!validate()) return;
    setStudents(
      students.map((student) =>
        student.id === editId
          ? {
              ...student,
              name: form.name,
              image: form.image,
              section: form.section,
              grade: form.grade,
              equivalent: getEquivalent(form.grade)
            }
          : student
      )
    );
    clearForm();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      image: student.image,
      section: student.section,
      grade: student.grade
    });
    setEditId(student.id);
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
    if (editId === id) clearForm();
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <span className="brand">STUDENT&nbsp;GRADE</span>
        <span className="record-count">{students.length} record{students.length !== 1 ? "s" : ""}</span>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h3 className="sidebar-title">{editId ? "Edit Record" : "New Record"}</h3>

          <div className="field">
            <label>Name</label>
            <input name="name" placeholder="e.g. Juan Dela Cruz" value={form.name} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Image URL</label>
            <input name="image" placeholder="https://..." value={form.image} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Section</label>
            <select name="section" value={form.section} onChange={handleChange}>
              <option value="">Select Section</option>
              {SECTIONS.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Grade</label>
            <input
              name="grade"
              type="number"
              min="0"
              max="100"
              placeholder="0 - 100"
              value={form.grade}
              onChange={handleChange}
            />
          </div>

          <div className="equivalent-box">
            <span>Equivalent</span>
            <strong>{form.grade !== "" ? getEquivalent(form.grade) : "—"}</strong>
          </div>

          <div className="button-row">
            {editId ? (
              <button className="btn-solid" onClick={handleUpdate}>Update</button>
            ) : (
              <button className="btn-solid" onClick={handleCreate}>Create</button>
            )}
            <button className="btn-outline" onClick={clearForm}>Clear</button>
          </div>
        </aside>

        <main className="content">
          {students.length === 0 ? (
            <div className="empty-state">No records yet. Add one from the panel on the left.</div>
          ) : (
            <div className="grid">
              {students.map((student) => (
                <div key={student.id} className="record-card">
                  <img src={student.image} alt="This is an image" />
                  <div className="record-info">
                    <p className="record-name">{student.name}</p>
                    <p className="record-meta">{student.section}</p>
                    <div className="record-stats">
                      <span>Grade <strong>{student.grade}</strong></span>
                      <span>GPA <strong>{student.equivalent}</strong></span>
                    </div>
                  </div>
                  <div className="record-actions">
                    <button className="btn-outline small" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="btn-solid small" onClick={() => handleDelete(student.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;