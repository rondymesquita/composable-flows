import {hello} from './'

describe('index', () => {
	it('test', () => {
		expect(hello()).toEqual('world')
	})
})
