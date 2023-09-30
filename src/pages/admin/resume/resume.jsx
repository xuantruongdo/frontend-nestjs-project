import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Table,
  message,
  notification,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import moment from "moment";
import {
  callDeleteResume,
  callFetchResumes,
  callUpdateStatusResume,
} from "../../../services/api";
import { STATUS_LIST } from "../../../config/sample";
const ResumeAdminPage = () => {
  const [form] = Form.useForm();
  const [formSearch] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
  const [displayResume, setDisplayResume] = useState([]);
  const [dataViewDetail, setDataViewDetail] = useState({});

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách CV</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button>Export</Button>
          <Button>Import</Button>
          <Button icon={<PlusOutlined />} type="primary">
            Thêm mới
          </Button>
          <Button
            type="ghost"
            onClick={() => {
              setFilter("");
              setSortQuery("sort=-updatedAt");
            }}
          >
            <ReloadOutlined />
          </Button>
        </span>
      </div>
    );
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a href="#" onClick={() => showDrawer(record)}>
            {record._id}
          </a>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
    },
    {
      title: "Job",
      dataIndex: ["jobId", "name"],
      sorter: true,
    },
    {
      title: "Công ty",
      dataIndex: ["companyId", "logo"],
      render: (text, record, index) => {
        return (
          <img
            style={{ width: "150px" }}
            alt="Logo"
            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
              record?.companyId?.logo
            }`}
          />
        );
      },
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
      render: (text, record, index) => {
        return <p>{moment(record?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa CV"}
              description={"Bạn có chắc xóa CV này?"}
              onConfirm={() => handleDeleteCV(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteOutlined style={{ color: "#ff4d4f" }} />
              </span>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleDeleteCV = async (id) => {
    setLoading(true);
    const res = await callDeleteResume(id);
    if (res && res.data) {
      message.success("Xóa CV thành công");
      fetchDisplayResumes();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
  };

  const fetchDisplayResumes = async (filter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchResumes(query);
    setLoading(false);
    if (res?.data) {
      setDisplayResume(res.data.result);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    fetchDisplayResumes();
  }, [current, pageSize, filter, sortQuery]);
  useEffect(() => {
    const init = {
      _id: dataViewDetail?._id,
      status: dataViewDetail?.status,
    };
    form.setFieldsValue(init);
  }, [dataViewDetail]);
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination?.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination?.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;

      setSortQuery(q);
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const onFinish = async (values) => {
    const { _id, status } = values;
    setLoadingForm(true);
    let data = {
      status,
    };
    const res = await callUpdateStatusResume(_id, data);
    if (res && res.data) {
      message.success("Cập nhập CV thành công");
      setOpen(false);
      fetchDisplayResumes();
      setDataViewDetail({});
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoadingForm(false);
  };

  const handleChangeStatus = () => {
    form.submit();
  };

  const onFinishSearch = (values) => {
    let query = "";
    if (values.status) {
      query += `&status=/${values.status}/i`;
    }
    if (query) {
      handleSearch(query);
    }
  };

  const handleSearch = (filter) => {
    fetchDisplayResumes(filter);
  };
  const handleClear = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={formSearch}
        name="form-filter"
        initialValues={{ remember: true }}
        onFinish={onFinishSearch}
        autoComplete="off"
      >
        <Row gutter={[16, 16]} justify="space-arround">
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select
                allowClear
                placeholder="Chọn trạng thái"
                options={STATUS_LIST}
              />
            </Form.Item>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={handleClear}>
              Clear
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        title={renderHeader}
        loading={loading}
        columns={columns}
        dataSource={displayResume}
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {range[0]} - {range[1]} trên {total} rows
              </div>
            );
          },
        }}
      />
      <Drawer
        title="Chi tiết CV"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Button
            loading={loadingForm}
            type="primary"
            onClick={handleChangeStatus}
          >
            Thay đổi trạng thái
          </Button>
        }
      >
        <Descriptions
          title="Thông tin CV"
          bordered
          column={2}
          layout="vertical"
        >
          <Descriptions.Item label="Tên job">
            {dataViewDetail?.jobId?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Form form={form} onFinish={onFinish}>
              <Col span={0}>
                <Form.Item name={"_id"}>
                  <Input />
                </Form.Item>
              </Col>
              <Form.Item name={"status"}>
                <Select
                  style={{ width: "100%" }}
                  defaultValue={dataViewDetail?.status}
                  options={STATUS_LIST}
                ></Select>
              </Form.Item>
            </Form>
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default ResumeAdminPage;
