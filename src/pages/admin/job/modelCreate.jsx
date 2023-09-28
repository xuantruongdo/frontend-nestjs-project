import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { LEVEL_LIST, LOCATION_LIST, SKILLS_LIST } from "../../../config/sample";
import {
  callCreateJob,
  callFetchCompanies,
  callFetchCompanyById,
} from "../../../services/api";

const ModalCreate = (props) => {
  const { openModalCreate, setOpenModalCreate, fetchDisplayJobs } = props;
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchDisplayCompanies = async () => {
    let query = "";

    const res = await callFetchCompanies(query);
    if (res?.data) {
      setCompanies(
        res.data.result.map((item) => {
          return {
            label: item.name,
            value: item._id,
          };
        })
      );
    }
  };

  useEffect(() => {
    fetchDisplayCompanies();
  }, []);

  const handleCancel = () => {
    setOpenModalCreate(false);
  };

  const onChangeStartDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const onChangeEndDate = (date, dateString) => {
    console.log(date, dateString);
  };
  const onChangeSwitch = (checked) => {
    setIsActive(checked);
  };

  const onFinish = async (values) => {
    const { name, company, location, salary, quantity, skills, startDate, endDate, level } = values;
    setLoading(true);
    if (startDate && endDate && startDate.isBefore(endDate)) {
      const resFetchCompany = await callFetchCompanyById(company);
      if (resFetchCompany && resFetchCompany.data) {
        let data = {
          name,
          skills,
          company: {
            _id: resFetchCompany.data._id,
            name: resFetchCompany.data.name,
            logo: resFetchCompany.data.logo,
          },
          location: location,
          salary,
          quantity,
          startDate,
          endDate,
          level,
          description: value,
          isActive: isActive
        }
        
        const res = await callCreateJob(data);
        if (res && res.data) {
          message.success("Thêm job thành công !");
          setOpenModalCreate(false);
          fetchDisplayJobs();
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra",
            description: res.message,
          });
        }
      }
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: "Ngày kết thúc không hợp lệ",
      });
    }
    setLoading(false);
  };


  return (
    <Modal
      title="Thêm mới job"
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
              label="Tên job"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên job !" }]}
            >
              <Input placeholder="Nhập tên job" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Thuộc công ty"
                  name="company"
                  rules={[
                    { required: true, message: "Vui lòng chọn kĩ năng !" },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Chọn công ty"
                    options={companies}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Địa điểm"
                  name="location"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa điểm !" },
                  ]}
                >
                  <Select
                    placeholder="Chọn một địa điểm"
                    options={LOCATION_LIST}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={12}>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Mức lương"
                  name="salary"
                  rules={[{ required: true, message: "Vui lòng chọn level !" }]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    addonAfter=" đ"
                    placeholder="Nhập lương"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    { required: true, message: "Vui lòng chọn số lượng !" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Kĩ năng"
              name="skills"
              rules={[{ required: true, message: "Vui lòng chọn kĩ năng !" }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn kĩ năng"
                options={SKILLS_LIST}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={12}>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Ngày tuyển"
                  name="startDate"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày tuyển !" },
                  ]}
                >
                  <DatePicker
                    onChange={onChangeStartDate}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Ngày kết thúc"
                  name="endDate"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày kết thúc !",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={onChangeEndDate}
                    placeholder="dd/mm/yyyy"
                    format={"DD/MM/YYYY"}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row justify="space-between" gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Trình độ"
                  name="level"
                  rules={[
                    { required: true, message: "Vui lòng chọn trình độ !" },
                  ]}
                >
                  <Select placeholder="Chọn một level" options={LEVEL_LIST} />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  label="Active"
                  name="isActive"
                >
                  <Switch value={isActive} onChange={onChangeSwitch} />;
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" gutter={[16, 16]}>
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
                  <ReactQuill theme="snow" value={value} onChange={setValue} style={{height: '300px'}}/>
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
