import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  message,
  notification,
} from "antd";
import "../admin.scss";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { callDeleteCompany, callFetchCompanies } from "../../../services/api";
import ModalCreate from "./modalCreate";
import ModalUpdate from "./modalUpdate";

const CompanyAdminPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayCompany, setDisplayCompany] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  const [dataViewUpdate, setDataViewUpdate] = useState({});

  const fetchDisplayCompanies = async (filter) => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchCompanies(query);
    setLoading(false);
    if (res?.data) {
      setDisplayCompany(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  useEffect(() => {
    fetchDisplayCompanies();
  }, [current, pageSize, filter, sortQuery]);

  const handleDeleteCompany = async (id) => {
    setLoading(true);
    const res = await callDeleteCompany(id);
    if (res && res.data) {
      setLoading(false);
      message.success("Thêm mới công ty thành công");
      fetchDisplayCompanies();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
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

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách công ty</span>
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
            onClick={showModalCreate}
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
      title: "Logo",
      dataIndex: "logo",
      render: (text, record, index) => {
        return (
          <img
            style={{ width: "150px" }}
            alt="Logo"
            src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${
              record?.logo
            }`}
          />
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: true,
      width: 300,
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
              title={"Xác nhận xóa công ty"}
              description={"Bạn có chắc xóa công ty này?"}
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

  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showModalCreate = () => {
    setOpenModalCreate(true);
  };

  const showModalUpdate = (record) => {
    setOpenModalUpdate(true);
    setDataViewUpdate(record);
  };

  const onFinish = (values) => {
    let query = "";
    if (values.name) {
      query += `&name=/${values.name}/i`;
    }
    if (query) {
      handleSearch(query);
    }
  };

  const handleSearch = (filter) => {
    fetchDisplayCompanies(filter);
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
          <Col xs={18} md={12}>
            <Form.Item
              label="Tên công ty"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên công ty !" },
              ]}
            >
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
              onClick={showModalCreate}
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
        dataSource={displayCompany}
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
        title="Chi tiết công ty"
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
          <Descriptions.Item label="Địa chỉ">
            {dataViewDetail?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Tạo bởi">
            {dataViewDetail?.createdBy?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(dataViewDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
      <ModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayCompanies={fetchDisplayCompanies}
      />
      <ModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        fetchDisplayCompanies={fetchDisplayCompanies}
        dataViewUpdate={dataViewUpdate}
      />
    </div>
  );
};

export default CompanyAdminPage;
