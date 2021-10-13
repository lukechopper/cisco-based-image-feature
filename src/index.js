import './css/global.css';
import './css/styles.css';
import gsap from 'gsap';

let canUseAnimation = window.innerWidth > 1200;

const imageDisplayContainer = document.querySelector('.img-display__container');
const imageDisplays = document.querySelectorAll('.img-display__container > *');
let indexOfCurrentImageDisplay = null; //store index of current image display

const textContainersBottomStore = [];
/*move text containers downwards so that only their titles are visible and, whilst doing this, store their correct positioning so that they 
can be used in further animations later on.*/
function moveTextContainers(){
    imageDisplays.forEach(imageDisplay => {
        const textContainer = imageDisplay.querySelector('.img-display__text-container'); const textHeader = imageDisplay.querySelector('.img-display__text-header');
        /*if the viewports width is too small for us to interact with our image feature, our textContainers may now be positioned incorrectly from a 
        previous invoking of this method, and so, we need to reset all of their positions back to their default value: 0.*/
        if(!canUseAnimation){
            textContainer.style.bottom = '0';
            return;
        }
        const height = textContainer.clientHeight - textHeader.clientHeight - 35;
        textContainer.style.bottom = -height+'px';
        textContainersBottomStore.push(-height);
    });
};
moveTextContainers();
//remove hide modifier class from text header but only if it is actually on inputted text header in the first place
function removeHideClassFromTextHeader(textHeader){
    if(textHeader.classList.contains('img-display__text-header--hide')){
        textHeader.classList.remove('img-display__text-header--hide');
    }
}
//Text containers upwards animation
function animateTextContainersUp(index){
    const imageDisplay = imageDisplays[index];
    const textContainer = imageDisplay.querySelector('.img-display__text-container');
    textContainer.classList.remove('img-display__text-container--hide');
    gsap.to(textContainer, {bottom: 0, duration: 0.4, ease: 'Power4.easeOut', overwrite: true});
    const textHeader = textContainer.querySelector('.img-display__text-header');
    removeHideClassFromTextHeader(textHeader);
}
//Text containers downwards animation
function animateTextContainersDown(index){
    if(index === null) return;
    const imageDisplay = imageDisplays[index];
    const textContainer = imageDisplay.querySelector('.img-display__text-container');
    textContainer.classList.add('img-display__text-container--hide');
    const textHeader = textContainer.querySelector('.img-display__text-header');
    textHeader.classList.add('img-display__text-header--hide');
    gsap.to(textContainer, {bottom: textContainersBottomStore[index], duration: 0.25, ease: 'Power4.easeOut', overwrite: true});
    textHeader.addEventListener('animationend', e => {
        removeHideClassFromTextHeader(textHeader);
    });
}

/*called each time the user hovers their mouse over any image display on our image feature. It positions things correctly
so that the image display that we just hovered over is on top of all the others. */
function sortOutZIndexPosition(index){
    imageDisplays.forEach((imageDisplay, i) => {
        if(index === i){
            imageDisplay.style.zIndex = '10';
            return;
        }
        if(i === 1){
            imageDisplay.style.zIndex = '5';
            return;
        }
        imageDisplay.style.zIndex = '';
    });
}

//send the other images that aren't being selected to go back in
function sendImageDisplayBackIn(index){
    if(index === null) return;
    const imageDisplay = imageDisplays[index];
    gsap.to(imageDisplay, {duration: 0.25, width: '33.333333%', ease: 'easeIn', overwrite: true});
    animateTextContainersDown(index);
}

//remove black screens from all image displays because user has hovered their mouse outside of the entire feature
function removeBlackScreensFromAllImageDisplays(){
    imageDisplays.forEach((imageDisplay, index) => {
        if(index === indexOfCurrentImageDisplay) return;
        const blackScreen = imageDisplay.querySelector('.img-display__black-screen');
        gsap.to(blackScreen, {duration: 1, opacity: 0, overwrite: true});
    });
}

//start animating in the black screens non-selected image displays
function activateBlackScreen(index){
    imageDisplays.forEach((imageDisplay, i) => {
        if(i === index) return;
        const blackScreen = imageDisplay.querySelector('.img-display__black-screen');
        gsap.to(blackScreen, {duration: 3.5, opacity: 0.8, ease: 'easeIn', overwrite: true});
    });
}

imageDisplays.forEach((imageDisplay, index) => {
    imageDisplay.onmouseenter = () => {
        if(!canUseAnimation) return;//we don't want to give our image feature any interactivity unless the screens width is beyond a certain threshold
        const blackScreen = imageDisplay.querySelector('.img-display__black-screen'); gsap.to(blackScreen, {duration: 0, opacity: 0, overwrite: true});
        sortOutZIndexPosition(index);
        gsap.to(imageDisplay, {duration: 0.5, width: '60%', ease: 'Power4.easeOut'});
        sendImageDisplayBackIn(indexOfCurrentImageDisplay);
        activateBlackScreen(index);
        animateTextContainersUp(index);
        indexOfCurrentImageDisplay = index;//this variable is now up to date with the index of the image display that we most recently hovered our mouse over
    };
});

imageDisplayContainer.onmouseleave = () => {
    if(!canUseAnimation) return; //we don't want to give our image feature any interactivity unless the screens width is beyond a certain threshold
    sendImageDisplayBackIn(indexOfCurrentImageDisplay);
    removeBlackScreensFromAllImageDisplays();
    indexOfCurrentImageDisplay = null;
}

addEventListener('resize', () => {
    let prevCanUseAnimation = canUseAnimation;
    canUseAnimation = window.innerWidth > 1200;
    /*may potentially need to capture the position values of our display images text containers again because we have
    just passed the threshold, in either direction, for being able to interact with out image feature.*/
    if(prevCanUseAnimation !== canUseAnimation) moveTextContainers();
});