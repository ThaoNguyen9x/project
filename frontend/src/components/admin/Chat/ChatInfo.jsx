import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Collapse, Image, Modal } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { FORMAT_TEXT_LENGTH, formatDate, isURL } from "../../../utils/constant";
import { IoIosLink } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import iconPDF from "../../../assets/icons/icon-pdf.svg";
import iconDocx from "../../../assets/icons/icon-docx.svg";
import iconDoc from "../../../assets/icons/icon-doc.svg";
import iconExcel from "../../../assets/icons/icon-excel.svg";
import iconRar from "../../../assets/icons/icon-rar.svg";

const ChatInfo = ({
  user,
  openInfo,
  setOpenInfo,
  selectedChatRoomUser,
  handleDeleteChatHistory,
  listMessages,
}) => {
  const infoRef = useRef(null);
  const [isModalConfirm, setIsModalConfirm] = useState(false);
  const [imageShowCount, setImageShowCount] = useState(2);
  const [fileShowCount, setFileShowCount] = useState(3);
  const [linkShowCount, setLinkShowCount] = useState(3);

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
      label: "Ảnh",
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
                .slice(0, imageShowCount)
                .map((image, index) => (
                  <div className="group relative" key={index}>
                    <Image
                      src={`${import.meta.env.VITE_BACKEND_URL}/storage/image/${
                        image?.imageUrl
                      }`}
                      alt={`Image ${index + 1}`}
                      className="rounded-md !h-20 !w-20"
                    />
                  </div>
                ))}

              {mergedList.filter((image) => {
                const fileExtension = image?.imageUrl
                  ?.split(".")
                  .pop()
                  ?.toLowerCase();
                return ["jpg", "jpeg", "png"].includes(fileExtension);
              }).length > imageShowCount && (
                <div className="group relative">
                  <button
                    onClick={() =>
                      setImageShowCount(imageShowCount + imageShowCount)
                    }
                    className="absolute  !h-20 !w-20 bg-gray-900/90 hover:bg-gray-900/50 transition-all duration-300 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-xl font-medium text-white">
                      +
                      {mergedList.filter((image) => {
                        const fileExtension = image?.imageUrl
                          ?.split(".")
                          .pop()
                          ?.toLowerCase();
                        return ["jpg", "jpeg", "png"].includes(fileExtension);
                      }).length - imageShowCount}
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
                      })[imageShowCount]?.imageUrl
                    }`}
                    className="rounded-lg !h-20 !w-20"
                    alt="Additional images"
                  />
                </div>
              )}
            </div>
          ) : (
            <p>Chưa có Ảnh được chia sẻ trong cuộc hội thoại này</p>
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
                .slice(0, fileShowCount)
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
              }).length > fileShowCount && (
                <Button
                  onClick={() =>
                    setFileShowCount(fileShowCount + fileShowCount)
                  }
                  color="default"
                  variant="filled"
                  className="w-full my-2"
                >
                  Xem thêm
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
                mergedList
                  .filter((message) => isURL(message?.content))
                  .slice(0, linkShowCount)
              )}
              {mergedList.filter((message) => isURL(message?.content)).length >
                linkShowCount && (
                <Button
                  onClick={() =>
                    setLinkShowCount(linkShowCount + linkShowCount)
                  }
                  color="default"
                  variant="filled"
                  className="w-full my-2"
                >
                  Xem thêm
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
      className={`absolute rounded-lg bg-white border border-r rounded-r-lg h-full transition-all duration-300 z-50 top-0 
        ${
          openInfo
            ? "opacity-100 !max-w-fit right-0"
            : "opacity-0 w-0 right-[0%]"
        }  overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300`}
    >
      <div className="my-10">
        <div className="pb-[1.7rem] flex items-center justify-center gap-5 border-b">
          <h4 className="text-lg font-bold">Thông tin hội thoại</h4>
          <button
            onClick={() => {
              setOpenInfo(false);
              setLinkShowCount(3);
              setFileShowCount(3);
              setImageShowCount(2);
            }}
            className="hover:text-[#0958d9] text-lg"
          >
            <IoClose />
          </button>
        </div>
        <div className="m-5">
          <div className="flex flex-col items-center justify-center gap-2">
            <Avatar size={40} className="bg-red-700">
              {selectedChatRoomUser?.user?.role?.name[0]?.toUpperCase() || "G"}
            </Avatar>
            <h3 className="text-lg font-medium">
              {FORMAT_TEXT_LENGTH(
                selectedChatRoomUser?.user?.name ||
                  selectedChatRoomUser?.chatRoom?.name,
                20
              )}
            </h3>
            <Collapse
              size="small"
              ghost
              items={items}
              defaultActiveKey={["1", "2", "3"]}
              className="w-full"
            />

            {user?.role?.name === "Application_Admin" ? (
              <>
                <div className="w-full px-2.5">
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
                    setOpenInfo(false);
                    setIsModalConfirm(false);
                  }}
                  onCancel={() => setIsModalConfirm(false)}
                  className="!w-1/4"
                >
                  <p>
                    Toàn bộ nội dung trò chuyện sẽ bị xóa vĩnh viễn. Bạn có chắc
                    chắn muốn xóa?
                  </p>
                </Modal>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
