import { formatDate } from "@/lib/utils/formatDate";
import InvoiceForm from "./invoice-form";
import { getOrdersBySession } from "@/lib/services/orderService";

const statusStyles = {
  PAID: "bg-green-100 text-green-600",
  PENDING: "bg-blue-100 text-blue-600",
  WAITING_PAYMENT_METHOD: "bg-yellow-100 text-yellow-600",
  EXPIRED: "bg-red-100 text-red-600",
};

export default async function InvoicePage() {
  // const [recentPayments, setRecentPayments] = useState<Order[]>([]);

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const res = await fetch(`/api/invoice`, {
  //         credentials: "include",
  //       });
  //       const result = await res.json();
  //       if (!mounted) return;
  //       if (result.success) setRecentPayments(result.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  const orders = await getOrdersBySession();

  return (
    <div className="flex items-center justify-center mx-auto py-20">
      <div className="grid items-start max-w-6xl grid-cols-1 gap-6 mx-auto">
        <div className="text-center">
          <h1 className="mb-4 lg:text-4xl text-3xl font-semibold tracking-wide text-center text-gray-800">
            Cek Transaksi Kamu dengan Mudah dan Cepat
          </h1>
          <h2 className="mb-4 lg:text-xl text-lg font-medium tracking-wide text-center text-gray-500">
            Lihat detail pembelian kamu menggunakan nomor Transaksi.
          </h2>
        </div>
        <InvoiceForm />
        <div className="mt-5">
          <div className="bg-white rounded-xl px-6 py-4 overflow-x-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-4">
                Recent Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-200 border-collapse text-left">
                <thead className="text-gray-500 text-xs sm:text-sm">
                  <tr>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Tanggal
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Nomor Transaksi
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Nama
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Harga
                    </th>
                    <th className="px-5 py-4 border-b border-gray-200 first:pl-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((p) => (
                    <tr key={p.id}>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {p.transactionId}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        {p.customerName}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        Rp{p.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 first:pl-0">
                        <span
                          className={`px-2 py-1 capitalize rounded-full font-medium text-xs ${statusStyles[p.status]}`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
