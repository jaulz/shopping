import Header from "@/components/Header";
import styles from "./Layout.module.scss";
import { Layout as AntdLayout, theme } from "antd";
import CategoriesMenu from "./CategoriesMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntdLayout>
      <Header />

      <AntdLayout.Content className={styles.content}>
        <div style={{ background: colorBgContainer }}>
          <AntdLayout
            style={{ padding: "24px 0", background: colorBgContainer }}
          >
            <AntdLayout.Sider
              style={{ background: colorBgContainer }}
              width={300}
            >
              <CategoriesMenu />
            </AntdLayout.Sider>

            <AntdLayout.Content className={styles.content}>
              {children}
            </AntdLayout.Content>
          </AntdLayout>
        </div>
      </AntdLayout.Content>

      <AntdLayout.Footer className={styles.footer}>
        © 2023 ...
      </AntdLayout.Footer>
    </AntdLayout>
  );
}
