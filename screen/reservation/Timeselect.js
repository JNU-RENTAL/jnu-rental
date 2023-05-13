const urlParams = new URLSearchParams(location.search);
      const space = urlParams.get('space');
      const selectedSpaceElement = document.getElementById('selected-space');
      const date = urlParams.get('date');
      const selectedDateElement = document.getElementById('selected-Date');
      selectedSpaceElement.textContent = space;
      selectedDateElement.textContent = date;
      
const btns = document.querySelectorAll('.btns button');

btns.forEach((button) => {
  let isClicked = false;

  button.addEventListener('click', () => {
    if (button.classList.contains('reserve-btn')) {
        // do nothing for reservation button
        return;
      }
  
      if (!isClicked) {
        button.style.backgroundColor = 'gray';
        button.parentElement.style.backgroundColor = 'gray';
        isClicked = true;
      } else {
        button.style.backgroundColor = '';
        button.parentElement.style.backgroundColor = '';
        isClicked = false;
      }
  });
});