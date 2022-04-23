const usersUrl='https://fakestoreapi.com/users';
const cartsUrl= 'https://fakestoreapi.com/carts';
const productsUrl='https://fakestoreapi.com/products';
let usersData;
let cartsData;
let productsData;
async function fetchUsers() {
  try {
    const response = await fetch(usersUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  }
  catch(error) {
    console.error(`Could not get products: ${error}`);
  }
}
const usersPromise = fetchUsers();
usersPromise.then((json) => {usersData=json}); //json is the return of the usersPromise which the data which we fetched!
usersPromise.then((data)=>{console.log(data)});
// Get Products data

async function fetchProducts() {
  try {
    const response = await fetch(productsUrl);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const json = await response.json();
    return json;
  }
  catch(error) {
    console.error(`Could not get products: ${error}`);
  }
}

const productsPromise = fetchProducts();
productsPromise.then((json) => {productsData=json});
productsPromise.then((data)=> {console.log(data)});
productsPromise.then((json)=>{
  let categories=[{categoryName:"", value:0}];
  json.forEach(function(product){
    let checker=true;
    categories.forEach(function(element){
      if(element.categoryName===product.category){
        element.value+=product.price;
        checker=false;
      }
    });
    if(checker){
      categories.push({categoryName:product.category,value:product.price});
    }
  });
  categories.shift();
  console.log(categories); /// <--- complete answer to 2. part in the task
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
  }
  catch(error) {
    console.error(`Could not get products: ${error}`);
  }
}
const cartsPromise = fetchCarts();
cartsPromise.then((json) => {cartsData=json});
cartsPromise.then((data)=>{console.log(data)});   /// completes the 1st part of the task with the above commented logs.!


const highVC = Promise.all([usersPromise,productsPromise,cartsPromise]).then((datas)=>{
  let highestValuedCart;
  let prodValue=0;
  let highestValue=0;
  let highestValueCartUserId=-1;
  datas[2].forEach(function(cart){
    cart.products.forEach(function(product){  //ASSUMING HERE products ordered by id's otherwise we can sort datas[1] wrt to id value before all
    prodValue+=product.quantity*datas[1][product.productId].price;
    });
    highestValue=Math.max(highestValue,prodValue);
    if(highestValue===prodValue){
      highestValuedCart=[{cartId:cart.id},{value:highestValue}];
      highestValueCartUserId=cart.userId;
    }
    prodValue=0;
  });
  datas[0].forEach(function(user){
    if(highestValueCartUserId===user.id){
      highestValuedCart.push({username:user.name.firstname+" "+user.name.lastname});
    }
  });
  console.log(highestValuedCart);   /// <<-- complete answer to 3rd part of the task
  return highestValuedCart
}); // do 3rd task inside this promise


/// DISTANCE FORMULA USING GEOCOORDINATES

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


usersPromise.then((data)=>{
  const distArr=[];
  const geolocations=[];
  data.forEach(function(user){
    geolocations.push(user.address.geolocation);
  });
  // console.log(geolocations);
  let maxDist=0;
  for(let i=0;i<geolocations.length-1;i++){
    for(let j=i+1;j<geolocations.length;j++){
    const r = 6371e3; // metres
    const lat1=geolocations[i].lat;
    const lat2=geolocations[j].lat;
    const lon1=geolocations[i].long;
    const lon2=geolocations[j].long;
    const f1 = lat1 * Math.PI/180; // f, l in radians
    const f2 = lat2 * Math.PI/180;
    const deltaf = (lat2-lat1) * Math.PI/180;
    const deltal = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaf/2) * Math.sin(deltaf/2) +
            Math.cos(f1) * Math.cos(f2) *
            Math.sin(deltal/2) * Math.sin(deltal/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = r * c; // in metres

    if(maxDist<d){
      maxDist=d;
    distArr.push([i,j,d]);
  }
  }
  }
  const maxDistanceArray=distArr.pop();  /// <--- longest distance of users equal to value maxDistanceArray[2];
  console.log(maxDistanceArray);
  const maxDistanceUsers=[];
  data.forEach(function(user){
  if(user.id===maxDistanceArray[0]+1){
    maxDistanceUsers.push(user);
  }
  if(user.id===maxDistanceArray[1]+1){
    maxDistanceUsers.push(user);
  }
  });
  console.log(maxDistanceUsers); // <<---- The users who has longest distance
});
