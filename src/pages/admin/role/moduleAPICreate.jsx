import "./moduleAPI.scss";
import { Card, Col, Collapse, Form, Row, Switch, Tooltip } from "antd";
import { useEffect, useState } from "react"; // Import useState

const { Panel } = Collapse;
const ModuleAPICreate = (props) => {
  const { form, permissions, permissionsRole, setSelectedIds } = props;

  // State to track the checked state of individual switches for each module
  const [checkedSwitches, setCheckedSwitches] = useState({});

  const handleSingleCheck = (v, id, module) => {
    // Update the state when an individual switch is checked or unchecked
    setCheckedSwitches({
      ...checkedSwitches,
      [`${module}_${id}`]: v,
    });
  };

  const handleSwitchAll = (v, module) => {
    // Update the state for all switches in the same module
    const updatedSwitches = {};
    permissions.forEach((item) => {
      if (item.module === module && item.permissions) {
        item.permissions.forEach((value) => {
          updatedSwitches[`${module}_${value._id}`] = v;
        });
      }
    });

    setCheckedSwitches({
      ...checkedSwitches,
      ...updatedSwitches,
    });
  };

  useEffect(() => {
    const newSelectedIds = [];
    permissions.forEach((item) => {
      if (item.permissions) {
        item.permissions.forEach((value) => {
          if (checkedSwitches[`${item.module}_${value._id}`]) {
            newSelectedIds.push(value._id);
          }
        });
      }
    });
    setSelectedIds(newSelectedIds);
  }, [checkedSwitches, permissions]);

  return (
    <Collapse accordion>
      {permissions.map((item, index) => (
        <Panel
          header={item.module}
          key={index}
          extra={
            <div>
              <Switch
                defaultChecked={false}
                onChange={(v) => handleSwitchAll(v, item.module)}
              />
            </div>
          }
        >
          <Row gutter={[16, 16]}>
            {item.permissions?.map((value, index) => (
              <Col lg={12} md={12} sm={24} key={index}>
                <Card
                  size="small"
                  bodyStyle={{ display: "flex", flex: 1, flexDirection: "row" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Switch
                      defaultChecked={false}
                      onChange={(v) =>
                        handleSingleCheck(v, value._id, item.module)
                      }
                      checked={checkedSwitches[`${item.module}_${value._id}`]}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Tooltip title={value?.name}>
                      <p style={{ paddingLeft: 10, marginBottom: 3 }}>
                        {value?.name || ""}
                      </p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <p
                          style={{
                            paddingLeft: 10,
                            marginBottom: 3,
                            fontWeight: "bold",
                          }}
                          className={value?.method}
                        >
                          {value?.method || ""}
                        </p>
                        <p style={{ paddingLeft: 10, marginBottom: 3 }}>
                          {value?.apiPath || ""}
                        </p>
                      </div>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Panel>
      ))}
    </Collapse>
  );
};

export default ModuleAPICreate;
