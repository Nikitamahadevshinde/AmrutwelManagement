import { useState } from "react";

import AddRenter from "./pages/AddRenter";
import RenterList from "./pages/RenterList";
import UnitManagement from "./pages/UnitManagement";
import PaymentTracking from "./pages/PaymentTracking";


function App() {

  const [activePage, setActivePage] = useState("renters");

  const [refreshRenterList, setRefreshRenterList] =
    useState(0);


  const handleRenterAdded = () => {

    setRefreshRenterList(
      (value) => value + 1
    );

  };


  return (

    <div>

      {/* Navigation */}

      <nav>

        <h2>
          AMRUTWEL MANAGEMENT
        </h2>


        <div>

          <button
            onClick={() =>
              setActivePage("renters")
            }
          >
            Renters
          </button>


          <button
            onClick={() =>
              setActivePage("units")
            }
          >
            Units
          </button>


          <button
            onClick={() =>
              setActivePage("payments")
            }
          >
            Payments
          </button>

        </div>

      </nav>


      {/* Renters Page */}

      {activePage === "renters" && (

        <>

          <AddRenter
            onRenterAdded={
              handleRenterAdded
            }
          />


          <RenterList
            refreshRenterList={
              refreshRenterList
            }
          />

        </>

      )}


      {/* Units Page */}

      {activePage === "units" && (

        <UnitManagement />

      )}


      {/* Payment Tracking Page */}

      {activePage === "payments" && (

        <PaymentTracking />

      )}

    </div>

  );

}


export default App;