// LeavesPage.js
import React, { useState, useEffect } from "react";
import "../App.css"; // Import CSS file

const LeavesPage = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);

  // Simulated initial data loading
  useEffect(() => {
    // Fetch leave records from the server or database
    // Replace this with your actual data fetching logic
    const fetchLeaveRecords = async () => {
      try {
        // Simulated data
        const data = [
          { leave_id: 1, leave_type: "Sick", date: "2024-03-05", duration: 1, remark: "Feeling unwell" },
          { leave_id: 2, leave_type: "Vacation", date: "2024-03-15", duration: 2, remark: "Holiday trip" },
          { leave_id: 3, leave_type: "Personal", date: "2024-03-20", duration: 0.5, remark: "Appointment" },
          // Add more leave records as needed
        ];
        setLeaveRecords(data);
      } catch (error) {
        console.error("Error fetching leave records:", error);
      }
    };

    fetchLeaveRecords();
  }, []);

  const handleApplyLeave = () => {
    // Implement logic to navigate to the page for applying for leave
    console.log("Navigate to apply leave page");
  };

  return (
    <div className="container">
      <h2 className="page-header">Leave Records</h2>
      <button onClick={handleApplyLeave} className="page-button">Apply Leave</button>
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
          {leaveRecords.map(leave => (
            <tr key={leave.leave_id}>
              <td>{leave.leave_id}</td>
              <td>{leave.leave_type}</td>
              <td>{leave.date}</td>
              <td>{leave.duration}</td>
              <td>{leave.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavesPage;
