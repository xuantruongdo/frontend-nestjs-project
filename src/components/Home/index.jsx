import { Divider } from "antd";
import Search from "../Search";
import CompanyCard from "../Card/company.card";
import JobCard from "../Card/job.card";


const HomePage = () => {

    return ( 
      <div className="container" style={{ marginTop: 30 }}>
        <Search/>
        <Divider />
        <CompanyCard />
        <Divider />
        <JobCard/>
      </div>
     );
}
 
export default HomePage;