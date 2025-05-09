document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const coverImageInput = document.getElementById('coverImage');
    const articleLinkInput = document.getElementById('articleLink');
    const descriptionInput = document.getElementById('description');
    const imagePreview = document.getElementById('imagePreview');
    const contentList = document.getElementById('contentList');
  
    let editIndex = null;
  
    // Load existing content from localStorage
    let contents = JSON.parse(localStorage.getItem('carouselContents')) || [];
    renderContentList();
  
    // Image preview
    coverImageInput.addEventListener('change', () => {
      const file = coverImageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Form submission
    uploadForm.addEventListener('submit', e => {
      e.preventDefault();
  
      const file = coverImageInput.files[0];
      const articleLink = articleLinkInput.value.trim();
      const description = descriptionInput.value.trim();
  
      if (!file || !articleLink || !description) {
        alert('Please fill in all fields.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = e => {
        const imageData = e.target.result;
  
        const contentItem = {
          image: imageData,
          link: articleLink,
          description: description
        };
  
        if (editIndex !== null) {
          contents[editIndex] = contentItem;
          editIndex = null;
        } else {
          if (contents.length >= 2) {
            contents.shift(); // Keep only the latest two entries
          }
          contents.push(contentItem);
        }
  
        localStorage.setItem('carouselContents', JSON.stringify(contents));
        renderContentList();
        updateCarouselSlides();
        uploadForm.reset();
        imagePreview.src = '';
      };
      reader.readAsDataURL(file);
    });
  
    function renderContentList() {
      contentList.innerHTML = '';
      contents.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'content-item';
  
        const img = document.createElement('img');
        img.src = item.image;
        div.appendChild(img);
  
        const link = document.createElement('p');
        link.textContent = `Link: ${item.link}`;
        div.appendChild(link);
  
        const desc = document.createElement('p');
        desc.textContent = `Description: ${item.description}`;
        div.appendChild(desc);
  
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
          articleLinkInput.value = item.link;
          descriptionInput.value = item.description;
          imagePreview.src = item.image;
          editIndex = index;
        });
        div.appendChild(editBtn);
  
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', () => {
          contents.splice(index, 1);
          localStorage.setItem('carouselContents', JSON.stringify(contents));
          renderContentList();
          updateCarouselSlides();
        });
        div.appendChild(deleteBtn);
  
        contentList.appendChild(div);
      });
    }
  
    function updateCarouselSlides() {
      const carouselTrack = document.getElementById('carouselTrack');
      const existingSlides = carouselTrack.querySelectorAll('.carousel-slide');
      // Remove existing dynamic slides (slides 4 and 5)
      existingSlides.forEach((slide, index) => {
        if (index >= 3) {
          carouselTrack.removeChild(slide);
        }
      });
  
      // Add new slides
      contents.forEach(item => {
        const figure = document.createElement('figure');
        figure.className = 'carousel-slide';
  
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'User uploaded content';
        figure.appendChild(img);
  
        const figcaption = document.createElement('figcaption');
        const h2 = document.createElement('h2');
        h2.textContent = item.description;
        figcaption.appendChild(h2);
  
        const p = document.createElement('p');
        p.textContent = item.link;
        figcaption.appendChild(p);
  
        figure.appendChild(figcaption);
        carouselTrack.appendChild(figure);
      });
    }
  
    // Initial load
    updateCarouselSlides();
  });
  