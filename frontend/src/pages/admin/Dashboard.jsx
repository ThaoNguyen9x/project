import React from "react";
import Card from "../../components/admin/Card/Card";
import CustomBarChart from "../../components/admin/Chart/CustomBarChart";
import CustomPieChart from "../../components/admin/Chart/CustomPieChart";
import Tables from "../../components/admin/Tables";
import Activity from "../../components/admin/Activity";

const Dashboard = () => {
  return (
    <>
      <Card />

      <div className="flex flex-col xl:flex-row my-3 gap-3">
        <CustomBarChart />
        <CustomPieChart />
      </div>

      <div className="flex flex-col xl:flex-row gap-3">
        <Tables />
        <Activity />
      </div>
    </>
  );
};

export default Dashboard;
