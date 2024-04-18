import React, { useState, useEffect } from "react";
import "../App.css"; // Import file CSS

const LeavesPage = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [formData, setFormData] = useState({
    leave_type: "",
    date: "",
    duration: "",
    remark: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3007/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to apply leave");
      }
      // Optionally, you can fetch leave records again after submission
      // to update the leaveRecords state with the latest data
      // fetchLeaveRecords();
      // Reset form data after submission
      setFormData({
        leave_type: "",
        date: "",
        duration: "",
        remark: "",
      });
    } catch (error) {
      console.error("Error applying leave:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="page-header">Leave Records</h2>
      <div className="leave-table-container">
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
      <div className="leave-form-container">
        <h2>Apply Leave</h2>
        <form onSubmit={handleSubmitLeave}>
          <div className="form-group">
            <label htmlFor="leave_type">Leave Type</label>
            <input
              type="text"
              id="leave_type"
              name="leave_type"
              placeholder="Leave Type"
              value={formData.leave_type}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration (days)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              placeholder="Duration (days)"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="remark">Remark</label>
            <textarea
              id="remark"
              name="remark"
              placeholder="Remark"
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="btn-submit">Apply Leave</button>
        </form>
      </div>
    </div>
  );
};

export default LeavesPage;
