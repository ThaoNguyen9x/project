import { Avatar, Dropdown, message, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { CiMenuKebab } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { FORMAT_TEXT_LENGTH } from "../../../utils/constant";
import Search from "antd/es/transfer/search";
import ChatAddContact from "./ChatAddContact";

const ChatSidebar = ({
  user,
  listChatRoomUsers,
  listChatRoomGroups,
  selectChatRoomUser,
  handleCreateRoomPrivate,
  handleCreateGroup,
  fetchData,
}) => {
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [listMessageUserWs, setListMessageUserWs] = useState([]);

  useEffect(() => {
    setListMessageUserWs([]);

    const sock = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/ws`);
    const stompClient = Stomp.over(sock);

    stompClient.debug = () => {};

    const topic = `/topic/messages/${user?.id}`;

    stompClient.connect({}, () => {
      stompClient.subscribe(topic, (messageOutput) => {
        const messageBody = JSON.parse(messageOutput.body);
        fetchData();
        setListMessageUserWs((prevMessages) => [
          ...prevMessages,
          { ...messageBody },
        ]);

        message.success("Bạn có một tin nhắn mới. Vui lòng kiểm tra.");
      });
    });

    return () => stompClient.disconnect();
  }, [user?.id]);

  const items = [
    {
      key: "add",
      label: "Add contact",
      onClick: () => setOpenModal(true),
    },
    {
      key: "all",
      label: "Show all",
      onClick: () => setFilter("all"),
    },
    {
      key: "online",
      label: "Show online",
      onClick: () => setFilter("online"),
    },
    {
      key: "offline",
      label: "Show offline",
      onClick: () => setFilter("offline"),
    },
  ];

  const filteredChatRoomUsers = listChatRoomUsers
    .filter((chatRoomUser) => {
      if (filter === "online") return chatRoomUser?.user?.isOnline;
      if (filter === "offline") return !chatRoomUser?.user?.isOnline;
      return true;
    })
    .filter((chatRoomUser) =>
      chatRoomUser?.user?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

  const groupedChatRoomGroups = listChatRoomGroups
    .filter((chatRoomUser) =>
      chatRoomUser?.chatRoom?.name
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    )
    .reduce((acc, current) => {
      const roomName = current.chatRoom?.name;
      if (!acc[roomName]) {
        acc[roomName] = { chatRoom: current.chatRoom, users: [] };
      }
      acc[roomName].users.push(current.user);
      return acc;
    }, {});

  const filteredChatRoomGroups = Object.values(groupedChatRoomGroups);

  const contacts = [
    {
      key: "1",
      label: "Khách hàng",
      children: (
        <>
          {filteredChatRoomUsers
            .filter((chatRoomUser) => chatRoomUser?.user?.status)
            .map((chatRoomUser) => {
              return (
                <button
                  key={chatRoomUser?.user?.id}
                  onClick={() => {
                    selectChatRoomUser(chatRoomUser);
                  }}
                  className="w-full p-3 flex items-center justify-between gap-3 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar size={32} className="bg-red-700">
                        {chatRoomUser?.user?.role?.name[0]?.toUpperCase()}
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 size-2 ${
                          chatRoomUser?.user?.isOnline
                            ? "bg-green-600"
                            : "bg-red-600"
                        } rounded-full`}
                      />
                    </div>

                    <div className="hidden lg:block text-left min-w-0">
                      <div className="font-medium truncate">
                        {FORMAT_TEXT_LENGTH(chatRoomUser?.user?.name)}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {chatRoomUser?.user?.isOnline ? "Online" : "Offline"}
                        {chatRoomUser?.user?.chatRoomUsers?.[0].chatRoomId}
                      </div>
                    </div>
                  </div>

                  {chatRoomUser?.unreadCount > 0 ? (
                    <div className="flex items-center justify-center bg-red-700 text-white h-5 w-7 rounded-full">
                      <span className="text-xs font-semibold">
                        {chatRoomUser?.unreadCount}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </button>
              );
            })}
        </>
      ),
    },
    {
      key: "2",
      label: "Nhóm",
      children: (
        <>
          {filteredChatRoomGroups.map((chatRoomGroup) => (
            <button
              key={chatRoomGroup?.chatRoom?.id}
              onClick={() => {
                selectChatRoomUser(chatRoomGroup);
              }}
              className="w-full p-3 flex items-center gap-3 hover:bg-gray-100 rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar.Group
                    max={{
                      count: 2,
                      style: {
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                      },
                    }}
                  >
                    {chatRoomGroup.users.map((user) => (
                      <Avatar key={user?.id} size={32} className="bg-red-700">
                        {user?.role?.name?.[0]?.toUpperCase()}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">
                    {FORMAT_TEXT_LENGTH(chatRoomGroup?.chatRoom?.name)}
                  </div>
                </div>
              </div>

              {chatRoomGroup?.unreadCount > 0 ? (
                <div className="flex items-center justify-center bg-red-700 text-white h-5 w-7 rounded-full">
                  <span className="text-xs font-semibold">
                    {chatRoomGroup?.unreadCount}
                  </span>
                </div>
              ) : (
                ""
              )}
            </button>
          ))}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="h-full w-20 lg:w-72 border-r flex flex-col transition-all duration-200">
        <div className="w-full pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuUsers className="size-6" />
              <span className="font-medium hidden lg:block">Liên hệ</span>
            </div>

            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <CiMenuKebab className="size-6 text-black" />
                </Space>
              </a>
            </Dropdown>
          </div>

          <div className="mt-3 pr-2">
            <Search
              placeholder="Tìm kiếm..."
              enterButton="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto w-full pr-3 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <Tabs defaultActiveKey="1" items={contacts} />
        </div>
      </div>

      <ChatAddContact
        user={user}
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleCreateRoomPrivate={handleCreateRoomPrivate}
        handleCreateGroup={handleCreateGroup}
      />
    </>
  );
};

export default ChatSidebar;
