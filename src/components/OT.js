import React, { useState, useEffect } from "react";
import "../App.css";

const OTPage = () => {
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOTData, setNewOTData] = useState({
    date: "",
    ot_duration: "",
    status: "pending"
  });

  useEffect(() => {
    const fetchOvertimeRecords = async () => {
      try {
        const response = await fetch("http://localhost:3007/overtime");
        if (!response.ok) {
          throw new Error("Failed to fetch overtime records");
        }
        const data = await response.json();
        setOvertimeRecords(data.overtimeRecords);
      } catch (error) {
        console.error("Error fetching overtime records:", error);
      }
    };

    fetchOvertimeRecords();
  }, []);

  const handleNewOTSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch("http://localhost:3007/overtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOTData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit new OT");
      }
      const data = await response.json();
      setOvertimeRecords([...overtimeRecords, data.overtimeRecord]);
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting new OT:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOTData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <h2 className="page-header">Overtime Records</h2>
      <form onSubmit={handleNewOTSubmit}>
        <button type="submit" className="page-button" onClick={() => setShowModal(true)}>Submit New OT</button>
      </form>
      <table className="page-table">
        <thead>
          <tr>
            <th>OT ID</th>
            <th>Date</th>
            <th>OT Duration (hours)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {overtimeRecords.map(ot => (
            <tr key={ot.ot_id}>
              <td>{ot.ot_id}</td>
              <td>{new Date(ot.date).toISOString().slice(0, 10)}</td>
              <td>{parseFloat(ot.ot_duration).toFixed(1)}</td> 
              <td>{ot.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Submit New Overtime</h2>
            <label>Date:</label>
            <input type="date" name="date" value={newOTData.date} onChange={handleChange} />
            <label>OT Duration (hours):</label>
            <input type="number" name="ot_duration" value={newOTData.ot_duration} onChange={handleChange} />
            <button onClick={handleNewOTSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTPage;
