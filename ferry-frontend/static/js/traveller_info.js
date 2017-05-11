
function updateBanking(){
	console.log('updateBanking')
}

function updateShipping(){
	console.log('updateShipping')
}

function submitAll(){
	console.log('submitAll')
}

$("#shipping-form").submit(function(e){
	e.preventDefault()
	console.log('shipping', e)
})

$("#banking-form").submit(function(e){
	e.preventDefault()
	console.log('banking', e)
})