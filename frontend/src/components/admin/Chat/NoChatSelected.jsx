import React from "react";
import { FaRegMessage } from "react-icons/fa6";

const NoChatSelected = () => {
  return (
    <div className="w-full hidden lg:flex flex-1 flex-col items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce">
              <FaRegMessage className="w-8 h-8" />
            </div>
          </div>
        </div>

        <p className="text-xl font-bold">
          Chọn một cuộc trò chuyện từ thanh bên để bắt đầu trò chuyện
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
