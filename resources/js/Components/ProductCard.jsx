import React from "react";

const ProductCard = ({ product, onSelect}) => {
    return (
        <div className="product-item"
            onClick={() => onSelect(product)}
        >
            <img src={product.image} alt={product.name} />
            <div className="product-info">
                <h6>{product.name}</h6>
                <small>Rp{product.selling_price.toLocaleString()}</small>
            </div>
        </div>
    );
};

export default ProductCard;
