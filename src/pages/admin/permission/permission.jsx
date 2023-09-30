import "./permission.scss";
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
import { useEffect, useState } from "react";
import {
  callDeletePermission,
  callFetchPermissionsPaginnate,
} from "../../../services/api";
import ModalCreate from "./modalCreate";
import ModalUpdate from "./modalUpdate";
import { METHOD_LIST, MODULE_LIST } from "../../../config/sample";

const PermissionAdminPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayPermission, setDisplayPermission] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [dataViewUpdate, setDataViewUpdate] = useState({});
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách permission</span>
        <span style={{ display: "flex", gap: 15 }}>
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
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "API Path",
      dataIndex: "apiPath",
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      sorter: true,
      render: (text, record, index) => {
        return <p className={`method ${record?.method}`}>{record?.method}</p>;
      },
    },
    {
      title: "Module",
      dataIndex: "module",
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
              title={"Xác nhận xóa permission"}
              description={"Bạn có chắc xóa permission này?"}
              onConfirm={() => handleDeleteCompany(record._id)}
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

  const handleDeleteCompany = async (id) => {
    setLoading(true);
    const res = await callDeletePermission(id);
    if (res && res.data) {
      message.success("Xóa permission thành công");
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
  const showModalUpdate = (record) => {
    setOpenModalUpdate(true);
    setDataViewUpdate(record);
  };
  const fetchDisplayPermissions = async (filter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchPermissionsPaginnate(query);
    if (res?.data) {
      setDisplayPermission(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDisplayPermissions();
  }, [current, pageSize, filter, sortQuery]);
  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const onClose = () => {
    setOpen(false);
  };
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
  const onFinish = (values) => {
    let query = "";
    if (values.name) {
      query += `&name=/${values.name}/i`;
    }
    if (values.method) {
      query += `&method=/${values.method}/i`;
    }
    if (values.module) {
      query += `&module=/${values.module}/i`;
    }
    if (query) {
      handleSearch(query);
    }
  };

  const handleSearch = (filter) => {
    fetchDisplayPermissions(filter);
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
        <Row gutter={[16, 16]} justify="space-arround">
          <Col span={6}>
            <Form.Item label="Tên" name="name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phương thức" name="method">
              <Select
                allowClear
                placeholder="Chọn phương thức"
                options={METHOD_LIST}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Module" name="module">
              <Select
                allowClear
                placeholder="Chọn module"
                options={MODULE_LIST}
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
        dataSource={displayPermission}
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
        title="Chi tiết permission"
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
        <Descriptions title="Thông tin permission" bordered column={1}>
          <Descriptions.Item label="ID">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên permission">
            {dataViewDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label="API">
            {dataViewDetail?.apiPath}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức">
            {dataViewDetail?.method}
          </Descriptions.Item>
          <Descriptions.Item label="Module">
            {dataViewDetail?.module}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
      <ModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayPermissions={fetchDisplayPermissions}
      />
      <ModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        fetchDisplayPermissions={fetchDisplayPermissions}
        dataViewUpdate={dataViewUpdate}
      />
    </div>
  );
};

export default PermissionAdminPage;
