import React, { useState, useEffect } from "react";
import "../App.css";

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Simulated initial data loading
  useEffect(() => {
    // Fetch attendance records from the server or database
    // Replace this with your actual data fetching logic
    const fetchAttendanceRecords = async () => {
      try {
        // Simulated data
        const data = [
          { attendance_id: 1, date: "2024-03-01", clocked_in: "09:00", clocked_out: "18:00" },
          { attendance_id: 2, date: "2024-03-02", clocked_in: "09:15", clocked_out: "17:45" },
          { attendance_id: 3, date: "2024-03-03", clocked_in: "09:30", clocked_out: "18:30" },
          // Add more attendance records as needed
        ];
        setAttendanceRecords(data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchAttendanceRecords();
  }, []);

  return (
    <div className="container">
      <h2 className="page-header">Attendance Records</h2>
      <table className="page-table">
        <thead>
          <tr>
            <th>Attendance ID</th>
            <th>Date</th>
            <th>Clocked In</th>
            <th>Clocked Out</th>
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map(record => (
            <tr key={record.attendance_id}>
              <td>{record.attendance_id}</td>
              <td>{record.date}</td>
              <td>{record.clocked_in}</td>
              <td>{record.clocked_out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
