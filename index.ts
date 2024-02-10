const world = "world";

// import { fetchWeatherApi } from "openmeteo";
import axios from "axios";
let AWS = require("aws-sdk");

let documentClient = new AWS.DynamoDB.DocumentClient();

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}

interface BoredApi {
  activity: string | null;
  type: string;
  price: number;
}

const params = {
  latitude: 51.5072,
  longitude: 0.1276,
  start_date: "2009-12-29",
  end_date: "2024-01-29",
  hourly: [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "wind_speed_10m",
    "wind_direction_10m",
  ],
};

async function getWeatherData() {
  try {
    const url = "https://archive-api.open-meteo.com/v1/archive";
    const responses = await axios.get(url, { params });
    const response: BoredApi = responses.data;
    console.log(response);
  } catch (ex: any) {
    if (ex.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Response data:", ex.response.data);
      console.log("Response status:", ex.response.status);
      console.log("Response headers:", ex.response.headers);
    } else if (ex.request) {
      // The request was made but no response was received
      console.log("Request data:", ex.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error message:", ex.message);
    }
  }
}

async function getNewsApi() {
  try {
    const url =
      "https://newsapi.org/v2/everything?q=tem&from=2024-12-29&sortBy=publishedAt&apiKey=b6cb9dda81e548d1912bcf92ce7f8c69";
    const responses = await axios.get(url, { params });
    const response: BoredApi = responses.data;
    console.log(response);
  } catch (ex: any) {
    if (ex.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("Response data:", ex.response.data);
      console.log("Response status:", ex.response.status);
      console.log("Response headers:", ex.response.headers);
    } else if (ex.request) {
      // The request was made but no response was received
      console.log("Request data:", ex.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error message:", ex.message);
    }
  }
}


getWeatherData();
