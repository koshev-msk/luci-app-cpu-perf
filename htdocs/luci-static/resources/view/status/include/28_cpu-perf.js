'use strict';
'require baseclass';
'require rpc';

return baseclass.extend({
	title      : _('CPU Performance'),

	callCpuPerf: rpc.declare({
		object: 'luci.cpu-perf',
		method: 'getCpuPerf',
		expect: { '': {} }
	}),

	freqFormat(freq) {
		if(!freq) {
			return '-';
		};
		return (freq >= 1e6) ?
			(freq / 1e6).toFixed(3) + ' ' + _('GHz')
		:
			(freq / 1e3).toFixed(1) + ' ' + _('MHz');
	},

	load() {
		return L.resolveDefault(this.callCpuPerf(), null);
	},
	render(data) {
		if(!data) return;
		let cpuTable = E('table', { 'class': 'table' });
		if(data.cpus) {
			cpuTable.append(
				E('tr', { 'class': 'tr table-titles' })
			);
			for(let i of Object.values(data.cpus)) {
				cpuTable.append(
					E('th', { 'class': 'th left' }, _('CPU') + ' ' + i.number ),
				);
			};
			cpuTable.append(
				E('tr', { 'class': 'tr' })
			);
			for(let i of Object.values(data.cpus)) {
				cpuTable.append(
					E('td', { 'class': 'td left' },
						(i.sCurFreq) ? this.freqFormat(i.sCurFreq) : this.freqFormat(i.curFreq)
					),
				);
			};
		};
		
		if(cpuTable.childNodes.length === 1){
			cpuTable.append(
				E('tr', { 'class': 'tr placeholder' },
					E('td', { 'class': 'td' },
						E('em', {}, _('No performance data...'))
					)
				)
			);
		};
		return cpuTable;
	},
});
