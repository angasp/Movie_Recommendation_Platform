import React from "react";
import { useSelector } from "react-redux";
import { createFromIconfontCN } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Logo from "../../../../assets/logo1.png";

import "./Navbar.css";

const PopcornIcon = createFromIconfontCN({
	scriptUrl: "//at.alicdn.com/t/font_1804216_05evm2uwptc9.js",
});

function LeftMenu(props) {
	const { t } = useTranslation();

	const user = useSelector((state) => state.user);

	if (user.userData && !user.userData.isAuth) {
		return (
			<div className="menu__logo">
				<a href="/">
					<img src={Logo} alt="Logo" style={{ height: "100%" }} />
				</a>
			</div>
		);
	} else {
	return (
		<div className="menu_left">
			<div className="menu__logo">
				<a href="/landing">
					<img src={Logo} alt="Logo" style={{ height: "100%" }} />
				</a>
			</div>
			<div className="popcorn_icon">
				<a href="/favorite">
					<PopcornIcon type="icon-popcorn" style={{ fontSize: 25 }} />
					{t("navbar.favorites")}
				</a>
			</div>
		</div>
	);
  }
}

export default LeftMenu;
