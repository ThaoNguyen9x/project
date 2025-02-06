import React, { useEffect, useState } from "react";
import { Avatar, Checkbox, Form, Modal, Select } from "antd";
import Search from "antd/es/transfer/search";
import { callGetAllUsers } from "../../../services/api";
import { FORMAT_TEXT_LENGTH } from "../../../utils/constant";
import { IoIosClose } from "react-icons/io";

const ChatAddContact = ({
  user,
  openModal,
  setOpenModal,
  handleCreateRoomPrivate,
  handleCreateGroup,
}) => {
  const [listUsers, setListUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);

    const res = await callGetAllUsers();
    if (res && res.data) {
      setListUsers(res.data.result);
    }

    setIsLoading(false);
  };

  const handleCheckboxChange = (user, checked) => {
    if (checked) {
      setSelectedUsers((prev) => [
        ...prev,
        { id: user.id, value: user.role?.name, label: user.name },
      ]);
    } else {
      setSelectedUsers((prev) => prev.filter((item) => item.id !== user.id));
    }
  };

  const tagRender = (props) => {
    const { value, closable, onClose } = props;

    return (
      <div className="relative flex items-center gap-2 rounded my-1 mx-2">
        <Avatar size={32} className="bg-red-700">
          {value}
        </Avatar>
        {closable && (
          <span
            onClick={onClose}
            className="absolute -top-1 -right-2 bg-gray-100 p-[2px] rounded-full cursor-pointer"
          >
            <IoIosClose />
          </span>
        )}
      </div>
    );
  };

  const onFinish = () => {
    const accountIds = [user.id, ...selectedUsers.map((user) => user.id)];

    if (selectedUsers.length === 1) {
      handleCreateRoomPrivate(accountIds[0], accountIds[1]);
    } else if (selectedUsers.length > 1) {
      handleCreateGroup({ accountIds });
    }

    setOpenModal(false);
    setSelectedUsers([]);
  };

  return (
    <div>
      <Modal
        title="Tạo cuộc trò chuyện"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedUsers([]);
        }}
        onOk={onFinish}
      >
        <Form name="basic" onFinish={onFinish} layout="vertical">
          <div className="w-full pb-3">
            <Search
              placeholder="Tìm kiếm..."
              enterButton="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="overflow-y-auto w-full h-[calc(100vh-25rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {listUsers
              .filter((user) => user?.status)
              .filter((user) =>
                user?.name?.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id}
                  className="w-full px-3 hover:bg-gray-100 rounded-md"
                >
                  <Checkbox
                    checked={selectedUsers.some((item) => item.id === user.id)}
                    onChange={(e) =>
                      handleCheckboxChange(user, e.target.checked)
                    }
                  >
                    <div className="flex items-center gap-3 p-3">
                      <Avatar size={32} className="bg-red-700">
                        {user?.role?.name[0]?.toUpperCase()}
                      </Avatar>
                      <div className="block text-left min-w-0">
                        <div className="font-medium truncate">
                          {FORMAT_TEXT_LENGTH(user?.name, 20)}
                        </div>
                      </div>
                    </div>
                  </Checkbox>
                </div>
              ))}
          </div>

          {selectedUsers.length > 0 ? (
            <div className="mt-4">
              <Select
                mode="multiple"
                className="w-full"
                value={selectedUsers}
                tagRender={tagRender}
                open={false}
                onChange={(newValues) => {
                  setSelectedUsers(
                    newValues.map((value) => {
                      const user = listUsers.find(
                        (u) => u.role?.name[0]?.toUpperCase() === value
                      );
                      return {
                        id: user.id,
                        value: user.role?.name[0]?.toUpperCase(),
                        label: user.name,
                      };
                    })
                  );
                }}
              />
            </div>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};

export default ChatAddContact;
