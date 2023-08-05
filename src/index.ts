// Importing required modules and dependencies
import * as fs from "fs/promises";
import * as path from "path";
import moment from "moment";
import { exit } from "process";

// Defining the LogEntry type to represent each log entry
type LogEntry = {
  date: string;
  endpoint?: string;
  status?: number;
};

// Function to parse log data and extract relevant information into LogEntry objects
const parseLogEntry = (logData: string): LogEntry[] => {
  const logs: LogEntry[] = [];
  const lines = logData.split("\n");
  const regex =
    /(?<date>\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2}):.*(?<endpoint>GET|POST|PUT|DELETE) (.*) HTTP\/1\.\d" (?<status>\d{3})/;

  for (const line of lines) {
    const matches = line.match(regex);
    if (matches && matches.groups) {
      const { date, endpoint, status } = matches.groups;
      logs.push({ date, endpoint, status: parseInt(status) });
    }
  }

  return logs;
};

// Function to format the date in the desired format
const formatDate = (date: string): string => {
  return moment(date).format("YYYY-MM-DD HH:mm");
};

// Type to represent API call count by endpoint
type ApiCallByEndpoint = {
  endpoint: string;
  count: number;
};

// Function to count API calls by endpoint
const countApiCallsByEndpoint = (logs: LogEntry[]): ApiCallByEndpoint[] => {
  const apiCallsByEndpoint: ApiCallByEndpoint[] = [];

  for (const log of logs) {
    const endpoint = log.endpoint || "Unknown";
    const index = apiCallsByEndpoint.findIndex(
      (item) => item.endpoint === endpoint
    );
    if (index === -1) {
      apiCallsByEndpoint.push({
        endpoint,
        count: 1,
      });
    } else {
      apiCallsByEndpoint[index].count += 1;
    }
  }

  return apiCallsByEndpoint;
};

// Type to represent API call count by minute
type ApiCallByMinute = {
  date: string;
  count: number;
};

// Function to count API calls by minute
const countApiCallsByMinute = (logs: LogEntry[]): ApiCallByMinute[] => {
  const apiCallsByMinute: ApiCallByMinute[] = [];

  for (const log of logs) {
    const formattedDate = formatDate(log.date);
    const index = apiCallsByMinute.findIndex(
      (item) => item.date === formattedDate
    );
    if (index === -1) {
      apiCallsByMinute.push({
        date: formattedDate,
        count: 1,
      });
    } else {
      apiCallsByMinute[index].count += 1;
    }
  }

  return apiCallsByMinute;
};

// Type to represent API call count by status
type ApiCallByStatus = {
  status: number;
  count: number;
};

// Function to count API calls by status
const countApiCallsByStatus = (logs: LogEntry[]): ApiCallByStatus[] => {
  const apiCallsByStatus: ApiCallByStatus[] = [];

  for (const log of logs) {
    const status = log.status || 0;
    const index = apiCallsByStatus.findIndex((item) => item.status === status);
    if (index === -1) {
      apiCallsByStatus.push({
        status,
        count: 1,
      });
    } else {
      apiCallsByStatus[index].count += 1;
    }
  }

  return apiCallsByStatus;
};

// Main function to process the log file and display results
const main = async (filename: string) => {
  try {
    const filePath = path.join(__dirname, "..", filename);
    const logData = await fs.readFile(filePath, "utf-8");

    const logs = parseLogEntry(logData);
    const apiCallsByEndpoint = countApiCallsByEndpoint(logs);
    const apiCallsByMinute = countApiCallsByMinute(logs);
    const apiCallsByStatus = countApiCallsByStatus(logs);

    // Display API call counts by endpoint, minute, and status in tabular format
    console.log();
    console.log("API Calls by Endpoint");
    console.table(apiCallsByEndpoint);

    console.log();
    console.log("API Calls by Minute");
    console.table(apiCallsByMinute);

    console.log();
    console.log("API Calls by Status");
    console.table(apiCallsByStatus);
  } catch (error) {
    console.error((error as Error).message);
  } finally {
    return "Done";
  }
};

// Call the main function with the log file name and handle the process
main("prod-api-prod-out.log").then((result) => {
  console.log(result);
  process.exit(0);
});
