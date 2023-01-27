import AddProductToShoppingCartButton from "@/components/AddProductToShoppingCartButton";
import Layout from "@/components/Layout";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Button, List, Spin, Tag } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./[id]-[slug].module.scss";

const QUERY = gql`
  query Products($categoryId: String!, $offset: Int, $limit: Int) {
    category(id: $categoryId) {
      productCount
      products(offset: $offset, limit: $limit) {
        _id
        price
        stock
        title
      }
    }
  }
`;

export default function Category() {
  const router = useRouter();
  const [pageSize] = useState(5);
  const [offset, setOffset] = useState(0);
  const getCategoryId = (
    categoryIdWithSlug: string | string[] | undefined
  ): string => String(categoryIdWithSlug).split("-")[0];

  // Get products
  const { data, loading, error, refetch } = useQuery<{
    category: {
      productCount: number;
      products: {
        _id: string;
        title: string;
        price: number;
        stock: number;
      }[];
    };
  }>(QUERY, {
    variables: { categoryId: getCategoryId(router.query.categoryId) },
  });

  // Load products whenever category or pagination changes
  useEffect(() => {
    refetch({
      categoryId: getCategoryId(router.query.categoryId),
      offset,
      limit: pageSize,
    });
  }, [refetch, router.query.categoryId, offset, pageSize]);

  if (!loading && !data?.category) {
    router.replace("/");

    return null;
  }

  return (
    <Layout>
      <List
        loading={loading}
        itemLayout="horizontal"
        pagination={{
          onChange: (page) => {
            setOffset((page - 1) * 5);
          },
          pageSize,
          total: data?.category.productCount,
        }}
        dataSource={data?.category.products || []}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Tag key="stock" color="blue">
                {item.stock} left
              </Tag>,
              <Tag key="price" color="red">
                CHF {item.price}
              </Tag>,
              <AddProductToShoppingCartButton key="add" product={item} />,
            ]}
          >
            <List.Item.Meta avatar={<Avatar />} title={item.title} />
          </List.Item>
        )}
      />
    </Layout>
  );
}
