import React, { useState } from "react";
import TaskBoard from "./components/Board";

function App() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <TaskBoard
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}

export default App;
