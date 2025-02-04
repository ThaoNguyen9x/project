import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import Picker from "emoji-picker-react";
import { runes } from "runes2";
import { Form, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Button, Dropdown, Space, Upload, notification } from "antd";
import { callSendMessage, callUploadFile } from "../../../services/api";

import { BsEmojiSmile } from "react-icons/bs";
import { BiSend } from "react-icons/bi";
import { TiAttachment } from "react-icons/ti";

const MessageInput = ({
  user,
  selectedChatRoomUser,
  fetchData,
  handleChangeStatusMessage,
}) => {
  const [form] = Form.useForm();
  const [inputStr, setInputStr] = useState("");
  const [dataImage, setDataImage] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const items = [
    {
      label: (
        <Picker
          height={400}
          width={400}
          onEmojiClick={(emojiObject) => {
            setInputStr((prevInput) => prevInput + emojiObject.emoji);
          }}
        />
      ),
    },
  ];

  const handleUploadImages = async ({ file }) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("folder", "image");
    formData.append("file", file);

    const res = await callUploadFile(formData);

    if (res && res.statusCode === 200 && res.data) {
      const uploadedFileName = res.data[0]?.fileName;

      setDataImage([
        {
          name: uploadedFileName,
          uid: file.uid,
        },
      ]);

      const chatRoomId = selectedChatRoomUser?.chatRoom?.id;

      if (chatRoomId) {
        const sendMessageRes = await callSendMessage(
          { id: chatRoomId },
          { id: user.id },
          inputStr.trim(),
          uploadedFileName
        );

        if (sendMessageRes && sendMessageRes.data) {
          setInputStr("");
          setFileList([]);
          setDataImage([]);
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description: sendMessageRes?.error,
          });
        }
      }
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res?.error,
      });
    }

    setIsUploading(false);
  };

  const handleFormSubmit = async () => {
    if (isUploading || isSending) return;

    setIsSending(true);

    const chatRoomId = selectedChatRoomUser?.chatRoom?.id;
    if (chatRoomId && (inputStr.trim() || dataImage.length)) {
      const res = await callSendMessage(
        { id: chatRoomId },
        { id: user.id },
        inputStr.trim(),
        dataImage[0]?.name || ""
      );

      if (res && res.data) {
        await fetchData();
        setInputStr("");
        setFileList([]);
        setDataImage([]);
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res?.error,
        });
      }
    }

    setIsSending(false);
  };

  return (
    <div className="p-4 w-full relative">
      <Form
        className="flex items-center gap-2"
        form={form}
        onFinish={handleFormSubmit}
      >
        <Tooltip title="Gửi hình ảnh/ đính kèm File">
          <Upload
            multiple={true}
            customRequest={handleUploadImages}
            showUploadList={false}
          >
            <TiAttachment
              size={25}
              className="cursor-pointer text-[#1677ff] hover:text-[#4096ff]"
            />
          </Upload>
        </Tooltip>

        <Tooltip title="Biểu cảm">
          <>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <BsEmojiSmile
                    size={20}
                    className="text-[#1677ff] hover:text-[#4096ff]"
                  />
                </Space>
              </a>
            </Dropdown>
          </>
        </Tooltip>

        <TextArea
          value={inputStr}
          onClick={() =>
            handleChangeStatusMessage(selectedChatRoomUser?.chatRoom?.id)
          }
          onChange={(e) => {
            setInputStr(e.target.value);
            handleChangeStatusMessage(selectedChatRoomUser?.chatRoom?.id);
          }}
          count={{
            show: true,
            max: 255,
            strategy: (txt) => runes(txt).length,
            exceedFormatter: (txt, { max }) =>
              runes(txt).slice(0, max).join(""),
          }}
          onPressEnter={(e) => {
            e.preventDefault();
            form.submit();
          }}
          allowClear
          autoSize={{ minRows: 1, maxRows: 2 }}
          name="content"
        />

        <Button
          htmlType="submit"
          type="primary"
          disabled={isUploading || isSending}
        >
          <BiSend size={25} />
        </Button>
      </Form>
    </div>
  );
};

export default MessageInput;
