import { Button, Col, Form, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { callFetchResumesByUserId, callFetchSkills, callUpdateSkills } from "../../services/api";
import { SKILLS_LIST } from "../../config/sample";
import { useSelector } from "react-redux";

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

  const user = useSelector((state) => state.account.user);

  useEffect(() => {
    const init = async () => {
        const res = await callFetchSkills();
        if (res && res.data) {
            form.setFieldValue("skills", res.data.skills);
        }
    }
    init();
  }, [])
  const onFinish = async (values) => {
    const { skills } = values;
    let data = {
      email: user?.email,
      name: user?.fullname,
      skills: skills ? skills : []
    }

    const res = await callUpdateSkills(data);
    if (res && res.data) {
      message.success("Cập nhật skills thành công");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }


  }
  return (
    <Form form={form} onFinish={onFinish}>
      <Row gutter={[20, 20]}>
        <Col span={24}>
        <Form.Item label="Kỹ năng" name="skills" rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn kĩ năng"
              options={optionsSkills}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button onClick={() => form.submit()}>
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
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "Thay đổi mật khẩu",
      children: "Content of Tab Pane 4",
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

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
