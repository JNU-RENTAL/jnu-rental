const btns = document.querySelectorAll('.space_btn button');
      btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const spaceName = btn.textContent;
        const url = `Dateselect.html?space=${encodeURIComponent(spaceName)}`; // 쿼리 파라미터 추가
      location.href = url;
      });
    });