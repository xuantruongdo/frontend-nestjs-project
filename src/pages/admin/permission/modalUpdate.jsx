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
import { useEffect, useState } from "react";
import { METHOD_LIST, MODULE_LIST } from "../../../config/sample";
import { callUpdatePermission } from "../../../services/api";

const ModalUpdate = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    fetchDisplayPermissions,
    dataViewUpdate,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpenModalUpdate(false);
  };
  useEffect(() => {
    const init = {
      _id: dataViewUpdate?._id,
      name: dataViewUpdate?.name,
      apiPath: dataViewUpdate?.apiPath,
      method: dataViewUpdate?.method,
      module: dataViewUpdate?.module,
    };
    form.setFieldsValue(init);
  }, [dataViewUpdate]);
  const onFinish = async (values) => {
    const { _id, name, apiPath, method, module } = values;
    let data = { name, apiPath, method, module };
    setLoading(true);
    const res = await callUpdatePermission(_id, data);
    if (res && res.data) {
      message.success("Cập nhật permission thành công");
      setOpenModalUpdate(false);
      fetchDisplayPermissions();
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
      className="modal-custom-width"
      title="Thêm mới permission"
      width={"50%"}
      open={openModalUpdate}
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
          <Col span={0}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="ID"
              name="_id"
              rules={[
                { required: true, message: "Vui lòng nhập ID permission !" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
          <Col xs={24} md={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="API Path"
              name="apiPath"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập api path permission !",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
          <Col xs={24} md={12}>
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

export default ModalUpdate;
