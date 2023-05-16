// 모달 열기
const openModalButton = document.querySelector('#open-modal');
const modal = document.querySelector('#modal-form');
const closeModalButton = document.querySelector('#close-modal');

openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// 모달 닫기
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달 영역 외 클릭 시 닫기
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});
