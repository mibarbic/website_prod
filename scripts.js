// Your custom JavaScript code here

// Initialize Vanta.js with 100vh coverage
VANTA.CLOUDS({
    el: "body",
    mouseControls: false,
    gyroControls: false,
    minHeight: window.innerHeight,
    minWidth: window.innerWidth,
    skyColor: 0x616161,
    cloudColor: 0xffffff,
    sunColor: 0x2e5a9b,
    sunGlareColor: 0x1e177d,
    sunlightColor: 0x16c2cd,
    speed: 0.80
});

// Function to animate "hello" text and content-container
function animateElements() {
    // Animate the "hello" text fade in
    anime({
        targets: '.hello-text',
        opacity: [0, 1], // Fade in
        duration: 1000, // Animation duration in milliseconds
        easing: 'easeInOutQuad', // Easing function for smooth animation
        complete: function () {
            // After the "hello" text animation is complete, wait for a moment and then fade it out
            setTimeout(function() {
                anime({
                    targets: '.hello-text',
                    opacity: [1, 0], // Fade out
                    duration: 1000, // Animation duration in milliseconds
                    easing: 'easeInOutQuad', // Easing function for smooth animation
                    complete: function () {
                        // Hide the "hello" text after fading out
                        document.querySelector('.hello-text').style.display = 'none';

                        // After fading out the "hello" text, animate the content-container
                        anime({
                            targets: '.content-container',
                            scaleX: [0, 1], // Scale to 1
                            scaleY: [0, 1], // Scale to 1
                            opacity: [0, 1], // Fade in
                            duration: 1000, // Animation duration in milliseconds
                            easing: 'easeOutExpo', // Easing function for smooth animation
                        });
                    }
                });
            }, 1000); // Wait for 1 second before fading out the "hello" text
        }
    });
}

// Call the animation function when the page loads
window.addEventListener('load', function () {
    // Animate the opacity of the body to make it fade in from black
    document.body.style.opacity = '1';

    // Start the other animations after a delay (adjust as needed)
    setTimeout(animateElements, 1000);
});
