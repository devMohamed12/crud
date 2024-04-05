//final file

//declare elements

// product inputs
const productTitle = document.querySelector(".product-title");
const productPrice = document.querySelector(".product-price");
const productTaxes = document.querySelector(".product-taxes");
const productAds = document.querySelector(".ads");
const productDiscount = document.querySelector(".product-discount");
const productTotalPrice = document.querySelector(".product-total-price");
const productCount = document.querySelector(".product-count");
const productCategory = document.querySelector(".product-category");
const productSubmitBtn = document.querySelector(".product-submit");

// search 
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector("#search-btn");

const tbody = document.getElementById("tbody");
const deleteAllBtn = document.querySelector(".btn-delete-all");
const tableIcon = document.querySelector(".table-icon");
const cardIcon = document.querySelector(".card-icon");
const productsContainer = document.querySelector(".products-container");
const categoriesContainer = document.getElementById("categories-btns");

const cardsContainer = document.querySelector(".cards-container");
const tableContainer = document.querySelector(".table-container");

let displayMood ="table";
let mood = "create";
let updatedIndex;

// when the page is loaded, show products will be called
window.onload = () => {
  showProducts(products, displayMood);
   
};

// get "products" from localStorage or use an empty array if not present.
let products = JSON.parse(localStorage.getItem("products")) || [];

// products functions

// get total price of the product
function getTotal() {
  //  Checks if the value of productPrice is empty
  if (productPrice.value == "") {
    return;
  }

  const result =
    +productPrice.value +
    +productTaxes.value +
    +productAds.value -
    +productDiscount.value;

  productTotalPrice.innerHTML = result;
  console.log(result);

  productTotalPrice.style.background = result && result > 0 ? "#050" : "red";
}
productPrice.onkeyup = getTotal;
productTaxes.onkeyup = getTotal;
productAds.onkeyup = getTotal;
productDiscount.onkeyup = getTotal;

// create product
function createProduct(product) {
  products.push(product);
}

// handle this

// update product
function updateProduct(id) {
  // get the product
  const product = products.find((product) => product.id == id);
  productTitle.value = product.title;
  productPrice.value = product.price;
  productTaxes.value = product.taxes;
  productAds.value = product.ads;
  productDiscount.value = product.discount;
  getTotal();
  productTotalPrice.innerHTML = product.totalPrice;
  productCategory.value = product.category;
  productSubmitBtn.innerHTML = "update";

  mood = "update";
  updatedIndex = id;
}

// generate Unique Id with three number ranging from 100 to 999
const generateUniqueId = () => {
  const min = 100; // Minimum three-digit number
  const max = 999; // Maximum three-digit number
  const uniqueId = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number within range
  return uniqueId.toString(); // Convert number to string before returning
};

// clear inputs
function clearInputs() {
  productTitle.value = "";
  productPrice.value = "";
  productTaxes.value = "";
  productAds.value = "";
  productDiscount.value = "";
  productTotalPrice.innerHTML = "";
  productTotalPrice.style.background = "red";
  productCount.value = "";
  productCategory.value = "";
}

productSubmitBtn.onclick = () => {
  if (mood == "create") {
    const newProduct = {
      id: generateUniqueId(),
      title: productTitle.value.toLowerCase(),
      price: +productPrice.value,
      taxes: +productTaxes.value,
      ads: +productAds.value,
      discount: +productDiscount.value,
      totalPrice: +productTotalPrice.innerHTML,
      count: productCount.value,
      category: productCategory.value.toLowerCase(),
    };
    createProduct(newProduct);
  } else {
    // updating the product
    const updatedProduct1 = products.find(({ id }) => id == updatedIndex);
    updatedProduct1.title = productTitle.value;
    updatedProduct1.price = productPrice.value;
    updatedProduct1.taxes = productTaxes.value;
    updatedProduct1.ads = productAds.value;
    updatedProduct1.discount = productDiscount.value;
    updatedProduct1.totalPrice = productTotalPrice.innerHTML;
    updatedProduct1.count = productCount.value;
    updatedProduct1.category = productCategory.value;
    mood = "create";
  }

  showProducts(products);
  clearInputs();
  productSubmitBtn.innerText = mood;

  // save data in local storage
  localStorage.setItem("products", JSON.stringify(products));
};

// show products
function showProducts(array = products, Mood = displayMood) {
  Mood === "table" ? generateProductRows(array) : generateProductCards(array);
  showCategories(); 
  deleteAllBtn.innerText = `delete all (${products.length})`;
  deleteAllBtn.style.display = products.length ? "block" : "none";
}

// delete specific product
function deleteProduct(index) {
  products.splice(index, 1);
  showProducts(products, displayMood);
  // save products in local storage
  localStorage.setItem("products", JSON.stringify(products));
}

// delete all products
function deleteAllProducts() {
  products.length = 0;
  deleteAllBtn.style.display = "none";
  localStorage.removeItem("products");
  tbody.innerHTML = "";
  cardsContainer.innerHTML = "";
}

deleteAllBtn.onclick = () => {
  deleteAllProducts();
};

// search functions
searchBtn.onclick = () => {
  searchProducts(searchInput.value);
};

function searchProducts(value) {
  // Filter the products array based on  the product's title, id, or category includes the given value.
  const searchedProducts = products.filter(
    (product) =>
      product.title.includes(value) ||
      product.id.includes(value) ||
      product.category.includes(value)
  );

  showProducts(searchedProducts);
}

// categories functions

// show categories
function showCategories() {
  // Extract unique categories from products
  const categories = [...new Set(products.map(({ category }) => category))];

  // Generate buttons for each category
  categoriesContainer.innerHTML = categories
    .map(
      (category) =>
        `<button onclick="filterByCategory('${category}')">${category}</button>`
    )
    .join(" ");
}

// Filter products based on the selected category
function filterByCategory(category) {
  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  // Display the filtered products
  showProducts(filteredProducts);
}

// switcher

tableIcon.onclick = () => {
  displayMood = "table";
  cardsContainer.style.display = "none";
  tableContainer.style.display = "block";
  showProducts(products, displayMood);
};

cardIcon.onclick = () => {
  displayMood = "cards";
  tableContainer.style.display = "none";
  cardsContainer.style.display = "grid";
  showProducts(products, displayMood);
  console.log(displayMood, " cardIcon");
};

function generateProductRows(array) {
  const rows = array.map(
    ({ id, title, price, taxes, ads, discount, totalPrice, category }, idx) =>
      `<tr>
      <td>${idx + 1}</td>
      <td>${title}</td>
      <td>${price}</td>
      <td>${taxes}</td>
      <td>${ads}</td>
      <td>${discount}</td>
      <td>${totalPrice}</td>
      <td>${category}</td>
      <td>
        <button onclick="updateProduct(${id})" class="btn btn-update">update</button>
      </td>
      <td>
        <button onclick="deleteProduct(${id})" class="btn btn-delete">delete</button>
      </td>
    </tr>`
  );

  tbody.innerHTML = rows.join("");
}

function generateProductCards(array) {
  console.log(array, " array cards");
  const Cards = array.map(
    ({ id, title, price, taxes, ads, discount, totalPrice, category }, idx) =>
      `
     <div class="product">
            <p>${idx + 1}</p>
            <h4>${title}</h4>
            <p>price is ${price}</p>
            <p>taxes: ${taxes}</p>
            <p>ads: ${ads}</p>
            <p>discount: ${discount}</p>
            <p>total price: ${totalPrice}</p>
            <p>category price: ${category}</p>
            <button  onclick= "handleSubmit(${id})" class="btn btn-update" >update</button>
            <button onclick= "deleteProduct(${id})" class="btn btn-delete">delete</button>
          </div>`
  );

  cardsContainer.innerHTML = Cards.join("");
}

 
// tasks

//  [] style categories
//  [] try to make themes
//  [x] handle id
//  [x]  handle view cards
//  [x]  submit btn name
//  [x] ارتب الكود
