import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, message, notification } from "antd";

const REMOVE_PRODUCT_FROM_ORDER = gql`
  mutation RemoveProductFromOrder($productId: String!) {
    removeProductFromOrder(productId: $productId) {
      _id
      products {
        productId
      }
    }
  }
`;

export default function RemoveFromShoppingCartButton(props: {
  product: {
    _id: string;
    title: string;
    price: number;
  };
}) {
  const [notifications, contextHolder] = notification.useNotification();
  const [remove, { data, loading, error }] = useMutation(
    REMOVE_PRODUCT_FROM_ORDER
  );

  return (
    <>
      {contextHolder}

      <Button
        loading={loading}
        onClick={async () => {
          await remove({
            variables: {
              productId: props.product._id,
            },
          });
          notifications.success({
            message: `${props.product.title} removed.`,
            placement: "bottomRight",
          });
        }}
      >
        Remove
      </Button>
    </>
  );
}
