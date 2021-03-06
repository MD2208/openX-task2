const usersUrl = 'https://fakestoreapi.com/users';
const cartsUrl = 'https://fakestoreapi.com/carts';
const productsUrl = 'https://fakestoreapi.com/products';
//Get Users Data
async function fetchUsers() {
  try {
    const response = await fetch(usersUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}
const usersPromise = fetchUsers();
usersPromise.then((usersData) => {console.log(usersData)}); // The first data which we fetched from API.
// WRITING DATA TO HTML WITH A JSON VISUALIZER
$(function(){
     //Create a new visualizer object
     var _visualizer = new visualizer($(".users"));
     //Visualize the demo json object
     usersPromise.then((usersData) => {_visualizer.visualize(usersData)});
   });
// Get Products data
async function fetchProducts() {
  try {
    const response = await fetch(productsUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}
const productsPromise = fetchProducts();
productsPromise.then((productsData) => {console.log(productsData)}); // the data which we fetched from products api.
// WRITING DATA TO HTML WITH A JSON VISUALIZER
$(function(){
     //Create a new visualizer object
     var _visualizer = new visualizer($(".products"));
     //Visualize the demo json object
     productsPromise.then((productsData) => {_visualizer.visualize(productsData)});
   });
//Part 2
productsPromise.then((productsData) => {
  let categories = [{categoryName: "",value: 0}];
  productsData.forEach(function(product) {
    let checker = true;
    categories.forEach(function(element) {
      if (element.categoryName === product.category) {
        element.value += product.price;
        checker = false;
      }
    });
    if (checker) {
      categories.push({categoryName: product.category,value: product.price});
    }
  });
  categories.shift();
  console.log(categories); /// <--- complete answer to 2. part in the task
  $(function(){
       //Create a new visualizer object
       var _visualizer = new visualizer($(".part2"));
       //Visualize the demo json object
       _visualizer.visualize(categories);
     });
});

/// Carts DATA
async function fetchCarts() {
  try {
    const response = await fetch(cartsUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}
const cartsPromise = fetchCarts();
cartsPromise.then((cartsData) => {console.log(cartsData)}); /// completes the 1st part of the task with the above commented logs.!
// WRITING DATA TO HTML WITH A JSON VISUALIZER
$(function(){
     //Create a new visualizer object
     var _visualizer = new visualizer($(".carts"));
     //Visualize the demo json object
     cartsPromise.then((cartsData) => {_visualizer.visualize(cartsData)});
   });
//Highest Card Below
const highVC = Promise.all([usersPromise, productsPromise, cartsPromise]).then((datas) => {
  let highestValuedCart;
  let prodValue = 0;
  let highestValue = 0;
  let highestValueCartUserId = -1;
  datas[2].forEach(function(cart) {
    cart.products.forEach(function(product) {
//ASSUMING HERE products ordered by id's otherwise we can sort datas[1] w.r.t the id value before all
      prodValue += product.quantity * datas[1][product.productId].price;
    });
    highestValue = Math.max(highestValue, prodValue);
    if (highestValue === prodValue) {
      highestValuedCart = [{cartId: cart.id}, {value: highestValue}];
      highestValueCartUserId = cart.userId;
    }
    prodValue = 0;
  });
  datas[0].forEach(function(user) {
    if (highestValueCartUserId === user.id) {
      highestValuedCart.push({username: user.name.firstname + " " + user.name.lastname});
    }
  });
  console.log(highestValuedCart); /// <<-- complete answer to 3rd part of the task
  $(function(){
     	//Create a new visualizer object
     	var _visualizer = new visualizer($(".hvc"));
     	//Visualize the demo json object
     	_visualizer.visualize(highestValuedCart);
     });
});
/// DISTANCE FORMULA USING GEOCOORDINATES BELOW
// const R = 6371e3; // metres
// const f1 = lat1 * Math.PI/180; // f, l in radians
// const f2 = lat2 * Math.PI/180;
// const deltaf = (lat2-lat1) * Math.PI/180;
// const deltal; = (lon2-lon1) * Math.PI/180;
//
// const a = Math.sin(deltaf/2) * Math.sin(deltaf/2) +
//         Math.cos(f1) * Math.cos(f2) *
//         Math.sin(deltal/2) * Math.sin(deltal/2);
// const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//
// const d = R * c; // in metres
usersPromise.then((data) => {
  const distArr = [];
  const geolocations = [];
  data.forEach(function(user) {
    geolocations.push(user.address.geolocation);
  });
  // console.log(geolocations);
  let maxDist = 0;
  for (let i = 0; i < geolocations.length - 1; i++) {
    for (let j = i + 1; j < geolocations.length; j++) {
      const r = 6371e3; // metres
      const lat1 = geolocations[i].lat;
      const lat2 = geolocations[j].lat;
      const lon1 = geolocations[i].long;
      const lon2 = geolocations[j].long;
      const f1 = lat1 * Math.PI / 180; // f, l in radians
      const f2 = lat2 * Math.PI / 180;
      const deltaf = (lat2 - lat1) * Math.PI / 180;
      const deltal = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(deltaf / 2) * Math.sin(deltaf / 2) +
        Math.cos(f1) * Math.cos(f2) *
        Math.sin(deltal / 2) * Math.sin(deltal / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = r * c; // d is the distance between 2 locations. We check below the which one is maximum.
      if (maxDist < d) {
        maxDist = d;
        distArr.push([i, j, d]);
      }
    }
  }
  const maxDistanceArray = distArr.pop(); /// <--- longest distance of users equal to value maxDistanceArray[2];
  const maxDistanceUsers = [];
  data.forEach(function(user) {
    if (user.id === maxDistanceArray[0] + 1) {
      maxDistanceUsers.push(user);
    }
    if (user.id === maxDistanceArray[1] + 1) {
      maxDistanceUsers.push(user);
    }
  });
  console.log(maxDistanceUsers); // <<---- The users who have longest distance from each others.
  maxDistanceUsers.push({maximumDistance:maxDistanceArray[2]}); // <<--- we created an array of objects with maximum distance and the users.
  $(function(){
     	//Create a new visualizer object
     	var _visualizer = new visualizer($(".maxdistusers"));
     	//Visualize the demo json object
     	_visualizer.visualize(maxDistanceUsers);
     });
});
