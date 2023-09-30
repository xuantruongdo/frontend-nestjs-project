import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useState } from "react";
import { METHOD_LIST, MODULE_LIST } from "../../../config/sample";
import { callCreatePermission } from "../../../services/api";

const ModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchDisplayPermissions } =
    props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpenModalCreate(false);
  };
  const onFinish = async (values) => {
    const { name, apiPath, method, module } = values;
    setLoading(true);
    let data = { name, apiPath, method, module };
    const res = await callCreatePermission(data);
    if (res && res.data) {
      message.success("Thêm permission thành công");
      setOpenModalCreate(false);
      fetchDisplayPermissions();
      form.resetFields();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };
  return (
    <Modal
      title="Thêm mới permission"
      width={"50%"}
      open={openModalCreate}
      onCancel={handleCancel}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={loading}
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
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Tên permission"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên permission !" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="API Path"
              name="apiPath"
              rules={[
                { required: true, message: "Vui lòng nhập tên permission !" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Phương thức"
              name="method"
              rules={[
                { required: true, message: "Vui lòng chọn phương thức !" },
              ]}
            >
              <Select
                placeholder="Chọn một phương thức"
                options={METHOD_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Module"
              name="module"
              rules={[{ required: true, message: "Vui lòng chọn module !" }]}
            >
              <Select placeholder="Chọn một module" options={MODULE_LIST} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
