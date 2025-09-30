import { getPayment } from "@/lib/utils/fetchData";
import TransactionAdminClient from "./TransactionAdminClient";

export default async function TransactionAdmin() {
  const payments = await getPayment();

  return <TransactionAdminClient initialPayments={payments} />
}
