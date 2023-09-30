import { Card, Col, Row, Space } from "antd";
import DashboardCard from "./dashboardCard";
import LineChartExample from "./lineChart";
import { UserOutlined, BankOutlined, ScheduleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { callCountCV, callCountCompany, callCountJob, callCountUser } from "../../../services/api";

const DashboardAdminPage = () => {

    const [countUser, setCountUser] = useState(0);
    const [countCompany, setCountCompany] = useState(0);
    const [countJob, setCountJob] = useState(0);
    const [countCV, setCountCV] = useState(0);

    const fetchCountUser = async () => {
        const res = await callCountUser();
        if (res && res.data) {
            setCountUser(res.data);
        }
    }

    const fetchCountCompany = async () => {
        const res = await callCountCompany();
        if (res && res.data) {
            setCountCompany(res.data);
        }
    }

    const fetchCountJob = async () => {
        const res = await callCountJob();
        if (res && res.data) {
            setCountJob(res.data);
        }
    }

    const fetchCountCV = async () => {
        const res = await callCountCV();
        if (res && res.data) {
            setCountCV(res.data);
        }
    }

    useEffect(() => {
        fetchCountUser();
        fetchCountCompany();
        fetchCountJob();
        fetchCountCV();
    }, [])

    let data = [
        { name: "Người dùng", sl: countUser },
        { name: "Công ty", sl: countCompany },
        { name: "Job", sl: countJob },
        { name: "CV", sl: countCV },
    ];

    return ( 
        <div>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <DashboardCard icon={<UserOutlined style={{fontSize: 30}}/>} title={"Người dùng"} value={countUser} />
                </Col>
                <Col span={6}>
                    <DashboardCard icon={<BankOutlined style={{fontSize: 30}}/>} title={"Công ty"} value={countCompany} />
                </Col>
                <Col span={6}>
                    <DashboardCard icon={<ScheduleOutlined style={{fontSize: 30}}/>} title={"Job"} value={countJob} />
                </Col>
                <Col span={6}>
                    <DashboardCard icon={<FileTextOutlined style={{fontSize: 30}}/>} title={"CV"} value={countCV} />
                </Col>
            </Row>
            <LineChartExample data={ data } />
        </div>
     );
}
 
export default DashboardAdminPage;