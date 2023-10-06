import {
  Button,
  Form,
  Input,
  Divider,
  InputNumber,
  Radio,
  message,
  notification,
  Space,
} from "antd";
import { useState } from "react";
// import './register.scss'
import { callRegister } from "../../services/api";
import { NavLink, useNavigate } from "react-router-dom";

const options = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [gender, setGender] = useState();
  const navigate = useNavigate();

  const onChangeGender = ({ target: { value } }) => {
    setGender(value);
  };

  const onFinish = async (values) => {
    const {
      email,
      fullname,
      password,
      confirm_password,
      gender,
      age,
      address,
    } = values;
    setIsSubmit(true);
    if (password === confirm_password) {
      let data = { email, fullname, password, gender, age, address };
      const res = await callRegister(data);
      setIsSubmit(false);
      if (res?.data?._id) {
        message.success("Đăng ký tài khoản thành công");
        navigate("/login");
      } else {
        notification.error({
          message: "Có lỗi xảy ra!",
          description:
            res.message && Array.isArray(res.message)
              ? res.message[0]
              : res.message,
          duration: 5,
        });
      }
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description: "Nhập lại mật khẩu không khớp",
        duration: 5,
      });
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h3 style={{ textAlign: "center" }}>ĐĂNG KÝ TÀI KHOẢN</h3>
      <Divider />
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, margin: "0 auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email !" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="fullname"
          rules={[{ required: true, message: "Vui lòng nhập họ tên !" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu !" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirm_password"
          rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu !" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu !" }]}
        >
          <Radio.Group
            options={options}
            onChange={onChangeGender}
            value={gender}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi !" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ !" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <Space
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "30px",
        }}
      >
        <span>Bạn đã có tài khoản ?</span>
        <NavLink to="/login">Đăng nhập</NavLink>
      </Space>
    </div>
  );
};

export default RegisterPage;
