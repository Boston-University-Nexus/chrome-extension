window.onload = function(){
    // document.write("Hello World")


    // Checking if JQuery has loaded -- returns function is loaded else undefined
    checkForJQuery();
    runScript();
    checkForJQuery();
}

function checkForJQuery() {
    console.log("Checking for JQuery: ");
    try{
        console.log(typeof jQuery)
    } catch (e) {
        console.log(e);
    }    
}

function runScript(){
    if (window.$){
        scrape();
    } else {
        window.setTimeout(runScript, 100);
    }
}


function scrape(){
    $.get(window.location.href, function(res){
        console.log(res);
        // console.log($x('/html/body/center/center/table[2]'));
    });
}

