import './card.scss'
import { Card, Col, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchCompanies } from '../../services/api';

const CompanyCard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [displayCompany, setDisplayCompany] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    
    const fetchDisplayCompanies = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchCompanies(query);
        setIsLoading(false)
        if (res?.data) {
            setDisplayCompany(res.data.result);
        }
    }

    useEffect(() => {
        fetchDisplayCompanies()
    }, [current, pageSize, filter, sortQuery])
    return ( 
        <div className='company-section'>
            <div className="company-content">
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        {
                            displayCompany.map((item, index) => (
                                <Col span={24} md={6} key={index}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={
                                            <div className="card-customize" >
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.logo}`}
                                                />
                                            </div>
                                        }
                                    >
                                                                            
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </Spin>
            </div>
        </div>
     );
}
 
export default CompanyCard;