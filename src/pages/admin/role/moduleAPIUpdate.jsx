import "./moduleAPI.scss";
import { Card, Col, Collapse, Form, Row, Switch, Tooltip } from "antd";
import { useEffect, useState } from "react";
const { Panel } = Collapse;

const ModuleAPIUpdate = (props) => {
  const { permissions, permissionsRole, setSelectedIds } = props;

  // Create a state object to track switch states for each item
  const [itemSwitches, setItemSwitches] = useState({});

  // Function to handle switch change for an individual item
  const handleSingleCheck = (moduleId, permissionId, checked) => {
    setItemSwitches((prevSwitches) => ({
      ...prevSwitches,
      [moduleId]: {
        ...prevSwitches[moduleId],
        [permissionId]: checked,
      },
    }));
  };

  // Function to get the state of an individual switch
  const isSwitchActive = (moduleId, permissionId) => {
    const moduleSwitches = itemSwitches[moduleId];

    if (permissionsRole && permissionsRole.includes(permissionId)) {
      return true;
    }
    return moduleSwitches ? moduleSwitches[permissionId] || false : false;
  };

  useEffect(() => {
    const newSelectedIds = [];

    permissions.forEach((item) => {
      if (item.permissions) {
        item.permissions.forEach((value) => {
          if (isSwitchActive(item.module, value._id)) {
            newSelectedIds.push(value._id);
          }
        });
      }
    });

    setSelectedIds(newSelectedIds);
  }, [itemSwitches, permissions, permissionsRole, setSelectedIds]);

  return (
    <Collapse accordion>
      {permissions.map((item, index) => (
        <Panel header={item.module} key={index}>
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
                      onChange={(checked) =>
                        handleSingleCheck(item.module, value._id, checked)
                      }
                      defaultChecked={isSwitchActive(item.module, value._id)}
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

export default ModuleAPIUpdate;
