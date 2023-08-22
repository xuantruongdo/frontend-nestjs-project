import { useEffect, useState } from 'react';
import './companyDetail.scss';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import { callFetchCompanyById } from '../../services/api';

const company = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let id = params?.get("id")

    const [company, setCompany] = useState({});

    const fetchCompanyById = async () => {
        const res = await callFetchCompanyById(id);
        if (res?.data?._id) {
            setCompany(res.data);
        }
    }

    useEffect(() => {
        fetchCompanyById();
    }, [id])

    return ( 
        <div className="container detail-company-section">
            <Row gutter={[20, 20]}>

                <Col span={24} md={16}>
                    <div className="header">
                        <h2>{company.name}</h2>
                    </div>

                    <div className="location">
                        <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(company?.address)}
                    </div>

                    <Divider />
                    {parse(company?.description ?? "")}
                </Col>
                <Col span={24} md={8}>
                    <div className="company">
                        <div>
                            <img
                                alt="example"
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${company?.logo}`}
                            />
                        </div>
                        <div className='name'>
                            {company?.name}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
     );
}
 
export default company;