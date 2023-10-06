import { useEffect, useState } from "react";
import {
  callDeleteUser,
  callFetchAllCompanies,
  callFetchAllRoles,
  callFetchUsers,
} from "../../../services/api";
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
import ModalCreate from "./modalCreate";
import ModalUpdate from "./modalUpdate";

const UserAdminPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayUser, setDisplayUser] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [dataViewUpdate, setDataViewUpdate] = useState({});

  const [roles, setRoles] = useState([]);
  const [companies, setCompanies] = useState([]);

  const fetchDisplayUsers = async (filter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchUsers(query);
    setLoading(false);
    if (res?.data) {
      setDisplayUser(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  useEffect(() => {
    fetchDisplayUsers();
  }, [current, pageSize, filter, sortQuery]);

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách người dùng</span> 
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
            onClick={() => {
              setFilter("");
              setSortQuery("sort=-updatedAt");
            }}
          >
            <ReloadOutlined />
          </Button>
        </div>
      </div>
    );
  };

  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    setLoading(true);
    if (res && res.data) {
      message.success("Xóa user thành công");
      fetchDisplayUsers();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setLoading(false);
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
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Tên",
      dataIndex: "fullname",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
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
              title={"Xác nhận xóa người dùng"}
              description={"Bạn có chắc xóa người dùng này?"}
              onConfirm={() => handleDeleteUser(record._id)}
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
  const showModalUpdate = (record) => {
    setOpenModalUpdate(true);
    setDataViewUpdate(record);
  };

  const showDrawer = (record) => {
    setDataViewDetail(record);
    setOpen(true);
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

  const fetchAllRoles = async () => {
    const res = await callFetchAllRoles();
    if (res && res.data) {
      setRoles(res.data.result);
    }
  };
  const fetchAllCompanies = async () => {
    const res = await callFetchAllCompanies();
    if (res && res.data) {
      setCompanies(res.data.result);
    }
  };
  useEffect(() => {
    fetchAllRoles();
    fetchAllCompanies();
  }, []);

  const onFinish = (values) => {
    console.log(values);
    let query = "";
    if (values.email) {
      query += `&email=/${values.email}/i`;
    }
    if (values.fullname) {
      query += `&fullname=/${values.fullname}/i`;
    }
    if (query) {
      handleSearch(query);
    }
  };

  const handleSearch = (filter) => {
    fetchDisplayUsers(filter);
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
          <Col xs={24} md={6}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Tên hiển thị" name="fullname">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
        dataSource={displayUser}
        onChange={onChange}
        scroll={{ x: true }}
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
        title="Chi tiết người dùng"
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
        <Descriptions title="Thông tin người dùng" bordered column={1}>
          <Descriptions.Item label="ID">
            {dataViewDetail?._id}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {dataViewDetail?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">
            {dataViewDetail?.fullname}
          </Descriptions.Item>
          <Descriptions.Item label="Tuổi">
            {dataViewDetail?.age}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {dataViewDetail?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {dataViewDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {dataViewDetail?.role?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Thuộc công ty">
            {dataViewDetail?.company?.name}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
      <ModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayUsers={fetchDisplayUsers}
        roles={roles}
        companies={companies}
      />
      <ModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        fetchDisplayUsers={fetchDisplayUsers}
        dataViewUpdate={dataViewUpdate}
        roles={roles}
        companies={companies}
      />
    </div>
  );
};

export default UserAdminPage;
