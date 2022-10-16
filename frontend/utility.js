export function getLoggedInUsername(callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            content = this.responseText;
            if(content != '' && (content)) callback(content);
            else callback("undefined");
        }
    };
    xmlhttp.open("GET", "../scripts/functions_utility?func=Username", false);
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