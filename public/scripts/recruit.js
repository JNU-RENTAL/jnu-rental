// document 객체를 사용하여 HTML 문서의 요소를 가져온다.
const $profile = document.querySelector(".user_logo img");
const $recruitSearchInput = document.querySelector(".search input");
const $recruitSearchBtn = document.querySelector(".search button");
const $recruitSections = document.querySelectorAll("section");
const $recruitWriteBtn = document.querySelector(".write_btn button");

$recruitSearchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log($recruitSearchInput.value); // 검색어를 출력한다.
});

$recruitSections.forEach(function (section) {
  section.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(section.querySelector("h2").textContent); // 클릭한 게시글의 제목을 출력한다.
  });
});

$recruitWriteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("글쓰기 버튼이 클릭되었습니다."); // 글쓰기 버튼 클릭 시 메시지를 출력한다.
});


function filterPosts() {
  const searchText = $recruitSearchInput.value.trim().toLowerCase();

  // section 요소들 가져오기
  $recruitSections.forEach((section) => {
    const title = section.dataset.title.trim().toLowerCase();
    const text = section.dataset.text.trim().toLowerCase();
    const place = section.dataset.place.trim().toLowerCase();
    const user = section.dataset.user.trim().toLowerCase();

    // 검색어가 포함된 경우 해당 section 보이기
    if (
      title.includes(searchText) ||
      text.includes(searchText) ||
      place.includes(searchText) ||
      user.includes(searchText)
    ) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}