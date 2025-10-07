import Image from "next/image";

export default function CartCard({ cart, children }) {
  return (
    <div className="flex flex-row gap-2 p-4 duration-100 bg-white border border-gray-200 rounded-sm cursor-pointer hover:outline hover:outline-green-600 hover:shadow-sm sm:p-0">
      <div className="relative rounded sm:size-40 size-20 sm:p-4">
        <Image
          src={cart.product.image}
          alt={cart.product.name}
          width={256}
          height={256}
          className="object-cover w-full h-full rounded"
        />
      </div>
      <div className="flex flex-col justify-between flex-1 gap-2 sm:p-4 sm:gap-0">
        <div className="flex flex-wrap justify-between space-x-2 space-y-2 sm:flex-col">
          <h4 className="text-sm font-medium sm:text-base">{cart.product.name}</h4>
          <h4 className="font-semibold">
            {cart.product.price.toLocaleString("id-ID")}
          </h4>
        </div>
        <div className="flex items-center justify-end">{children}</div>
      </div>
    </div>
  );
}
