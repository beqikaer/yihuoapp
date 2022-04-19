import request from '@/common/js/request.js'

export default {
	getNoticeList(param) {
		//console.log(1111)
		return request({
			url: `/api/notice`,
			method: 'POST',
			data: {...param} 
		})
	}
	
}
