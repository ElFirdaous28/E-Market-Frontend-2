import { useOrders } from "../hooks/useOrders";

export default function Test() {
  const { recentOrders } = useOrders();
  console.log(recentOrders);

  return <div>Test</div>;
}
