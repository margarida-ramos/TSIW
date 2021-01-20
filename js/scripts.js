import PRODUCTS from "./products.js";

const displayProducts = () => {
  PRODUCTS.forEach((product) => {
    const newProduct = document
      .querySelector(".product-template")
      .cloneNode(true);
    newProduct.querySelector(".product-description").innerHTML = product.name;
    newProduct.querySelector(".author .value").innerHTML = product.author;
    newProduct.querySelector(".product-price .value").innerHTML =
      product.price + " €";
    newProduct.querySelector(".product-image").src =
      "/img/products/" + product.id + ".jpg";

    newProduct.classList.remove("product-template");
    document.querySelector(".product-wrapper").appendChild(newProduct);
  });
};

displayProducts();
