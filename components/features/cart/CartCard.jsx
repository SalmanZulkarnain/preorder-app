import Image from "next/image";

export default function CartCard({ cart, children }) {
  return (
    <div className="bg-white rounded-sm hover:outline hover:outline-green-600 duration-100 hover:shadow-sm flex flex-row gap-2">
      <div className="sm:size-40 size-20 rounded relative sm:p-4">
        <Image
          src={cart.product.image}
          alt={cart.product.name}
          width={256}
          height={256}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="sm:p-4 flex flex-1 flex-col gap-2 sm:gap-0 justify-between">
        <div className="flex flex-wrap justify-between sm:flex-col space-y-2 space-x-2">
          <h4 className="font-medium">{cart.product.name}</h4>
          <h4 className="font-bold">
            {cart.product.price.toLocaleString("id-ID")}
          </h4>
        </div>
        <div className="flex justify-end items-center">{children}</div>
      </div>
    </div>
  );
}
