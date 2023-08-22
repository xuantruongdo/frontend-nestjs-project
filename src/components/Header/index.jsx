import { FaReact } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './header.scss'
import { ConfigProvider, Menu } from 'antd';
import { TwitterOutlined, CodeOutlined, RiseOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])
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
                            <Link to={'/login'}>Đăng Nhập</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
     );
}
 
export default Header;