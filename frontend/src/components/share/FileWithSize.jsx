import { useState, useEffect } from "react";
import { LuDot } from "react-icons/lu";
import iconPDF from "../../assets/icons/icon-pdf.svg";
import iconDocx from "../../assets/icons/icon-docx.svg";
import iconDoc from "../../assets/icons/icon-doc.svg";
import iconExcel from "../../assets/icons/icon-excel.svg";
import iconRar from "../../assets/icons/icon-rar.svg";

const FileWithSize = ({ file }) => {
  const [fileSize, setFileSize] = useState(null);
  const [fileIcon, setFileIcon] = useState(iconPDF);

  useEffect(() => {
    const fileUrl = `${import.meta.env.VITE_BACKEND_URL}/storage/image/${file}`;
    const fileExtension = file.split(".").pop().toLowerCase();

    switch (fileExtension) {
      case "doc":
        setFileIcon(iconDoc);
        break;
      case "docx":
        setFileIcon(iconDocx);
        break;
      case "xls":
      case "xlsx":
        setFileIcon(iconExcel);
        break;
      case "pdf":
        setFileIcon(iconPDF);
        break;
      case "rar":
        setFileIcon(iconRar);
        break;
      default:
        setFileIcon(iconPDF); 
        break;
    }

    const fetchFileSize = async () => {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const sizeInBytes = blob.size;

      if (fileExtension === "pdf") {
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2); // MB
        setFileSize(`${sizeInMB} MB`);
      } else {
        const sizeInKB = (sizeInBytes / 1024).toFixed(2); // KB
        setFileSize(`${sizeInKB} KB`);
      }
    };

    fetchFileSize();
  }, [file]);

  return (
    <>
      <span className="flex items-center gap-2 text-sm font-medium pb-2">
        <img src={fileIcon} alt="File Icon" className="h-10 w-10" />
        {file}
      </span>
      {fileSize && (
        <span className="flex items-center text-xs font-normal text-gray-500">
          {fileSize}
          <LuDot className="size-5" />
          {file.split(".").pop().toUpperCase()}
        </span>
      )}
    </>
  );
};

export default FileWithSize;
