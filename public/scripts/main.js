function outputUpdate(vol) {
	document.querySelector('#tastePoints').value = vol ;
	}
	
	
function myFunction() {
    // Declare variables
    var input, filter, divContainer, divTile, h, i, whiskyNumber;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    divContainer = document.getElementById("suche"); 
    divTile = divContainer.getElementsByClassName('search');
    whiskyNumber = 0 ;

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < divTile.length; i++) {
        h = divTile[i].getElementsByTagName("h3")[0];
        if (h.innerHTML.toUpperCase().indexOf(filter) > -1) {
            divTile[i].style.display = "";
            
            whiskyNumber++;
        } else {
           divTile[i].style.display = "none";
        }
    }

    
    var newP = document.createElement("p"); 
	var newContent = document.createTextNode("Search results:"+""+whiskyNumber); 
	newP.appendChild(newContent);
    newP.setAttribute("id","searchResult");
    
    var currentDiv = document.getElementById("myInput");
    var oldP = currentDiv.parentElement.querySelector('p');
        if (oldP) {
    	oldP.remove();
    }
	    currentDiv.insertAdjacentElement("afterend", newP);
}


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


//jquery to do the upload of the image in the FE and to show the progress
$(document).ready(function() {

	$("form[name='newWhisky']").on('submit', function(event) {

		event.preventDefault();

		var formData = new FormData($("form[name='newWhisky']")[0]);

		$.ajax({
			xhr : function() {
				var xhr = new window.XMLHttpRequest();

				xhr.upload.addEventListener('progress', function(e) {

					if (e.lengthComputable) {

						console.log('Bytes Loaded: ' + e.loaded);
						console.log('Total Size: ' + e.total);
						console.log('Percentage Uploaded: ' + (e.loaded / e.total))

						var percent = Math.round((e.loaded / e.total) * 100);

						$('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%');
                        
					}

				});

				return xhr;
			},
			type : 'POST',
			url : '/collection',
			data : formData,
			processData : false,
			contentType : false,
			success : function() {
				$("p[name='progressHeadline']").css("color", "green");
				alert('File uploaded!');
			}
		});

	});

});

