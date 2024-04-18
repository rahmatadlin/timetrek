import React, { useState, useEffect } from "react";
import "../App.css";

const AttendancePage = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Fetch attendance records from the server
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await fetch("http://localhost:3007/attendance", {
          mode: "cors",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch attendance records");
        }
        const data = await response.json();
        setAttendanceRecords(data.attendanceRecords);
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
              <td>{new Date(record.date).toISOString().slice(0, 10)}</td>
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
