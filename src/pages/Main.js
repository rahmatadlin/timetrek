import React from "react";
import "../App.css";
import Scheduler from "../components/Scheduler";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import ViewPayroll from "../components/Payroll";
import ClaimsPage from "../components/Claims";
import AttendancePage from "../components/Attendance";
import OTPage from "../components/OT";
import LeavesPage from "../components/Leaves";
import AdminPage from "../components/Admin";

const Main = () => {
  const [currentTab, setCurrentTab] = React.useState("/schedule");
  const handleSearchInputChange = (event) => {
    // Implement your search logic here
    console.log("Search query:", event.target.value);
  };

  const generateInitials = (name) => {
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div className="topnav">
        {/* Logo */}
        <div className="logo">
          <h3>TimeTrek</h3>
        </div>

        {/* Search input */}
        <div className="search-input">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchInputChange}
          />
        </div>

        {/* Avatar */}
        <div className="avatar">
          <div className="avatar-circle">{generateInitials("John Doe")}</div>
          <span className="avatar-name">John Doe</span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 0.2 }}>
          <Navigation
            // you can use your own router's api to get pathname
            activeItemId={currentTab}
            onSelect={({ itemId }) => {
              // maybe push to the route
              setCurrentTab(itemId);
            }}
            items={[
              {
                title: "Schedule",
                itemId: "/schedule",
              },
              {
                title: "Payroll",
                itemId: "/payroll",
              },
              {
                title: "Claims",
                itemId: "/claims",
              },
              {
                title: "Management",
                itemId: "/management",
                subNav: [
                  {
                    title: "Attendance",
                    itemId: "/management/attendance",
                  },
                  {
                    title: "OT",
                    itemId: "/management/ot",
                  },
                  {
                    title: "Leave",
                    itemId: "/management/leave",
                  },
                ],
              },
              {
                title: "Admin",
                itemId: "/admin",
              },
              {
                title: "Settings",
                itemId: "/settings",
              },
              {
                title: "Logout",
                itemId: "/logout",
              },
            ]}
          />
        </div>
        <div style={{ flex: 1 }}>
          {currentTab === "/schedule" && <Scheduler></Scheduler>}
          {currentTab === "/payroll" && <ViewPayroll></ViewPayroll>}
          {currentTab === "/claims" && <ClaimsPage></ClaimsPage>}
          {currentTab === "/management/attendance" && (
            <AttendancePage></AttendancePage>
          )}
          {currentTab === "/management/ot" && <OTPage></OTPage>}
          {currentTab === "/management/leave" && <LeavesPage></LeavesPage>}
          {currentTab === "/admin" && <AdminPage></AdminPage>}
        </div>
      </div>
    </>
  );
};

export default Main;
