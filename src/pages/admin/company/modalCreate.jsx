import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Button,
  Upload,
  message,
  Card,
  notification,
} from "antd";
import { useState } from "react";
import { callCreateCompany, callUploadLogo } from "../../../services/api";
import TextArea from "antd/es/input/TextArea";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const ModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchDisplayCompanies } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const [logo, setLogo] = useState("");
  const [value, setValue] = useState("");

  const handleCancel = () => {
    setOpenModalCreate(false);
    // form.resetFields();
  };

  const onFinish = async (values) => {
    let data = {
      name: values.name,
      logo: logo,
      address: values.address,
      description: value
    }
    const res = await callCreateCompany(data);
    if (res && res.data) {
      setOpenModalCreate(false);
      message.success('Thêm mới công ty thành công');
      form.resetFields();
      setImageUrl("");
      setLogo("");
      fetchDisplayCompanies();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleUploadSingleFile = async ({ file, onSuccess, onError }) => {
    const res = await callUploadLogo(file, "company");
    console.log(res);
    if (res && res.data) {
      setLogo(res.data.file);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };

  return (
    <Modal
      title="Thêm mới công ty"
      width={"50%"}
      open={openModalCreate}
      onCancel={handleCancel}
      onOk={() => {
        form.submit();
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Tên công ty"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên công ty !" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Logo"
              name="logo"
              rules={[{ required: true, message: "Vui lòng thêm Logo !" }]}
            >
              <Upload
                name="logo"
                listType="picture-card"
                className="avatar-uploader"
                multiple={false}
                maxCount={1}
                customRequest={handleUploadSingleFile}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ công ty !" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Mô tả"
            >
              <Card
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill theme="snow" value={value} onChange={setValue} />
                </Col>
              </Card>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
