import { useEffect, useState } from "react";
import { callFetchUsers } from "../../../services/api";
import { Button, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment/moment";

const UserAdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [displayUser, setDisplayUser] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

  const fetchDisplayUsers = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }
    const res = await callFetchUsers(query);
    setIsLoading(false);
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
        <span>Danh sách công ty</span>
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
          <a
            href="#"
            // onClick={() => showDrawer(record)}
          >
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

  return (
    <div>
      <Table
        title={renderHeader}
        loading={isLoading}
        columns={columns}
        dataSource={displayUser}
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
    </div>
  );
};

export default UserAdminPage;
