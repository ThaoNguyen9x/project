import React, { useEffect, useRef, useState } from "react";
import { Avatar, Image } from "antd";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import ChatInfo from "./ChatInfo";
import ChatSearch from "./ChatSearch";

import { isURL } from "../../../utils/constant";
import FileWithSize from "../../share/FileWithSize";

const ChatContainer = ({
  user,
  userStatus,
  selectedChatRoomUser,
  setSelectedChatRoomUser,
  listMessages,
  listMessageWs,
  handleDeleteChatHistory,
  fetchData,
  handleChangeStatusMessage,
  setIsSidebarVisible,
}) => {
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});
  const [openInfo, setOpenInfo] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView();
    }
  }, [listMessages, listMessageWs]);

  const formatMessageTime = (createdAt) => {
    const messageDate = new Date(createdAt);
    const currentDate = new Date();

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

    const formatDateTime = (date) => {
      const day = date.getDate();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    if (isToday) {
      return `${messageDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (isYesterday) {
      return `Yesterday, ${messageDate
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

  const scrollToMessage = (messageId) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveMessageId(messageId);
    }
  };

  const filteredNotifications = listMessageWs.filter(
    (notification) =>
      notification?.chatRoom?.id === selectedChatRoomUser?.chatRoom?.id
  );

  const renderMessages = (messages) => {
    const groupedMessages = [];
    const timeGap = 60 * 10;

    messages.forEach((message) => {
      const messageTime = new Date(message.createdAt);
      let addedToGroup = false;

      for (let group of groupedMessages) {
        const groupTime = new Date(group?.createdAt);
        const timeDifference = Math.abs(messageTime - groupTime);

        if (
          timeDifference <= timeGap &&
          group?.user?.id === message?.user?.id
        ) {
          group?.messages.push(message);

          if (message.imageUrl && !group?.images.includes(message?.imageUrl)) {
            group?.images.push(message?.imageUrl);
          }

          if (message?.fileUrl && !group?.files.includes(message?.fileUrl)) {
            group?.files.push(message?.fileUrl);
          }

          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groupedMessages.push({
          createdAt: messageTime,
          user: message?.user,
          messages: [message],
          images: message?.imageUrl ? [message?.imageUrl] : [],
          files: message?.fileUrl ? [message?.fileUrl] : [],
        });
      }
    });

    return groupedMessages.map((group, groupIndex) => (
      <div ref={messageEndRef} key={groupIndex} className="message-group">
        {group?.messages.map((message, index) => (
          <div
            className={`flex ${
              message?.user?.id === user?.id ? "justify-end" : ""
            } items-start gap-2.5`}
            key={`${message?.id}-${index}`}
            ref={(el) => (messageRefs.current[message?.id] = el)}
          >
            {index === 0 && (
              <>
                <div
                  className={`flex ${
                    message?.user?.id === user?.id ? "order-2" : ""
                  }`}
                >
                  <Avatar size={32} className="bg-red-700">
                    {group?.user?.role?.name[0]?.toUpperCase()}
                  </Avatar>
                </div>
                <div className="flex flex-col gap-1 w-full max-w-[250px]">
                  <div
                    className={`flex items-center ${
                      message?.user?.id === user?.id ? "flex-row-reverse" : ""
                    } gap-2 rtl:space-x-reverse`}
                  >
                    {index === 0 && (
                      <>
                        <span className="text-sm font-semibold text-gray-900">
                          {group?.user?.name}
                        </span>
                        <span className="text-sm font-normal text-gray-500">
                          {formatMessageTime(message?.createdAt)}
                        </span>
                      </>
                    )}
                  </div>

                  <div
                    className={`flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 ${
                      message?.user?.id === user?.id
                        ? "rounded-s-xl rounded-br-xl"
                        : "rounded-e-xl rounded-es-xl"
                    } ${message?.id === activeMessageId ? "!bg-blue-100" : ""}`}
                  >
                    {message?.content && (
                      <>
                        {isURL(message?.content) ? (
                          <p className="text-sm font-normal text-gray-900">
                            <a
                              href={message?.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {message?.content}
                            </a>
                          </p>
                        ) : (
                          <p>{message?.content}</p>
                        )}
                      </>
                    )}

                    {group?.images?.length > 0 && (
                      <div
                        className={`${
                          group?.images?.length >= 2
                            ? "grid grid-cols-2 gap-2"
                            : "flex flex-col"
                        }`}
                      >
                        {group?.images?.map((img, imgIndex) => {
                          const fileExtension = img
                            .split(".")
                            .pop()
                            .toLowerCase();
                          const isImage = ["jpg", "jpeg", "png"].includes(
                            fileExtension
                          );

                          return (
                            <div key={imgIndex} className="w-full">
                              {isImage && (
                                <Image
                                  src={`${
                                    import.meta.env.VITE_BACKEND_URL
                                  }/storage/image/${img}`}
                                  alt={`Image ${imgIndex + 1}`}
                                  className="!w-[18rem]"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {group?.images?.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {group?.images.map((file, fileIndex) => {
                          const fileExtension = file
                            .split(".")
                            .pop()
                            .toLowerCase();
                          const isFile = [
                            "pdf",
                            "doc",
                            "docx",
                            "xls",
                            "xlsx",
                            "rar",
                          ].includes(fileExtension);
                          return (
                            <a
                              href={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/storage/image/${file}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={fileIndex}
                              className="w-full"
                            >
                              {isFile && <FileWithSize file={file} />}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {message?.chatRoom?.isPrivate && (
                    <span
                      className={`text-sm font-normal text-gray-500 ${
                        message?.user?.id === user?.id ? "place-self-end" : ""
                      }`}
                    >
                      {message?.status === "RECEIVED"
                        ? "Đã nhận"
                        : message?.status === "READ"
                        ? "Đã đọc"
                        : "Đã gửi"}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      <div className="flex-1 flex flex-col mb-3">
        <ChatHeader
          selectedChatRoomUser={selectedChatRoomUser}
          setSelectedChatRoomUser={setSelectedChatRoomUser}
          setOpenInfo={setOpenInfo}
          setOpenSearch={setOpenSearch}
          userStatus={userStatus}
          setIsSidebarVisible={setIsSidebarVisible}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
          {Array.isArray(listMessages) && listMessages.length > 0
            ? renderMessages([...listMessages, ...filteredNotifications])
            : ""}
        </div>

        <MessageInput
          user={user}
          selectedChatRoomUser={selectedChatRoomUser}
          fetchData={fetchData}
          handleChangeStatusMessage={handleChangeStatusMessage}
        />
      </div>

      <ChatInfo
        user={user}
        openInfo={openInfo}
        setOpenInfo={setOpenInfo}
        selectedChatRoomUser={selectedChatRoomUser}
        handleDeleteChatHistory={handleDeleteChatHistory}
        listMessages={listMessages}
        listMessageWs={listMessageWs}
      />

      <ChatSearch
        user={user}
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        selectedChatRoomUser={selectedChatRoomUser}
        listMessages={listMessages}
        listMessageWs={listMessageWs}
        scrollToMessage={scrollToMessage}
      />
    </>
  );
};

export default ChatContainer;
