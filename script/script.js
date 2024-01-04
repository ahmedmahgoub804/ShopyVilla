let app = {
    general: ()=>{
        
        // setting the copyright year
        document.getElementById('currentYear').innerText = new Date().getFullYear();
        
        /* start shopping cart */
        if(localStorage.getItem("token")){

            // getting cart value from local storage
            let cart = localStorage.getItem("cart")

            // if there is previous cart 
            if(cart){

                // rendering it in the dom
                JSON.parse(cart).forEach((v)=>{
                    app.addToCart(v)
                })

            }else{ 

                // setting empty [] as a new cart (using json to save it in local storage)
                localStorage.setItem("cart",JSON.stringify([]))
            }
    
            // cart Box 
            document.querySelector(".cart-box .icon").onclick = (e)=>{

                // Open cart Box
                e.currentTarget.parentElement.classList.toggle("open")
                
                // Spinning cart icon
                e.currentTarget.firstElementChild.classList.toggle("fa-spin")
    
                // making overlay
                document.querySelector(".overlay").classList.toggle("open")
            }

            // closing the cart when clicking outside it
            document.querySelector(".overlay").onclick = ()=>{
                document.querySelector(".cart-box .icon").click()
            }

            // order now button
            document.querySelector(".cart-box .order-button").onclick = ()=>{

                if(!document.querySelector(".cart-box .products-box .product-box")){
                    return
                }

                //  creating overlay div
                let payOverlay = document.createElement("div")
                payOverlay.classList.add("pay-overlay")

                // getting products in the cart
                let products = Array.from(document.querySelectorAll(".cart-box .products-box .product-box"))

                // creating order button
                let order = document.querySelector(".cart-box .order").cloneNode(true)

                // create overlay div inside html
                let inner = `
                    <div class="container">
                        <div class="close-button">x</div>
                        <div class="products">
                            ${  
                                // map on the products divs and create clone of everyone but without remove button
                                products.map(
                                    (v)=>{
                                        let clone = v.cloneNode(true)
                                        clone.lastElementChild.remove()
                                        return clone.outerHTML
                                    }
                                ).join('\n')
                            }
                        </div>
                        <form>

                            <input type="text" placeholder="Location" id="location"  autocomplete="off" required>
                            <div class="message"></div>
                            ${order.outerHTML}
                        </form>
                    </div>
                `
                payOverlay.innerHTML = inner

                // adding overlay with its inner html to the dom
                document.body.appendChild(payOverlay)

                // closing the pay window when clicking outside it
                payOverlay.onclick =(e)=>{
                    if(e.target === e.currentTarget){
                        e.currentTarget.remove()
                    }
                }

                // closing the pay window when clicking escape button
                document.addEventListener('keydown', function(event) {
                    if (event.key === 'Escape') {
                        payOverlay.remove()
                    }

                })

                // close overlay button
                document.querySelector(".pay-overlay .close-button").onclick= ()=>{
                    payOverlay.remove()
                }

                // addind effect on pay button
                document.querySelector(".pay-overlay form .order .order-button").onclick= ()=>{

                    // making sure user enters his location
                    if(document.querySelector(".pay-overlay form input").value){

                        // empty the cart
                        localStorage.removeItem("cart")

                        // reload the page
                        window.location.reload()

                    }else{

                        // alerting that user must enter his location
                        document.querySelector(".pay-overlay form .message").innerText = "Please Enter Your Location"
                    }
                    
                    
                }

            }
                        
        }else{

            // removing cart box from the dom
            document.querySelector(".cart-box").remove()
        }

        /* end shopping cart */


        /* START HEADER */
        // header links on click
        let headerLinks = document.querySelectorAll("header .links li:has(a)")
        headerLinks.forEach(v=>{
            v.onclick = (e)=>{

                // adding active on the clicked link only
                activeToggle(headerLinks,e.currentTarget)

            }
        })

        // header menu in mobile version
        document.querySelector(".toggle-icon").onclick=(e)=>{
            document.querySelector("header .links").classList.toggle("open")
        }

        // making category menu
        let categoryList = document.querySelector(".categ-list")

        // fetching categories names
        fetch('https://fakestoreapi.com/products/categories')

            // converting json to array
            .then((res)=>{ return res.json()})
            .then((data)=>{

                let frag = document.createDocumentFragment()

                //looping on categories to make li with a contains its value
                data.forEach((v)=>{
                    let li = document.createElement("li")
                    let a = document.createElement("a")
                    let text = document.createTextNode(v.toUpperCase())
                    a.appendChild(text)
                    li.appendChild(a)
                    a.href = `./products?category=${v}`
                    frag.appendChild(li)
                })
                //append the list to the dom
                categoryList.appendChild(frag)})
            
            // catching error
            .catch(()=>{throw new Error("couldn't fetch the data")})

            

        // opening categ menu when clicking
        let categ = document.querySelector(".categ")
        categ.addEventListener("click",(e)=>{
            e.stopPropagation()
            if(e.target === categ.firstElementChild){
                categoryList.classList.toggle("open")
            }
        })

        // closing category menu
        window.addEventListener("click",(e)=>{
            if(e.target !== categ){
                categoryList.classList.remove("open")
            }
            if(e.target !== categ && e.target !== document.querySelector(".toggle-icon")){
                document.querySelector("header .links").classList.remove("open")
            }
        })

        // adding event on the dark mode button
        document.querySelector("header .dark-container input").addEventListener('click', (e)=>{
            
            // function take boolean value of dark mode then apply dark mode and save to local storage
            applyDarkMode(e.currentTarget.checked)
        });

        // getting darkmode value in local storage
        let darkMode = localStorage.getItem("dark-mode")

        // checking its value
        if(darkMode != null){

            //apply dark mode
            applyDarkMode(darkMode === "true")

            // change darkmode button to the applied value 
            document.querySelector("label input[type='checkbox']").checked = (darkMode === "true")
        }

        // checking if the user is logged in
        if(window.localStorage.getItem("token")){

            // removing the login link
            document.querySelector("header .links .login").remove()

            // creating a profile icon
            let div = document.createElement("div")

            // adding class 
            div.classList.add("profile-icon")

            // adding the innet HTML elements
            div.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <div class="profile-menu">
                <div class="logout">Logout <i class="fa-solid fa-right-from-bracket"></i></div>
            </div>
            `

            // appending to header
            document.querySelector("header .secondary-container").appendChild(div)

            // profile icon and logout button
            let logout = document.querySelector(".profile-menu")
            let profile = document.querySelector("header .profile-icon")

            // profile icon on click openning and closing it's menu
            profile.onclick = (e)=>{
                e.stopPropagation()
                logout.classList.toggle("open")
            }

            // logout button on click removing token from local storage and reloading the page
            logout.onclick = (e)=>{
                window.localStorage.removeItem("token")
                window.location.reload()
            }

            // closing the profile menu when click away
            window.addEventListener("click",(e)=>{
                if(e.target !== profile){
                    logout.classList.remove("open")
                }
            })
        }
        
        
        /* END HEADER */

        /* Helper Functions */

        // takes boolean value of the dark mode
        function applyDarkMode(dark) {
            if (dark) {
                // save to the local storage
                localStorage.setItem("dark-mode", true)
                // setting the dark values
                document.documentElement.style.setProperty('--body-color', '#0e0e0e')
                document.documentElement.style.setProperty('--secondary-color', '#282828')
                document.documentElement.style.setProperty('--text-color', '#ffffff')
                document.documentElement.style.setProperty('--shadow-color', 'rgb(0,0,0,0.5)')
            } else {
                // save to local storage
                localStorage.setItem("dark-mode", false)
                // setting the light values
                document.documentElement.style.setProperty('--body-color', '#d6ae7a')
                document.documentElement.style.setProperty('--secondary-color', '#eee')
                document.documentElement.style.setProperty('--text-color', '#472f28')
                document.documentElement.style.setProperty('--shadow-color', 'rgb(255,255,255,0.5)')

            }
        }

        // takes arr & ele => remove active class from all arr and add it on the ele
        function activeToggle(arr,ele){
            arr.forEach((v)=>{
                v.classList.remove("active")
            })
            ele.classList.add("active")
        }
        
        if (window.location.pathname.endsWith("/")){
            app.home()
        } else if (window.location.pathname.endsWith("/product")){
            app.product()
        } else if (window.location.pathname.endsWith("/products")){
            app.products()
        }else if (window.location.pathname.endsWith("/login")){
            app.login()
        }
    },

    home: async ()=>{

        // landing product
        let landing = document.querySelector(".landing .container")
        let i = 1 ,z = 500

        // running the landing function to change landing product every 10s
        await landingSection()
        setInterval(landingSection,10000)  
        
        // product slider
        // fetch some products and make product slider under the landing product
        await productSlider()

        //  slider next button action on click
        document.querySelector(".slider-btn.next").onclick = ()=>{
            const wrapper = document.querySelector('.slider-wrapper');
            let scroll = document.querySelector(".product").offsetWidth
            wrapper.scrollBy(scroll + 55,0)
        }
        
        //  slider prev button action on click
        document.querySelector(".slider-btn.prev").onclick = ()=>{
            const wrapper = document.querySelector('.slider-wrapper');
            let scroll = document.querySelector(".product").offsetWidth
            wrapper.scrollBy(-scroll - 55,0)
        }

        // the onscroll effect status
        let start = false
        let stats = document.querySelector(".about .stats")
        let numbers = Array.from(document.querySelectorAll(".stats .number"))

        window.onscroll = ()=>{

            // when scroll to middle of stats section
            if(window.scrollY + window.innerHeight >= stats.offsetTop + stats.offsetHeight/2){
            
                if(!start){
                    //  start count from zero to objective number
                    numbers.forEach(count)
                }

                // to stop the effect from happening again
                start = true
            }    
        }

        // end loading
        app.loaded()

        // landing section function
        function landingSection(){

            // fetch a product and add 1 to i for next time
            return fetch(`https://fakestoreapi.com/products/${i++}`)

            //  convert to json
            .then((res)=>{
                if(i==21){
                    i=1
                    z=500
                }
                return res.json()})

            //  create product div and render it in the dom
            .then((data)=>{
                let product = document.createElement("div")
                product.onclick = (e)=>{
                    location.assign(`./product?id=${data["id"]}`)
                }
                product.classList.add("landing-product")
                product.style.zIndex = --z
                let img = `
                    <img src="${data['image']}" alt="${data['title']}">
                    <div class="text">
                        <h2>${data['title']}</h2>
                    </div>
                `
                product.innerHTML = img
                landing.appendChild(product)

                //  sliding the previious product away after the new product is reaady
                landing.firstElementChild.classList.add("slide")
                setTimeout(()=>{

                    // removing the previous product from the dom 
                    landing.firstElementChild.remove()
                },1000)})
                .catch("error fetching")

        }

        //slider function
        function productSlider(){

            // fetch 9 product for the slider
            return fetch('https://fakestoreapi.com/products?limit=9')

            // convert to json
            .then(res=>res.json())

            // create a slider and append all the products in it then render the slider in the dom
            .then((data)=>{
                let sliderWrapper = document.createElement("div")
                let sliderContainer = document.querySelector(".slider-container")
                sliderWrapper.classList.add("slider-wrapper")
                data.forEach((v)=>{
                    let sliderItem = `
                    <div class="product">
                        <div class="image-container"><img src="${v["image"]}" alt="" /></div>
                        <div class="content">
                          <h3>${v["title"]}</h3>
                          <p>${v["price"]}$</p>
                        </div>
                        <a href="./product?id=${v["id"]}">See More <i class="fas fa-long-arrow-alt-right"></i></a>
                    </div>
                    `
                    sliderWrapper.innerHTML += sliderItem
                })
                sliderContainer.prepend(sliderWrapper)
            })
                .catch("error fetching")
        }

        // count function
        function count(v){

            // get the objective value
            let objective = v.dataset.obj
            let handler = setInterval(()=>{

                // increase div inner value
                v.textContent++

                // clear interval when the value is already = objective
                if(v.textContent == objective){
                    clearInterval(handler)
                }
            },2000 / objective)
        }
    },

    product: async ()=>{

        //getting product id from the url
        const urlParams = new URLSearchParams(window.location.search)
        
        // checking if the user sending get request without url then reallocate to home
        if(!urlParams.has("id")){
            window.location.replace("./")
        }

        // fetching the product data
        await fetchProduct()
        
        // end loading
        app.loaded()

        // helper functions
        function fetchProduct(){

            // fetch the product in the url
            return fetch(`https://fakestoreapi.com/products/${urlParams.get("id")}`)

            // convert json to js object
            .then(res=>res.json())

            // creating product and rendering in the dom 
            .then((data)=>{
                let section = document.querySelector("section.page .product-page")

                // add to cart button
                let button = ""

                // Creating and add to cart button if the user is logged in
                if(window.localStorage.getItem("token")){

                    // creating input for count and add to cart button
                    button = `
                    <form class="cart">
                        <input type="number" id="quantity" name="quantity" min="1" value="1">
                        <div class="add-to-cart" data-title=${data['title'].replaceAll(" ","|")} data-price=${data['price']} data-image=${data['image']}>Add To Cart</div>
                    </form
                    `
                }

                let product = `
                <div class="image-container">
                    <img src="${data['image']}" a;t="${data['title']}">
                </div>
                <div class="text">
                    <h2 class="title">${data['title']}</h2>
                    <a class="category "href="./products?category=${data['category']}">${data['category']}</a>
                    <p class="description">${data['description']}</p>
                    <div class="price-container">
                        <div class="price">Price: ${data['price']}$</div>
                        <div class="rate"><i class="fas fa-star"></i> ${data["rating"]['rate']} || Count: ${data['rating']['count']}</div>
                    </div>
                    ${ button }
                </div>
                `

                section.innerHTML = product
            })
        }

        // making sure the user is signned in
        if(window.localStorage.getItem("token")){
            
            // adding to cart button effect
            document.querySelector(".add-to-cart").onclick = (e)=>{
                
                // get product data
                let title =  e.currentTarget.dataset.title.replaceAll("|"," ")
                let image = e.currentTarget.dataset.image
                let count = document.querySelector(".cart #quantity").value
                let price = e.currentTarget.dataset.price * count
                let id = app.generateId()

                // making a product object
                let product = {title, image, count, price, id}
                
                // get the cart data from local storage and parse it 
                let cart = JSON.parse(localStorage.getItem("cart"))

                // update the cart 
                cart.push(product)

                // saving cart after update (save it in local storage as json)
                localStorage.setItem("cart", JSON.stringify(cart))

                // adding the product to the cart in the dom
                app.addToCart(product)

                // openning your cart after update
                document.querySelector(".cart-box .icon").click()

            }
        }

    },

    products: async ()=>{

        //getting products category from the url
        const urlParams = new URLSearchParams(window.location.search)

        // getting category name
        let category = urlParams.get("category")

        // fetching all the products
        await fetchProducts()

        // getting all the loaded products
        let products = Array.from(document.querySelectorAll("section.products .product"))
        
        // getting the filter buttons
        let filters = document.querySelectorAll(".products .filter .spans span")

        // filtering only project in our category
        filter(category)
        
        // openning the filter box if loading with filter
        if(category){
            document.querySelector(".products .filter .spans").classList.toggle("open")
        }

        // adding click effect on every button
        filters.forEach((v)=>{

            // adding active on the active category button
            if(v.dataset.categ == category){
                activeToggle(filters,v)
            }

            v.addEventListener("click",(e)=>{

                // adding active class on it
                activeToggle(filters,e.target)

                // filter products depending on the clicked button
                category = e.target.dataset.categ
                filter(category)

                // empty the search input
                document.querySelector(".search-container input").value = ""
            })
        })

        // openning and closing the filter box with the filter button
        document.querySelector(".products .filter .filter-button").addEventListener("click",(e)=>{
            document.querySelector(".products .filter .spans").classList.toggle("open")
        })

        // filtering products with search input
        document.querySelector(".search-container input").addEventListener("input",(e)=>{
            products.forEach((v)=>{
                if(v.dataset.categ === category || !category){
                    let title = v.dataset.title.toLowerCase()
                    let query = e.target.value.toLowerCase()
                    if(title.includes(query)){
                        v.style.display = "block"
                    }else{
                        v.style.display = "none"
                    }
                }
            })
        })

        app.loaded()

        // helper functions
        //takes category and fetch Data
        function fetchProducts(){

            // fetching products in url
            return fetch(`https://fakestoreapi.com/products`)

            // converting json to js object
            .then(res=>res.json())

            // creating products and rendering in the dom
            .then((data)=>{
                let section = document.querySelector("section.products .inner-container")
                let frag = document.createDocumentFragment()
                data.forEach((v)=>{
                    let div = document.createElement("div")
                    div.setAttribute("data-categ",v["category"])
                    div.setAttribute("data-title",v["title"])
                    div.classList.add("product")
                    let product = `
                        <div class="image-container"><img src="${v["image"]}" alt="" /></div>
                        <div class="content">
                          <h3>${v["title"]}</h3>
                          <p>${v["price"]}$</p>
                        </div>
                        <a href="./product?id=${v["id"]}">See More <i class="fas fa-long-arrow-alt-right"></i></a>
                    `
                    div.innerHTML = product
                    frag.appendChild(div)
                })
                section.appendChild(frag)
            })
        }

        // filter all the data to get a specific category
        function filter(category){
            
            // filtering the products
            products.forEach((v)=>{
                if(v.dataset.categ === category || !category){
                    v.style.display = "block"
                }else{
                    v.style.display = "none"
                }
            })
        }

        // takes arr and an ele and add active class on it 
        function activeToggle(arr,ele){
            arr.forEach((v)=>{
                v.classList.remove("active")
            })
            ele.classList.add("active")
        }
    },

    login: ()=>{

        // making sure the user is not already logged in 
        if(window.localStorage.getItem("token")){

            // if user already logged in then relocate to home
            window.location.replace("./")
        }

        // getting the card container to create toggle card effect
        const cardContainer = document.querySelector('section.login-signup .container');

        // adding and removing a class to toggle the card using links on both sides
        document.querySelectorAll(".toggle-form").forEach((v)=>{
            v.onclick = ()=>{
                cardContainer.classList.toggle('is-flipped');
            }
        })
        
        // adding function to invoke when user sign in
        document.querySelector("button#signin").onclick = login
        
        // adding function to invoke when user sign up
        document.querySelector("button#signup").onclick = signup

        // removing the loading page
        app.loaded()

        // sign up function
        async function signup() {

            // getting the data from the form inputs
            const data = {
                firstname: document.getElementById("signup-firstname").value,
                lastname: document.getElementById("signup-lastname").value,
                username: document.getElementById("signup-username").value,
                email: document.getElementById("signup-email").value,
                phonenumber: '+' + document.getElementById("signup-phone").value,
                password: document.getElementById("signup-password").value
            };

            // Regular expressions for validation check
            const nameRegex = /^[A-Za-z]+$/; // Only letters allowed in the name
            const usernameRegex = /^[a-zA-Z0-9_]+$/; // Alphanumeric with optional underscore for username
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
            const phoneRegex = /^\+\d{1,3}\d{10}$/; // Country code followed by a 10-digit phone number
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

            // getting the div that contains the message if user miss informations
            let message = document.querySelector("#signup-form .message")
            
            //  making sure the user filled all the fields
            if (!data.firstname || !data.lastname || !data.username || !data.email || !data.phonenumber || !data.password) {
                message.innerText = "Please fill in all the required fields.";
                return;
            }

            // making sure the user first and last name are only letters
            if (!nameRegex.test(data.firstname) || !nameRegex.test(data.lastname)) {
                message.innerText = "Invalid name. Only letters are allowed.";
                return;
            }

            // making sure the username Use only alphanumeric characters or underscore
            if (!usernameRegex.test(data.username)) {
                message.innerText = "Invalid username. Use only alphanumeric characters with an optional underscore.";
                return;
            }

            // checking email validation
            if (!emailRegex.test(data.email)) {
                message.innerText = "Invalid email address.";
                return;
            }

            // check phone validation
            if (!phoneRegex.test(data.phonenumber)) {
                message.innerText = "Invalid phone number. Please enter a valid phone number with a country code.";
                return;
            }

            // check password validation
            if (!passwordRegex.test(data.password)) {
                message.innerText = "Invalid password. Minimum eight characters, at least one letter and one number.";
                return;
            }

            // getting all the usernames to check is the user or email is taken
            await fetch('https://fakestoreapi.com/users')
            .then(res=>res.json())

            // looping on data to see the username matching
            .then((json)=>{
                json.forEach((v)=>{
                    if (data.username == v["username"]){

                        // if the username match then it will change the message div inner text
                        message.innerText = "The username is already taken.";
                    }else{
                        message.innerText = "";
                    }
                    if (data.email == v["email"]){

                        // if the email match then it will change the message div inner text
                        message.innerText = "This email is already used";
                    }else{
                        message.innerText = "";
                    }
                })
            })

            // checking if the message div inner text change 
            if(message.innerText){

                // then the signup function will return without sending data to the api
                return;
            }
            
            // making post request to add the user to the api (nothing will change anyway)
            fetch('https://fakestoreapi.com/users',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(
                    {
                        email: data.email,
                        username:data.username,
                        password:data.password,
                        name:{
                            firstname:data.firstname,
                            lastname:data.lastname
                        },
                        address:{},
                        phone:data.phonenumber
                    }
                )
            })

            // get the json from the response body and convert it to js object
            .then(res=>res.json())

            // adding token to local storage as the user logged in (the api won't send token so I use user id instead)
            .then((data)=>{
                window.localStorage.setItem("token", data["id"])

                // relocate to home page
                window.location.assign("./")
            })
        }
        
        // sign in function
        function login() {

            // getting the data from the form inputs
            const data = {
                username: document.getElementById('login-username').value,
                password: document.getElementById('login-password').value
            }
            
            // Regular expressions for validation check
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            const passwordRegex = /^.{6,}$/;

            // getting the div that contains the message if user miss informations
            let message = document.querySelector("#login-form .message")

            //  making sure the user filled all the fields
            if (!data.username || !data.password) {
                message.innerText = "Please fill in all the required fields.";
                return;
            }

            // making sure the username Use only alphanumeric characters or underscore
            if (!usernameRegex.test(data.username)) {
                message.innerText = "Invalid username. Use only alphanumeric characters and underscore.";
                empty()
                return;
            }

            // check password validation
            if (!passwordRegex.test(data.password)) {
                message.innerText = "Invalid password. Password must be at least 6 characters long.";
                empty()
                return;
            }

            // making post request to sign in
            fetch('https://fakestoreapi.com/auth/login',{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(data)
            })

            // get the json from the response body and convert it to js object
            .then(res=>res.json())

            // if the api returns data then it will be the user token and the log in process is done
            .then((data)=>{

                // adding the token to local storage
                window.localStorage.setItem("token", data["token"])

                // relocate to the home page
                window.location.assign("./")

            })
            
            // if user and password did't match user in the api it will throw an error
            .catch(()=>{

                // adding error to the message inner text
                message.innerText = "Username and Password didn't match"

                empty()
            })

            // emptying the username and password fields
            function empty(){
                document.getElementById('login-username').value = "";
                document.getElementById('login-password').value = "";
            }
        }
    },

    loaded: ()=>{

        // stopping the loading screen
        document.querySelector(".loading").style.display = "none"
    },
    addToCart: (data)=>{

        //the cart box
        const cartBox = document.querySelector(".cart-box .products-box")
        
        // crating a product to add to cart box
        let product = document.createElement("div")
            product.classList.add("product-box")
            let inner = `
                <div class="image-container"><img src="${data["image"]}" alt=${data["title"]}></div>
                <div class="content">
                    <div class="title">${data["title"]}</div>
                    <div class="price">Quantity: ${data["count"]}</div>
                    <div class="price">Total Price: ${data["price"]}$</div>
                </div>
            ` 
            // changing the product inner html
            product.innerHTML = inner

            // making a remove button
            let removeButton = document.createElement("div")
            removeButton.classList.add("remove")
            removeButton.innerText = "x"

            // add removing event on click
            removeButton.onclick = (e)=>{

                // minus the removed product price 
                let totalPrice = parseFloat(document.querySelector(".cart-box .order .total-price").innerText)
                document.querySelector(".cart-box .order .total-price").innerText = (totalPrice - data["price"]).toFixed(2)

                // remove from local storage
                let cart = JSON.parse(localStorage.getItem("cart"))
                cart = cart.filter((v)=>v["id"] != data["id"])
                localStorage.setItem("cart",JSON.stringify(cart))

                // remove it from the dom
                e.currentTarget.parentElement.remove()
            }

            // appending the remove button to the product
            product.appendChild(removeButton)

            // adding to cart box
            cartBox.appendChild(product)
            
            // adding the product price 
            document.querySelector(".cart-box .order .total-price").innerText = (parseFloat(document.querySelector(".cart-box .order .total-price").innerText) + data["price"]).toFixed(2)
    },

    generateId: ()=>{
        // Retrieve the last generated ID from localStorage
        let lastId = localStorage.getItem('lastId') || 0;

        // Increment the ID for the next use
        let nextId = parseInt(lastId, 10) + 1;
        
        // Save the next ID to localStorage
        localStorage.setItem('lastId', nextId.toString());
        
        // Update the HTML display
        return nextId
    }
}

app.general()



    