class Task {
	constructor(id, name, toTaskIds) {
		if(toTaskIds.length == 1 && toTaskIds[0].trim().length == 0) {
			toTaskIds = [];
		}
		this.id = id;
		this.name = name;
		this.toTaskIds = toTaskIds;
	}
	getDefine() {
		return `${this.id}(${this.name})`;
	}
	getLink() {
		return this.toTaskIds.map(v => `${this.id} --> ${v}`).join('\n');
	}
}

function convertHtml(td) {
	return td.innerText.trim().split(' ').map(v => v.trim()).filter(v => v.length > 0).join('<br>')
}

function tableToMermaidScript(tbodySelector) {
	var rows = document.querySelectorAll(tbodySelector);
	rows.filter = Array.prototype.filter;
	var tasks = rows.filter(row => row.querySelector('td').innerText.trim().length > 0)
		.map(row => row.querySelectorAll('td'))
		.map(cells => new Task(cells[0].innerText, convertHtml(cells[1]), cells[2].innerText.split(',')))
	 
	var script = 'graph TD\n';
	script += tasks.map(v => v.getDefine()).join('\n') + '\n'
	script += tasks.map(v => v.getLink()).join('\n') + '\n'
	return script;
}

function setupTableToMermaid(tbodySelector) {
	window.addEventListener('load', () => {
		var script = tableToMermaidScript('.confluenceTable>tbody>tr'); 
		document.querySelector('.mermaid').innerHTML = script;
		console.log(script);
		mermaid.init();
	});

	mermaid.initialize({startOnLoad:false});
}
