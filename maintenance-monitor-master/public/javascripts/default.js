/**
 * Created by Ravi on 7/23/17.
 */

let HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200)
                aCallback(xhttp.responseText);
        };

        xhttp.open( "GET", aUrl, true );
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();
    }
};

function sendRequest(cId,id){
    let client = new HttpClient();
    if (cId == ''){
        cId = '0'
    }
    x = parseInt(cId, 10);
    cId = '' + (x+1);
    client.get('/send-request?id='+id+'&cId='+cId,(response) => {
        let res =  JSON.parse(response);
        document.getElementById(id+'-job-status').innerHTML = "pending";
        $("."+id+'-req-btn').hide();
        alert(res.message);
        window.location.reload();
        client.get('/update-jobs?id='+id+'&cId='+cId+'&status=pending',(response) => {
            let res =  JSON.parse(response);
            if (res.message=="success") {
                console.log("updated");
            }
        })
    });
}

function createJob() {
    let client = new HttpClient();
    let text = $('.job-des').val();
    window.location.reload();
    client.get('/create-job?des='+text,(response) => {
        let res =  JSON.parse(response);
        if (res.message=="success") {
            setTimeout(function(){
                console.log("updated");
            });
        }
    });
}