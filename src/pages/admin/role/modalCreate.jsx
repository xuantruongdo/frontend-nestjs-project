import { Card, Col, Form, Input, Modal, Row, Switch, message, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { callCreateRole, callFetchPermissions } from "../../../services/api";
import _ from "lodash";
import ModuleAPICreate from "./moduleAPICreate";

const ModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchDisplayRoles } = props;
  const [selectedIds, setSelectedIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpenModalCreate(false);
  };
  const onChangeSwitch = (checked) => {
    setIsActive(checked);
  };
  const onFinish = async (values) => {
    const { name, description } = values;
    let data = {
      name,
      description,
      isActive: isActive,
      permissions: selectedIds,
    };
    setLoading(true);
    const res = await callCreateRole(data);
    if (res && res.data) {
      message.success("Thêm role thành công");
      setOpenModalCreate(false);
      fetchDisplayRoles();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };
  //Group permissions
  const groupByPermission = (data) => {
    const groupedData = _.groupBy(data, (x) => x.module);

    const result = _.map(groupedData, (value, key) => {
      return { module: key, permissions: value };
    });

    return result;
  };
  const fetchPermissions = async () => {
    const res = await callFetchPermissions();
    if (res && res.data?.result) {
      setPermissions(groupByPermission(res.data?.result));
    }
  };
  useEffect(() => {
    fetchPermissions();
  }, []);
  return (
    <Modal
      className="modal-custom-width"
      title="Thêm mới role"
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
          <Col xs={24} md={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Tên role"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên role" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Active"
              name="isActive"
            >
              <Switch value={isActive} onChange={onChangeSwitch} />;
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Miêu tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
            >
              <TextArea rows={4} placeholder="Nhập miêu tả role" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Card
              title="Quyền hạn"
              headStyle={{ color: "#d81921" }}
              size="small"
            >
              <ModuleAPICreate
                form={form}
                permissions={permissions}
                setSelectedIds={setSelectedIds}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
