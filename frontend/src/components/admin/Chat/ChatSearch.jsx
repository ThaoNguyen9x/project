import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Search from "antd/es/transfer/search";
import HighlightText from "../../share/HighlightText";
import { Avatar, Button, DatePicker, Dropdown, Space } from "antd";
import { FORMAT_TEXT_LENGTH, shortenFileName } from "../../../utils/constant";

import { FaRegUser } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import iconPDF from "../../../assets/icons/icon-pdf.svg";
import iconDocx from "../../../assets/icons/icon-docx.svg";
import iconDoc from "../../../assets/icons/icon-doc.svg";
import iconExcel from "../../../assets/icons/icon-excel.svg";
import iconRar from "../../../assets/icons/icon-rar.svg";
import iconImage from "../../../assets/icons/icon-image.svg";

const ChatSearch = ({
  user,
  setOpenSearch,
  openSearch,
  listMessages,
  scrollToMessage,
}) => {
  const infoRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [messagesToShow, setMessagesToShow] = useState(4);
  const [filesToShow, setFilesToShow] = useState(4);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [dateDropdownVisible, setDateDropdownVisible] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMessages([]);
      setFilteredFiles([]);
      return;
    }

    let updatedMessages = listMessages;
    let updatedFiles = listMessages;

    updatedMessages = updatedMessages.filter((message) =>
      message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    updatedFiles = updatedFiles.filter((message) =>
      message?.imageUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedUser) {
      updatedMessages = updatedMessages.filter(
        (message) => message?.user?.id === selectedUser
      );

      updatedFiles = updatedFiles.filter(
        (message) => message?.user?.id === selectedUser
      );
    }

    if (selectedDateRange[0] && selectedDateRange[1]) {
      updatedMessages = updatedMessages.filter((message) => {
        const messageDate = dayjs(message.createdAt);
        return (
          messageDate.isAfter(dayjs(selectedDateRange[0]).startOf("day")) &&
          messageDate.isBefore(dayjs(selectedDateRange[1]).endOf("day"))
        );
      });

      updatedFiles = updatedFiles.filter((message) => {
        const messageDate = dayjs(message.createdAt);
        return (
          messageDate.isAfter(dayjs(selectedDateRange[0]).startOf("day")) &&
          messageDate.isBefore(dayjs(selectedDateRange[1]).endOf("day"))
        );
      });
    }

    setFilteredMessages(updatedMessages);
    setFilteredFiles(updatedFiles);
  }, [searchTerm, selectedUser, selectedDateRange, listMessages]);

  const formatMessageTime = (createdAt) => {
    const messageDate = new Date(createdAt);
    const currentDate = new Date();

    const timeDifference = currentDate - messageDate;

    const minutesAgo = Math.floor(timeDifference / 1000 / 60);

    const formatDateTime = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    if (minutesAgo < 1) {
      return "Mới gửi";
    } else if (minutesAgo < 60) {
      return `${minutesAgo} phút`;
    }

    const isToday =
      messageDate.getDate() === currentDate.getDate() &&
      messageDate.getMonth() === currentDate.getMonth() &&
      messageDate.getFullYear() === currentDate.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return `${messageDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (isYesterday) {
      return `Hôm qua, ${messageDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else {
      return formatDateTime(messageDate);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setMessagesToShow(4);
      setFilesToShow(4);
      handleDateRangeChange(null);
      setSelectedUser(null);
    }
  };

  const handleMessageClick = (messageId) => {
    setSelectedMessageId(messageId);
    scrollToMessage(messageId);
  };

  const handleDateRangeChange = (dates) => {
    if (!dates || dates.length < 2) {
      setSelectedDateRange([null, null]);
      return;
    }
    setSelectedDateRange([
      dayjs(dates[0]).startOf("day"),
      dayjs(dates[1]).endOf("day"),
    ]);
  };

  const userSents = [
    ...new Map(
      listMessages
        .map((message) => ({
          key: message?.user?.id,
          label: message?.user?.name,
        }))
        .filter(
          (user, index, self) =>
            index === self.findIndex((t) => t.label === user.label)
        )
        .map((user) => [user.key, user])
    ).values(),
  ];

  return (
    <div
      ref={infoRef}
      className={`absolute rounded-lg bg-white border border-r rounded-r-lg h-full transition-all duration-300 z-50 top-0 overflow-x-hidden
        ${
          openSearch
            ? "opacity-100 !max-w-fit right-0"
            : "opacity-0 w-0 right-[0%]"
        }  overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300`}
    >
      <div className="my-10">
        <div className="pb-[1.7rem] flex items-center justify-center gap-5 border-b">
          <h4 className="text-lg font-bold">Tìm kiếm trong trò chuyện</h4>
          <button
            onClick={() => setOpenSearch(false)}
            className="hover:text-[#0958d9] text-lg"
          >
            <IoClose />
          </button>
        </div>

        <div className="mx-5 my-4">
          <div className="flex flex-col items-center justify-center">
            <Search
              placeholder="Tìm kiếm..."
              enterButton="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="my-4 flex items-center justify-between gap-1">
            <p>Lọc:</p>
            <div className="flex items-center gap-1">
              <Dropdown
                menu={{
                  items: userSents.map((user) => ({
                    key: user.key,
                    label: user.label,
                    onClick: () => setSelectedUser(user.key),
                  })),
                }}
                placement="bottomLeft"
                trigger={["click"]}
                className="!p-2"
              >
                <Button>
                  <Space className="flex items-center justify-between w-28">
                    <FaRegUser />
                    {selectedUser
                      ? selectedUser === user?.id
                        ? "Bạn"
                        : FORMAT_TEXT_LENGTH(
                            userSents.find((user) => user.key === selectedUser)
                              ?.label,
                            20
                          ) || "Người gửi"
                      : "Người gửi"}

                    <IoIosArrowDown />
                  </Space>
                </Button>
              </Dropdown>

              <Dropdown
                open={dateDropdownVisible}
                onOpenChange={setDateDropdownVisible}
                trigger={["click"]}
                placement="bottomRight"
                dropdownRender={() => (
                  <div className="bg-white shadow-xl rounded-lg p-3">
                    <p className="mb-2">Chọn khoảng thời gian</p>
                    <DatePicker.RangePicker
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement
                      }
                      value={selectedDateRange.map((date) =>
                        date ? dayjs(date) : null
                      )}
                      onChange={handleDateRangeChange}
                      placeholder={["Từ ngày", "Đến ngày"]}
                    />
                  </div>
                )}
                className="!p-2"
              >
                <Button>
                  <Space>
                    <LuCalendarDays />
                    {selectedDateRange[0] && selectedDateRange[1]
                      ? (() => {
                          const formattedRange = `${dayjs(
                            selectedDateRange[0]
                          ).format("DD/MM/YYYY")} - ${dayjs(
                            selectedDateRange[1]
                          ).format("DD/MM/YYYY")}`;
                          return formattedRange.length > 5
                            ? formattedRange.substring(0, 5) + "..."
                            : formattedRange;
                        })()
                      : "Ngày gửi"}
                    <IoIosArrowDown />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>

          {/* Tin nhắn */}
          {filteredMessages.length > 0 ? (
            <>
              <p className="font-bold">Tin nhắn</p>
              {filteredMessages
                .slice(0, messagesToShow)
                .map((message, index) => {
                  const displayText =
                    message?.content?.length > 100
                      ? message.content.substring(0, 100) + "..."
                      : message?.content;

                  return (
                    <div
                      key={index}
                      onClick={() => handleMessageClick(message?.id)}
                      className={`flex items-center hover:bg-gray-100 px-3 cursor-pointer rounded-md ${
                        selectedMessageId === message.id ? "bg-blue-100" : ""
                      }`}
                    >
                      <Avatar size={32} className="bg-red-700">
                        {message?.user?.role?.name[0]?.toUpperCase()}
                      </Avatar>
                      <div className="w-full flex flex-col border-b p-2">
                        <div className="flex items-center justify-between">
                          <p>{FORMAT_TEXT_LENGTH(message?.user?.name, 20)}</p>
                          <p className="text-xs">
                            {formatMessageTime(message?.createdAt)}
                          </p>
                        </div>
                        <HighlightText
                          text={displayText}
                          searchText={searchTerm}
                        />
                      </div>
                    </div>
                  );
                })}
            </>
          ) : (
            ""
          )}

          {filteredMessages.length > messagesToShow && (
            <Button
              color="default"
              variant="filled"
              className="w-full my-2"
              onClick={() => setMessagesToShow((prev) => prev + 4)}
            >
              Xem thêm
            </Button>
          )}

          {/* File */}
          {filteredFiles.length > 0 ? (
            <>
              <p className="font-bold">File</p>
              {filteredFiles.slice(0, filesToShow).map((file, index) => {
                const displayFile = file?.imageUrl || "";
                const fileExtension = displayFile
                  .split(".")
                  .pop()
                  .toLowerCase();

                const fileIcons = {
                  pdf: iconPDF,
                  doc: iconDoc,
                  docx: iconDocx,
                  xls: iconExcel,
                  xlsx: iconExcel,
                  rar: iconRar,
                };

                const fileIcon = fileIcons[fileExtension] || iconImage;

                return (
                  <div
                    key={index}
                    onClick={() => handleMessageClick(file?.id)}
                    className={`flex items-center hover:bg-gray-100 px-3 cursor-pointer rounded-md ${
                      selectedMessageId === file?.id ? "bg-blue-100" : ""
                    }`}
                  >
                    <img
                      src={fileIcon}
                      alt={`${fileExtension} Icon`}
                      className="h-8 w-8"
                    />
                    <div className="w-full flex flex-col border-b p-2">
                      <HighlightText
                        text={shortenFileName(displayFile, 20)}
                        searchText={searchTerm}
                      />

                      <div className="flex items-center justify-between">
                        <p>{FORMAT_TEXT_LENGTH(file?.user?.name, 20)}</p>
                        <p className="text-xs">
                          {formatMessageTime(file?.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            ""
          )}

          {filteredFiles.length > filesToShow && (
            <Button
              color="default"
              variant="filled"
              className="w-full my-2"
              onClick={() => setFilesToShow((prev) => prev + 4)}
            >
              Xem thêm
            </Button>
          )}

          {searchTerm.trim() !== "" &&
            filteredMessages.length === 0 &&
            filteredFiles.length === 0 && (
              <p className="text-center mt-4 text-gray-500">
                Không tìm thấy kết quả
              </p>
            )}

          {searchTerm.trim() === "" && (
            <p className="text-center mt-4 text-gray-500">
              Nhập từ khóa để tìm kiếm tin nhắn và file trong cuộc trò chuyện
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSearch;
