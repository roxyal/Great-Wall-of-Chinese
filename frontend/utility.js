export function getLoggedInUsername() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            // var content = this.responseText;
            // if(content != '' && (content)) callback(content);
            // else callback("undefined");
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=Username", false);
    xmlhttp.send();
    return "undefined";
}

function getLoggedInAccountId() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=AccountId");
    xmlhttp.send();
}

export function getLoggedInCharacter() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=Character", false);
    xmlhttp.send();
    return "undefined";
}

function getLoggedInTeacherId() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=TeacherId");
    xmlhttp.send();
}

function getLoggedInAccountType() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=AccountType");
    xmlhttp.send();
}