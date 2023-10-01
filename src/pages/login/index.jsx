import { Button, Form, Input, Divider, message, notification, Space } from 'antd';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {

    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    const onFinish = async (values) => {
        const { email, password } = values;
        setIsSubmit(true);
        let data = { username: email, password }
        const res = await callLogin(data);
        setIsSubmit(false);
        if (res?.data) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            localStorage.setItem('access_token', res.data.access_token);
            console.log(res.data.user);
            dispatch(doLoginAction(res.data.user));
            message.success("Đăng nhập thành công");
            window.location.href = callback ? callback : '/';
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: 
                  res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };
    

    return ( 
        <div style={{ padding: "50px" }}>
            <h3 style={{ textAlign: "center" }}>ĐĂNG NHẬP</h3>
            <Divider />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: "0 auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email !' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu !' }]}
                >
                <Input.Password />
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng nhập
                </Button>
                </Form.Item>
            </Form>
            <Space style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: "30px"}}>
                <span>Bạn chưa có tài khoản ?</span>
                <NavLink to='/register'>Tạo tài khoản</NavLink>
            </Space>
        </div>
     );
}
 
export default LoginPage;