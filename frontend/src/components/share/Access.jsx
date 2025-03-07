import React, { useContext, useEffect, useState } from "react";
import { Result } from "antd";
import { AuthContext } from "./Context";

const Access = (props) => {
  const { hideChildren = false, permission } = props;
  const { user } = useContext(AuthContext);

  const [allow, setAllow] = useState(true);

  useEffect(() => {
    if (user.role.permissions.length > 0) {
      const check = user.role.permissions.find(
        (item) =>
          item.apiPath === permission.apiPath &&
          item.method === permission.method &&
          item.module === permission.module
      );

      if (check) {
        setAllow(check.status);
      } else {
        setAllow(false);
      }
    }
  }, [user.role.permissions, permission]);

  if (allow || import.meta.env.VITE_ACL_ENABLE === "false") {
    return <>{props.children}</>;
  } else {
    if (hideChildren) {
      return null;
    } else {
      return (
        <Result
          status="403"
          title="Access Denied"
          subTitle="Sorry, you do not have permission to access this information."
        />
      );
    }
  }
};

export default Access;
