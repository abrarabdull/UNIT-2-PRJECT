
document.addEventListener("DOMContentLoaded", function () {

    const mainImg = document.getElementById("mainCityImg");
    const thumbs = document.querySelectorAll(".thumb");

    if (!mainImg || thumbs.length === 0) return;

    let index = 0;

   
    function updateImage() {
        mainImg.src = thumbs[index].src;

        thumbs.forEach(t => t.classList.remove("active"));
        thumbs[index].classList.add("active");
    }

    
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => {
            index = i;
            updateImage();
        });
    });

  
    setInterval(() => {
        index = (index + 1) % thumbs.length;
        updateImage();
    }, 4000);

});
