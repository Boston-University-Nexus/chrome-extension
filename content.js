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
        // console.log(res);
        var table_path = $('body > center > center > table:nth-child(23) > tbody')
        var tr = table_path.find('tr:nth-child(6) > td:nth-child(6)')
        console.log(tr.text());

    });
}


// document.querySelector("body > center > center > table:nth-child(23) > tbody")


// document.querySelector("body > center > center > table:nth-child(23) > tbody > tr:nth-child(6) > td:nth-child(6) > text")



