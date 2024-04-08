import React, { useState, useEffect } from "react";
import "../App.css";

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("All");

  // Simulated initial data loading
  useEffect(() => {
    // Fetch claims from the server or database
    // Replace this with your actual data fetching logic
    const fetchClaims = async () => {
      try {
        // Simulated data
        const data = [
          { claim_id: 1, description: "Expense for office supplies", status: "approved", amount: 100.0, created_by: 1, approved_by: 2 },
          { claim_id: 2, description: "Travel expense for client meeting", status: "pending", amount: 250.0, created_by: 2, approved_by: null },
          { claim_id: 3, description: "Dinner with client", status: "rejected", amount: 80.0, created_by: 3, approved_by: 2 }
          // Add more claims as needed
        ];
        setClaims(data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    fetchClaims();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredClaims = filter === "All" ? claims : claims.filter(claim => claim.status === filter);

  const handleSubmitNewClaim = () => {
    // Implement logic to navigate to the page for submitting new claims
    console.log("Navigate to submit new claim page");
  };

  return (
    <div className="container">
      <h2 className="page-header">Claims</h2>
      <div>
        <label>Filter:</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <button className="page-button" onClick={handleSubmitNewClaim}>Submit New Claim</button>
      <table className="page-table">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Created By</th>
            <th>Approved By</th>
          </tr>
        </thead>
        <tbody>
          {filteredClaims.map(claim => (
            <tr key={claim.claim_id}>
              <td>{claim.claim_id}</td>
              <td>{claim.description}</td>
              <td>{claim.status}</td>
              <td>${claim.amount}</td>
              <td>{claim.created_by}</td>
              <td>{claim.approved_by || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimsPage;
