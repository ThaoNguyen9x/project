import React, { useState } from "react";
import { Avatar, Dropdown, Space, Tabs } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import Search from "antd/es/transfer/search";
import { FORMAT_TEXT_LENGTH } from "../../../utils/constant";
import ChatAddContact from "./ChatAddContact";

const ChatSidebar = ({
  user,
  userStatus,
  listChatRoomUsers,
  listChatRoomGroups,
  selectChatRoomUser,
  handleCreateRoomPrivate,
  handleCreateGroup,
  isSidebarVisible,
}) => {
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const items = [
    {
      key: "add",
      label: "Tạo cuộc trò chuyện",
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
      const roomName = current?.chatRoom?.name;
      if (!acc[roomName]) {
        acc[roomName] = { chatRoom: current?.chatRoom, users: [] };
      }
      acc[roomName]?.users.push(current?.user);
      return acc;
    }, {});

  const filteredChatRoomGroups = Object.values(groupedChatRoomGroups);

  const contacts = [
    {
      key: "1",
      label: "Tất cả",
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
                          userStatus[chatRoomUser?.user?.id] === "online"
                            ? "bg-green-600"
                            : "bg-red-600"
                        } rounded-full`}
                      />
                    </div>

                    <div className="block text-left min-w-0">
                      <div className="font-medium truncate">
                        {FORMAT_TEXT_LENGTH(chatRoomUser?.user?.name, 20)}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {userStatus[chatRoomUser?.user?.id] === "online"
                          ? "Online"
                          : "Offline"}
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

    ...(user?.role?.name !== "Customer"
      ? [
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
                            <Avatar
                              key={user?.id}
                              size={32}
                              className="bg-red-700"
                            >
                              {user?.role?.name?.[0]?.toUpperCase()}
                            </Avatar>
                          ))}
                        </Avatar.Group>
                      </div>

                      <div className="block text-left min-w-0">
                        <div className="font-medium truncate">
                          {FORMAT_TEXT_LENGTH(
                            chatRoomGroup?.chatRoom?.name,
                            20
                          )}
                        </div>
                      </div>
                    </div>

                    {chatRoomGroup?.unreadCount > 0 && (
                      <div className="flex items-center justify-center bg-red-700 text-white h-5 w-7 rounded-full">
                        <span className="text-xs font-semibold">
                          {chatRoomGroup?.unreadCount}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        className={`h-full w-full lg:w-72 lg:border-r ${
          isSidebarVisible ? "block" : "hidden lg:block"
        } flex flex-col transition-all duration-300`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuUsers className="size-6" />
              <span className="font-medium hidden lg:block">Liên hệ</span>
            </div>

            {user?.role?.name !== "Customer" ? (
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
            ) : (
              ""
            )}
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
