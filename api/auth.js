import request from '@/common/js/request.js'

export default {
	// 手机授权登录
	mobile_login(data) {
		console.log("手机一键登录")
		return request({
			url: '/app/Member.Member/mobile_login',
			method: 'POST',
			data:  {...data} 
		})
	},
	//查询用户
	find_mobile(data) {
		console.log("查询用户")
		return request({
			url: '/app/Member.Member/find_mobile',
			method: 'POST',
			data:  {...data} 
		})
	},
	//增加手机号用户
	add_mobile(data) {
		console.log("增加手机号用户")
		return request({
			url: '/app/Member.Member/add_mobile',
			method: 'POST',
			data:  {...data} 
		})
	},
	//增加用户
	add(data) {
		console.log("更新用户信息")
		return request({
			url: '/app/Member.Member/add',
			method: 'POST',
			data:  {...data} 
		})
	},
	//账号密码登录
	user_login(data) {
		console.log("账号密码登录")
		return request({
			url: '/app/Member.Member/user_login',
			method: 'POST',
			data:  {...data} 
		})
	},
	//查询登录名
	find_nickname(data) {
		console.log("查询登录名")
		return request({
			url: '/app/Member.Member/find_nickname',
			method: 'POST',
			data:  {...data} 
		})
	},
	//发送验证码
	sendSms(data) {
		console.log("发送验证码")
		return request({
			url: '/app/Member.Member/sendSms',
			method: 'POST',
			data:  {...data} 
		})
	},
	sms_login(data) {
		console.log("验证码登录")
		return request({
			url: '/app/Member.Member/sms_login',
			method: 'POST',
			data:  {...data} 
		})
	},
	detail(data) {
		console.log("获取更多信息")
		return request({
			url: '/app/Member.Member/detail',
			method: 'POST',
			data:  {...data} 
		})
	},
	index(data) {
		console.log("获取更多信息")
		return request({
			url: '/app/Member.Member/index',
			method: 'POST',
			data:  {...data} 
		})
	},
}