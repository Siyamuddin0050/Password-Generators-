const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generatBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[]}|;:",<.>?/';

let password = "";
let passwordLength =10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#f2f2f2");


//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize = ((passwordLength-min)*100 / (max-min ))+"% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow 
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger (min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateRandomLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateRandomSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum =false;
    let hasSym =false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasSym || hasNum) && passwordLength >=8){
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >=6) {
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}
//-----------------------------
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText ="Failed"
    }
    //to make cope span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000 );
}

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , () => {
    if (passwordDisplay.value)
        copyContent();
})

//suffle function
function shufflePassword(array){
    //Fisher Yates Method
    for (let i= array.length -1 ; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount =0;
    allCheckBox.forEach( (checkbox) => {
        if (checkbox.checked)
            checkCount ++;
    } );
    
    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount ;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange); 
})

generatBtn.addEventListener('click', () => {
    //none of checkbox are selected
    if (checkCount == 0 )
        return ;
    if (passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();

    }
    //let's start journy of find new password
    //remove old password
    password= "";
    // let's put stuff 
    let funcArr = [];

    if (uppercaseCheck.checked){
        funcArr.push(generateRandomUpperCase);}

    if (lowercaseCheck.checked){
        funcArr.push(generateRandomLowerCase);}

    if (numberCheck.checked){
        funcArr.push(generateRandomNumber);}

    if (symbolsCheck.checked){
        funcArr.push(generateRandomSymbol);}
    
    //compulsory addition
    for ( let i =0 ; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining addition
    for (let i=0;i<passwordLength-funcArr.length; i++){
        let randIndix = getRndInteger(0, funcArr.length);
        password += funcArr[randIndix]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password)); 

    //show in password box
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

})
