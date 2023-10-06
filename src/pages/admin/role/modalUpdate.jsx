import {
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  message,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { callFetchPermissions, callUpdateRole } from "../../../services/api";
import _ from "lodash";
import ModuleAPIUpdate from "./moduleAPIUpdate";

const ModalUpdate = (props) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    dataViewUpdate,
    fetchDisplayRoles,
  } = props;
  const [selectedIds, setSelectedIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionsRole, setPermissionsRole] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleCancel = () => {
    setOpenModalUpdate(false);
    window.location.reload();
  };
  const onChangeSwitch = (checked) => {
    setIsActive(checked);
  };
  const onFinish = async (values) => {
    const { _id, name, description } = values;
    let data = {
      name,
      description,
      isActive: isActive,
      permissions: selectedIds,
    };
      setLoading(true);
      const res = await callUpdateRole(_id, data);
      if (res && res.data) {
        message.success("Cập nhật role thành công");
        setOpenModalUpdate(false);
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

  useEffect(() => {
    setIsActive(dataViewUpdate?.isActive);
    setPermissionsRole(dataViewUpdate?.permissions);
    const init = {
      _id: dataViewUpdate?._id,
      name: dataViewUpdate?.name,
      description: dataViewUpdate?.description,
      isActive: isActive,
    };

    form.setFieldsValue(init);
  }, [dataViewUpdate, form]);
  return (
    <Modal
      className="modal-custom-width"
      title="Thêm mới role"
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
              rules={[{ required: true, message: "Vui lòng nhập ID role" }]}
            >
              <Input />
            </Form.Item>
          </Col>
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
              <Switch checked={isActive} onChange={onChangeSwitch} />;
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
              <ModuleAPIUpdate
                permissions={permissions}
                permissionsRole={permissionsRole}
                setSelectedIds={setSelectedIds}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
