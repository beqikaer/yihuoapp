import {
	msg
} from './util.js'

import {
	baseUrl
} from '@/config.js';

let BASE_URL = baseUrl;

// 1.导入
import store from '@/store'

const request = (options = {}) => {

	// 判断是否有访问令牌
	const accessToken = store.state.accessToken
	console.log(accessToken)
	if (accessToken) {
		// oauth2协议
		options.header = {
			'Authorization': `${accessToken}`
		}
	}

	// 短信验证码也要放行
	const whileList = ['/app/location/index','/app/System.Version/index', '/app/Member.Member/mobile_login',
		'/app/Member.Member/find_mobile',
		'/app/Member.Member/add_mobile', '/app/Member.Member/add', '/app/Member.Member/user_login',
		'/app/Member.Member/find_nickname', '/app/Member.Member/sendSms', '/app/Member.Member/sms_login',
		'/app/System.Memberlevel/index', '/app/Goods.Type/index'
	] //不需要登录放行的请求接口

	// resolve 正常响应，reject异常响应
	return new Promise((resolve, reject) => {
		/* if(option.isLogin && !accessToken) {
			//跳转到登录页
			return uni.navigateTo({
				url: '/pages/auth/login'
			})
		} */
		// 判断请求接口url包含/api/ 说明不需要登录，
		// 如果没有 包含，说明需要登录才可以访问（accessToken)
		if (whileList.indexOf(options.url) === -1 && //不在数组
			!accessToken) { //非空为真 没有登录accessToken
			//跳转到登录页
			return uni.navigateTo({
				animationType: 'slide-in-bottom',
				url: '/pages/login/login'
			})
		}
		console.log(555)

		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			timeout: 8000, // 8秒超时时间，单位ms
			header: options.header || {},
			success: (res) => {
				console.log(res.data)
				resolve(res.data)
			},
			fail: (err) => {
				console.log(options.url);
				console.log('err', err)
				msg('请求接口失败')
				reject(err)
			}
		})
	})
}

// 导出
export default request
