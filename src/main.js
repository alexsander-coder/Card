import "./css/index.css"
import IMask from "imask";

const bgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const bgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const securityCode = document.querySelector('#security-code');
const expirationDate = document.querySelector('#expiration-date');
const cardNumber = document.querySelector('#card-number');
const nameUser = document.querySelector('#card-holder');
const addButton = document.querySelector('#add-card');
const cardHolder = document.querySelector('#card-holder');


function setCardType(type) {
  const colors = {
    "visa": ["#436099", "#2057F2"],
    "mastercard": ["#0F6F29", "#C69347"],
    "default": ["black", "gray"]
  }
  bgColor01.setAttribute("fill", colors[type][0]);
  bgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}
// setCardType("mastercard");

globalThis.setCardType = setCardType

const securityCodePattern = {
  mask: "0000"
}

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],

  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    // console.log(foundMask);
    return foundMask
  }
}

const inNameUser = {
  mask: /^[a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/
}

const nameFinish = IMask(nameUser, inNameUser);
const securityCodeMasked = IMask(securityCode, securityCodePattern);
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

addButton.addEventListener('click', () => {
  // console.log('click success!');
})
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
})

cardHolder.addEventListener('input', () => {
  const ccHolder = document.querySelector('.cc-holder .value')
  ccHolder.innerText = cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value
})

securityCodeMasked.on('accept', () => {
  updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector('.cc-security .value')
  ccSecurity.innerText = code.length === 0 ? '000' : code
}

cardNumberMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector('.cc-number')
  ccNumber.innerText = number.length === 0 ? '0000 0000 0000 0000' : number
}

expirationDateMasked.on('accept', () => {
  updateExpiration(expirationDateMasked.value)
})

function updateExpiration(data) {
  const ccExpiration = document.querySelector('.cc-extra .value')
  ccExpiration.innerText = data.length === 0 ? '00/00' : data
}