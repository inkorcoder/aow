export let Ajax: any = {

	get: function(url: string){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "http://localhost:3000"+url, true);
		return {
			subscribe: function(callback: Function){
				xhr.send(null);
				xhr.onload = ()=> {
					callback(JSON.parse(xhr.responseText));
				}
			}
		}
	},

	post: function(url: string, data: any){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', "http://localhost:3000"+url, true);
		return {
			subscribe: function(callback: Function){
				xhr.send(JSON.stringify(data));
				xhr.onload = ()=> {
					callback(JSON.parse(xhr.responseText));
				}
			}
		}
	}

};