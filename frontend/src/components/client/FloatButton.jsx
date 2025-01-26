import React from "react";
import { FaFacebookMessenger, FaSquarePhoneFlip } from "react-icons/fa6";
import iconZalo from "../../assets/icons/icon-zalo.svg";
import { Link } from "react-router-dom";

const FloatButton = () => {
  return (
    <div className="fixed bottom-4 right-0 bg-blue-950 text-white rounded-l-md shadow-lg border border-white border-r-0">
      <div className="flex flex-col items-center px-3 py-2 gap-2">
        <Link to="" className="border-b border-b-white pb-2 text-white">
          <FaFacebookMessenger className="h-9 w-9" />
        </Link>
        <Link href="" className="h-10 w-10">
          <img src={iconZalo} alt="" className="h-full w-full object-cover" />
        </Link>
        <Link href="" className=" border-t border-t-white pt-2 text-white">
          <FaSquarePhoneFlip className="h-9 w-9" />
        </Link>
      </div>
    </div>
  );
};

export default FloatButton;
