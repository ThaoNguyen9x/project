import React from "react";
import { Avatar, Button, Tooltip } from "antd";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import { BsReverseLayoutSidebarReverse } from "react-icons/bs";
import { FORMAT_TEXT_LENGTH } from "../../../utils/constant";

const ChatHeader = ({
  selectedChatRoomUser,
  setSelectedChatRoomUser,
  setOpenInfo,
  setOpenSearch,
  userStatus,
  setIsSidebarVisible,
}) => {
  const onlineUsers = selectedChatRoomUser?.users?.filter(
    (user) => user?.isOnline
  );

  return (
    <div className="p-3.5 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative mx-auto">
            <Avatar size={32} className="bg-red-700">
              {selectedChatRoomUser?.user?.role?.name[0]?.toUpperCase() || "G"}
            </Avatar>
            {selectedChatRoomUser?.user ? (
              <span
                className={`absolute bottom-0 right-0 size-2 ${
                  userStatus[selectedChatRoomUser?.user?.id] === "online"
                    ? "bg-green-600"
                    : "bg-red-600"
                } rounded-full`}
              />
            ) : (
              ""
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium">
              {FORMAT_TEXT_LENGTH(
                selectedChatRoomUser?.user?.name ||
                  selectedChatRoomUser?.chatRoom?.name,
                20
              )}
            </h3>
            <p className="text-sm text-zinc-400">
              {selectedChatRoomUser && onlineUsers
                ? `${onlineUsers?.length + 1} users online`
                : userStatus[selectedChatRoomUser?.user?.id] === "online"
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <Tooltip
            title="Tìm kiếm tin nhắn"
            onClick={() => setOpenSearch(true)}
          >
            <Button type="text" icon={<IoSearchOutline className="size-4" />} />
          </Tooltip>

          <Tooltip
            title="Thông tin hội thoại"
            onClick={() => setOpenInfo(true)}
          >
            <Button
              type="text"
              icon={<BsReverseLayoutSidebarReverse className="size-4" />}
            />
          </Tooltip>

          <Tooltip
            title="Đóng cuộc trò chuyện"
            onClick={() => {
              setSelectedChatRoomUser(null);
              setIsSidebarVisible(true);
            }}
          >
            <Button type="text" icon={<IoCloseOutline className="size-4" />} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
