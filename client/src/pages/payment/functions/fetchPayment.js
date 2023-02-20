export const fetchPayment = async (id) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    const response = await fetch(`/api/payments/pix/review/${id}`, {
      method: "GET",
      headers: myHeaders,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const generateNewPayment = async (id) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);
    const response = await fetch(`/api/payments/pix/${id}`, {
      method: "GET",
      headers: myHeaders,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};
