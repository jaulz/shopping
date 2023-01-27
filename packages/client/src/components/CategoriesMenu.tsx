import { gql, useQuery } from "@apollo/client";
import { Menu, Layout as AntdLayout, theme, Spin } from "antd";
import { useRouter } from "next/router";

const QUERY = gql`
  query Categories {
    categories {
      _id
      slug
      title
      productCount
    }
  }
`;

export default function CategoriesMenu() {
  const router = useRouter();
  const { data, loading, error } = useQuery<{
    categories: {
      _id: string;
      title: string;
      slug: string;
      productCount: number;
    }[];
  }>(QUERY);

  if (loading) {
    return <Spin />;
  }

  return (
    <Menu
      mode="inline"
      items={data?.categories.map((item) => ({
        key: item._id,
        label: `${item.title} (${item.productCount})`,
        onClick() {
          router.push(`/${item._id}-${item.slug}`);
        },
      }))}
    />
  );
}
