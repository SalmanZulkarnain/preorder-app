import AddToCartButton from "./addToCartBtn";

export default function ProductCard({ product, onProductClick }) {

  const handleClick = onProductClick ? () => onProductClick(product) : undefined;
  
  return (
    <div className="flex p-4 duration-100 bg-white border border-gray-200 rounded-sm cursor-pointer hover:border-green-600 hover:shadow-sm" onClick={handleClick}>
      <div className="relative rounded size-30">
        <img
          src={product.image}
          alt={product.name}
          width={256}
          height={256}
          className="object-cover w-full h-full rounded"
        ></img>
      </div>
      <div className="flex flex-col justify-between flex-1 ml-4">
        <h4 className="mb-4 font-medium">{product.name}</h4>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between gap-4">
          <h4 className="font-semibold">{product.price.toLocaleString("id-ID")}</h4>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
