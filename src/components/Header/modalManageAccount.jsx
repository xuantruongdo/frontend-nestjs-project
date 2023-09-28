import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Table,
  Tabs,
  message,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  callChangePassword,
  callCreateSkills,
  callFetchCurrentAccount,
  callFetchResumesByUserId,
  callFetchSkills,
  callUpdateSkills,
  callUpdateUser,
} from "../../services/api";
import { SKILLS_LIST } from "../../config/sample";
import { useDispatch, useSelector } from "react-redux";
import {
  doGetAccountAction,
  doUpdateUser,
} from "../../redux/account/accountSlice";

const UserResume = () => {
  const [loading, setLoading] = useState(false);
  const [resumesUser, setResumesuser] = useState([]);

  const fetchResumesByUserId = async () => {
    setLoading(true);
    const res = await callFetchResumesByUserId();
    if (res && res.data) {
      setLoading(false);
      setResumesuser(res.data);
    }
  };

  useEffect(() => {
    fetchResumesByUserId();
  }, []);
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Công Ty",
      dataIndex: ["companyId", "name"],
    },
    {
      title: "Vị trí",
      dataIndex: ["jobId", "name"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày rải CV",
      dataIndex: "createdAt",
      render(value, record, index) {
        return <>{dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "",
      dataIndex: "",
      render(value, record, index) {
        return (
          <a
            href={`${import.meta.env.VITE_BACKEND_URL}/images/resume/${
              record?.url
            }`}
            target="_blank"
          >
            Chi tiết
          </a>
        );
      },
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={resumesUser}
      loading={loading}
      pagination={false}
    />
  );
};

const JobByEmail = () => {
  const optionsSkills = SKILLS_LIST;
  const [form] = Form.useForm();
  const [isSubscriber, setIsSubscriber] = useState(false);

  const user = useSelector((state) => state.account.user);

  const handleRegisterSkills = async () => {
    let data = {
      email: user?.email,
      name: user?.fullname,
      skills: [],
    };

    const res = await callCreateSkills(data);
    if (res && res.data) {
      message.success("Đăng ký nhận job thành công");
      setIsSubscriber(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      const res = await callFetchSkills();
      if (res && res.data) {
        setIsSubscriber(true);
        form.setFieldValue("skills", res.data.skills);
      } else {
        setIsSubscriber(false);
      }
    };
    init();
  }, []);
  const onFinish = async (values) => {
    const { skills } = values;
    let data = {
      email: user?.email,
      name: user?.fullname,
      skills: skills ? skills : [],
    };

    const res = await callUpdateSkills(data);
    if (res && res.data) {
      message.success("Cập nhật skills thành công");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  return (
    <Form form={form} onFinish={onFinish}>
      {isSubscriber ? (
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label="Kỹ năng"
              name="skills"
              rules={[
                { required: true, message: "Vui lòng chọn ít nhất 1 skill!" },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn kĩ năng"
                options={optionsSkills}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={() => form.submit()}>Cập nhật</Button>
          </Col>
        </Row>
      ) : (
        <Button onClick={handleRegisterSkills}>Đăng ký</Button>
      )}
    </Form>
  );
};

const UpdateInfo = () => {
  const user = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const options = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
  ];
  const onChangeGender = ({ target: { value } }) => {
    setGender(value);
  };
  useEffect(() => {
    const init = {
      _id: user?._id,
      fullname: user?.fullname,
      age: user?.age,
      gender: user?.gender,
      address: user?.address,
    };
    form.setFieldsValue(init);
  }, []);
  const onFinish = async (values) => {
    const { _id, fullname, age, gender, address } = values;
    let data = { fullname, age, gender, address };
    setLoading(true);
    const res = await callUpdateUser(_id, data);
    if (res && res.data) {
      setLoading(false);
      dispatch(doUpdateUser(res.data.userUpdated));
      message.success("Cập nhật thông tin thành công !");
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
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={[20, 20]}>
        <Col span={0}>
          <Form.Item
            labelCol={{ span: 6 }}
            label="ID"
            name="_id"
            rules={[{ required: true, message: "Vui lòng nhập _id !" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            label="Họ tên"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ tên !" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            label="Tuổi"
            name="age"
            rules={[{ required: true, message: "Vui lòng nhập tuổi !" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            label="Giới tính"
            name="gender"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu !" },
            ]}
          >
            <Radio.Group
              options={options}
              onChange={onChangeGender}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 6 }}
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ !" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const ChangePassword = () => {
  const user = useSelector((state) => state.account.user);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { confirm_password, current_password, new_password } = values;
    setLoading(true);
    let data = {
      confirm_password, current_password, new_password
    }
    const res = await callChangePassword(user._id, data);
    if (res && res.data) {
      setLoading(false);
      message.success("Thay đổi mật khẩu thành công")
    } else {
      notification.error({
        message: "Có lỗi xảy ra!",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5,
      });
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={[20, 20]} style={{flexDirection: 'column'}} align={"middle"}>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Mật khẩu hiện"
            name="current_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại !" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới !" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 24 }}
            label="Xác nhận mật khẩu"
            name="confirm_password"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới !" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const ModalManageAccount = (props) => {
  const { openManageAccount, setOpenManageAccount } = props;

  const handleOk = () => {
    setOpenManageAccount(false);
  };

  const handleCancel = () => {
    setOpenManageAccount(false);
  };

  const items = [
    {
      key: "1",
      label: "Rải CV",
      children: <UserResume />,
    },
    {
      key: "2",
      label: "Nhận Jobs qua Email",
      children: <JobByEmail />,
    },
    {
      key: "3",
      label: "Cập nhật thông tin",
      children: <UpdateInfo />,
    },
    {
      key: "4",
      label: "Thay đổi mật khẩu",
      children: <ChangePassword />,
    },
  ];

  const onChange = (key) => {};

  return (
    <Modal
      title="Quản lý tài khoản"
      width={800}
      open={openManageAccount}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </Modal>
  );
};

export default ModalManageAccount;
