import { useEffect, useRef, useState } from "react";
import "./RenterList.css";

function RenterList({ refreshRenterList }) {
  const [renters, setRenters] = useState([]);
  const [deletedRenter, setDeletedRenter] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Stores the Undo timer
  const undoTimerRef = useRef(null);

  useEffect(() => {
    fetchRenters();

    // Clear timer when component is removed
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, [refreshRenterList]);

  const fetchRenters = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/renters"
      );

      const data = await response.json();

      setRenters(data);
    } catch (error) {
      console.error("Error fetching renters:", error);
    }
  };

  // Show confirmation beside the selected renter
  const askDeleteConfirmation = (id) => {
    setConfirmDeleteId(id);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Delete renter
  const deleteRenter = async (renter) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/renters/${renter._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log("Renter deleted:", data);

      // Remember deleted renter for Undo
      setDeletedRenter(renter);

      // Remove renter from React state
      setRenters((currentRenters) =>
        currentRenters.filter(
          (currentRenter) => currentRenter._id !== renter._id
        )
      );

      setMessage("Renter deleted successfully.");
      setConfirmDeleteId(null);

      // Clear any previous Undo timer
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      // Make Undo available for 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setDeletedRenter(null);
        setMessage("");
      }, 2000);

    } catch (error) {
      console.error("Error deleting renter:", error);
      setMessage("❌ Failed to delete renter");
    }
  };

  // Restore deleted renter
  const undoDelete = async () => {
    if (!deletedRenter) {
      return;
    }

    // Stop the 5-second timer
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }

    try {
      const renterData = {
        name: deletedRenter.name,
        phone: deletedRenter.phone,
        roomNumber: deletedRenter.roomNumber,
        roomType: deletedRenter.roomType,
        monthlyRent: deletedRenter.monthlyRent,
      };

      const response = await fetch(
        "http://localhost:5000/api/renters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(renterData),
        }
      );

      const restoredRenter = await response.json();

      console.log("Renter restored:", restoredRenter);

      // Add restored renter back to the list
      setRenters((currentRenters) => [
        ...currentRenters,
        restoredRenter,
      ]);

      // Clear deleted renter and message
      setDeletedRenter(null);
      setMessage("");

    } catch (error) {
      console.error("Error restoring renter:", error);
      setMessage("❌ Failed to restore renter");
    }
  };

  return (
    <div className="renter-list-container">

      <h1>All Renters</h1>

      {message && (
        <div className="renter-message">
          <span>{message}</span>

          {deletedRenter && (
            <button
              className="undo-button"
              onClick={undoDelete}
            >
              Undo
            </button>
          )}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Monthly Rent</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {renters.map((renter) => (
            <tr key={renter._id}>
              <td>{renter.name}</td>
              <td>{renter.phone}</td>
              <td>{renter.roomNumber}</td>
              <td>{renter.roomType}</td>
              <td>₹{renter.monthlyRent}</td>

              <td>
                {confirmDeleteId === renter._id ? (
                  <div className="delete-confirmation">
                    <span>Are you sure?</span>

                    <button
                      className="confirm-delete-button"
                      onClick={() => deleteRenter(renter)}
                    >
                      Yes
                    </button>

                    <button
                      className="cancel-delete-button"
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="delete-button"
                    onClick={() =>
                      askDeleteConfirmation(renter._id)
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default RenterList;