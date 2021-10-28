const loadMore = document.querySelector('.load-more button');
const container = document.querySelector('.container');
const loading = document.querySelector('.loading');

// store last document recieved
let latestDoc = null;
const getNextReviews = async () => {
    loading.classList.add('active');

    const ref = db.collection('reviews')
        .orderBy('createdAt')
        .startAfter(latestDoc || 0)
        .limit(6);
    
    const data = await ref.get();

    let template = '';
    data.docs.forEach(doc => {
        const review = doc.data();
        template += `
            <div class="card">
                <h2>${review.title}</h2>
                <p>Written by ${review.author}</p>
                <p>Rating - ${review.rating} / 5</p>
            </div>
        `
    })

    container.innerHTML += template;
    loading.classList.remove('active');

    // update latest doc
    latestDoc = data.docs[data.docs.length - 1];

    // remove event listeners if no more docs
    if (data.empty) {
        loadMore.removeEventListener('click', handleClick);
        container.removeEventListener('scroll', handleScroll);
    }
}

// wait for DOM content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());

// load more docs (click)
const handleClick = () => {
    getNextReviews();
}
loadMore.addEventListener('click', handleClick);


// load more docs (scroll)
const handleScroll = () => {
    // console.log('scrolling')
    let triggerHeight = container.scrollTop + container.offsetHeight;
    if (triggerHeight >= container.scrollHeight) { // reach the bottom of the container
        getNextReviews();
    }
}
container.addEventListener('scroll', handleScroll);