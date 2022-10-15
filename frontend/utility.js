function getLoggedInUsername() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=Username");
    xmlhttp.send();
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

function getLoggedInCharacter() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=Character");
    xmlhttp.send();
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