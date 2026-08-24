
import { useState } from "react";

import AddRenter from "./pages/AddRenter";
import RenterList from "./pages/RenterList";
import UnitManagement from "./pages/UnitManagement";

function App() {
  const [activePage, setActivePage] = useState("renters");

  const [refreshRenterList, setRefreshRenterList] = useState(0);

  const handleRenterAdded = () => {
    setRefreshRenterList((value) => value + 1);
  };

  return (
    <div>

      {/* Navigation */}
      <nav>
        <h2>AMRUTWEL MANAGEMENT</h2>

        <div>
          <button onClick={() => setActivePage("renters")}>
            Renters
          </button>

          <button onClick={() => setActivePage("units")}>
            Units
          </button>
        </div>
      </nav>


      {/* Renters Page */}
      {activePage === "renters" && (
        <>
          <AddRenter onRenterAdded={handleRenterAdded} />

          <RenterList
            refreshRenterList={refreshRenterList}
          />
        </>
      )}


      {/* Units Page */}
       {/* {activePage === "units" && (
        <div>
          <h1>Unit Management</h1>

          <p>Unit Management page coming next...</p>
        </div>
      )} */}
      
      {activePage === "units" && (
        <UnitManagement />
      )}

    </div> 
       
  );
}

export default App;

