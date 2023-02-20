export const fetchRegistrations = async (type) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    const response = await fetch(`/api/registrations/user/`, {
      method: "GET",
      headers: myHeaders,
    });
    const parseResponse = await response.json();
    for (let i = 0; i < parseResponse.length; i++) {
      let dateToParse = new Date(parseResponse[i].event_date);
      let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
      let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
      let dateToParseYear = String(dateToParse.getFullYear());
      parseResponse[i].formattedDate = `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
    }
    return parseResponse;
  } catch (error) {
    console.log(error);
  }
};
