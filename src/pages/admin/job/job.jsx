import { useEffect, useState } from "react";
import { callFetchJobs } from "../../../services/api";
import { Button, Descriptions, Drawer, Popconfirm, Space, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment/moment";

const JobAdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayJob, setDisplayJob] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});

  const fetchDisplayJobs = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchJobs(query);
    setIsLoading(false);
    if (res?.data) {
      setDisplayJob(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  useEffect(() => {
    fetchDisplayJobs();
  }, [current, pageSize, filter, sortQuery]);

  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách công việc</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button>Export</Button>
          <Button>Import</Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            // onClick={showModalCreate}
          >
            Thêm mới
          </Button>
          <Button type="ghost">
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
      sorter: true,
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
              title={"Xác nhận xóa người dùng"}
              description={"Bạn có chắc xóa người dùng này?"}
              //   onConfirm={() => handleDeleteUser(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteOutlined style={{ color: "#ff4d4f" }} />
              </span>
            </Popconfirm>

            <span
              style={{ cursor: "pointer", margin: "0 20px" }}
              //   onClick={() => showModalUpdate(record)}
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

  console.log(displayJob);
  const showDrawer = (record) => {
    setOpen(true);
    setDataViewDetail(record);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Table
        title={renderHeader}
        loading={isLoading}
        columns={columns}
        dataSource={displayJob}
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
    </div>
  );
};

export default JobAdminPage;
