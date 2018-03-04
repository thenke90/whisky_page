function outputUpdate(vol) {
	document.querySelector('#tastePoints').value = vol ;
	}
	
	
function myFunction() {
    // Declare variables
    var input, filter, divContainer, divTile, h, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    divContainer = document.getElementById("suche"); 
    divTile = divContainer.getElementsByClassName('search');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < divTile.length; i++) {
        h = divTile[i].getElementsByTagName("h3")[0];
        if (h.innerHTML.toUpperCase().indexOf(filter) > -1) {
            divTile[i].style.display = "";
        } else {
           divTile[i].style.display = "none";
        }
    }
}





