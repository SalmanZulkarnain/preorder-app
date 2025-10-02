import AddToCartButton from "./addToCartBtn";

export default function ProductCard({ product }) {
  
  return (
    <div className="bg-white rounded-sm hover:outline hover:outline-green-600 duration-100 hover:shadow-sm flex">
      <div className="h-40 w-[160] rounded-t-sm relative p-4">
        <img
          src={product.image}
          alt={product.name}
          width={256}
          height={256}
          className="w-full h-full object-cover rounded-t-sm"
        ></img>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h4 className="font-medium mb-4">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex justify-between items-center gap-4">
          <h4 className="font-bold">{product.price.toLocaleString("id-ID")}</h4>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
