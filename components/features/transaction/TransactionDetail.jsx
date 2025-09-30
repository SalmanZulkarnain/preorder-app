import { formatDate } from "@/lib/utils/formatDate";

export default function TransactionDetail({ open, onClose, selectedPayment, openSection, toggleSection }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 m-0"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 px-4 sm:px-6 py-6 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        } ${
          open ? "w-full sm:w-96 md:w-150" : "" // Full width on mobile, narrower on larger screens
        }`}
      >
        {/* Exit Button */}
        <button
          className="text-gray-500 hover:text-gray-800 w-full text-right text-xl mb-4"
          onClick={onClose}
        >
          ✕
        </button>

        {selectedPayment && (
          <>
            {/* Order ID */}
            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-green-600 text-sm font-medium">Payment</h3>
              <p className="text-gray-600 font-medium text-sm">
                Order ID {selectedPayment.transactionId}
              </p>
              <h3 className="font-bold text-xl sm:text-2xl">
                Rp{selectedPayment.grossAmount.toLocaleString("id-ID")}
              </h3>
            </div>

            {/* Status */}
            <div className="space-y-4 mb-4">
              <span className="font-bold block mb-2">Status</span>
              <hr className="mb-3 border-gray-300" />
              <h3
                className={`rounded p-3 text-sm ${
                  selectedPayment.order.status === "PAID"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                Transaction status: {selectedPayment.order.status}
              </h3>
            </div>

            {/* Payment details */}
            <div className="mb-4">
              <span className="font-bold block mb-2">Payment Details</span>
              <hr className="mb-3 border-gray-300" />
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-bold">Transaction ID</h5>
                  <span className="block">
                    {selectedPayment.midtransTransactionId}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Payment Type</h5>
                  <span className="uppercase block">
                    {selectedPayment.paymentType}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Created On</h5>
                  <span className="block">
                    {formatDate(selectedPayment.transactionTime)}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold">Expiry Time</h5>
                  <span className="block">
                    {formatDate(selectedPayment.expiryTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order details */}
            <div className="mb-4">
              <span className="font-bold block mb-2">Order Details</span>
              <hr className="mb-3 border-gray-300" />
              <div className="space-y-4">
                <div>
                  <button
                    onClick={() => toggleSection("customer")}
                    className="w-full flex justify-between items-centers font-medium"
                  >
                    Customer details
                    <span>{openSection === "customer" ? "-" : "+"}</span>
                  </button>
                  {openSection === "customer" && (
                    <div className="pt-4">
                      <div className="p-4 bg-gray-100 rounded">
                        <p>
                          <strong>Name:</strong>{" "}
                          {selectedPayment.order.customer.name}
                        </p>
                        <p>
                          <strong>Mobile number:</strong>{" "}
                          {selectedPayment.order.customer.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => toggleSection("product")}
                    className="w-full flex justify-between items-centers font-medium"
                  >
                    Product details
                    <span>{openSection === "product" ? "-" : "+"}</span>
                  </button>
                  {openSection === "product" && (
                    <div className="pt-4">
                      <table className="table-auto w-full text-left">
                        <thead>
                          <tr>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRODUCT ID
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRODUCT NAME
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              QUANTITY
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              PRICE
                            </th>
                            <th className="border border-gray-200 p-3 text-sm">
                              SUBTOTAL
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPayment.order.orderItems.map((item) => (
                            <tr key={item.id}>
                              <td className="border p-3 border-gray-200">
                                {item.product.id}
                              </td>
                              <td className="border p-3 border-gray-200">
                                {item.product.name}
                              </td>
                              <td className="border p-3 border-gray-200">
                                {item.quantity}
                              </td>
                              <td className="border p-3 border-gray-200">
                                Rp{item.priceAtOrder.toLocaleString("id-ID")}
                              </td>
                              <td className="border p-3 border-gray-200">
                                Rp
                                {(
                                  item.priceAtOrder * item.quantity
                                ).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
