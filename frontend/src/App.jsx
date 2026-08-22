import { useState } from "react";

import AddRenter from "./pages/AddRenter";
import RenterList from "./pages/RenterList";

function App() {
  const [refreshRenterList, setRefreshRenterList] = useState(0);

  const handleRenterAdded = () => {
    setRefreshRenterList((value) => value + 1);
  };

  return (
    <>
      <AddRenter onRenterAdded={handleRenterAdded} />

      <RenterList refreshRenterList={refreshRenterList} />
    </>
  );
}

export default App;