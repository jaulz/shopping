import { InputNumber } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import styles from "./OrderProductQuantityInput.module.scss";

const UpdateProductInOrder = gql`
  mutation UpdateProductInOrder($productId: String!, $quantity: Int) {
    updateProductInOrder(productId: $productId, quantity: $quantity) {
      _id
      products {
        productId
        quantity
      }
    }
  }
`;

export default function OrderProductQuantityInput(props: {
  product: {
    _id: string;
    title: string;
    price: number;
  };
  quantity: number;
}) {
  const [update, { data, loading, error }] = useMutation(UpdateProductInOrder);

  return (
    <InputNumber
      type="number"
      className={styles.input}
      maxLength={2}
      value={props.quantity}
      min={1}
      onChange={(nextQuantity) =>
        update({
          variables: {
            productId: props.product._id,
            quantity: nextQuantity,
          },
        })
      }
      disabled={loading}
    />
  );
}
