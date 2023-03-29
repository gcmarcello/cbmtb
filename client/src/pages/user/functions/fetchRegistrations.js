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
    return parseResponse;
  } catch (error) {
    console.log(error);
  }
};
