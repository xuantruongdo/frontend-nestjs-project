import { FaReact } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.scss'
import { ConfigProvider, Dropdown, Menu, Space, message } from 'antd';
import { TwitterOutlined, CodeOutlined, RiseOutlined, ContactsOutlined, DashOutlined, LogoutOutlined  } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callLogout } from '../../services/api';
import { doLogoutAction } from '../../redux/account/accountSlice';
import ModalManageAccount from './modalManageAccount';

const items = [
    {
        label: <Link to="/">Trang Chủ</Link>,
        key: '/',
        icon: <TwitterOutlined />,
    },
    {
        label: <Link to={'/job'}>Việc Làm IT</Link>,
        key: '/job',
        icon: <CodeOutlined />,
    },
    {
        label: <Link to={'/company'}>Top Công ty IT</Link>,
        key: '/company',
        icon: <RiseOutlined />,
    }
];

const Header = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState('home');
    const location = useLocation();
    const dispatch = useDispatch();

    const [openManageAccount, setOpenManageAccount] = useState(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const user = useSelector((state) => state.account.user);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(doLogoutAction());
            message.success('Đăng xuất thành công');
        }
        navigate('/')
    }

    let itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    if (user?.role.name !== "NORMAL_USER") {
        itemsDropdown.splice(1, 0, { // Chèn mục mới vào vị trí thứ 1 (sau mục đầu tiên)
            label: (
                <Link to="/admin">
                    Trang Quản Trị
                </Link>
            ),
            key: 'admin',
            icon: <DashOutlined />,
        });
    }

    return ( 
        <header>
            <div className="container">
                <div style={{ display: "flex", gap: 30 }}>
                    <div className="logo">
                        <FaReact onClick={() => navigate("/")} title="CRIS ITVIEC"/>
                    </div>
                    <div className="top-menu">
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#fff',
                                colorBgContainer: '#222831',
                                colorText: '#a7a7a7',
                                },
                        }}
                    >
                            <Menu
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={items}
                        />  
                        </ConfigProvider>
                        <div className="extra">
                            {isAuthenticated === false ?
                            <Link to={'/login'}>Đăng Nhập</Link>
                                :
                                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                    <Space style={{ cursor: "pointer", color: 'white' }}>
                                        <span>Welcome {user?.email}</span>
                                    </Space>
                                </Dropdown>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ModalManageAccount openManageAccount={openManageAccount} setOpenManageAccount={ setOpenManageAccount } />
        </header>
     );
}
 
export default Header;