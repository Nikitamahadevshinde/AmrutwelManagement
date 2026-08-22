import { useState } from "react";
import "./AddRenter.css";


function AddRenter() {

    // State variables store the values entered by the user
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [roomType, setRoomType] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");
    const [message, setMessage] = useState("");

  // Function to check the values entered in the form
    const handleSubmit = async () => {
  const renterData = {
    name,
    phone,
    roomNumber,
    roomType,
    monthlyRent
  };

  // try {
  //   const response = await fetch("http://localhost:5000/api/renters", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(renterData)
  //   });

  //   const data = await response.json();

  //   console.log("Renter added successfully:", data);
  // }  
  // catch (error) {
  //   console.error("Error adding renter:", error);
  // }

  try {
  const response = await fetch("http://localhost:5000/api/renters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(renterData)
  });

  const data = await response.json();

  console.log("Renter added successfully:", data);

  setMessage("✅ Renter added successfully!");

  setName("");
  setPhone("");
  setRoomNumber("");
  setRoomType("");
  setMonthlyRent("");

} 
catch (error) {
  console.error("Error adding renter:", error);

  setMessage("❌ Failed to add renter");
}
};

  return (
    <div className="add-renter-container">
      <h1>Add Renter</h1>


     {/* Controlled inputs:
    value displays the state
    onChange updates the state
    */}
      <input
  type="text"
  placeholder="Enter Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

     <input
  type="text"
  placeholder="Enter Phone"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>

    <input
  type="text"
  placeholder="Enter Room Number"
  value={roomNumber}
  onChange={(e) => setRoomNumber(e.target.value)}
/>
<input
  type="text"
  placeholder="Enter Room Type"
  value={roomType}
  onChange={(e) => setRoomType(e.target.value)}
/>

      <input
  type="number"
  placeholder="Enter Monthly Rent"
  value={monthlyRent}
  onChange={(e) => setMonthlyRent(e.target.value)}
/>
       <p>{message}</p>
      <button onClick={handleSubmit}>Add Renter</button>
    </div>
  );
}

export default AddRenter;