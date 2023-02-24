export const fetchInformation = async (id) => {
  const parseResponse = {
    user: {},
    event: {},
    categories: [],
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("token", localStorage.token);

  try {
    const response = await fetch(`/api/users/self`, {
      method: "GET",
      headers: myHeaders,
    });
    const parseUser = await response.json();
    let dateToParse = new Date(parseUser.user_birth_date);
    let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
    let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
    let dateToParseYear = String(dateToParse.getFullYear());
    parseUser.user_formattedDate = `${dateToParseYear}-${dateToParseMonth}-${dateToParseDay}`;
    parseUser.age = Math.floor((new Date() - dateToParse) / 31556952000);
    parseResponse.user = parseUser;
  } catch (err) {
    console.log(err);
  }

  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "GET",
      headers: myHeaders,
    });

    const parseEvent = await response.json();
    let dateToParse = new Date(parseResponse.event_date);
    let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
    let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
    let dateToParseYear = String(dateToParse.getFullYear());
    parseEvent.formattedDate = `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
    parseResponse.event = parseEvent;
  } catch (err) {
    console.log(err);
  }

  try {
    const response = await fetch(`/api/categories/${parseResponse.event.event_id}/public`, {
      method: "GET",
      headers: myHeaders,
    });
    const parseCategories = await response.json();
    parseResponse.categories = parseCategories;
  } catch (err) {
    console.log(err);
  }

  return parseResponse;
};
