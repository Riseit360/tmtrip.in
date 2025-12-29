try {
    /* -----------------------------------------
          1️⃣ PIN CODE AUTO FILL LOGIC
       ----------------------------------------- */

    const deliverInput = document.getElementById("deliverAtInput");
    const showPin = document.getElementById("showPin");
    const showCity = document.getElementById("showCity");
    const secondInput = document.getElementById("secondInput");

    deliverInput.addEventListener("keyup", function () {
        let pin = deliverInput.value.trim();
        secondInput.value = pin;

        if (pin.length === 6 && /^\d{6}$/.test(pin)) {
            fetch(`https://api.postalpincode.in/pincode/${pin}`)
                .then(res => res.json())
                .then(data => {
                    if (data[0].Status === "Success") {
                        const office = data[0].PostOffice[0];
                        showPin.textContent = office.Pincode;
                        showCity.textContent = office.District;
                        secondInput.value = office.Pincode;
                    } else {
                        showPin.textContent = "----";
                        showCity.textContent = "Not Found";
                    }
                })
                .catch(() => {
                    showPin.textContent = "----";
                    showCity.textContent = "Error";
                });
        } else {
            showPin.textContent = "----";
            showCity.textContent = "----";
        }
    });



    /* -----------------------------------------
       2️⃣ NORMAL CURRENCY SELECT (text only)
    ----------------------------------------- */

    const currencySelect = document.getElementById("currencySelect");
    const currencyType = document.getElementById("currencyType");
    const currencyInput = document.getElementById("currencyInput");
    const curSelectInput = document.getElementById("curSelect");
    const currencylabelForex = document.getElementById("currencylabelForex");
    const currencyInputConvert = document.getElementById("currencyInputConvert");
    const currencyInputForex = document.getElementById("currencyInputForex");
    const currencyInputcanvert = document.getElementById("currencyInputcanvert");

    let liveRate = 0;

    currencySelect.addEventListener("change", function () {

        let code = this.value;
        let name = this.options[this.selectedIndex].dataset.name;

        // Update currency labels
        currencyType.textContent = name;
        currencyInput.textContent = code;
        curSelectInput.value = code;
        currencylabelForex.textContent = code;
        currencyInputcanvert.textContent = "INR";

        // Fetch Live Rate
        fetch(`https://api.exchangerate-api.com/v4/latest/${code}`)
            .then(res => res.json())
            .then(rate => {
                liveRate = rate.rates.INR;
                convertForexToINR();
            });
    });


    /* -----------------------------------------
        ⭐ DEFAULT SELECT LOAD FIX ADDED HERE ⭐
    ----------------------------------------- */

    window.addEventListener("DOMContentLoaded", function () {
        const event = new Event("change");
        currencySelect.dispatchEvent(event);
    });


    /* -----------------------------------------
       3️⃣ FOREX → INR Auto Convert
    ----------------------------------------- */

    currencyInputForex.addEventListener("keyup", convertForexToINR);
    function convertForexToINR() {
        let amount = parseFloat(currencyInputForex.value) || 0;

        if (liveRate > 0) {
            let finalValue = (amount * liveRate).toFixed(2);
            currencyInputConvert.value = finalValue;
        } else {
            currencyInputConvert.value = "";
        }
    }



    /* -----------------------------------------
       4️⃣ SELECT2 DROPDOWN WITH ICON + TITLE
    ----------------------------------------- */

    $(document).ready(function () {

        function formatState(state) {
            if (!state.id) return state.text;

            let img = state.element.getAttribute("data-image");
            let title = state.element.getAttribute("data-title");
            let desc = state.element.getAttribute("data-desc");

            return $(`
            <div class="custom-option">
                <span><img src="${img}" width="35"></span>
                <div class="option-text">
                    <h6><b>${title}</b></h6>
                    <p>${desc}</p>
                </div>
            </div>
        `);
        }

        $("#paymentSelect").select2({
            templateResult: formatState,
            templateSelection: formatState,
            minimumResultsForSearch: Infinity
        });

        $("#paymentSelect").on("select2:select", function (e) {
            let el = e.params.data.element;

            let img = el.getAttribute("data-image");
            let title = el.getAttribute("data-title");

            document.getElementById("iconelogo").innerHTML = `<img src="${img}" width="30">`;
            document.getElementById("titiel").textContent = title;

            curSelectInput.value = title;
        });

    });

} catch (error) {
    console.log('error: ', error);
}

try {

    // FLIGHT FROM-TO SWAP LOGIC
    document.addEventListener("DOMContentLoaded", function () {

        const fromInput = document.getElementById("fromInput");
        const toInput = document.getElementById("toInput");
        const swapBtn = document.getElementById("swapBtn");

        swapBtn.addEventListener("click", function () {
            let temp = fromInput.value;
            fromInput.value = toInput.value;
            toInput.value = temp;
        });

    });
} catch (error) {
    console.log('error: ', error);

}