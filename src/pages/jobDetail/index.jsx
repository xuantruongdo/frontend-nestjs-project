import "./jobDetail.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  callCreateResume,
  callFetchJobById,
  callUploadSingleFile,
} from "../../services/api";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Tag,
  Upload,
  message,
  notification,
} from "antd";
import {
  DollarOutlined,
  EnvironmentOutlined,
  HistoryOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const JobDetailPage = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let id = params?.get("id");
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);

  const [job, setJob] = useState({});
  const [urlCV, setUrlCV] = useState();

  const fetchJobById = async () => {
    const res = await callFetchJobById(id);
    if (res?.data?._id) {
      setJob(res.data);
    }
  };

  useEffect(() => {
    fetchJobById();
  }, [id]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkButton = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(false);
      navigate(`/login?callback=${window.location.href}`);
    } else {
      let data = {
        url: urlCV,
        companyId: job.company?._id,
        jobId: job._id,
      };
      const res = await callCreateResume(data);
      if (res && res.data) {
        message.success(`Rải CV thành công !`);
        setIsModalOpen(false);
      } else {
        notification.error({
          message: "Đã có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    accept: "application/pdf,application/msword, .doc, .docx, .pdf",
    async customRequest({ file, onSuccess, onError }) {
      const res = await callUploadSingleFile(file, "resume");
      console.log(res);
      if (res && res.data) {
        setUrlCV(res.data.file);
        if (onSuccess) onSuccess("ok");
      } else {
        if (onError) {
          setUrlCV("");
          const error = new Error(res.message);
          onError({ event: error });
        }
      }
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(
          info?.file?.error?.event?.message ??
            "Đã có lỗi xảy ra khi upload file."
        );
      }
    },
  };

  return (
    <div className="container detail-job-section">
      {job && job._id && (
        <Row gutter={[20, 20]}>
          <Col span={24} md={16}>
            <div className="header">
              <h2>{job.name}</h2>
              <button onClick={showModal}>APPLY NOW</button>
            </div>
            <Divider />
            <div className="content">
              <div className="skills">
                {job?.skills &&
                  job?.skills.map((item, index) => (
                    <Tag color="gold" key={index}>
                      {item}
                    </Tag>
                  ))}
              </div>
              <div className="salary">
                <DollarOutlined />
                <span>
                  &nbsp;
                  {(job.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
                </span>
              </div>
              <div className="location">
                <EnvironmentOutlined style={{ color: "#58aaab" }} />
                &nbsp;{job.location}
              </div>
              <div>
                <HistoryOutlined />{" "}
                {dayjs(job.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
              </div>
              <Divider />
              {parse(job.description)}
            </div>
          </Col>
          <Col span={24} md={8}>
            <div className="company">
              <img
                alt="example"
                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
                  job.company?.logo
                }`}
              />
              <div className="name">{job.company?.name}</div>
            </div>
          </Col>
        </Row>
      )}
      <Modal
        title="Ứng tuyển Job"
        open={isModalOpen}
        onOk={() => handleOkButton()}
        onCancel={handleCancel}
        okText={isAuthenticated ? "Rải CV Nào " : "Đăng Nhập Nhanh"}
        cancelButtonProps={{ style: { display: "none" } }}
        destroyOnClose={true}
      >
        <Divider />
        <Form>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <div>
                Bạn đang ứng tuyển công việc <b>{job?.name} </b>tại{" "}
                <b>{job?.company?.name}</b>
              </div>
            </Col>
            <Col span={24}>
              <Form.Item name="email" initialValue={user?.email}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }}
                label={"Upload file CV"}
                rules={[{ required: true, message: "Vui lòng upload file!" }]}
              >
                <Upload {...propsUpload}>
                  <Button
                    icon={<UploadOutlined />}
                    style={{
                      display: "flex",
                      height: "auto",
                      alignItems: "center",
                      whiteSpace: "normal",
                      width: "100%",
                    }}
                  >
                    Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt;
                    5MB )
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
