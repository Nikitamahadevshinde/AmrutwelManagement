import { useState } from "react";
import "./Dashboard.css";

import AddRenter from "../pages/AddRenter";
import RenterList from "../pages/RenterList";
import UnitManagement from "../pages/UnitManagement";
import PaymentTracking from "../pages/PaymentTracking";

function Dashboard() {

const [activePage, setActivePage] = useState("dashboard");
const [renterMenuOpen, setRenterMenuOpen] = useState(true);

const [refreshRenterList, setRefreshRenterList] = useState(0);

const handleRenterAdded = () => {
setRefreshRenterList((value) => value + 1);
setActivePage("renter-list");
};

return ( <div className="dashboard">


  <header className="dashboard-header">
    <h1>Welcome to Our Home</h1>
  </header>

  <div className="dashboard-body">

    <aside className="dashboard-sidebar">

      <button
        className="sidebar-item"
        onClick={() => setActivePage("dashboard")}
      >
        🏠 Dashboard
      </button>

      <button
        className="sidebar-item"
        onClick={() => setRenterMenuOpen(!renterMenuOpen)}
      >
        👤 Renters
      </button>

      {renterMenuOpen && (
        <div className="renter-submenu">

          <button
            className="sidebar-subitem"
            onClick={() => setActivePage("add-renter")}
          >
            ➕ Add Renter
          </button>

          <button
            className="sidebar-subitem"
            onClick={() => setActivePage("renter-list")}
          >
            📋 Renter List
          </button>

        </div>
      )}

      <button
        className="sidebar-item"
        onClick={() => setActivePage("units")}
      >
        🚪 Units
      </button>

      <button
        className="sidebar-item"
        onClick={() => setActivePage("payments")}
      >
        💰 Payments
      </button>

    </aside>

    <main className="dashboard-content">

      {activePage === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>
            Welcome to the Amrutwel Management System.
          </p>
        </div>
      )}

      {activePage === "add-renter" && (
        <AddRenter
          onRenterAdded={handleRenterAdded}
        />
      )}

      {activePage === "renter-list" && (
        <RenterList
          refreshRenterList={refreshRenterList}
        />
      )}

      {activePage === "units" && (
        <UnitManagement />
      )}

      {activePage === "payments" && (
        <PaymentTracking />
      )}

    </main>

  </div>

</div>


);
}

export default Dashboard;
