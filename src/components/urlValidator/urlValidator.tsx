import React, { useState, useEffect, useCallback } from "react";

// URL validation regex
const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + // domain name
    "localhost|" + // localhost
    "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|" + // OR ip address
    "\\[?[a-fA-F0-9:]+\\]?)" + // OR ip (v6) address
    "(\\:\\d+)?(\\/[-a-zA-Z0-9@:%._\\+~#=]*)*" + // port and path
    "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // query string
    "(\\#[-a-zA-Z0-9_]*)?$",
  "i"
);

// Mock server function to check URL existence
const mockServerCheck = async (
  url: string
): Promise<{ exists: boolean; type: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock server side response
      if (url.endsWith("/")) {
        resolve({ exists: true, type: "folder" });
      } else if (url.includes(".")) {
        resolve({ exists: true, type: "file" });
      } else {
        resolve({ exists: false, type: "unknown" });
      }
    }, 500); // Simulate server delay
  });
};

const UrlValidator: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [color, setColor] = useState<string>("black");
  const [loading, setLoading] = useState<boolean>(false);

  // Check URL format
  const isValidUrl = (url: string): boolean => urlPattern.test(url);

  // Throttled URL check handler
  const checkUrlExistence = useCallback(async (urlToCheck: string) => {
    setLoading(true);
    const result = await mockServerCheck(urlToCheck);
    setLoading(false);
    if (result.exists) {
      setMessage(`URL exists and is a ${result.type}`);
      setColor("green");
    } else {
      setMessage("URL does not exist");
      setColor("red");
    }
  }, []);

  // Immediate URL format validation
  useEffect(() => {
    if (url.trim() && isValidUrl(url.trim())) {
      setMessage("Valid URL format");
      setColor("blue");
    } else {
      setLoading(false);
      setMessage("Invalid URL format");
      setColor("red");
    }
  }, [url]);

  // Debounce the URL existence check
  useEffect(() => {
    if (isValidUrl(url.trim())) {
      setLoading(true); // Show loading as soon as valid URL is detected
    }
    const handler = setTimeout(() => {
      if (url.trim() && isValidUrl(url.trim())) {
        checkUrlExistence(url.trim());
      }
    }, 500); // Throttle existence check to 500ms

    return () => clearTimeout(handler);
  }, [url, checkUrlExistence]);

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>URL Existence Checker</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <div style={{ color }}> {loading ? "Checking..." : message}</div>
    </div>
  );
};

export default UrlValidator;
