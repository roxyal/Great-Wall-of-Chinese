function getLoggedInUsername() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility");
    xmlhttp.send(`func=${Username}`);
}

function getLoggedInAccountId() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility");
    xmlhttp.send(`func=${AccountId}`);
}

function getLoggedInCharacter() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility");
    xmlhttp.send(`func=${Character}`);
}

function getLoggedInTeacherId() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility");
    xmlhttp.send(`func=${TeacherId}`);
}

function getLoggedInAccountType() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            return this.responseText;
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility");
    xmlhttp.send(`func=${AccountType}`);
}