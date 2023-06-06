const urlParams = new URLSearchParams(location.search);
      const space = urlParams.get('space');
      const selectedSpaceElement = document.getElementById('selected-space');
      selectedSpaceElement.textContent = space;

      const selectedSpace = selectedSpaceElement.textContent;
      // 버튼 클래스의 요소들을 선택
      const btns = document.querySelectorAll('.date_btn button');
      // 각 요소의 텍스트 값을 현재 값에서 7일을 더한 값으로 변경
      btns.forEach((btn, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 7);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        btn.textContent = `${month}월 ${day}일`;
        
      const selectedDate = `${month}월 ${day}일`;
        btn.addEventListener('click', () => {
          location.href = `Timeselect.html?space=${space}&date=${selectedDate}`;
        });
      });