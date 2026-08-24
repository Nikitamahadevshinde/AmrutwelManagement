
import { useEffect, useState } from "react";
import "./AddRenter.css";

function AddRenter({ onRenterAdded }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const [units, setUnits] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");

  const [roomType, setRoomType] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [message, setMessage] = useState("");


  // ==========================================
  // Fetch units
  // ==========================================

  useEffect(() => {
    fetchUnits();
  }, []);


  const fetchUnits = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/units"
      );

      const data = await response.json();

      // Only show rooms available for renters
      const availableUnits = data.filter(
        (unit) =>
          unit.status === "Vacant" &&
          unit.occupancyType === "None"
      );

      setUnits(availableUnits);

    } catch (error) {

      console.error("Error fetching units:", error);

      setMessage("❌ Failed to load available rooms");

    }
  };


  // ==========================================
  // Name
  // ==========================================

  const handleNameChange = (e) => {

    const value = e.target.value;

    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
    }

  };


  // ==========================================
  // Phone
  // ==========================================

  const handlePhoneChange = (e) => {

    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }

  };


  // ==========================================
  // Room selection
  // ==========================================

  const handleRoomChange = (e) => {

    const selectedRoomNumber = e.target.value;

    setRoomNumber(selectedRoomNumber);


    // Find selected unit
    const selectedUnit = units.find(
      (unit) =>
        String(unit.unitNumber) === selectedRoomNumber
    );


    if (selectedUnit) {

      // Automatically get room type
      setRoomType(selectedUnit.unitType);

      // Automatically get rent
      setMonthlyRent(String(selectedUnit.monthlyRent));

    } else {

      setRoomType("");
      setMonthlyRent("");

    }

  };


  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async () => {

    // Check required fields
      if (
         !name.trim() ||
         !phone ||
         !joiningDate ||
         !roomNumber
         )
    
     {

      setMessage("❌ Please fill in all fields.");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }


    // Phone validation
    if (phone.length !== 10) {

      setMessage(
        "❌ Please enter a valid 10-digit phone number."
      );

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }


    // Find selected unit
    const selectedUnit = units.find(
      (unit) =>
        String(unit.unitNumber) === String(roomNumber)
    );


    if (!selectedUnit) {

      setMessage("❌ Please select a valid vacant room.");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return;
    }


    // ==========================================
    // Data sent to backend
    // ==========================================

    const renterData = {

    name: name.trim(),

    phone: phone,

   joiningDate: joiningDate,

   roomNumber: String(selectedUnit.unitNumber),

   roomType: selectedUnit.unitType,

   monthlyRent: selectedUnit.monthlyRent

   };

    try {

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


      // ==========================================
      // Backend error
      // ==========================================

      if (!response.ok) {

        setMessage(
          `❌ ${data.message || "Failed to add renter"}`
        );

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }


      // ==========================================
      // Success
      // ==========================================

      console.log(
        "Renter added successfully:",
        data
      );


      setMessage(
        "✅ Renter added successfully!"
      );


      setTimeout(() => {
        setMessage("");
      }, 2000);


      // Tell App.jsx
      onRenterAdded();


      // Clear form
      setName("");
      setPhone("");
      setRoomNumber("");
      setRoomType("");
      setMonthlyRent("");
      setJoiningDate("");


      // Refresh available rooms
      fetchUnits();


    } catch (error) {

      console.error(
        "Error adding renter:",
        error
      );

      setMessage(
        "❌ Failed to connect to server"
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="add-renter-container">

      <h1>Add Renter</h1>


      {/* Name */}

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={handleNameChange}
      />


      {/* Phone */}

      <input
        type="text"
        placeholder="Enter 10-digit Phone Number"
        value={phone}
        onChange={handlePhoneChange}
      />

       
       {/* Joining Date */}

        <input
        type="date"
        value={joiningDate}
        onChange={(e) => setJoiningDate(e.target.value)}
      />

      {/* Room */}

      <select
        value={roomNumber}
        onChange={handleRoomChange}
      >

        <option value="">
          Select Vacant Room
        </option>


        {units.map((unit) => (

          <option
            key={unit._id}
            value={unit.unitNumber}
          >

            Room {unit.unitNumber} — {unit.unitType} — ₹
            {unit.monthlyRent}

          </option>

        ))}

      </select>


      {/* Room Type */}

      <input
        type="text"
        placeholder="Room Type"
        value={roomType}
        readOnly
      />


      {/* Monthly Rent */}

      <input
        type="number"
        placeholder="Monthly Rent"
        value={monthlyRent}
        readOnly
      />


      {/* Message */}

      <p>{message}</p>


      {/* Button */}

      <button onClick={handleSubmit}>
        Add Renter
      </button>

    </div>

  );

}


export default AddRenter;

