import request from '@/common/js/request.js'

export default {
	// 专项练习
	specialexercise(data) {
		return request({
			url: '/api/lesson/specialexercise',
			method: 'POST',
			data
		})
	}
}
