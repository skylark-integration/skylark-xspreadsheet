define([
    "skylark-langx-ns",
    "./spreadsheet"
],function(skylark,Spreadsheet){
    const spreadsheet = (el, options = {}) => new Spreadsheet(el, options);

	return skylark.attach("intg.xspreadsheet",{
		Spreadsheet,
		create : spreadsheet
	});
});