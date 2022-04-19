import request from '@/common/js/request.js'

export default {
	// 用户级别列表
	userlevel(data) {
		console.log("用户级别列表")
		return request({
			url: '/app/System.Memberlevel/index',
			method: 'POST',
			data: {
				...data
			}
		})
	}
}
