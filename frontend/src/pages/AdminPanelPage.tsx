import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import UsersTab from "../components/AdminUsersTab";
import TicketsTab from "../components/AdminTicketsTab";
import CategoriesTab from "../components/AdminCategoriesTab";
import StatisticsTab from "../components/AdminStatisticsTab";

export default function AdminPanelPage() {
    const [key, setKey] = useState("users");

    return (
        <div className="container mt-4">
            <h2 className="mb-3 text-center">Admin panel</h2>
            <Tabs activeKey={key} onSelect={(k) => setKey(k || "users")} className="mb-3">
                <Tab eventKey="users" title="Users">
                    <UsersTab/>
                </Tab>
                <Tab eventKey="tickets" title="Tickets">
                    <TicketsTab/>
                </Tab>
                <Tab eventKey="categories" title="Categories">
                    <CategoriesTab/>
                </Tab>
                <Tab eventKey="statistics" title="Statistics">
                    <StatisticsTab/>
                </Tab>
            </Tabs>
        </div>
    );
}