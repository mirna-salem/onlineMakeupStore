
// Show Products Page, hide everything else
var my_products = document.getElementsByClassName("product_nav");
for (var i = 0; i < my_products.length; i++){
    console.log(my_products[i])
    my_products[i].addEventListener("click", toggleProducts);
}
function toggleProducts(event) {
    document.getElementById('products').style.display = 'flex';
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    var product_id_selected = event.target.id;
    fetchProducts(product_id_selected);
}


// Show Homepage, hide everything else
document.getElementById('home_nav').addEventListener("click", toggleHomepage);
function toggleHomepage() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('homepage').style.display = 'flex';
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
}

// Show cart page, hide everything else
document.getElementById('cart_nav').addEventListener("click", toggleCart);
function toggleCart() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('cart-section').style.display = 'block';
    document.getElementById('contact').style.display = 'none';
}

// Show contact page, hide everything else
document.getElementById('contact_nav').addEventListener("click", toggleContact);
function toggleContact() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('cart-section').style.display = 'none';
    document.getElementById('contact').style.display = 'block';
}

async function fetchProducts(product_id) {    
    var my_api = {
        eyes: 'http://makeup-api.herokuapp.com/api/v1/products.json?product_type=mascara&brand=nyx',
        face: 'http://makeup-api.herokuapp.com/api/v1/products.json?product_type=foundation&brand=nyx',
        lips: 'http://makeup-api.herokuapp.com/api/v1/products.json?product_type=lipstick&brand=nyx'
    }

    var my_url = my_api[product_id];
    var response = await fetch(my_url)

    const data = await response.json()

    document.getElementById('products').innerHTML = "";

    data.forEach(obj => {
        var ul = document.createElement("ul");
        ul.setAttribute("class", "productUL");
        
        ul.innerHTML = "<li><img class='product-image' src='" + obj.image_link 
        + "'</img></li><li class='product-name'>" + obj.name 
        + "</li><li class='product-brand'>" + obj.brand 
        + "</li><li class='product-price'>" + obj.price_sign 
        + obj.price + 0 +"</li><li><button class='add-button' type='submit'>" + 'Add to Cart'
        + "</button></li>";
        document.getElementById('products').appendChild(ul);
        
    })

    ready();
}


function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger');
    
    for(var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeItem)
    }    

    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for(var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = document.getElementsByClassName("add-button")
    for(var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener("click", addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseComplete)

}

function purchaseComplete() {
    alert('Thank you for your purchase!');
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while(cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var itemName = shopItem.getElementsByClassName("product-name")[0].innerHTML;
    var price = shopItem.getElementsByClassName("product-price")[0].innerHTML;
    var imageSrc = shopItem.getElementsByClassName("product-image")[0].src;
    alert(`${itemName} is added to your shopping cart!`);
    addItemToCart(itemName,price,imageSrc);
    updateCartTotal();
}


function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for(var i=0; i < cartItemNames.length; i++) {
        if(cartItemNames[i].innerText == title) {
            var val = cartItemNames[i].parentNode.parentNode.getElementsByClassName('cart-quantity-input')[0].value;
            val = parseInt(val);
            val++;
            cartItemNames[i].parentNode.parentNode.getElementsByClassName('cart-quantity-input')[0].value = val;
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
        cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}


function removeItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal();
} 

function updateCartTotal () {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for(var i=0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    total = (Math.round((total * 1000)/10)/100).toFixed(2)
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
    document.getElementsByClassName('cart-total-price')[1].innerText = '$' + total;
}

function validate(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("yourMessage").value;
    var error_message = document.getElementById("errorMessage");
    
    error_message.style.padding = "10px";
    
    var text;
    if(name.length < 5){
      text = "Please Enter Valid Name";
      error_message.innerHTML = text;
      return false;
    }
    if(email.indexOf("@") == -1 || email.length < 6){
      text = "Please Enter valid Email";
      error_message.innerHTML = text;
      return false;
    }
    if(message.length <= 140){
      text = "Please Enter More Than 140 Characters";
      error_message.innerHTML = text;
      return false;
    }
    alert("Form Submitted Successfully!");
    return true;
  }
