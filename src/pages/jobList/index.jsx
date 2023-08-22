import './jobList.scss'
import { Row, Col, Divider } from "antd";
import Search from "../../components/Search";
import JobCard from '../../components/Card/job.card';
import { useState } from 'react';

const JobListPage = () => {
    const [showPagination, setShowPagination] = useState(true);
    return ( 
        <div className="job-list container">
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Search />
                </Col>
                <Divider />
                <Col>
                    <JobCard showPagination={showPagination} />
                </Col>
            </Row>
        </div>
     );
}
 
export default JobListPage;