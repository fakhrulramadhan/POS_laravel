import Skeleton from "react-loading-skeleton";
import ProductCard from "./ProductCard";

const ProductList = ({ products, loading, onSelectProduct}) => {
    return (
        <div className="product-grid">
        { loading ? 
            Array.from({ length: 8 }).map((_, index) => (
                <div className="col" key={index}>
                    <Skeleton height={120}/>
                </div>
            ))
            :
            products.map((product, index) => (
                <ProductCard 
                    key={index}
                    product={product}
                    onSelect={onSelectProduct}
                />
            ))
        }
        </div>
    );
};

export default ProductList;
