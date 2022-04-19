import {
	msg
} from './util.js'

import {
	baseUrl
} from '@/config.js';

let BASE_URL = baseUrl;

import store from '@/store/index.js'


// 上传图片
const upload = (options = {}) => {
	var self = this;
	// resolve 正常响应，reject异常响应
	return new Promise((resolve, reject) => {

		//判断是否登录，登录后才可以上传图片
		const accessToken = store.state.accessToken
		if (!accessToken) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({
					animationType: 'slide-in-bottom',
					url: '/pages/login/login'
				})
			}, 500)
			return
		}

		


		uni.uploadFile({
			url: BASE_URL + options.url, // 服务器 url
			filePath: options.filePath, // 要上传文件资源的路径。
			fileType: options.fileType,
			name: options.name || 'file', // File 对象对应 key
			formData: options.data || {}, //额外的 form data 
			timeout: 8000, // 8秒超时时间，单位ms
			header: {
				'Authorization': `Bearer ${accessToken}`
			},
			success: (res) => {
				if (res.statusCode === 200) {
					console.log('res.data', res.data)
					// 响应的数据是json字符串，把它转成对象
					resolve(JSON.parse(res.data))
				} else {
					// 404 ，500等错误码
					reject(res)
				}
			},
			fail: (err) => {
				msg('请求接口失败')
				reject(err)
			},
		})
	})
}

// 导出
export default upload
