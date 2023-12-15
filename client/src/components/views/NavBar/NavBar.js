import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { useSelector } from "react-redux";
import { Drawer, Button } from "antd";
import { AlignRightOutlined } from "@ant-design/icons";
import Logo from "../../../assets/logo1.png";
import "./Sections/Navbar.css";

function NavBar() {
	const [visible, setVisible] = useState(false);
	const user = useSelector((state) => state.user);

	const showDrawer = () => {
		setVisible(true);
	};

	const onClose = () => {
		setVisible(false);
	};

	console.log(Logo);

	return (
		<nav
			className="menu"
			style={{ position: "fixed", zIndex: 1, width: "100%", height: "5rem" }}
		>
			<div className="menu__container">
				<LeftMenu mode="horizontal" />
				<div className="menu_right">
					<RightMenu mode="horizontal" />
				</div>
				<Button
					className="menu__mobile-button"
					type="primary"
					onClick={showDrawer}
				>
					<AlignRightOutlined />
				</Button>
				<Drawer
					title="Menu"
					placement="right"
					className="menu_drawer"
					closable={false}
					onClose={onClose}
					visible={visible}
				>
					<LeftMenu mode="inline" />
					<RightMenu mode="inline" />
				</Drawer>
			</div>
		</nav>
	);
}

export default NavBar;
