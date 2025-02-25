// Define constants for date formats
export const FORMAT_DATE_TIME_DISPLAY = "DD-MM-YYYY HH:mm:ss";
export const FORMAT_DATE_DISPLAY = "DD-MM-YYYY";

// Define a function to format text length
export const FORMAT_TEXT_LENGTH = (text, maxLength) => {
  if (text?.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export const shortenFileName = (fileName, maxLength) =>
  fileName.length > maxLength
    ? `${fileName.slice(0, maxLength)}...${fileName.slice(
        fileName.lastIndexOf(".")
      )}`
    : fileName;

export const isURL = (text) => {
  const urlPattern = new RegExp(
    "^" +
      "(?:(?:https?|ftp):\\/\\/)?" +
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      "(?:(?:[a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,}|" +
      "localhost|" +
      "(?:\\d{1,3}\\.){3}\\d{1,3})" +
      ")" +
      "(?::\\d{2,5})?" +
      "(?:[/?#]\\S*)?" +
      "$",
    "i"
  );
  return urlPattern.test(text);
};

export const formatDate = (dateString) => {
  const today = new Date();
  const messageDate = new Date(dateString);

  if (today.toDateString() === messageDate.toDateString()) {
    return "Hôm nay";
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (yesterday.toDateString() === messageDate.toDateString()) {
    return "Hôm qua";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return messageDate.toLocaleDateString("en-US", options);
};
