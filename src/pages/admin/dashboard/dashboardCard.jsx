import { Card, Space, Statistic } from "antd";


const DashboardCard = ({icon, title, value}) => {
    return ( 
        <Card >
        <Space direction="horizontal" style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {icon}
          <Statistic title={title} value={value} />
        </Space>
      </Card>
     );
}
 
export default DashboardCard;