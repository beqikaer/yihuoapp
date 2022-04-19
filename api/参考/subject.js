import request from '@/common/js/request.js'

export default {
	getSubjectList(param) {
		//console.log(1111)
		return request({
			url: `/api/subject/`,
			method: 'POST',
			data: {...param} 
		})
	},
	getSlideList(param) {
		//console.log(1111)
		return request({
			url: `/api/slide/`,
			method: 'POST',
			data: {...param} 
		})
	},
	getNavigationList(param) {
		//console.log(1111)
		return request({
			url: `/api/navigation/`,
			method: 'POST',
			data: {...param} 
		})
	}
}
