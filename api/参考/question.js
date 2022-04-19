import request from '@/common/js/request.js'

export default {

	getLessonList(param) {
		//console.log(1111)
		return request({
			url: `/api/lesson/`,
			method: 'POST',
			data: {
				...param
			}
		})
	},
	getChapterList(param) {
		//console.log(1111)
		return request({
			url: `/api/chapter/`,
			method: 'POST',
			data: {
				...param
			}
		})
	},
	getQuestionList(param) {
		//console.log(1111)
		return request({
			url: `/api/question/`,
			method: 'POST',
			data: {
				...param
			}
		})
	}



}
