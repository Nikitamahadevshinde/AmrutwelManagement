
import { useEffect, useRef, useState } from "react";
import "./RenterList.css";

function RenterList({ refreshRenterList }) {

  const [renters, setRenters] = useState([]);
  const [units, setUnits] = useState([]);

  const [deletedRenter, setDeletedRenter] = useState(null);
  const [message, setMessage] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingRenter, setEditingRenter] = useState(null);

  // Timers
  const undoTimerRef = useRef(null);
  const messageTimerRef = useRef(null);


  // ==========================================
  // Fetch data when component loads
  // ==========================================

  useEffect(() => {

    fetchRenters();
    fetchUnits();

    return () => {

      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }

      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }

    };

  }, [refreshRenterList]);


  // ==========================================
  // Fetch renters
  // ==========================================

  const fetchRenters = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/renters"
      );

      const data = await response.json();

      setRenters(data);

    } catch (error) {

      console.error(
        "Error fetching renters:",
        error
      );

    }

  };


  // ==========================================
  // Fetch units
  // ==========================================

  const fetchUnits = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/units"
      );

      const data = await response.json();

      setUnits(data);

    } catch (error) {

      console.error(
        "Error fetching units:",
        error
      );

    }

  };


  // ==========================================
  // Show message
  // ==========================================

  const showMessage = (text) => {

    setMessage(text);

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    messageTimerRef.current = setTimeout(() => {
      setMessage("");
    }, 2500);

  };


  // ==========================================
  // Delete confirmation
  // ==========================================

  const askDeleteConfirmation = (id) => {
    setConfirmDeleteId(id);
  };


  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };


  // ==========================================
  // Delete renter
  // ==========================================

  const deleteRenter = async (renter) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/renters/${renter._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();


      if (!response.ok) {

        showMessage(
          `❌ ${data.message || "Failed to delete renter"}`
        );

        return;

      }


      console.log(
        "Renter deleted:",
        data
      );


      // Remember deleted renter
      setDeletedRenter(renter);


      // Remove from frontend
      setRenters((currentRenters) =>
        currentRenters.filter(
          (currentRenter) =>
            currentRenter._id !== renter._id
        )
      );


      // Refresh units
      fetchUnits();


      setConfirmDeleteId(null);

      setMessage(
        "Renter deleted successfully."
      );


      // Clear previous undo timer
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }


      // Undo available for 3 seconds
      undoTimerRef.current = setTimeout(() => {

        setDeletedRenter(null);
        setMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Error deleting renter:",
        error
      );

      showMessage(
        "❌ Failed to delete renter"
      );

    }

  };


  // ==========================================
  // Undo delete
  // ==========================================

  const undoDelete = async () => {

    if (!deletedRenter) {
      return;
    }


    if (undoTimerRef.current) {

      clearTimeout(
        undoTimerRef.current
      );

      undoTimerRef.current = null;

    }


    try {

      const renterData = {

        name: deletedRenter.name,

        phone: deletedRenter.phone,

        roomNumber: deletedRenter.roomNumber

      };


      const response = await fetch(
        "http://localhost:5000/api/renters",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(renterData)

        }
      );


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to restore renter"
        );

      }


      console.log(
        "Renter restored:",
        data
      );


      // Backend returns { message, renter, unit }
      setRenters((currentRenters) => [
        ...currentRenters,
        data.renter
      ]);


      // Refresh units
      fetchUnits();


      setDeletedRenter(null);

      setMessage(
        "Renter restored successfully."
      );


      setTimeout(() => {
        setMessage("");
      }, 2000);


    } catch (error) {

      console.error(
        "Error restoring renter:",
        error
      );

      showMessage(
        `❌ ${error.message}`
      );

    }

  };


  // ==========================================
  // Start editing
  // ==========================================

  const startEditing = (renter) => {

    setEditingRenter({
      ...renter
    });

  };


  // ==========================================
  // Handle edit room
  // ==========================================

  const handleEditRoomChange = (e) => {

    const selectedRoom = e.target.value;


    const selectedUnit = units.find(
      (unit) =>
        String(unit.unitNumber) ===
        String(selectedRoom)
    );


    if (!selectedUnit) {
      return;
    }


    setEditingRenter((current) => ({

      ...current,

      roomNumber: String(
        selectedUnit.unitNumber
      ),

      roomType: selectedUnit.unitType,

      monthlyRent: selectedUnit.monthlyRent

    }));

  };


  // ==========================================
  // Update renter
  // ==========================================

  const updateRenter = async () => {

    if (!editingRenter) {
      return;
    }


    // Basic validation

    if (!editingRenter.name.trim()) {

      showMessage(
        "❌ Name is required"
      );

      return;

    }


    if (
      !/^\d{10}$/.test(
        String(editingRenter.phone)
      )
    ) {

      showMessage(
        "❌ Phone number must contain exactly 10 digits"
      );

      return;

    }


    if (!editingRenter.roomNumber) {

      showMessage(
        "❌ Please select a room"
      );

      return;

    }


    try {

      const response = await fetch(
        `http://localhost:5000/api/renters/${editingRenter._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            name: editingRenter.name.trim(),

            phone: String(
              editingRenter.phone
            ),

            roomNumber: String(
              editingRenter.roomNumber
            )

          })

        }
      );


      const data = await response.json();


      if (!response.ok) {

        showMessage(
          `❌ ${data.message || "Failed to update renter"}`
        );

        return;

      }


      console.log(
        "Renter updated:",
        data
      );


      // Backend returns { message, renter, ... }
      const updatedRenter = data.renter;


      // Update renter in list
      setRenters((currentRenters) =>
        currentRenters.map((renter) =>
          renter._id === updatedRenter._id
            ? updatedRenter
            : renter
        )
      );


      // Refresh units so Unit Management
      // immediately has correct information
      fetchUnits();


      setEditingRenter(null);


      showMessage(
        "✅ Renter updated successfully!"
      );


    } catch (error) {

      console.error(
        "Error updating renter:",
        error
      );

      showMessage(
        "❌ Failed to update renter"
      );

    }

  };


  // ==========================================
  // Available rooms for editing
  // ==========================================

  const getAvailableRoomsForEdit = () => {

    if (!editingRenter) {
      return [];
    }


    return units.filter((unit) => {

      // Current renter's room should remain available
      if (
        String(unit.unitNumber) ===
        String(editingRenter.roomNumber)
      ) {
        return true;
      }


      // Other vacant rooms
      return (
        unit.status === "Vacant" &&
        unit.occupancyType === "None"
      );

    });

  };


  return (

    <div className="renter-list-container">

      <h1>All Renters</h1>


      {/* ======================================
          Message
      ====================================== */}

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


      {/* ======================================
          Edit Form
      ====================================== */}

      {editingRenter && (

        <div className="edit-form">

          <h2>Edit Renter</h2>


          {/* Name */}

          <input
            type="text"
            placeholder="Enter Name"
            value={editingRenter.name}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^[A-Za-z\s]*$/.test(
                  value
                )
              ) {

                setEditingRenter({
                  ...editingRenter,
                  name: value
                });

              }

            }}
          />


          {/* Phone */}

          <input
            type="text"
            placeholder="Enter 10-digit Phone"
            value={editingRenter.phone}
            onChange={(e) => {

              const value =
                e.target.value;

              if (
                /^\d{0,10}$/.test(
                  value
                )
              ) {

                setEditingRenter({
                  ...editingRenter,
                  phone: value
                });

              }

            }}
          />


          {/* Room */}

          <select
            value={
              editingRenter.roomNumber
            }
            onChange={
              handleEditRoomChange
            }
          >

            <option value="">
              Select Room
            </option>


            {getAvailableRoomsForEdit().map(
              (unit) => (

                <option
                  key={unit._id}
                  value={unit.unitNumber}
                >

                  Room {unit.unitNumber}
                  {" — "}
                  {unit.unitType}
                  {" — ₹"}
                  {unit.monthlyRent}

                </option>

              )
            )}

          </select>


          {/* Room Type - Automatically filled */}

          <input
            type="text"
            placeholder="Room Type"
            value={
              editingRenter.roomType
            }
            readOnly
          />


          {/* Rent - Automatically filled */}

          <input
            type="number"
            placeholder="Monthly Rent"
            value={
              editingRenter.monthlyRent
            }
            readOnly
          />


          {/* Save */}

          <button
            className="save-edit-button"
            onClick={updateRenter}
          >
            Save Changes
          </button>


          {/* Cancel */}

          <button
            className="cancel-edit-button"
            onClick={() =>
              setEditingRenter(null)
            }
          >
            Cancel
          </button>

        </div>

      )}


      {/* ======================================
          Renter Table
      ====================================== */}

      {renters.length === 0 ? (

        <p className="no-renters">
          No renters found.
        </p>

      ) : (

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

                <td>
                  {renter.name}
                </td>

                <td>
                  {renter.phone}
                </td>

                <td>
                  {renter.roomNumber}
                </td>

                <td>
                  {renter.roomType}
                </td>

                <td>
                  ₹{renter.monthlyRent}
                </td>


                <td>

                  {/* Edit */}

                  <button
                    className="edit-button"
                    onClick={() =>
                      startEditing(renter)
                    }
                  >
                    Edit
                  </button>


                  {/* Delete */}

                  {confirmDeleteId ===
                  renter._id ? (

                    <div className="delete-confirmation">

                      <span>
                        Are you sure?
                      </span>


                      <button
                        className="confirm-delete-button"
                        onClick={() =>
                          deleteRenter(
                            renter
                          )
                        }
                      >
                        Yes
                      </button>


                      <button
                        className="cancel-delete-button"
                        onClick={
                          cancelDelete
                        }
                      >
                        Cancel
                      </button>

                    </div>

                  ) : (

                    <button
                      className="delete-button"
                      onClick={() =>
                        askDeleteConfirmation(
                          renter._id
                        )
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

      )}

    </div>

  );

}

export default RenterList;

