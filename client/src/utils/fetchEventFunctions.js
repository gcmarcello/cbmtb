import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const fetchEvent = async (id) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("token", localStorage.token);

    const response = await fetch(`/api/events/view/${id}`, {
      method: "GET",
      headers: myHeaders,
    });

    const parseResponse = await response.json();
    let dateToParse = new Date(parseResponse.event_date);
    let dateToParseDay = String(dateToParse.getDate()).padStart(2, 0);
    let dateToParseMonth = String(dateToParse.getMonth() + 1).padStart(2, 0);
    let dateToParseYear = String(dateToParse.getFullYear());
    parseResponse.formattedDate = `${dateToParseDay}/${dateToParseMonth}/${dateToParseYear}`;
    return parseResponse;
  } catch (err) {
    console.log(err);
  }
};

export const fetchCategories = async (eventId) => {
  try {
    const response = await fetch(`/api/categories/${eventId}`, {
      method: "GET",
    });
    const parseResponse = await response.json();
    console.log(parseResponse);
    return parseResponse;
  } catch (err) {
    console.log(err);
  }
};

export const fetchProfile = async (eventId) => {
  try {
    const response = await fetch(`/api/categories/${eventId}`, {
      method: "GET",
    });
    const parseResponse = await response.json();
    console.log(parseResponse);
    return parseResponse;
  } catch (err) {
    console.log(err);
  }
};
