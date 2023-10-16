import { useEffect, useState } from "react";
import { callDeleteJob, callFetchJobs } from "../../../services/api";
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
  Space,
  Table,
  message,
  notification,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment/moment";
import ModalCreate from "./modelCreate";
import ModalUpdate from "./modalUpdate";
import { LEVEL_LIST, LOCATION_LIST, SKILLS_LIST } from "../../../config/sample";

const JobAdminPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayJob, setDisplayJob] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});

  const fetchDisplayJobs = async (filter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchJobs(query);
    setLoading(false);
    if (res?.data) {
      setDisplayJob(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  useEffect(() => {
    fetchDisplayJobs();
  }, [current, pageSize, filter, sortQuery]);

  const reload = () => {
    fetchDisplayJobs();
    form.resetFields();
    setFilter("");
    setSortQuery("sort=-updatedAt");
  }

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách công việc</span>
        <div
          className="render-header-right"
          style={{
            display: "flex",
            gap: 15,
          }}
        >
          <Button>Export</Button>
          <Button>Import</Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
          >
            Thêm mới
          </Button>
          <Button
            type="ghost"
            onClick={reload}
          >
            <ReloadOutlined />
          </Button>
        </div>
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
      title: "Tên",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      sorter: true,
      render: (text, record, index) => {
        return <p>{record?.company?.name}</p>;
      },
    },
    {
      title: "Logo",
      dataIndex: "company",
      render: (text, record, index) => {
        return (
          <img
            style={{ width: "150px" }}
            alt="Logo"
            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
              record?.company?.logo
            }`}
          />
        );
      },
    },
    {
      title: "Level",
      dataIndex: "level",
      sorter: true,
    },
    {
      title: "Create At",
      dataIndex: "createdAt",
      sorter: true,
      render: (text, record, index) => {
        return <p>{moment(record?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>;
      },
    },
    {
      title: "Action",
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm
              placement="leftTop"
              title={"Xác nhận xóa job"}
              description={"Bạn có chắc xóa job này?"}
              onConfirm={() => handleDeleteJob(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteOutlined style={{ color: "#ff4d4f" }} />
              </span>
            </Popconfirm>

            <span
              style={{ cursor: "pointer", margin: "0 20px" }}
              onClick={() => showModalUpdate(record)}
            >
              <EditOutlined style={{ color: "#f57800" }} />
            </span>
          </div>
        );
      },
    },
  ];

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

  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleDeleteJob = async (id) => {
    const res = await callDeleteJob(id);
    if (res && res.data) {
      message.success("Xóa job thành công !");
      fetchDisplayJobs();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
  };

  const showModalUpdate = (record) => {
    setOpenModalUpdate(true);
    setDataUpdate(record);
  };

  const onFinish = (values) => {
    let query = "";
    if (values.skills) {
      query += `&skills=/${values.skills}/i`;
    }
    if (values.location) {
      query += `&location=/${values.location}/i`;
    }
    if (values.level) {
      query += `&level=/${values.level}/i`;
    }
    if (query) {
      handleSearch(query);
    }
  };

  const handleSearch = (filter) => {
    fetchDisplayJobs(filter);
  };
  const handleClear = () => {
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={form}
        name="form-filter"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={[20, 20]}>
          <Col xs={12} md={6}>
            <Form.Item label="Kĩ năng" name="skills">
              <Select
                allowClear
                placeholder="Chọn kĩ năng"
                options={SKILLS_LIST}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Địa điểm" name="location">
              <Select
                allowClear
                placeholder="Chọn địa điểm"
                options={LOCATION_LIST}
              />
            </Form.Item>
          </Col>
          <Col xs={12} md={6}>
            <Form.Item label="Trình độ" name="level">
              <Select
                allowClear
                placeholder="Chọn trình độ"
                options={LEVEL_LIST}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
            <Button style={{ marginLeft: "10px" }} onClick={handleClear}>
              Clear
            </Button>
          </Col>
          <Col xs={24} sm={0}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setOpenModalCreate(true)}
            >
              Thêm mới
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        title={renderHeader}
        loading={loading}
        columns={columns}
        dataSource={displayJob}
        onChange={onChange}
        scroll={{x: true}}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                Từ {range[0]} - {range[1]} / {total} hàng dữ liệu
              </div>
            );
          },
        }}
      />
      <Drawer
        title="Chi tiết công việc"
        placement="right"
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Descriptions title="Thông tin công ty" bordered column={1}>
          <Descriptions.Item label="ID">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên công ty">
            {dataViewDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Level">
            {dataViewDetail?.level}
          </Descriptions.Item>
          <Descriptions.Item label="Mức lương">
            &nbsp;
            {(dataViewDetail?.salary + "")?.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )}{" "}
            đ
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {dataViewDetail?.location}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo bởi">
            {dataViewDetail?.createdBy?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tuyển">
            {moment(dataViewDetail?.startDate).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Hạn tuyển">
            {moment(dataViewDetail?.endDate).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
      <ModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayJobs={fetchDisplayJobs}
      />
      <ModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        fetchDisplayJobs={fetchDisplayJobs}
        dataUpdate={dataUpdate}
      />
    </div>
  );
};

export default JobAdminPage;
