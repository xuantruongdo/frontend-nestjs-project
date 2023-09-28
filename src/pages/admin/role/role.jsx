import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Drawer,
  Popconfirm,
  Space,
  Table,
  message,
  notification,
} from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { callDeleteRole, callFetchRoles } from "../../../services/api";
import ModalCreate from "./modalCreate";
import ModalUpdate from "./modalUpdate";

const RoleAdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayRole, setDisplayRole] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const [open, setOpen] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState({});
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);

  const [dataViewUpdate, setDataViewUpdate] = useState({});
  const showModalCreate = () => {
    setOpenModalCreate(true);
  };

  const fetchDisplayRoles = async () => {
    setLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchRoles(query);
    setLoading(false);
    if (res?.data) {
      setDisplayRole(res.data.result);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    fetchDisplayRoles();
  }, [current, pageSize, filter, sortQuery]);
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
  const handleDeleteRole = async (id) => {
    setLoading(true);
    const res = await callDeleteRole(id);
    if (res && res.data) {
      message.success("Xóa role thành công");
      fetchDisplayRoles();
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
    setDataViewUpdate(record)
  }
  const renderHeader = () => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Danh sách permissions</span>
        <span style={{ display: "flex", gap: 15 }}>
          <Button>Export</Button>
          <Button>Import</Button>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={showModalCreate}
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
              title={"Xác nhận xóa role"}
              description={"Bạn có chắc xóa role này?"}
              onConfirm={() => handleDeleteRole(record._id)}
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
  return (
    <div>
      <Table
        title={renderHeader}
        loading={loading}
        columns={columns}
        dataSource={displayRole}
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
      {/* <Drawer
          title="Chi tiết permissions"
          placement='right'
          width={500}
          onClose={onClose}
          open={open}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
            </Space>
          }
        >
          <Descriptions title="Thông tin permissions" bordered column={1}>
            <Descriptions.Item label="ID">
              {dataViewDetail?._id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên permissions">
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
        </Drawer> */}
      {/* <ModalCreate openModalCreate={ openModalCreate } setOpenModalCreate={ setOpenModalCreate } fetchDisplayCompanies={fetchDisplayCompanies} />
        <ModalUpdate openModalUpdate={openModalUpdate} setOpenModalUpdate={setOpenModalUpdate} fetchDisplayCompanies={fetchDisplayCompanies} dataViewUpdate={ dataViewUpdate } /> */}
      <ModalCreate
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        fetchDisplayRoles={fetchDisplayRoles}
      />
      <ModalUpdate
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        dataViewUpdate={dataViewUpdate}
        fetchDisplayRoles={fetchDisplayRoles}
      />
    </div>
  );
};

export default RoleAdminPage;
