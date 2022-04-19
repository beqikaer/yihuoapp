import request from '@/common/js/request.js'

export default {
	// 添加易货额度变化记录
	add(data) {
		console.log("添加易货额度变化记录")
		return request({
			url: '/app/Member.Creditchange/add',
			method: 'POST',
			data: {
				...data
			}
		})
	},

	addcredit(data) {
		console.log("用户易货额度加")
		return request({
			url: '/app/Member.Member/credit_jia',
			method: 'POST',
			data: {
				...data
			}
		})
	},
	reducecredit(data) {
		console.log("用户易货额度减")
		return request({
			url: '/app/Member.Member/credit_jian',
			method: 'POST',
			data: {
				...data
			}
		})
	}
}
