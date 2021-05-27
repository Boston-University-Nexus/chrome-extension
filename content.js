window.onload = function(){
    // document.write("Hello World")


    // Checking if JQuery has loaded -- returns function is loaded else undefined
    // checkForJQuery();
    // runScript();


    console.log(window.location.href);
    if (window.location.href.includes("allgpa")){
        console.log("This is the Classes Website");
    } else if (window.location.href.includes("xcred")){
        console.log("This is the external credit page");
    } else{
        console.log("On BU Page but not correct one");
    }
    runScript();
}

function checkForJQuery() {
    console.log("Checking for JQuery: ");
    try{
        console.log(typeof jQuery)
    } catch (e) {
        console.log(e);
    }    
}

// Runs script after JQuery has been loaded 
function runScript(){
    if (window.$){
        if (window.location.href.includes("allgpa")){
            scrape_Classes_Taken();
        } else if (window.location.href.includes("xcred")){
            scrape_Ext_Credits();
        } // ADD ELSE CONDITION
    } else {
        window.setTimeout(runScript, 100);
    }
}


// Scrapes external credits 
function scrape_Ext_Credits(){
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

    });
}

// Scrapes classes taken 
function scrape_Classes_Taken(){
    $.get(window.location.href, function(res){
        // console.log(res);
        var table_path = $('body > table:nth-child(5) > tbody');
        var num_rows = $('body > table:nth-child(5) > tbody tr').length;
        console.log("Num rows of Classes taken: " + num_rows);

        for (var i = 0; i < num_rows; i++){
            var tr = table_path.find('tr:nth-child('+i.toString()+')')
            var exact  = tr.find("td:nth-child(2)")
            console.log(exact.text());
        }
    });
}


