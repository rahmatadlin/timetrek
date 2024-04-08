import React, { useState, useEffect } from "react";
import "../App.css";

const ViewPayroll = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [payslips, setPayslips] = useState([]);

  // Mock data
  useEffect(() => {
    // Fetch payslips from the server or database based on selected year and month
    // Replace this with your actual data fetching logic
    const fetchData = async () => {
      // Mock data for demonstration
      const mockPayslips = [
        { id: 1, user_id: 1, month: "January", year: 2024, amount: 1500 },
        { id: 2, user_id: 1, month: "February", year: 2024, amount: 1600 },
        { id: 3, user_id: 1, month: "March", year: 2024, amount: 1700 },
        // Add more payslips as needed
      ];
      setPayslips(mockPayslips);
    };

    fetchData();
  }, [year, month]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleDownloadClick = (payslip) => {
    // Simulated download logic
    alert(`Downloading payslip for ${payslip.year}-${payslip.month}`);
  };

  return (
    <div className="container">
      <h2 className="page-header">View Payroll</h2>
      <div className="select-container">
        <label>Year:</label>
        <select value={year} onChange={handleYearChange}>
          {[...Array(3).keys()].map((index) => (
            <option key={year - 1 + index} value={year - 1 + index}>{year - 1 + index}</option>
          ))}
        </select>
      </div>
      <div className="select-container">
        <label>Month:</label>
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(year, i, 1).toLocaleDateString("en-US", { month: "long" })}</option>
          ))}
        </select>
      </div>
      <table className="page-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map((payslip) => (
            <tr key={payslip.id}>
              <td>{payslip.month}</td>
              <td>{payslip.year}</td>
              <td>${payslip.amount}</td>
              <td>
                <button className="page-button" onClick={() => handleDownloadClick(payslip)}>Download Payslip</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPayroll;
