const btns = document.querySelectorAll(".login_btn button");
const $reservationSubmit = document.querySelector("#reservation_submit");

let time = "";
let count = 0;
let link = ``;

btns.forEach((button) => {
  let isClicked = false;

  button.addEventListener("click", () => {
    if (!isClicked) {
      button.style.backgroundColor = "aqua";
      button.parentElement.style.backgroundColor = "aqua";
      isClicked = true;
      time =
        count === 0
          ? button.textContent.slice(0, 2)
          : time < parseInt(button.textContent.slice(0, 2))
          ? time
          : button.textContent.slice(0, 2);
      count += 1;
    } else {
      button.style.backgroundColor = "";
      button.parentElement.style.backgroundColor = "";
      isClicked = false;
      count -= 1;
      time =
        count === 0
          ? 0
          : time === button.textContent.slice(0, 2)
          ? `${parseInt(time) + 1}`
          : time;
    }
    link = ``;
    link = `${time}${parseInt(time) + count}`;
    $reservationSubmit.href = $reservationSubmit.href.replace(
      "reservation",
      "apply"
    );
    $reservationSubmit.href =
      $reservationSubmit.href.slice(-1) === "/"
        ? $reservationSubmit.href + link
        : $reservationSubmit.href.slice(0, -4) + link;
  });
});
