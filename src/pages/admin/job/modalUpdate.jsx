import {
  Card,
  Col,
  ConfigProvider,
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
  callFetchCompanies,
  callFetchCompanyById,
  callUpdateJob,
} from "../../../services/api";
import locale from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const ModalUpdate = (props) => {
  const { openModalUpdate, setOpenModalUpdate, fetchDisplayJobs, dataUpdate } =
    props;
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isActive, setIsActive] = useState(null);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fetchDisplayCompanies = async () => {
    let query = "";

    const res = await callFetchCompanies(query);
    if (res?.data) {
      setCompanies(
        res.data.result.map((item) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        })
      );
    }
  };

  useEffect(() => {
    fetchDisplayCompanies();
  }, []);
  useEffect(() => {
    let formattedStartDate = dayjs(dataUpdate?.startDate).format("YYYY-MM-DD");
    let formattedEndDate = dayjs(dataUpdate?.endDate).format("YYYY-MM-DD");
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setDescription(dataUpdate?.description);
    setIsActive(dataUpdate?.isActive);
    const init = {
      _id: dataUpdate?._id,
      name: dataUpdate?.name,
      company: dataUpdate?.company?._id,
      location: dataUpdate?.location,
      salary: dataUpdate?.salary,
      quantity: dataUpdate?.quantity,
      skills: dataUpdate?.skills,
      level: dataUpdate?.level,
      startDate: startDate,
      endDate: endDate,
    };

    form.setFieldsValue(init);
  }, [dataUpdate, form]);

  const handleCancel = () => {
    setOpenModalUpdate(false);
  };

  const onChangeSwitch = (checked) => {
    setIsActive(checked);
  };

  const onFinish = async (values) => {
    const { _id, name, company, location, salary, quantity, skills, level } =
      values;
    let convertStartDate = dayjs(
      dayjs(startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    );
    let convertEndDate = dayjs(
      dayjs(endDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
    );

    setLoading(true);
    if (
      convertStartDate &&
      convertEndDate &&
      convertStartDate.isBefore(convertEndDate)
    ) {
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
          location,
          salary,
          quantity,
          startDate: convertStartDate,
          endDate: convertEndDate,
          level,
          description: description,
          isActive: isActive,
        };

        const res = await callUpdateJob(_id, data);
        if (res && res.data) {
          message.success("Cập nhật job thành công !");
          setOpenModalUpdate(false);
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
      className="modal-custom-width"
      title="Cập nhật job"
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
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ remember: true }}
      >
        <Row justify="space-between" gutter={[16, 16]}>
          <Col span={0}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="ID"
              name="_id"
              rules={[{ required: true, message: "Vui lòng nhập tên ID !" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Thuộc công ty"
              name="company"
              rules={[{ required: true, message: "Vui lòng chọn kĩ năng !" }]}
            >
              <Select
                showSearch
                allowClear
                placeholder="Chọn công ty"
                options={companies}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Địa điểm"
              name="location"
              rules={[{ required: true, message: "Vui lòng chọn địa điểm !" }]}
            >
              <Select placeholder="Chọn một địa điểm" options={LOCATION_LIST} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Số lượng"
              name="quantity"
              rules={[{ required: true, message: "Vui lòng chọn số lượng !" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
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
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Ngày tuyển"
              name="startDate"
              rules={[
                { required: true, message: "Vui lòng chọn ngày tuyển !" },
              ]}
            >
              <ConfigProvider locale={locale}>
                <DatePicker
                  value={dayjs(startDate, "YYYY-MM-DD")}
                  onChange={(date) => setStartDate(date.format("YYYY-MM-DD"))}
                />
              </ConfigProvider>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
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
              <ConfigProvider locale={locale}>
                <DatePicker
                  value={dayjs(endDate, "YYYY-MM-DD")}
                  onChange={(date) => setEndDate(date.format("YYYY-MM-DD"))}
                />
              </ConfigProvider>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Trình độ"
              name="level"
              rules={[{ required: true, message: "Vui lòng chọn trình độ !" }]}
            >
              <Select placeholder="Chọn một level" options={LEVEL_LIST} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Active"
              name="isActive"
            >
              <Switch checked={isActive} onChange={onChangeSwitch} />;
            </Form.Item>
          </Col>
          <Col span={24} style={{marginBottom: 50}}>
            <Form.Item
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label="Mô tả"
              name="description"
            >
              <Card
                style={{ marginBottom: 20 }}
                headerBordered
                size="small"
                bordered
              >
                <Col span={24}>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    style={{ height: "300px" }}
                  />
                </Col>
              </Card>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
