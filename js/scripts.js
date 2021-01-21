import PRODUCTS from "./products.js";

const handleNavigate = (event, asd) => {
  switch (event.view) {
    case "detail":
      const productId = event.product_id;
      showDetail(productId);
      break;
    default:
      showProducts();
      break;
  }
};

document.addEventListener("navigate", handleNavigate);

const showDetail = (productId) => {
  scrollToTop();
  document.querySelector("body").classList.add("detail");
  const existingProduct = document.querySelector(
    ".product-detail:not(.product-detail-template)"
  );

  existingProduct && existingProduct.remove();

  const newProductDetail = document
    .querySelector(".product-detail-template")
    .cloneNode(true);
  newProductDetail.classList.remove("product-detail-template");

  let product = PRODUCTS.filter((product) => product.id == productId);

  if (product.length !== 1) {
    // invalid product id
    navigate();
  }

  product = product[0];

  newProductDetail.querySelector(".product-title").innerHTML = product.name;
  newProductDetail.querySelector(".author").innerHTML = product.author;
  newProductDetail.querySelector(".price").innerHTML = product.price + " €";
  newProductDetail.querySelector(".product-image").src =
    "/img/products/" + product.id + ".jpg";

  document
    .querySelector(".product-detail-wrapper")
    .appendChild(newProductDetail);

  document.querySelector(".go-back").addEventListener("click", _onGoBackClick);
};

const _onGoBackClick = () => {
  closeAllPanes();
  showProducts();
  scrollToTop();
};

const scrollToTop = () => window.scrollTo(0, 0);

const closeAllPanes = () => {
  hideProducts();
  hideDetail();
};

const showProducts = () =>
  document.querySelector(".product-wrapper").classList.remove("hide");

const hideProducts = () =>
  document.querySelector(".product-wrapper").classList.add("hide");

const hideDetail = () => {
  document.querySelector(".product-detail-wrapper").classList.add("hide");
  document.querySelector("body").classList.remove("detail");
};

const viewProduct = (e) => {
  scrollToTop();
  e.preventDefault();
  const productID = e.currentTarget.closest(".product").getAttribute("data-id");

  const event = new CustomEvent("navigate");
  event.view = "detail";
  event.product_id = productID;

  document.dispatchEvent(event);
};

const displayProducts = () => {
  PRODUCTS.forEach((product) => {
    const newProduct = document
      .querySelector(".product-template")
      .cloneNode(true);
    newProduct.classList.remove("product-template");

    newProduct.querySelector(".product-description").innerHTML = product.name;
    newProduct.querySelector(".author .value").innerHTML = product.author;
    newProduct.querySelector(".product-price .value").innerHTML =
      product.price + " €";
    newProduct.querySelector(".product-image").src =
      "/img/products/" + product.id + ".jpg";
    newProduct.setAttribute("data-id", product.id);

    // Event listeners
    newProduct
      .querySelector(".product-description")
      .addEventListener("click", viewProduct);
    newProduct
      .querySelector(".img-wrapper")
      .addEventListener("click", viewProduct);

    document.querySelector(".product-wrapper").appendChild(newProduct);
  });
};

displayProducts();

const navigate = (target = "") => {
  window.location =
    window.location.protocol + "//" + window.location.hostname + target;
};
