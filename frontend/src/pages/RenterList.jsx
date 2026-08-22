// import { useEffect, useState } from "react";

// function RenterList() {
//   const [renters, setRenters] = useState([]);

//   useEffect(() => {
//     fetchRenters();
//   }, []);

//   const fetchRenters = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/renters"
//       );

//       const data = await response.json();

//       setRenters(data);

//     } catch (error) {
//       console.error("Error fetching renters:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>All Renters</h1>

//       {renters.map((renter) => (
//         <div key={renter._id}>
//           <h3>{renter.name}</h3>
//           <p>Phone: {renter.phone}</p>
//           <p>Room: {renter.roomNumber}</p>
//           <p>Type: {renter.roomType}</p>
//           <p>Rent: ₹{renter.monthlyRent}</p>

//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default RenterList;

import { useEffect, useState } from "react";
import "./RenterList.css";

function RenterList() {
  const [renters, setRenters] = useState([]);

  useEffect(() => {
    fetchRenters();
  }, []);

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

  return (
    <div className="renter-list-container">

      <h1>All Renters</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Room Number</th>
            <th>Room Type</th>
            <th>Monthly Rent</th>
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
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default RenterList;