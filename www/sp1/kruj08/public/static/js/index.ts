const hamburgerMenu = document.getElementById("menu-toggle");
const navbar = document.querySelector(".navbar");

hamburgerMenu?.addEventListener("click", () => {
  navbar?.classList.toggle("active");
});

document.addEventListener("scroll", () => {
  const giftBox: HTMLElement | null = document.querySelector(".gift-box");
  const lid: HTMLElement | null = document.querySelector(".lid");

  const boxPosition = giftBox?.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (boxPosition) {
    let progress = (windowHeight - boxPosition.top) / windowHeight;
    progress = Math.max(0, Math.min(progress, 1));

    const translateY = 30 - progress * 150;

    if (lid) {
      lid.style.transform = `translateY(${translateY}px)`;
    } else {
      console.log("class .lid not found");
    }
  } else {
    console.log("class .gift-box doesnt exist.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const navLinks: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll("ul.navbar li a");

  // console.log(currentPath);

  navLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    // console.log(link.href);
    // console.log(window.location.origin);
    // console.log(new URL(link.href, window.location.origin).pathname);

    if (linkPath === currentPath) {
      link.classList.add("actual");
    }
  });
});
