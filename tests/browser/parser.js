import { test } from 'qunit';
import { initModule } from '../helpers/test-config';

export default function () {
	initModule( 'parser' );

	test( `global defaults apply to parsing even with no instance`, t => {
		const delimiters = Ractive.defaults.delimiters;
		Ractive.defaults.delimiters = [ '<%', '%>' ];
		const parsed = Ractive.parse( '<% foo %>' );
		t.deepEqual( parsed, { v: 4, t: [{ t: 2, r: 'foo' }] } );
		Ractive.defaults.delimiters = delimiters;
	});

	test( `parser transforms can drop elements`, t => {
		const parsed = Ractive.parse( `<foo /><div />`, {
			transforms: [
				n => n.e === 'foo' ? { remove: true } : undefined
			]
		});

		t.deepEqual( parsed, { v: 4, t: [{ t: 7, e: 'div' }] } );
	});

	test( `parser transforms can modify an element in place`, t => {
		const parsed = Ractive.parse( `<div />`, {
			transforms: [
				n => n.e === 'div' ? ( n.m || ( n.m = [] ) ).push({ t: 13, f: 'bar', n: 'class' }) && n : undefined
			]
		});

		t.deepEqual( parsed, { v: 4, t: [{ t: 7, e: 'div', m: [{ t: 13, f: 'bar', n: 'class' }] }] } );
	});

	test( `parser transforms can replace an element`, t => {
		const parsed = Ractive.parse( `<bar />`, {
			transforms: [
				function ( n ) { return n.e === 'bar' ? { replace: this.parse( `<div id="replaced">yep</div>` ).t[0] } : undefined; }
			]
		});

		t.deepEqual( parsed, { v: 4, t: [{ t: 7, e: 'div', m: [{ t: 13, f: 'replaced', n: 'id' }], f: [ 'yep' ] }] } );
	});

	test( `parser transforms can replace an element with multiple elements`, t => {
		const parsed = Ractive.parse( `<bar />`, {
			transforms: [
				function ( n ) { return n.e === 'bar' ? { replace: this.parse( `<div id="replaced">yep</div><span>sure</span>` ).t } : undefined; }
			]
		});

		t.deepEqual( parsed, { v: 4, t: [{ t: 7, e: 'div', m: [{ t: 13, f: 'replaced', n: 'id' }], f: [ 'yep' ] }, { t: 7, e: 'span', f: [ 'sure' ] }] } );
	});

	test( `parser transforms can replace an element with multiple elements, which can also be replaced`, t => {
		const parsed = Ractive.parse( `<bar />`, {
			transforms: [
				function ( n ) { return n.e === 'bar' ? { replace: this.parse( `<div id="replaced">yep</div><baz>sure</baz>` ).t } : undefined; },
				function ( n ) { if ( n.e === 'baz' ) n.e = 'span'; }
			]
		});

		t.deepEqual( parsed, { v: 4, t: [{ t: 7, e: 'div', m: [{ t: 13, f: 'replaced', n: 'id' }], f: [ 'yep' ] }, { t: 7, e: 'span', f: [ 'sure' ] }] } );
	});
}