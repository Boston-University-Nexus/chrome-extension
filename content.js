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
        var table_path = $('body > center > center > table:nth-child(23) > tbody');
        var num_rows = $('body > center > center > table:nth-child(23) > tbody tr').length;
        console.log("Num rows: " + num_rows);

        for (var i = 6; i < num_rows; i++){
            var tr = table_path.find('tr:nth-child('+i.toString()+')')
            var tr_length = table_path.find('tr:nth-child('+i.toString()+') td').length;
            // console.log(tr.text());
            for (var j = tr_length; j > tr_length-2; j--){
                var ext_class = tr.find('td:nth-child('+j.toString()+')')
                console.log(ext_class.text());
            }
        }



        // var tr = table_path.find('tr:nth-child(6) > td:nth-child(6)')
        // console.log(tr.text());

    });
}


// document.querySelector("body > center > center > table:nth-child(23) > tbody")


// document.querySelector("body > center > center > table:nth-child(23) > tbody > tr:nth-child(6) > td:nth-child(6) > text")

document.querySelector("body > center > center > table:nth-child(23) > tbody > tr:nth-child(6) > td:nth-child(7)")
document.querySelector("body > center > center > table:nth-child(23) > tbody > tr:nth-child(6)")

