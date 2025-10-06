import AddToCartButton from "./addToCartBtn";

export default function ProductCard({ product, onProductClick }) {

  const handleClick = onProductClick ? () => onProductClick(product) : undefined;
  
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4 hover:outline hover:outline-green-600 duration-100 hover:shadow-sm flex cursor-pointer" onClick={handleClick}>
      <div className="size-30 rounded relative">
        <img
          src={product.image}
          alt={product.name}
          width={256}
          height={256}
          className="w-full h-full object-cover rounded"
        ></img>
      </div>
      <div className="flex flex-col flex-1 justify-between ml-4">
        <h4 className="font-medium mb-4">{product.name}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center gap-4">
          <h4 className="font-semibold">{product.price.toLocaleString("id-ID")}</h4>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
