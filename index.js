function changeLayout() {
  const screenWidth = window.innerWidth;

  if (screenWidth > 760) {
    const pageElement = document.getElementById("page");
    pageElement.classList.add("card");
    const tabElement = document.querySelector(".tab.curr > div");
    tabElement.classList.remove("card");
  } else {
    const pageElement = document.getElementById("page");
    pageElement.classList.remove("card");
    const tabElement = document.querySelector(".tab.curr > div");
    tabElement.classList.add("card");
  }
}

async function changePage(direction) {
  const oldPageNr = pageNr;
  pageNr += direction;

  const tabs = await document.querySelectorAll(".tab");

  tabs[oldPageNr].classList.remove("curr");
  tabs[pageNr].classList.add("curr");

  const steps = document.querySelectorAll(".step");
  if (pageNr < pageCount - 1) {
    steps[oldPageNr].classList.remove("curr");
    steps[pageNr].classList.add("curr");
  }

  changeLayout();
  if (pageNr === pageCount - 2) calculateTotal();
}

let pageNr = -1;
let pageCount = 0;

async function initForm() {
  const form = document.querySelector("form");
  form.reset();

  const tabs = await document.querySelectorAll(".tab");
  pageCount = tabs.length;

  for (let i = 0; i < pageCount; i++)
    if (tabs[i].classList.contains("curr")) pageNr = i;

  if (pageNr === -1) {
    pageNr = 0;
    tabs[0].classList.add("curr");
  }

  const steps = document.querySelectorAll(".step");
  steps[pageNr].classList.add("curr");

  const backBtn = document.querySelector(".btn.back");
  backBtn.addEventListener("click", moveBack);
  const continueBtn = document.querySelector(".btn.continue");
  continueBtn.addEventListener("click", moveForward);
  const confirmBtn = document.querySelector(".btn.confirm");
  confirmBtn.addEventListener("click", confirmForm);

  const planDurationCheckbox = document.querySelector("#plan_duration");
  planDurationCheckbox.addEventListener("change", togglePlanDuration);

  if (backBtn.classList.contains("hidden") && pageNr != 0)
    backBtn.classList.remove("hidden");
  changeLayout();
}

function moveBack() {
  if (pageNr === 0) return;
  if (pageNr === 1) {
    const backBtn = document.querySelector(".btn.back");
    backBtn.classList.add("hidden");
  }
  if (pageNr === pageCount - 2) {
    const continueBtn = document.querySelector(".btn.continue");
    continueBtn.classList.remove("hidden");
    const confirmBtn = document.querySelector(".btn.confirm");
    confirmBtn.classList.add("hidden");
  }
  changePage(-1);
}

function moveForward() {
  if (pageNr === 0) {
    const backBtn = document.querySelector(".btn.back");
    backBtn.classList.remove("hidden");
  }
  if (pageNr === pageCount - 3) {
    const continueBtn = document.querySelector(".btn.continue");
    continueBtn.classList.add("hidden");
    const confirmBtn = document.querySelector(".btn.confirm");
    confirmBtn.classList.remove("hidden");
  }
  changePage(1);
}

function togglePlanDuration(event) {
  const checkbox = document.querySelector("#plan_duration");

  const monthlyPrices = document.querySelectorAll(".price.monthly");
  const yearlyPrices = document.querySelectorAll(".price.yearly");
  const promotions = document.querySelectorAll(".promotion");

  const totals = document.querySelectorAll(".total_price .total");

  if (checkbox.checked) {
    monthlyPrices.forEach((price) => price.classList.add("hidden"));
    yearlyPrices.forEach((price) => price.classList.remove("hidden"));
    promotions.forEach((promotion) => promotion.classList.remove("hidden"));
    totals.forEach((total) => total.classList.toggle("hidden"));
  } else {
    monthlyPrices.forEach((price) => price.classList.remove("hidden"));
    yearlyPrices.forEach((price) => price.classList.add("hidden"));
    promotions.forEach((promotion) => promotion.classList.add("hidden"));
    totals.forEach((total) => total.classList.toggle("hidden"));
  }
}

function confirmForm() {
  changePage(1);

  const confirmBtn = document.querySelector(".btn.confirm");
  confirmBtn.classList.add("hidden");
  const backBtn = document.querySelector(".btn.back");
  backBtn.classList.add("hidden");
}

window.addEventListener("load", initForm);
window.addEventListener("resize", changeLayout);

function changeOptionState(checkbox) {
  if (checkbox.checked) checkbox.parentElement.classList.add("active");
  else checkbox.parentElement.classList.remove("active");
}

let ll1;

async function calculateTotal() {
  const formData = new FormData(await document.getElementById("form"));

  const planName = document.querySelector("#receipt .info .name");
  const planPrice = document.querySelector("#receipt .plan_price");
  const options = document.querySelectorAll("#receipt .options > div");

  const isYearlyPlan = formData.get("plan_duration") == "yearly" ? true : false;

  let totalSum = 0;

  switch (formData.get("plan")) {
    case "arcade_plan":
      planName.textContent = `Arcade (${isYearlyPlan ? "yearly" : "monthly"})`;
      planPrice.textContent = `$9${isYearlyPlan ? "0/yr" : "/mo"}`;
      totalSum += isYearlyPlan ? 90 : 9;
      break;
    case "advanced_plan":
      planName.textContent = `Adcanced (${
        isYearlyPlan ? "yearly" : "monthly"
      })`;
      planPrice.textContent = `$12${isYearlyPlan ? "0/yr" : "/mo"}`;
      totalSum += isYearlyPlan ? 120 : 12;
      break;
    case "pro_plan":
      planName.textContent = `Pro (${isYearlyPlan ? "yearly" : "monthly"})`;
      planPrice.textContent = `$15${isYearlyPlan ? "0/yr" : "/mo"}`;
      totalSum += isYearlyPlan ? 150 : 15;
      break;
  }

  let optionsExists = false;

  if (
    formData.get("online_services") &&
    (optionsExists = true) &&
    (totalSum += isYearlyPlan ? 10 : 1)
  )
    options[0].classList.remove("hidden");
  else options[0].classList.add("hidden");

  if (
    formData.get("large_storage") &&
    (optionsExists = true) &&
    (totalSum += isYearlyPlan ? 20 : 2)
  )
    options[1].classList.remove("hidden");
  else options[1].classList.add("hidden");

  if (
    formData.get("costumizable_profile") &&
    (optionsExists = true) &&
    (totalSum += isYearlyPlan ? 20 : 2)
  )
    options[2].classList.remove("hidden");
  else options[2].classList.add("hidden");

  const optionsParent = document.querySelector("#receipt .options");

  if (optionsExists) optionsParent.classList.remove("hidden");
  else optionsParent.classList.add("hidden");

  const actualSize = document.querySelector("#receipt .actual_price");
  actualSize.textContent = "$" + totalSum + (isYearlyPlan ? "/yr" : "/mo");
}

function restartForm() {
  //goes to second page
  // TODO: Change name to something better
  changePage(1 - pageNr);
  const continueBtn = document.querySelector(".btn.continue");
  continueBtn.classList.remove("hidden");
  const confirmBtn = document.querySelector(".btn.confirm");
  confirmBtn.classList.add("hidden");
  const navigation = document.querySelector(".navigation");
  navigation.classList.add("hidden");
}
