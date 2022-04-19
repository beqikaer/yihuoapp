import request from '@/common/js/request.js'

export default {
	// 商品列表树
	goodstype(data) {
		console.log("商品列表树")
		return request({
			url: '/app/Goods.Type/index',
			method: 'POST',
			data: {
				...data
			}
		})
	}
}
