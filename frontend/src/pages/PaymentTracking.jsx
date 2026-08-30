
import { useEffect, useState } from "react";
import "./PaymentTracking.css";

function PaymentTracking() {

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [renter, setRenter] = useState(null);
  const [payments, setPayments] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [payingMonth, setPayingMonth] = useState("");


  // =====================================================
  // FETCH ALL ROOMS
  // =====================================================

  useEffect(() => {
    fetchUnits();
  }, []);


  const fetchUnits = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/units"
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.message || "Failed to load rooms"
        );

      }

      setUnits(data);

    } catch (error) {

      console.error(
        "Error fetching units:",
        error
      );

      setMessage(
        "❌ Failed to load rooms"
      );

    }

  };


  // =====================================================
  // CLICK ROOM
  // =====================================================

  const handleRoomClick = async (unit) => {

    setSelectedUnit(unit);
    setRenter(null);
    setPayments([]);
    setMessage("");
    setLoading(true);


    // ===================================================
    // VACANT ROOM
    // ===================================================

    if (!unit.renter) {

      setMessage(
        "This room is currently vacant."
      );

      setLoading(false);

      return;

    }


    try {

      // =================================================
      // GET COMPLETE RENTER INFORMATION
      // =================================================

      const renterResponse = await fetch(
        "http://localhost:5000/api/renters"
      );


      const renters =
        await renterResponse.json();


      if (!renterResponse.ok) {

        throw new Error(
          renters.message ||
          "Failed to fetch renter information"
        );

      }


      // Find renter belonging to this room

      const selectedRenter =
        renters.find(
          (renterItem) =>
            renterItem._id === unit.renter._id
        );


      if (!selectedRenter) {

        throw new Error(
          "Renter information not found"
        );

      }


      // Save complete renter information

      setRenter(selectedRenter);


      // =================================================
      // GET PAYMENT HISTORY
      // =================================================

      const paymentResponse =
        await fetch(
          `http://localhost:5000/api/payments/renter/${unit.renter._id}`
        );


      const paymentData =
        await paymentResponse.json();


      if (!paymentResponse.ok) {

        throw new Error(
          paymentData.message ||
          "Failed to fetch payment history"
        );

      }


      setPayments(paymentData);


    } catch (error) {

      console.error(
        "Error loading renter/payment details:",
        error
      );

      setMessage(
        `❌ ${
          error.message ||
          "Failed to load details"
        }`
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // BACK TO ROOMS
  // =====================================================

  const handleBack = () => {

    setSelectedUnit(null);
    setRenter(null);
    setPayments([]);
    setMessage("");
    setPayingMonth("");

  };


  // =====================================================
  // FORMAT MONTH
  // Example: July 2026
  // =====================================================

  const formatMonth = (date) => {

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

  };


  // =====================================================
  // ADD MONTHS WITHOUT DATE SHIFTING
  //
  // This handles dates like:
  // 15th → 15th
  // 20th → 20th
  // 31st → last valid day of next month
  // =====================================================

  const addMonths = (date, months) => {

    const originalDay =
      date.getDate();

    const result =
      new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1
      );

    const lastDayOfTargetMonth =
      new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0
      ).getDate();

    result.setDate(
      Math.min(
        originalDay,
        lastDayOfTargetMonth
      )
    );

    return result;

  };


  // =====================================================
  // CHECK WHETHER A RENTAL MONTH IS COMPLETED
  //
  // Example:
  //
  // Joining Date = 15 July
  //
  // 14 August → false
  // 15 August → true
  // 30 August → true
  // 15 September → second month completed
  // =====================================================

  const getCompletedRentMonths = () => {

    if (
      !renter ||
      !renter.joiningDate
    ) {

      return [];

    }


    const joiningDate =
      new Date(renter.joiningDate);


    const today =
      new Date();


    // Remove time from today's date

    today.setHours(
      0,
      0,
      0,
      0
    );


    const months = [];

    let monthNumber = 1;


    while (true) {

      // Calculate the date on which
      // this rental month completes

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


      // If the rental month has not
      // completed yet, stop here

      if (completionDate > today) {

        break;

      }


      // The payment is identified by
      // the month in which the rental
      // period started

      const periodStart =
        addMonths(
          joiningDate,
          monthNumber - 1
        );


      months.push({
        month: formatMonth(periodStart),
        periodStart: periodStart,
        completionDate: completionDate
      });


      monthNumber++;

    }


    return months;

  };


  // =====================================================
  // ALL COMPLETED RENT MONTHS
  // =====================================================

  const rentMonths =
    getCompletedRentMonths();


  // =====================================================
  // FIND PAYMENT FOR A RENTAL MONTH
  // =====================================================

  const getPaymentForMonth = (month) => {

    return payments.find(
      (payment) =>
        payment.month === month &&
        payment.status === "Paid"
    );

  };


  // =====================================================
  // PAID MONTHS
  // =====================================================

  const paidMonths =
    rentMonths.filter(
      (rentMonth) =>
        getPaymentForMonth(
          rentMonth.month
        )
    );


  // =====================================================
  // UNPAID MONTHS
  // =====================================================

  const unpaidMonths =
    rentMonths.filter(
      (rentMonth) =>
        !getPaymentForMonth(
          rentMonth.month
        )
    );


  // =====================================================
  // MONTHLY RENT
  // =====================================================

  const monthlyRent =
    renter?.monthlyRent ||
    selectedUnit?.monthlyRent ||
    0;


  // =====================================================
  // TOTAL PAID
  // =====================================================

  const totalPaid =
    payments
      .filter(
        (payment) =>
          payment.status === "Paid"
      )
      .reduce(
        (total, payment) =>
          total +
          Number(payment.amount || 0),
        0
      );


  // =====================================================
  // TOTAL UNPAID RENT
  // =====================================================

  const totalUnpaid =
    unpaidMonths.length *
    Number(monthlyRent);


  // =====================================================
  // PAY FOR A MONTH
  // =====================================================

  const handlePay = async (month) => {

    if (!renter) {

      return;

    }


    setPayingMonth(month);
    setMessage("");


    try {

      const response =
        await fetch(
          "http://localhost:5000/api/payments",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              renterId:
                renter._id,

              roomNumber:
                renter.roomNumber,

              month:
                month,

              amount:
                Number(monthlyRent),

              paymentDate:
                new Date().toISOString()

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to record payment"
        );

      }


      // Add newly created payment
      // to the current payment list

      setPayments(
        (previousPayments) => [
          ...previousPayments,
          data.payment
        ]
      );


      setMessage(
        `✅ Payment for ${month} recorded successfully`
      );


    } catch (error) {

      console.error(
        "Payment error:",
        error
      );


      setMessage(
        `❌ ${
          error.message ||
          "Failed to record payment"
        }`
      );

    } finally {

      setPayingMonth("");

    }

  };


  // =====================================================
  // ROOM GRID
  // =====================================================

  if (!selectedUnit) {

    return (

      <div className="payment-tracking">

        <h1>
          Payment Tracking
        </h1>


        <p className="payment-subtitle">
          Select a room to view payment details
        </p>


        {message && (

          <p className="payment-message">
            {message}
          </p>

        )}


        <div className="payment-room-grid">

          {[...units]
            .sort(
              (a, b) =>
                a.unitNumber -
                b.unitNumber
            )
            .map((unit) => (

              <button
                key={unit._id}
                className={`payment-room-button ${
                  unit.status === "Occupied"
                    ? "room-occupied"
                    : "room-vacant"
                }`}
                onClick={() =>
                  handleRoomClick(unit)
                }
              >

                {unit.unitNumber}

              </button>

            ))}

        </div>

      </div>

    );

  }


  // =====================================================
  // SELECTED ROOM DETAILS
  // =====================================================

  return (

    <div className="payment-tracking">


      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        className="back-to-rooms-button"
        onClick={handleBack}
      >

        ← Back to Rooms

      </button>


      <div className="payment-details">


        <h1>
          Room {selectedUnit.unitNumber}
        </h1>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <p>
            Loading room details...
          </p>

        ) : !renter ? (

          /* =================================================
             VACANT ROOM
          ================================================= */

          <div className="vacant-room-details">

            <h2>
              Room {selectedUnit.unitNumber}
            </h2>


            <p>
              {message ||
                "This room is currently vacant."}
            </p>


            <p>

              <strong>
                Room Type:
              </strong>{" "}

              {selectedUnit.unitType}

            </p>


            <p>

              <strong>
                Monthly Rent:
              </strong>{" "}

              ₹{selectedUnit.monthlyRent}

            </p>

          </div>

        ) : (

          <>


            {/* =================================================
                RENTER DETAILS
            ================================================= */}

            <div className="renter-payment-info">

              <h2>
                Renter Details
              </h2>


              <div className="detail-row">

                <span>
                  Name
                </span>

                <strong>
                  {renter.name}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Phone
                </span>

                <strong>
                  {renter.phone}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Room Number
                </span>

                <strong>
                  {renter.roomNumber}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Room Type
                </span>

                <strong>
                  {renter.roomType}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Monthly Rent
                </span>

                <strong>
                  ₹{renter.monthlyRent}
                </strong>

              </div>


              <div className="detail-row">

                <span>
                  Joining Date
                </span>

                <strong>

                  {renter.joiningDate
                    ? new Date(
                        renter.joiningDate
                      ).toLocaleDateString("en-GB")
                    : "-"}

                </strong>

              </div>

            </div>


            {/* =================================================
                PAYMENT SUMMARY
            ================================================= */}

            <div className="payment-summary">

              <h2>
                Payment Summary
              </h2>


              <div className="summary-card">

                <span>
                  Total Rent Months
                </span>

                <strong>
                  {rentMonths.length}
                </strong>

              </div>


              <div className="summary-card">

                <span>
                  Paid Months
                </span>

                <strong>
                  {paidMonths.length}
                </strong>

              </div>


              <div className="summary-card">

                <span>
                  Unpaid Months
                </span>

                <strong>
                  {unpaidMonths.length}
                </strong>

              </div>


              <div className="summary-card">

                <span>
                  Total Amount Paid
                </span>

                <strong>
                  ₹{totalPaid}
                </strong>

              </div>


              <div className="summary-card">

                <span>
                  Total Unpaid Rent
                </span>

                <strong>
                  ₹{totalUnpaid}
                </strong>

              </div>

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (

              <p className="payment-message">
                {message}
              </p>

            )}


            {/* =================================================
                MONTHLY RENT STATUS
            ================================================= */}

            <div className="monthly-rent-section">

              <h2>
                Monthly Rent Status
              </h2>


              {rentMonths.length === 0 ? (

                <p>
                  No completed rent months yet.
                </p>

              ) : (

                <div className="rent-month-list">

                  {rentMonths.map(
                    (rentMonth) => {

                      const payment =
                        getPaymentForMonth(
                          rentMonth.month
                        );


                      const isPaid =
                        Boolean(payment);


                      return (

                        <div
                          key={rentMonth.month}
                          className={`rent-month-row ${
                            isPaid
                              ? "month-paid"
                              : "month-unpaid"
                          }`}
                        >


                          <div className="month-name">

                            <strong>
                              {rentMonth.month}
                            </strong>

                          </div>


                          <div className="month-amount">

                            ₹{monthlyRent}

                          </div>


                          <div
                            className={`month-status ${
                              isPaid
                                ? "paid-status"
                                : "unpaid-status"
                            }`}
                          >

                            {isPaid
                              ? "Paid"
                              : "Unpaid"}

                          </div>


                          <div className="month-action">

                            {isPaid ? (

                              <span className="paid-date">

                                Paid on{" "}

                                {payment.paymentDate
                                  ? new Date(
                                      payment.paymentDate
                                    ).toLocaleDateString(
                                      "en-GB"
                                    )
                                  : "-"}

                              </span>

                            ) : (

                              <button
                                className="pay-button"
                                disabled={
                                  payingMonth ===
                                  rentMonth.month
                                }
                                onClick={() =>
                                  handlePay(
                                    rentMonth.month
                                  )
                                }
                              >

                                {payingMonth ===
                                rentMonth.month
                                  ? "Processing..."
                                  : "Pay"}

                              </button>

                            )}

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                PAYMENT HISTORY
            ================================================= */}

            <div className="payment-history">

              <h2>
                Payment History
              </h2>


              {payments.length === 0 ? (

                <p className="no-payment-message">

                  No payments recorded yet.

                </p>

              ) : (

                <table>

                  <thead>

                    <tr>

                      <th>
                        Month
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Payment Date
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {payments.map(
                      (payment) => (

                        <tr
                          key={
                            payment._id
                          }
                        >

                          <td>
                            {payment.month}
                          </td>

                          <td>
                            ₹{payment.amount}
                          </td>

                          <td
                            className={
                              payment.status ===
                              "Paid"
                                ? "paid-status"
                                : "unpaid-status"
                            }
                          >

                            {payment.status}

                          </td>

                          <td>

                            {payment.paymentDate
                              ? new Date(
                                  payment.paymentDate
                                ).toLocaleDateString(
                                  "en-GB"
                                )
                              : "-"}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>


          </>

        )}

      </div>

    </div>

  );

}


export default PaymentTracking;

