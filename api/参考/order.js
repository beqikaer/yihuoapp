import request from '@/common/js/request.js'

export default {
	// 获取生成的预支付的订单信息-微信支付  发起调用微信
	getOrderInfoWxpay(data) {
		return request({
			url: '/api/WxpayController/weChatPay',
			method: 'POST',
			data
		})
	},
	
	//创建订单获得订单号
	createOrder(data) {
		return request({
			url: '/api/Courseorder/add',
			method: 'POST',
			data
		})
	},
	
	//支付完成更新状态
	updateOrder(data) {
		return request({
			url: '/api/Courseorder/update',
			method: 'POST',
			data
		})
	}
	
}