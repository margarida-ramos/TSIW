import PRODUCTS from "./products.js";

const handleNavigate = (event, asd) => {
  switch (event.view) {
    case "detail":
      const productId = event.product_id;
      showDetail(productId);
      break;
    case "signup":
      showSignup();
      break;
    case "login":
      showLogin();
      break;
    case "shopping-cart":
      showShoppingCart();
      break;
    case "products":
    default:
      showProducts();
      break;
  }
};

const showShoppingCart = () => {
  closeAllPanes();
  document.querySelector(".view-cart-wrapper").classList.remove("hide");
  const basket = JSON.parse(localStorage.getItem("basket") || "[]");
  document
    .querySelector(".view-cart-wrapper .go-back")
    .addEventListener("click", _onGoBackClick);
  let totalPrice = 0;
  basket.forEach((entry) => {
    const templateRow = document
      .querySelector(".shopping-cart-table .template-row")
      .cloneNode(true);
    templateRow.classList.remove("template-row");
    templateRow.classList.remove("hide");
    templateRow.querySelector(".product-name").innerHTML = PRODUCTS[entry].name;
    templateRow.querySelector(".product-image").src =
      "/img/products/" + entry + ".jpg";
    templateRow.querySelector(".product-price").innerHTML =
      PRODUCTS[entry].price;
    totalPrice += parseFloat(PRODUCTS[entry].price);
    document.querySelector(".shopping-cart-table").appendChild(templateRow);
  });
  document.querySelector(".total-price").innerHTML =
    totalPrice.toFixed(2) + "€";
  scrollToTop();
};

const showSignup = () => {
  closeAllPanes();
  document.querySelector(".signup-wrapper").classList.remove("hide");
  scrollToTop();
};

const showLogin = () => {
  closeAllPanes();
  document.querySelector(".login-wrapper").classList.remove("hide");
  scrollToTop();
};

const showDetail = (productId) => {
  closeAllPanes();
  scrollToTop();
  const existingProduct = document.querySelector(
    ".product-detail:not(.product-detail-template)"
  );

  existingProduct && existingProduct.remove();

  const newProductDetail = document
    .querySelector(".product-detail-template")
    .cloneNode(true);
  newProductDetail.classList.remove("product-detail-template");
  newProductDetail.classList.remove("hide");

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

  newProductDetail
    .querySelector("a.add-to-cart")
    .addEventListener("click", addToCart);

  document.querySelector(".product-detail-wrapper").classList.remove("hide");
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
  hideSignup();
  hideLogin();
  hideShoppingCart();
};

const hideShoppingCart = () =>
  document.querySelector(".view-cart-wrapper").classList.add("hide");

const showProducts = () =>
  document.querySelector(".product-wrapper").classList.remove("hide");

const hideProducts = () =>
  document.querySelector(".product-wrapper").classList.add("hide");

const hideSignup = () =>
  document.querySelector(".signup-wrapper").classList.add("hide");

const hideLogin = () =>
  document.querySelector(".login-wrapper").classList.add("hide");

const hideDetail = () =>
  document.querySelector(".product-detail-wrapper").classList.add("hide");

const viewProduct = (e) => {
  scrollToTop();
  e.preventDefault();
  const productID = e.currentTarget.closest(".product").getAttribute("data-id");

  loadView({ view: "detail", product_id: productID });
};

const viewCart = () => {
  scrollToTop();
  loadView({ view: "shopping-cart" });
};

const loadView = (opts = {}) => {
  closeAllPanes();
  const event = new CustomEvent("navigate");
  event.view = opts.view;
  event.product_id = opts.product_id;

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

    newProduct
      .querySelector("a.add-to-cart")
      .addEventListener("click", addToCart);

    document.querySelector(".product-wrapper").appendChild(newProduct);
  });
  showProducts();
};

const navigate = (target = "") => {
  window.location =
    window.location.protocol + "//" + window.location.hostname + target;
};

const _onLoginClick = () => loadView({ view: "login" });
const _onSignupButtonClick = () => loadView({ view: "signup" });

const login = (e) => {
  e.preventDefault();
  document.querySelector(".login-wrapper .error").innerHTML = "";
  document.querySelector(".login-wrapper .success").innerHTML = "";

  const wrapper = document.querySelector(".login-wrapper");
  const user = wrapper.querySelector(".username").value;
  const password = wrapper.querySelector(".password").value;

  if (user === "" || password === "") {
    wrapper.querySelector(".error").innerHTML = "All fields are required.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userExists = users.filter(
    (u) => u.username === user && u.password === password
  );

  if (userExists.length !== 1) {
    wrapper.querySelector(".error").innerHTML =
      "Your username & password do not match.";
    return;
  }

  localStorage.setItem("username", user);
  document.querySelector(".current-username").innerHTML = user;
  document.querySelector(".with-login").classList.remove("hide");
  document.querySelector(".without-login").classList.add("hide");

  loadView({ view: "products" });
};

const maybeLogin = () => {
  const username = localStorage.getItem("username");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users.filter((u) => u.username === username).length === 1) {
    document.querySelector(".current-username").innerHTML = username;
    document.querySelector(".with-login").classList.remove("hide");
    document.querySelector(".without-login").classList.add("hide");
  }
};

const logout = (e) => {
  e.preventDefault();

  localStorage.setItem("username", "");
  document.querySelector(".with-login").classList.add("hide");
  document.querySelector(".without-login").classList.remove("hide");
};

const signup = (e) => {
  e.preventDefault();
  document.querySelector(".signup-wrapper .error").innerHTML = "";
  document.querySelector(".signup-wrapper .success").innerHTML = "";
  const wrapper = document.querySelector(".signup-wrapper");
  const user = wrapper.querySelector(".username").value;
  const password = wrapper.querySelector(".password").value;
  const passwordConfirm = wrapper.querySelector(".password-confirm").value;

  if (password !== passwordConfirm) {
    wrapper.querySelector(".error").innerHTML = "Passwords don't match";
    return;
  }

  if (user === "" || password === "") {
    wrapper.querySelector(".error").innerHTML = "All fields are required.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userExists = users.filter((u) => u.username === user);

  if (userExists.length !== 0) {
    // User already exists
    wrapper.querySelector(".error").innerHTML =
      "This username is already taken.";
    return;
  }

  users.push({
    username: user,
    password: password
  });

  document.querySelector(".signup-wrapper .success").innerHTML =
    "Your account has been created.";

  localStorage.setItem("users", JSON.stringify(users));
};

const addToCart = (e) => {
  e.preventDefault();
  const productId = e.currentTarget.closest(".product").getAttribute("data-id");

  const basket = JSON.parse(localStorage.getItem("basket") || "[]");
  basket.push(productId);

  document.querySelector(".shop-count").innerHTML =
    basket.length === 0 ? "" : basket.length;
  localStorage.setItem("basket", JSON.stringify(basket));
};

/**
 * Events
 */

document.addEventListener("navigate", handleNavigate);
document
  .querySelector(".go-back-detail")
  .addEventListener("click", _onGoBackClick);
document.querySelector("a.login").addEventListener("click", _onLoginClick);
document
  .querySelector("a.login-button")
  .addEventListener("click", _onLoginClick);
document
  .querySelector("a.signup-button")
  .addEventListener("click", _onSignupButtonClick);

document
  .querySelector("button.signup-button")
  .addEventListener("click", signup);

document.querySelector("a.logout").addEventListener("click", logout);

document.querySelector("button.login-button").addEventListener("click", login);

document.querySelector(".view-cart").addEventListener("click", viewCart);

displayProducts();
maybeLogin();
