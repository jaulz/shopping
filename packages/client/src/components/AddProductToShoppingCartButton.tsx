import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, message, notification } from "antd";

const ADD_PRODUCT_TO_ORDER = gql`
  mutation AddProductToOrder($productId: String!, $quantity: Int) {
    addProductToOrder(productId: $productId, quantity: $quantity) {
      _id
      products {
        productId
      }
    }
  }
`;

export default function AddProductToShoppingCartButton(props: {
  product: {
    _id: string;
    title: string;
    price: number;
  };
}) {
  const [notifications, contextHolder] = notification.useNotification();
  const [add, { data, loading, error }] = useMutation(ADD_PRODUCT_TO_ORDER);

  return (
    <>
      {contextHolder}

      <Button
        key="add"
        loading={loading}
        onClick={async () => {
          await add({
            variables: {
              productId: props.product._id,
              quantity: 1,
            },
          });

          notifications.success({
            message: `${props.product.title} added.`,
            placement: "bottomRight",
          });
        }}
      >
        Add to shopping cart
      </Button>
    </>
  );
}
