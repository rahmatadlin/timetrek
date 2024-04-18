import React, { useState, useEffect } from "react";
import "../App.css";

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("All");

  // Fetch claims from the server
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch("http://localhost:3007/claims");
        if (!response.ok) {
          throw new Error("Failed to fetch claims");
        }
        const data = await response.json();
        setClaims(data.claims);
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
