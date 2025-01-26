import React, { useEffect, useRef, useState } from "react";
import Search from "antd/es/transfer/search";
import HighlightText from "../../share/HighlightText";

const ChatSearch = ({ openSearch, setOpenSearch, listMessages }) => {
  const infoRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setFilteredMessages(
        listMessages.filter((message) =>
          message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMessages([]);
    }
  }, [searchTerm, listMessages]);

  return (
    <div
      ref={infoRef}
      className={`absolute bg-white border border-r rounded-r-lg h-full transition-all duration-300 z-50 top-0 
        ${
          openSearch
            ? "opacity-100 w-[calc(100vw-65rem)] right-0"
            : "opacity-0 w-0 right-[0%]"
        }  overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300`}
    >
      <div className="flex flex-col items-center justify-center mt-10 px-5">
        <Search
          placeholder="Tìm kiếm..."
          enterButton="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="px-5">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => (
            <div key={index} className="p-2 border-b">
              <HighlightText text={message?.content} searchText={searchTerm} />
            </div>
          ))
        ) : searchTerm.trim() !== "" ? (
          <p className="text-center mt-4 text-gray-500">
            Không tìm thấy tin nhắn nào
          </p>
        ) : (
          <p className="text-center mt-4 text-gray-500">
            Nhập từ khóa để tìm kiếm tin nhắn
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSearch;
