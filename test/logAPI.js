const BASE_URL = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel";

//function log_message(elem, url){
function log_message(url){
    setInterval(async function(){
        const response = await fetch(url);
        const text = await response.text();
        let data = JSON.parse(text);
        //elem.textContent = text;
        console.log(data);

        // TODO : Indexation en BDD
        //... 

        }, 100);     
}















//log_message(BASE_URL+"/exports/json?where=duedate > date'2018-12-01'&select=duedate");
log_message(BASE_URL+"/exports/json?where=duedate > date'2018-12-01'&select=duedate");
log_message(BASE_URL+"/exports/json");
//log_message("https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/exports/json?select=name");      
