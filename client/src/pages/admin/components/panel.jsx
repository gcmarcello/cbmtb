import React, { useState } from "react";

// React Components
import ListEvents from "../components/events/listEvents";
import NewEvent from "../components/events/newEvent";
import ListNews from "../components/news/listNews";
import NewNews from "../components/news/newNews";
import ListDocuments from "./documents/listDocuments";

const Panel = ({ screen, setScreen, saveCurrentPanel }) => {
  const [eventChange, setEventChange] = useState(false);
  const [documentChange, setDocumentChange] = useState(true);

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
    case "NewNews":
      return (
        <NewNews newsChange={eventChange} setNewsChange={setEventChange} screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
      );
    case "ListNews":
      return (
        <ListNews newsChange={eventChange} setNewsChange={setEventChange} screen={screen} setScreen={setScreen} saveCurrentPanel={saveCurrentPanel} />
      );
    case "ListDocuments":
      return (
        <ListDocuments
          documentChange={documentChange}
          setDocumentChange={setDocumentChange}
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
