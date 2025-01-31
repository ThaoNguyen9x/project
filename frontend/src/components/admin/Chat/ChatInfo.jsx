import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Collapse, Image, Modal } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { formatDate, isURL } from "../../../utils/constant";
import { IoIosLink } from "react-icons/io";
import iconPDF from "../../../assets/icons/icon-pdf.svg";
import iconDocx from "../../../assets/icons/icon-docx.svg";
import iconDoc from "../../../assets/icons/icon-doc.svg";
import iconExcel from "../../../assets/icons/icon-excel.svg";
import iconRar from "../../../assets/icons/icon-rar.svg";

const ChatInfo = ({
  openInfo,
  setOpenInfo,
  selectedChatRoomUser,
  handleDeleteChatHistory,
  listMessages,
}) => {
  const infoRef = useRef(null);
  const [isModalConfirm, setIsModalConfirm] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setOpenInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mergedList = [...listMessages];

  const shortenFileName = (fileName, maxLength) =>
    fileName.length > maxLength
      ? `${fileName.slice(0, maxLength)}...${fileName.slice(
          fileName.lastIndexOf(".")
        )}`
      : fileName;

  const renderMessages = (messages) => {
    return messages.map((message, index) => (
      <div key={index} className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Avatar shape="square" icon={<IoIosLink />} />
          <a
            href={`http://${message?.content}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline font-bold"
          >
            {message?.content}
          </a>
        </div>
        <p className="text-xs">{formatDate(message?.createdAt)}</p>
      </div>
    ));
  };

  const items = [
    {
      key: "1",
      label: "Ảnh/Video",
      children: (
        <>
          {mergedList.filter((image) => {
            const fileExtension = image?.imageUrl
              ?.split(".")
              .pop()
              ?.toLowerCase();
            return ["jpg", "jpeg", "png"].includes(fileExtension);
          }).length > 0 ? (
            <div className="grid gap-4 grid-cols-3">
              {mergedList
                .filter((image) => {
                  const fileExtension = image?.imageUrl
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();
                  return ["jpg", "jpeg", "png"].includes(fileExtension);
                })
                .slice(0, 5)
                .map((image, index) => (
                  <div className="group relative" key={index}>
                    <Image
                      src={`${import.meta.env.VITE_BACKEND_URL}/storage/image/${
                        image?.imageUrl
                      }`}
                      alt={`Image ${index + 1}`}
                      className="rounded-md"
                    />
                  </div>
                ))}

              {mergedList.filter((image) => {
                const fileExtension = image?.imageUrl
                  ?.split(".")
                  .pop()
                  ?.toLowerCase();
                return ["jpg", "jpeg", "png"].includes(fileExtension);
              }).length > 5 && (
                <div className="group relative">
                  <button className="absolute w-full min-h-full bg-gray-900/90 hover:bg-gray-900/50 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-medium text-white">
                      +
                      {mergedList.filter((image) => {
                        const fileExtension = image?.imageUrl
                          ?.split(".")
                          .pop()
                          ?.toLowerCase();
                        return ["jpg", "jpeg", "png"].includes(fileExtension);
                      }).length - 5}
                    </span>
                  </button>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/image/${
                      mergedList.filter((image) => {
                        const fileExtension = image?.imageUrl
                          ?.split(".")
                          .pop()
                          ?.toLowerCase();
                        return ["jpg", "jpeg", "png"].includes(fileExtension);
                      })[5]?.imageUrl
                    }`}
                    className="rounded-lg"
                    alt="Additional images"
                  />
                </div>
              )}
            </div>
          ) : (
            <p>Chưa có Ảnh/Video được chia sẻ trong cuộc hội thoại này</p>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "File",
      children: (
        <>
          {mergedList.filter((file) => {
            const fileExtension = file?.imageUrl
              ?.split(".")
              .pop()
              ?.toLowerCase();
            return ["pdf", "doc", "docx", "xls", "xlsx", "rar"].includes(
              fileExtension
            );
          }).length > 0 ? (
            <div className="grid grid-cols-1">
              {mergedList
                .filter((file) => {
                  const fileExtension = file?.imageUrl
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();
                  return ["pdf", "doc", "docx", "xls", "xlsx", "rar"].includes(
                    fileExtension
                  );
                })
                .slice(0, 3)
                .map((file, index) => {
                  const fileExtension = file?.imageUrl
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();
                  const fileIcons = {
                    pdf: iconPDF,
                    doc: iconDoc,
                    docx: iconDocx,
                    xls: iconExcel,
                    xlsx: iconExcel,
                    rar: iconRar,
                  };
                  const fileIcon = fileIcons[fileExtension] || iconPDF;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={fileIcon}
                          alt={`${fileExtension} Icon`}
                          className="h-8 w-8"
                        />
                        <a
                          href={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/storage/image/${file?.imageUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline font-bold"
                        >
                          {shortenFileName(file?.imageUrl, 10)}
                        </a>
                      </div>
                      <p className="text-xs">{formatDate(file?.createdAt)}</p>
                    </div>
                  );
                })}

              {mergedList.filter((file) => {
                const fileExtension = file?.imageUrl
                  ?.split(".")
                  .pop()
                  ?.toLowerCase();
                return ["pdf", "doc", "docx", "xls", "xlsx", "rar"].includes(
                  fileExtension
                );
              }).length > 2 && (
                <Button
                  color="default"
                  variant="filled"
                  className="w-full my-2"
                >
                  Xem tất cả
                </Button>
              )}
            </div>
          ) : (
            <p>Chưa có File được chia sẻ trong cuộc hội thoại này</p>
          )}
        </>
      ),
    },
    {
      key: "3",
      label: "Link",
      children: (
        <>
          {mergedList.filter((message) => isURL(message?.content)).length ? (
            <>
              {renderMessages(
                mergedList.filter((message) => isURL(message?.content))
              )}
              {mergedList.filter((message) => isURL(message?.content)).length >
                2 && (
                <Button
                  color="default"
                  variant="filled"
                  className="w-full my-2"
                >
                  Xem tất cả
                </Button>
              )}
            </>
          ) : (
            <p>Chưa có Link được chia sẻ trong cuộc hội thoại này</p>
          )}
        </>
      ),
    },
  ];

  return (
    <div
      ref={infoRef}
      className={`absolute bg-white border border-r rounded-r-lg h-full transition-all duration-300 z-50 top-0 
        ${
          openInfo
            ? "opacity-100 w-[calc(100vw-65rem)] right-0"
            : "opacity-0 w-0 right-[0%]"
        }  overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300`}
    >
      <div className="flex flex-col items-center justify-center mt-10 px-5">
        <Avatar size={40} className="bg-red-700">
          {selectedChatRoomUser?.user?.role?.name[0]?.toUpperCase() || "G"}
        </Avatar>
        <h3 className="text-lg font-medium">
          {selectedChatRoomUser?.user?.name ||
            selectedChatRoomUser?.chatRoom?.name}
        </h3>
        <Collapse
          size="small"
          ghost
          items={items}
          defaultActiveKey={["1", "2", "3"]}
          className="w-full"
        />

        <div className="w-full px-2.5 mb-10">
          <Button
            onClick={() => setIsModalConfirm(true)}
            danger
            className="w-full"
          >
            <AiOutlineDelete className="size-5" />
            Xóa lịch sử trò chuyện
          </Button>
        </div>

        <Modal
          title="Xác nhận"
          open={isModalConfirm}
          onOk={() => {
            handleDeleteChatHistory();
            setIsModalConfirm(false);
          }}
          onCancel={() => setIsModalConfirm(false)}
          className="!w-1/4"
        >
          <p>
            Toàn bộ nội dung trò chuyện sẽ bị xóa vĩnh viễn. Bạn có chắc chắn
            muốn xóa?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ChatInfo;
