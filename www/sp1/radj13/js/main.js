document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        link.addEventListener("mouseover", () => {
            link.style.transform = "scale(1.1)";
        });
        link.addEventListener("mouseout", () => {
            link.style.transform = "scale(1)";
        });
    });
});

// Get the modal and the close button
const modal = document.getElementById("image-modal");
const closeModal = document.getElementById("close-modal");

// Get all images in the gallery
const galleryItems = document.querySelectorAll('.gallery-item img');

// Function to open the modal with the clicked image
galleryItems.forEach(item => {
    item.addEventListener('click', function () {
        const modalImage = document.getElementById("modal-image");
        modalImage.src = this.src; // Set the modal image source to the clicked image
        modal.style.display = "block"; // Show the modal
    });
});

// Function to close the modal
closeModal.addEventListener('click', function() {
    modal.style.display = "none";
});