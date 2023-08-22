import { Col, Row, Form, Select, Button } from "antd";
import { LOCATION_LIST, SKILLS_LIST } from "../../config/sample";

const Search = () => {
    const optionsSkills = SKILLS_LIST;
    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();
  
      const onFinish = (values) => {
          console.log(values);
      }
      const handleChange = (value) => {
          console.log(`selected ${value}`);
        };
        
    return ( 
        <Form
        form={form}
        onFinish={onFinish}
      //   submitter={
      //     {
      //         render: () => <></>
      //     }
      // }
      >
        <Row gutter={[20, 20]}>
            <Col span={24}>
              <h2>Việc làm IT Cho Developer</h2>
            </Col>
            <Col span={24} xs={24} md={12}>
              <Form.Item
                label="Skills"
                name="skills"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn kĩ năng"
                options={optionsSkills}
                />
              </Form.Item>
          </Col>
          <Col span={12} xs={24} md={8}>
              <Form.Item
                label="Location"
                name="location"
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn địa điểm"
                  options={optionsLocations}
                />
              </Form.Item>
          </Col>
          <Col span={12} xs={24} md={4}>
                  <Button type='primary' onClick={() => form.submit()}>Search</Button>
              </Col>
        </Row>
      </Form>
     );
}
 
export default Search;