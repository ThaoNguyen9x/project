import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message, notification } from "antd";

import {
  callForgotPassword,
  callLogin,
  callResetPassword,
} from "../services/api";
import { AuthContext } from "../components/share/Context";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname.replace(/\/$/, '') === "/login";
  const isForgotPasswordPage = location.pathname.replace(/\/$/, '') === "/forgot-password";
  const isResetPasswordPage = location.pathname.replace(/\/$/, '') === "/reset-password";

  useEffect(() => {
    form.resetFields();
  }, [location.pathname]);

  const handleLogin = async (values) => {
    const { email, password } = values;
    setIsSubmit(true);

    const res = await callLogin(email, password);

    if (res && res.data) {
      message.success(res.message);
      localStorage.setItem("access_token", res.data.access_token);
      setUser(res.data.user);
      navigate("/dashboard");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }

    setIsSubmit(false);
  };

  const handleForgotPassword = async (values) => {
    const { email } = values;

    setIsSubmit(true);

    const res = await callForgotPassword(email);

    if (res && res.statusCode === 200) {
      message.success(res.message);
      form.resetFields();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }

    setIsSubmit(false);
  };

  const handleResetPassword = async (values) => {
    const { newPassword } = values;
    const tokenFromUrl = new URLSearchParams(location.search).get("token");

    setIsSubmit(true);

    const res = await callResetPassword(tokenFromUrl, newPassword);

    if (res && res.statusCode === 200) {
      message.success(res.message);
      form.resetFields();
      navigate("/login");
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.error,
      });
    }

    setIsSubmit(false);
  };

  useEffect(() => {
    if (localStorage.getItem("redirectedFromExpiredSession")) {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          "Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại",
      });

      localStorage.removeItem("redirectedFromExpiredSession");
    }
  }, []);

  const onFinish = isLoginPage
    ? handleLogin
    : isForgotPasswordPage
    ? handleForgotPassword
    : isResetPasswordPage
    ? handleResetPassword
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl bg-white shadow">
          <h2 className="text-blue-950 text-center text-2xl font-bold">
            {isLoginPage
              ? "Đăng nhập"
              : isForgotPasswordPage
              ? "Quên mật khẩu"
              : "Đặt lại mật khẩu"}
          </h2>
          <Form
            onFinish={onFinish}
            layout="vertical"
            form={form}
            autoComplete="off"
            className="mt-8 space-y-4"
          >
            {isLoginPage || isForgotPasswordPage ? (
              <Form.Item
                label="E-mail"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "E-mail không hợp lệ",
                  },
                  {
                    required: true,
                    message: "Vui lòng không được để trống",
                  },
                ]}
              >
                <Input autoComplete="off" />
              </Form.Item>
            ) : (
              ""
            )}

            {isLoginPage ? (
              <>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                  ]}
                >
                  <Input.Password autoComplete="off" />
                </Form.Item>

                <div className="flex items-center justify-between">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-2"
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item className="mb-2">
                    <Link
                      to="/forgot-password"
                      className="text-blue-950 whitespace-nowrap font-semibold flex items-center justify-center"
                    >
                      Quên mật khẩu
                    </Link>
                  </Form.Item>
                </div>
              </>
            ) : (
              ""
            )}

            {isResetPasswordPage ? (
              <>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                  ]}
                >
                  <Input.Password autoComplete="off" />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: "Vui lòng không được để trống" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp"));
                      },
                    }),
                  ]}
                >
                  <Input.Password autoComplete="off" />
                </Form.Item>
              </>
            ) : (
              ""
            )}

            <Button
              htmlType="submit"
              type="primary"
              className="w-full !bg-blue-950 hover:opacity-95"
              size="large"
              loading={isSubmit}
            >
              {isLoginPage
                ? "Đăng nhập"
                : isForgotPasswordPage
                ? "Lấy lại mật khẩu"
                : "Đặt lại mật khẩu"}
            </Button>

            {!isLoginPage ? (
              <Link
                to="/login"
                className="text-blue-950 whitespace-nowrap font-semibold mt-5 flex items-center justify-center"
              >
                Quay lại trang đăng nhập
              </Link>
            ) : (
              ""
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
