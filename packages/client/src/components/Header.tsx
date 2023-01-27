import styles from "./Header.module.scss";
import { Layout } from "antd";
import Logo from "./Logo";
import { Avatar } from "antd";
import { useState } from "react";
import ShoppingCartButton from "./ShoppingCartButton";

export default function Header({}: {}) {
  const [openShoppingCart, setOpenShoppingCart] = useState(false);

  return (
    <Layout.Header className={styles.container}>
      <div className={styles.left}>
        <Logo />
      </div>

      <div className={styles.right}>
        <ShoppingCartButton />

        <div className={styles.user}>
          <div>Julian</div>
          
          <Avatar className={styles.avatar} size="large">
            JH
          </Avatar>
        </div>
      </div>
    </Layout.Header>
  );
}
