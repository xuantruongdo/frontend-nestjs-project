import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { GENDER_LIST } from "../../../config/sample";
import {
  callFetchCompanyById,
  callUpdateUserByAdmin,
} from "../../../services/api";

const ModalUpdate = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    fetchDisplayUsers,
    dataViewUpdate,
    roles,
    companies,
  } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpenModalUpdate(false);
  };
  useEffect(() => {
    const init = {
      _id: dataViewUpdate?._id,
      email: dataViewUpdate?.email,
      password: dataViewUpdate?.password,
      fullname: dataViewUpdate?.fullname,
      age: dataViewUpdate?.age,
      gender: dataViewUpdate?.gender,
      address: dataViewUpdate?.address,
      gender: dataViewUpdate?.gender,
      role: dataViewUpdate?.role?.name,
      company: dataViewUpdate?.company?._id,
    };
    form.setFieldsValue(init);
  }, [dataViewUpdate]);
  const onFinish = async (values) => {
    const {
      _id,
      fullname,
      age,
      gender,
      address,
      role,
      company,
    } = values;
    let data = {
      fullname,
      age,
      gender,
      address,
    };
    if (dataViewUpdate?.role?.name === role) {
      data.role = dataViewUpdate?.role?._id;
    } else {
      data.role = role;
    }
    if (company) {
      const resFetchCompany = await callFetchCompanyById(company);
      if (resFetchCompany && resFetchCompany.data) {
        data.company = {
          _id: resFetchCompany.data._id,
          name: resFetchCompany.data.name,
        };
      }
    }

    setLoading(true);
    const res = await callUpdateUserByAdmin(_id, data);
    if (res && res.data) {
      message.success("Cập nhật user thành công !");
      setOpenModalUpdate(false);
      fetchDisplayUsers();
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
      title="Thêm mới user"
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
          <Col xs={24} sm={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="ID"
              name="_id"
              rules={[{ required: true, message: "Vui lòng nhập ID !" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email !" }]}
            >
              <Input disabled/>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Tên hiển thị"
              name="fullname"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị !" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Tuổi"
              name="age"
              rules={[{ required: true, message: "Vui lòng nhập tuổi !" }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          <Col xs={12} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng nhập giới tính !" }]}
            >
              <Select placeholder="Giới tính" options={GENDER_LIST} />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ !" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Vui lòng nhập vai trò !" }]}
            >
              <Select placeholder="Vai trò">
                {roles?.map((item) => (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Thuộc công ty"
              name="company"
            >
              <Select placeholder="Công ty">
                {companies?.map((item) => (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
