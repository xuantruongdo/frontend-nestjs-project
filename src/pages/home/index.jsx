import { Col, Row, Form, Select, Button, Divider } from "antd";
import CompanyCard from "../../components/Card/company.card";
import JobCard from "../../components/Card/job.card";
import { LOCATION_LIST, SKILLS_LIST } from "../../config/sample";
import { useState } from "react";

const HomePage = () => {
  const [showPagination, setShowPagination] = useState(false);
  const optionsSkills = SKILLS_LIST;
  const optionsLocations = LOCATION_LIST;
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const onFinish = (values) => { 
    let searchStr = "";
    if (values.skills) {
      searchStr += `&skills=${values.skills.join(",")}`;
    }
    if (values.location) {
      searchStr += `&location=${values.location.join(",")}`;
    }
    if (searchStr) {
      setSearch(searchStr);
      setShowPagination(true);
    }
  }
  return (
    <div className="container" style={{ marginTop: 30 }}>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <h2>Việc làm IT Cho Developer</h2>
          </Col>
          <Col span={24} xs={24} md={12}>
            <Form.Item label="Skills" name="skills">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn kĩ năng"
                options={optionsSkills}
              />
            </Form.Item>
          </Col>
          <Col span={12} xs={24} md={8}>
            <Form.Item label="Location" name="location">
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn địa điểm"
                options={optionsLocations}
              />
            </Form.Item>
          </Col>
          <Col span={12} xs={24} md={4}>
            <Button type="primary" onClick={() => form.submit()}>
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
      <Divider />
      <JobCard search={search} showPagination={ showPagination } />
      <Divider />
      <CompanyCard/>
    </div>
  );
};

export default HomePage;
