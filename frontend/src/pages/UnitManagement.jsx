
import { useEffect, useState } from "react";
import "./UnitManagement.css";

function UnitManagement() {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/units"
      );

      const data = await response.json();

      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  // Group units floor-wise
  const floors = {};

  units.forEach((unit) => {
    if (!floors[unit.floor]) {
      floors[unit.floor] = [];
    }

    floors[unit.floor].push(unit);
  });

  // Statistics
  const totalUnits = units.length;

  const occupiedUnits = units.filter(
    (unit) => unit.status === "Occupied"
  ).length;

  const vacantUnits = units.filter(
    (unit) => unit.status === "Vacant"
  ).length;

  return (
    <div className="unit-management">

      <h1>Unit Management</h1>

      {/* Statistics */}
      <div className="unit-stats">

        <div className="stat-card">
          <h3>Total Units</h3>
          <p>{totalUnits}</p>
        </div>

        <div className="stat-card">
          <h3>Occupied</h3>
          <p>{occupiedUnits}</p>
        </div>

        <div className="stat-card">
          <h3>Vacant</h3>
          <p>{vacantUnits}</p>
        </div>

      </div>


      {/* Floors */}
      {Object.keys(floors)
        .sort((a, b) => a - b)
        .map((floor) => (

          <div className="floor-section" key={floor}>

            <h2>Floor {floor}</h2>

            <div className="unit-grid">

              {floors[floor].map((unit) => (

                <div
                  className={`unit-card ${
                    unit.occupancyType === "Owner"
                      ? "owner-unit"
                      : unit.status === "Occupied"
                      ? "occupied"
                      : "vacant"
                  }`}
                  key={unit._id}
                >

                  <div className="unit-header">

                    <h3>Room {unit.unitNumber}</h3>

                    <span className="unit-status">
                      {unit.occupancyType === "Owner"
                        ? "OWNER"
                        : unit.status}
                    </span>

                  </div>


                  <div className="unit-info">

                    <div className="info-item">
                      <span>Type</span>
                      <strong>{unit.unitType}</strong>
                    </div>

                    <div className="info-item">
                      <span>Monthly Rent</span>
                      <strong>₹{unit.monthlyRent}</strong>
                    </div>

                    <div className="info-item">
                      <span>Occupancy</span>
                      <strong>
                    {unit.occupancyType === "Owner"
                    ? "Owner"
                     : unit.occupancyType === "Renter"
                      ? unit.renter?.name || "Renter"
                    : "None"}
                   </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

    </div>
  );
}

export default UnitManagement;

