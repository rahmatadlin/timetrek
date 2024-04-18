import React, { useState, useEffect } from "react";
import "../App.css"; // Import file CSS

const LeavesPage = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);

  // Fetch leave records from server
  useEffect(() => {
    const fetchLeaveRecords = async () => {
      try {
        const response = await fetch("http://localhost:3007/leaves");
        if (!response.ok) {
          throw new Error("Failed to fetch leave records");
        }
        const data = await response.json();
        setLeaveRecords(data.leaveRecords);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      }
    };

    fetchLeaveRecords();
  }, []);

  const handleApplyLeave = () => {
    console.log("Navigate to apply leave page");
  };

  return (
    <div className="container">
      <h2 className="page-header">Leave Records</h2>
      <button onClick={handleApplyLeave} className="page-button">
        Apply Leave
      </button>
      <table className="page-table">
        <thead>
          <tr>
            <th>Leave ID</th>
            <th>Leave Type</th>
            <th>Date</th>
            <th>Duration (days)</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {leaveRecords.map((leave) => (
            <tr key={leave.leave_id}>
              <td>{leave.leave_id}</td>
              <td>{leave.leave_type}</td>
              <td>{new Date(leave.date).toISOString().slice(0, 10)}</td>
              <td>{Math.floor(leave.duration)}</td>
              <td>{leave.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavesPage;
