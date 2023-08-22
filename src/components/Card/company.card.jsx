import './card.scss'
import { Card, Col, Pagination, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { callFetchCompanies } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { convertSlug } from '../../config/utils';

const CompanyCard = (props) => {
    const { showPagination } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(4);
    const [displayCompany, setDisplayCompany] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const navigate = useNavigate();
    
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
            setTotal(res.data.meta.total);
        }
    }

    useEffect(() => {
        fetchDisplayCompanies()
    }, [current, pageSize, filter, sortQuery])

    const handleViewCompany = (item) => {
        const slug = convertSlug(item.name);
        navigate(`/company/${slug}?id=${item._id}`);
    }

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }
    return ( 
        <div className='company-section'>
            <div className="company-content">
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <h2>TOP Công ty IT</h2>
                        </Col>
                        {
                            displayCompany.map((item, index) => (
                                <Col span={24} md={6} key={index}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        onClick={() => handleViewCompany(item)}
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
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}
                </Spin>
            </div>
        </div>
     );
}
 
export default CompanyCard;