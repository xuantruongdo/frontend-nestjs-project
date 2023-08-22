import './jobDetail.scss';
import { useLocation } from "react-router-dom";
import { callFetchJobById } from "../../services/api";
import { useEffect, useState } from "react";
import { Col, Divider, Modal, Row, Tag } from 'antd';
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

const JobDetailPage = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    let id = params?.get("id")

    const [job, setJob] = useState({})

    const fetchJobById = async () => {
        const res = await callFetchJobById(id);
        if (res?.data?._id) {
            setJob(res.data)
        }
    }

    useEffect(() => {
        fetchJobById()
    }, [id])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return ( 
        <div className="container detail-job-section">
            {
                job && job._id &&
                <Row gutter={[20, 20]}>
                    <Col span={24} md={16}>
                        <div className='header'>
                            <h2>{ job.name }</h2>        
                            <button onClick={showModal}>APPLY NOW</button>
                            </div>
                            <Divider />
                            <div className='content'>
                                <div className='skills'>
                                    {
                                        job?.skills && 
                                        job?.skills.map((item, index) => (
                                            <Tag color='gold' key={index}>{ item }</Tag>
                                        ))
                                    }
                                </div>
                                <div className='salary'>
                                    <DollarOutlined />
                                    <span>&nbsp;{(job.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                                </div>
                                <div className='location'>
                                    <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{job.location}
                                </div>
                                <div>
                                    <HistoryOutlined /> {job.updatedAt}
                                </div>
                                <Divider />
                                {parse(job.description)}
                            </div>
                    </Col>
                    <Col span={24} md={8}>
                            <div className='company'>
                            <img
                                alt="example"
                                src={`${import.meta.env.VITE_BACKEND_URL}/images/company/${job.company?.logo}`}
                                />
                            <div className='name'>
                                {job.company?.name}
                            </div>
                            </div>
                    </Col>
                    
                </Row>
            }
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
        </div>
     );
}
 
export default JobDetailPage;