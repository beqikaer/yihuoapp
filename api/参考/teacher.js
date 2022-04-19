import request from '@/common/js/request.js'

export default {
	getTeacherInfo(param) {
		//console.log(1111)
		return request({
			url: `/api/teacher/index`,
			method: 'POST',
			data: {...param} 
		})
	}
	
}
