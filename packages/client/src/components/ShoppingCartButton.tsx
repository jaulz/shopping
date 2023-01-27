import React, { useState } from "react";
import { Avatar, Button, List, message, Modal, notification, Tag } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import AddProductToShoppingCartButton from "./AddProductToShoppingCartButton";
import RemoveFromShoppingCartButton from "./RemoveFromShoppingCartButton";
import OrderProductQuantityInput from "./OrderProductQuantityInput";
import styles from "./ShoppingCartButton.module.scss";

const QUERY = gql`
  query Order {
    order {
      _id
      products {
        quantity
        product {
          _id
          title
          price
        }
      }
    }
  }
`;

const SUBMIT_ORDER = gql`
  mutation SubmitOrder {
    submitOrder {
      _id
      products {
        productId
      }
    }
  }
`;

export default function ShoppingCartButton({}: {}) {
  const [open, setOpen] = useState(false);
  const [notifications, contextHolder] = notification.useNotification();
  const { data, loading, error, refetch } = useQuery<{
    order: {
      _id: string;
      products: {
        quantity: number;
        product: {
          _id: string;
          title: string;
          price: number;
        };
      }[];
    };
  }>(QUERY);
  const [submit, mutationState] = useMutation(SUBMIT_ORDER);

  return (
    <>
      {contextHolder}

      <Button
        type="primary"
        loading={loading}
        onClick={() => {
          setOpen(true);
        }}
      >
        Shopping Cart {data ? `(${data.order.products.length})` : null}
      </Button>

      <Modal
        title="Shopping Cart"
        open={open}
        onOk={async () => {
          await submit();
          notifications.info({
            message: "Thank you for your order.",
            placement: "bottomRight",
          });
          setOpen(false);
          refetch();
        }}
        onCancel={() => setOpen(false)}
        okText="Buy"
        okButtonProps={{
          loading: mutationState.loading,
          disabled: data?.order.products.length === 0,
        }}
        cancelButtonProps={{
          disabled: mutationState.loading,
        }}
      >
        <List
          className={styles.list}
          loading={loading}
          itemLayout="horizontal"
          dataSource={data?.order.products || []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <OrderProductQuantityInput
                  key="quantity"
                  product={item.product}
                  quantity={item.quantity}
                />,
                <Tag key="price" color="red">
                  CHF {item.product.price}
                </Tag>,
                <RemoveFromShoppingCartButton
                  key="add"
                  product={item.product}
                />,
              ]}
            >
              <List.Item.Meta avatar={<Avatar />} title={item.product.title} />
            </List.Item>
          )}
        />

        <div>
          Total Cost:{" "}
          <Tag color="red">
            CHF{" "}
            {data?.order.products.reduce(
              (cumulatedPrice, orderProduct) =>
                cumulatedPrice +
                orderProduct.quantity * orderProduct.product.price,
              0
            )}
          </Tag>
        </div>
      </Modal>
    </>
  );
}
