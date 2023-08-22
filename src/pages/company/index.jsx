import './companyList.scss'
import { Col, Row } from 'antd';
import { useState } from 'react';
import CompanyCard from '../../components/Card/company.card';

const CompanyPage = () => {
    const [showPagination, setShowPagination] = useState(true);
    return ( 
        <div className="company-list container">
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <CompanyCard showPagination={showPagination} />
                </Col>
            </Row>
        </div>
     );
}
 
export default CompanyPage;