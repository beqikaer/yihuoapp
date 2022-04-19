import request from '@/common/js/request.js'

export default {

	// 用户名登录
	login(data) {
		console.log("用户名登录")
		return request({
			url: '/api/member/login',
			method: 'POST',
			data:  {...data} 
		})
	},
	
	sendsms(data) {
		console.log("验证码推送")
		return request({
			url: '/api/member/sendsms',
			method: 'POST',
			data:  {...data} 
		})
	},
	sms_login(data) {
		console.log("手机登录")
		return request({
			url: '/api/member/sms_login',
			method: 'POST',
			data:  {...data} 
		})
	},
	// 第三方授权后，进行应用内登录
	loginByProvider(data) {
		console.log("登录")
		return request({
			url: '/api/member/index',
			method: 'POST',
			data
		})
	},
	//注册用户
	registerMember(data) {
		console.log("注册")
		return request({
			url: '/api/member/add',
			method: 'POST',
			data
		})
	},
	appleLogin(data) {
		console.log("苹果登录")
		return request({
			url: '/api/member/apple_login',
			method: 'POST',
			data
		})
	},
	wxLogin(data) {
		console.log("微信登录")
		return request({
			url: '/api/member/wx_login',
			method: 'POST',
			data
		})
	},
	moblielogin(data) {
		console.log("手机号授权登录")
		return request({
			url: '/api/member/phone_login',
			method: 'POST',
			data
		})
	},
	updateMemberInfo(data) {
		console.log("更新用户信息")
		return request({
			url: '/api/member/update',
			method: 'POST',
			data
		})
	},
	//更新绑定用户手机号
	updateUserMobile(data) {
		return request({
			url: '/auth/user/mobile',
			method: 'PUT',
			data
		})
	},
	
	//退出系统
	logout(accessToken) {
		return request({
			url: '/auth/logout', // /auth/logout?accessToken=${accessToken}
			method: 'GET',
			data: { accessToken }
		})
	}

}