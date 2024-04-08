import React, { useState, useEffect } from "react";
import "../App.css";

const OTPage = () => {
  const [overtimeRecords, setOvertimeRecords] = useState([]);

  // Simulated initial data loading
  useEffect(() => {
    // Fetch overtime records from the server or database
    // Replace this with your actual data fetching logic
    const fetchOvertimeRecords = async () => {
      try {
        // Simulated data
        const data = [
          { ot_id: 1, date: "2024-03-01", ot_duration: 2.5, status: "approved" },
          { ot_id: 2, date: "2024-03-10", ot_duration: 3.0, status: "pending" },
          { ot_id: 3, date: "2024-03-15", ot_duration: 1.5, status: "rejected" },
          // Add more overtime records as needed
        ];
        setOvertimeRecords(data);
      } catch (error) {
        console.error("Error fetching overtime records:", error);
      }
    };

    fetchOvertimeRecords();
  }, []);

  const handleNewOTSubmit = () => {
    // Implement logic to navigate to the page for submitting new OT
    console.log("Navigate to submit new OT page");
  };

  return (
    <div className="container">
      <h2 className="page-header">Overtime Records</h2>
      <button className="page-button" onClick={handleNewOTSubmit}>Submit New OT</button>
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
              <td>{ot.date}</td>
              <td>{ot.ot_duration}</td>
              <td>{ot.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OTPage;
