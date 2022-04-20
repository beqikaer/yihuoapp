import upload from '@/common/js/upload.js'
import request from '@/common/js/request.js'

export default {

	//上传图片文件
	uploadImg(filePath) {
		return upload({
			url: '/app/Upload/Upload',
			filePath
		})
	},
	//版本升级
	version(data) {
		return request({
			url: '/app/System.Version/index',
			method: 'POST',
			data: {
				...data
			}
		})
	},
	//版本升级
	location(data) {
		return request({
			url: '/app/location/index',
			method: 'POST',
			data: {
				...data
			}
		})
	},


}
