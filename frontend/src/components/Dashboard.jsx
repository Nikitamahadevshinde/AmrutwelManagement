import { useEffect, useState } from "react";
import "./Dashboard.css";

import AddRenter from "../pages/AddRenter";
import RenterList from "../pages/RenterList";
import UnitManagement from "../pages/UnitManagement";
import PaymentTracking from "../pages/PaymentTracking";

function Dashboard() {

  const [activePage, setActivePage] = useState("dashboard");
  const [renterMenuOpen, setRenterMenuOpen] = useState(true);

  const [refreshRenterList, setRefreshRenterList] = useState(0);

  // ==========================================
  // Dashboard data
  // ==========================================

  const [units, setUnits] = useState([]);
  const [renters, setRenters] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const [
        unitsResponse,
        rentersResponse,
        paymentsResponse
      ] = await Promise.all([

        fetch("http://localhost:5000/api/units"),

        fetch("http://localhost:5000/api/renters"),

        fetch("http://localhost:5000/api/payments")

      ]);


      const unitsData = await unitsResponse.json();

      const rentersData = await rentersResponse.json();

      const paymentsData = await paymentsResponse.json();


      if (!unitsResponse.ok) {
        throw new Error("Failed to fetch units");
      }

      if (!rentersResponse.ok) {
        throw new Error("Failed to fetch renters");
      }

      if (!paymentsResponse.ok) {
        throw new Error("Failed to fetch payments");
      }


      setUnits(unitsData);

      setRenters(rentersData);

      setPayments(paymentsData);


    } catch (error) {

      console.error(
        "Error fetching dashboard data:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    fetchDashboardData();

  }, []);


  // ==========================================
  // RENTER ADDED
  // ==========================================

  const handleRenterAdded = () => {

    setRefreshRenterList(
      (value) => value + 1
    );

    setActivePage("renter-list");

    fetchDashboardData();

  };


  // ==========================================
  // BASIC DASHBOARD COUNTS
  // ==========================================

  const totalUnits =
    units.length;


  const occupiedUnits =
    units.filter(
      (unit) =>
        unit.status === "Occupied"
    ).length;


  const vacantUnits =
    units.filter(
      (unit) =>
        unit.status === "Vacant"
    ).length;


  const totalRenters =
    renters.length;


  // ==========================================
  // CURRENT DATE
  // ==========================================

  const today = new Date();

  const currentMonth =
    today.getMonth();

  const currentYear =
    today.getFullYear();


  const currentMonthYear =
    today.toLocaleString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );


  // ==========================================
  // RENT COLLECTED
  //
  // Count payments that were ACTUALLY MADE
  // during the current calendar month.
  //
  // We use paymentDate instead of payment.month.
  // ==========================================

  const rentCollected =
    payments
      .filter((payment) => {

        if (
          payment.status !== "Paid" ||
          !payment.paymentDate
        ) {
          return false;
        }


        const paymentDate =
          new Date(
            payment.paymentDate
          );


        return (
          paymentDate.getMonth() ===
            currentMonth &&
          paymentDate.getFullYear() ===
            currentYear
        );

      })
      .reduce(
        (total, payment) =>
          total +
          Number(
            payment.amount || 0
          ),
        0
      );


  // ==========================================
  // HELPER
  // ADD MONTHS WITHOUT DATE SHIFTING
  // ==========================================

  const addMonths = (
    date,
    months
  ) => {

    const originalDay =
      date.getDate();


    const result =
      new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1
      );


    const lastDay =
      new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0
      ).getDate();


    result.setDate(
      Math.min(
        originalDay,
        lastDay
      )
    );


    return result;

  };


  // ==========================================
  // CHECK WHETHER A PAYMENT EXISTS
  // ==========================================

  const hasPaymentForPeriod = (
    renterId,
    month
  ) => {

    return payments.some(
      (payment) =>
        payment.renter === renterId &&
        payment.month === month &&
        payment.status === "Paid"
    );

  };


  // ==========================================
  // CALCULATE PENDING RENT
  //
  // For every renter:
  //
  // 1. Find completed rental months
  // 2. Check whether each completed month
  //    has been paid
  // 3. Add unpaid rent
  // ==========================================

  let pendingRent = 0;


  renters.forEach((renter) => {

    if (!renter.joiningDate) {
      return;
    }


    const joiningDate =
      new Date(
        renter.joiningDate
      );


    joiningDate.setHours(
      0,
      0,
      0,
      0
    );


    const todayDate =
      new Date();


    todayDate.setHours(
      0,
      0,
      0,
      0
    );


    let monthNumber = 1;


    while (true) {

      // Date when this rental month
      // becomes completed

      const completionDate =
        addMonths(
          joiningDate,
          monthNumber
        );


      completionDate.setHours(
        0,
        0,
        0,
        0
      );


      // Rental month is not completed yet

      if (
        completionDate >
        todayDate
      ) {

        break;

      }


      // Start of this rental period

      const periodStart =
        addMonths(
          joiningDate,
          monthNumber - 1
        );


      const periodMonth =
        periodStart.toLocaleString(
          "en-US",
          {
            month: "long",
            year: "numeric"
          }
        );


      // Check whether this rental period
      // has already been paid

      const alreadyPaid =
        payments.some(
          (payment) =>
            (
              payment.renter ===
              renter._id ||
              payment.renter?._id ===
              renter._id
            ) &&
            payment.month ===
              periodMonth &&
            payment.status ===
              "Paid"
        );


      // If not paid, add monthly rent

      if (!alreadyPaid) {

        pendingRent +=
          Number(
            renter.monthlyRent || 0
          );

      }


      monthNumber++;

    }

  });


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="dashboard">


      {/* ======================================
    DASHBOARD HEADER
====================================== */}

           <header className="dashboard-header">

             {/* Left side - Logo and title */}

            <div className="dashboard-brand">

                <div className="building-icon">
                 🏢
                 </div>

                      <h1>
                    Amrutwel Management System
                     </h1>

                 </div>


            {/* Right side - Settings and Help */}

            <div className="dashboard-header-actions">

                <button
                 className="header-action-button"
                 title="Settings"
                 >
                  ⚙️
                 </button>

                   <button
                    className="header-action-button"
                     title="Help"
                       >
                         ❓
                     </button>

     </div>

         </header>


      {/* ======================================
          DASHBOARD BODY
      ====================================== */}

      <div className="dashboard-body">


        {/* ====================================
            SIDEBAR
        ==================================== */}

        <aside className="dashboard-sidebar">


          <button
            className="sidebar-item"
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            🏠 Dashboard
          </button>


          <button
            className="sidebar-item"
            onClick={() =>
              setRenterMenuOpen(
                !renterMenuOpen
              )
            }
          >
            👤 Renters
          </button>


          {renterMenuOpen && (

            <div className="renter-submenu">

              <button
                className="sidebar-subitem"
                onClick={() =>
                  setActivePage(
                    "add-renter"
                  )
                }
              >
                ➕ Add Renter
              </button>


              <button
                className="sidebar-subitem"
                onClick={() =>
                  setActivePage(
                    "renter-list"
                  )
                }
              >
                📋 Renter List
              </button>

            </div>

          )}


          <button
            className="sidebar-item"
            onClick={() =>
              setActivePage("units")
            }
          >
            🚪 Units
          </button>


          <button
            className="sidebar-item"
            onClick={() =>
              setActivePage("payments")
            }
          >
            💰 Payments
          </button>


        </aside>


        {/* ====================================
            MAIN CONTENT
        ==================================== */}

        <main className="dashboard-content">


          {/* ==================================
              DASHBOARD
          ================================== */}

          {activePage === "dashboard" && (

            <div>

              <h2>
                Dashboard
              </h2>


              <p>
                Welcome to the Amrutwel
                Management System.
              </p>


              {loading ? (

                <p>
                  Loading dashboard data...
                </p>

              ) : (

                <div className="dashboard-cards">


                  {/* TOTAL UNITS */}

                  <div className="dashboard-card">

                    <h3>
                      🏠 Total Units
                    </h3>

                    <p>
                      {totalUnits}
                    </p>

                  </div>


                  {/* OCCUPIED UNITS */}

                  <div className="dashboard-card">

                    <h3>
                      🟢 Occupied Units
                    </h3>

                    <p>
                      {occupiedUnits}
                    </p>

                  </div>


                  {/* VACANT UNITS */}

                  <div className="dashboard-card">

                    <h3>
                      🔵 Vacant Units
                    </h3>

                    <p>
                      {vacantUnits}
                    </p>

                  </div>


                  {/* TOTAL RENTERS */}

                  <div className="dashboard-card">

                    <h3>
                      👥 Total Renters
                    </h3>

                    <p>
                      {totalRenters}
                    </p>

                  </div>


                  {/* RENT COLLECTED */}

                  <div className="dashboard-card">

                    <h3>
                      💰 Rent Collected
                    </h3>

                    <p>
                      ₹
                      {rentCollected.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <small>
                      {currentMonthYear}
                    </small>

                  </div>


                  {/* PENDING RENT */}

                  <div className="dashboard-card">

                    <h3>
                      ⏳ Pending Rent
                    </h3>

                    <p>
                      ₹
                      {pendingRent.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <small>
                      As of {today.toLocaleDateString(
                        "en-GB"
                      )}
                    </small>

                  </div>


                </div>

              )}

            </div>

          )}


          {/* ==================================
              ADD RENTER
          ================================== */}

          {activePage === "add-renter" && (

            <AddRenter
              onRenterAdded={
                handleRenterAdded
              }
            />

          )}


          {/* ==================================
              RENTER LIST
          ================================== */}

          {activePage === "renter-list" && (

            <RenterList
              refreshRenterList={
                refreshRenterList
              }
            />

          )}


          {/* ==================================
              UNITS
          ================================== */}

          {activePage === "units" && (

            <UnitManagement />

          )}


          {/* ==================================
              PAYMENTS
          ================================== */}

          {activePage === "payments" && (

            <PaymentTracking />

          )}

        </main>

      </div>

    </div>

  );

}

export default Dashboard;