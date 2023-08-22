import './card.scss'
import { useEffect, useState } from "react";
import { callFetchJobs } from "../../services/api";
import { Card, Col, Pagination, Row, Spin } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { convertSlug } from '../../config/utils';
import { useNavigate } from 'react-router-dom';
dayjs.extend(relativeTime)

const JobCard = (props) => {
    const { showPagination } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [displayJob, setDisplayJob] = useState([]);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const navigate = useNavigate();
    
    const fetchDisplayJobs = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchJobs(query);
        setIsLoading(false)
        if (res?.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total)
        }
    }

    useEffect(() => {
        fetchDisplayJobs()
    }, [current, pageSize, filter, sortQuery])

    const handleViewJob = (item) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item._id}`);
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
        <div className='job-section'>
            <div className="job-content">
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <h2>Công việc mới nhất</h2>
                        </Col>
                        {
                            displayJob.map((item, index) => (
                                <Col span={24} md={12} key={index}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewJob(item)}
                                    >
                                        <div className="card-job-content" >
                                            <div className='card-job-left'>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${item?.company.logo}`}
                                                />
                                            </div>
                                            <div className="card-job-right">
                                                <h4 className='title'>{item?.name}</h4>
                                                <div className='location'>
                                                    <EnvironmentOutlined style={{ color: '#58aaab' }}/>
                                                    <p>{item.location}</p>
                                                </div>
                                                <div className='salary'>
                                                    <ThunderboltOutlined style={{ color: 'orange' }}/>
                                                    <p>{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</p>
                                                </div>
                                                <div className='job-updatedAt'>
                                                    <p>{(item.updatedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
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
 
export default JobCard;