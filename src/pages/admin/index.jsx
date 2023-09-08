import React, { useState } from "react";
import {
  AppstoreOutlined,
  BankOutlined,
  UserOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  ApiOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const { Content, Sider } = Layout;

const AdminPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      key: "1",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
      link: "/admin",
    },
    {
      key: "2",
      icon: <BankOutlined />,
      label: "Module Company",
      link: "/admin/company",
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Module User",
      link: "/admin/user",
    },
    {
      key: "4",
      icon: <ScheduleOutlined />,
      label: "Module Job",
      link: "/admin/job",
    },
    {
      key: 5,
      icon: <FileTextOutlined />,
      label: "Module Resume",
      link: "/admin/resume",
    },
    {
      key: 6,
      icon: <ApiOutlined />,
      label: "Module Permission",
      link: "/admin/permission",
    },
    {
      key: 7,
      icon: <FileDoneOutlined />,
      label: "Module Role",
      link: "/admin/role",
    },
  ];

  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("1");

  const handleMenuItemClick = (key, link) => {
    setActiveMenu(key);
    navigate(link);
  };

  return (
    <>
      <Header />
      <Layout>
        <Sider
          theme="light"
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[activeMenu]}
            onClick={(e) => setActiveMenu(e.key)}
          >
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleMenuItemClick(item.key, item.link)}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </>
  );
};

export default AdminPage;
