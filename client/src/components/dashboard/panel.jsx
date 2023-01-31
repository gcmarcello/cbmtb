import React, { useState } from "react";

// React Components
import ListEvents from "../events/listEvents";
import NewEvent from "../events/newEvent";

const Panel = ({ screen, setScreen, saveCurrentPanel }) => {
  const [eventChange, setEventChange] = useState(false);

  switch (screen) {
    case "ListEvents":
      return (
        <ListEvents
          eventChange={eventChange}
          setEventChange={setEventChange}
          screen={screen}
          setScreen={setScreen}
          saveCurrentPanel={saveCurrentPanel}
        />
      );
    case "NewEvent":
      return (
        <NewEvent
          eventChange={eventChange}
          setEventChange={setEventChange}
          screen={screen}
          setScreen={setScreen}
          saveCurrentPanel={saveCurrentPanel}
        />
      );
    default:
      return (
        <ListEvents
          eventChange={eventChange}
          setEventChange={setEventChange}
          screen={screen}
          setScreen={setScreen}
          saveCurrentPanel={saveCurrentPanel}
        />
      );
  }
};

export default Panel;
