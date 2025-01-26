// Define constants for date formats
export const FORMAT_DATE_TIME_DISPLAY = "DD-MM-YYYY HH:mm:ss";
export const FORMAT_DATE_DISPLAY = "DD-MM-YYYY";

// Define a function to format text length
export const FORMAT_TEXT_LENGTH = (text, maxLength = 30) => {
  if (text?.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

export const isURL = (text) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol (http:// hoặc https:// là tùy chọn)
    '([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}' + // domain name (bao gồm các tên miền quốc tế)
    '(\\/[^\\s]*)?$', // path, không có khoảng trắng
    'i'
  );
  return !!urlPattern.test(text);
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
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return messageDate.toLocaleDateString('vi-VN', options);
};
