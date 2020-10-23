const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photos = [];

//Unsplash API
let count = 10;
const apiKey = 'zPxrUyCgL2l-ElM7si6z3iBhlbcA3zMbLwxmfl95Wjw';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

//Check if all images were loaded
function imageLoaded(){
    imagesLoaded++;
    if (imagesLoaded == totalImages){
        loader.hidden = true;
        ready = true;
    }
}

//Helper function to set attributes on DOM elements
function setAttributes(element, attributes){
    for (key in attributes){
        //Key can be target for example.
        //and attributes[key] can be "_blank".
        element.setAttribute(key, attributes[key]);
    }
}


//Create Elements for links & Photos
function displayPhotos(){
    totalImages = photos.length;
    photos.map(photo => {
        // Create <div> this is going to be a card
        const card = document.createElement('div');
        card.setAttribute('class', 'card mb-3');

        // Create <img> for card
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.url,
            class: 'car-img-top img-fluid'
        });
        //Even Listener, check whean each is finished loading.
        img.addEventListener('load', imageLoaded);
        //Create card body
        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');

        //Card body Content
        const title = document.createElement('h3');
        title.setAttribute('class','card-title')
        title.textContent = `By ${photo.author}`;
        const date = document.createElement('p');
        date.setAttribute('class', 'card-text text-secondary')
        const dateCreated = new Date(photo.date);
        date.textContent = `${dateCreated.getMonth()} - ${dateCreated.getDate()} - ${dateCreated.getFullYear()}`;
        const description = document.createElement('p');
        description.setAttribute('class', 'card-text');
        description.textContent = photo.description;

        //Card Buttons
        const btnRow = document.createElement('div');
        btnRow.setAttribute('class','row');
        const btnCol1 = document.createElement('div');
        btnCol1.setAttribute('class','col-10 mx-auto mb-2 col-md-6');
        const btnLikes = document.createElement('a');
        btnLikes.setAttribute('class','btn btn-dark btn-lg btn-block text-white');
        btnLikes.innerHTML = `<i class="fas fa-thumbs-up"></i> ${photo.likes}`;
        const btnCol2 = document.createElement('div');
        btnCol2.setAttribute('class','col-10 mx-auto mb-2 col-md-6');
        const btnUnsplash = document.createElement('a');
        setAttributes(btnUnsplash, {
            href: photo.link,
            target: '_blank',
            class: 'btn btn-dark btn-lg btn-block'
        });
        btnUnsplash.innerHTML = `<i class="fas fa-external-link-alt"></i> Unsplash`;


        //Appending Childs
        //Buttons
        btnRow.appendChild(btnCol1);
        btnRow.appendChild(btnCol2);
        btnCol1.appendChild(btnLikes);
        btnCol2.appendChild(btnUnsplash);
        //Card Body
        cardBody.innerHTML += title.outerHTML + date.outerHTML + description.outerHTML + btnRow.outerHTML;
        //Card
        card.innerHTML += img.outerHTML + cardBody.outerHTML;
        imageContainer.appendChild(card);
    });
}

//Get photos from Unsplash API
async function getPhotos(){
    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        photos = data.map( img => {
            return {
                description: img.alt_description,
                likes: img.likes,
                date: img.created_at,
                author: img.user.name,
                url: img.urls.regular,
                link: img.links.html,
            }
        });
        displayPhotos();
    }catch(error){
        console.log(error);
    }
}


//Check to see if scrolling near botton of page, Load mora photos.
window.addEventListener('scroll',()=>{
  
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready === true){

        getPhotos();
        ready = false;
        imagesLoaded = 0;
    }
});

//On Load
getPhotos();

//Description of elements in scroll.
/* 
    offsetHeight = Total size of the body including that we cannot see.
    innerheight = size of user screen. The part that user can see.
    scrollY =   Distance from top of page user has crolled

*/