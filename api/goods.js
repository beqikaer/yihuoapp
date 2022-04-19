import request from '@/common/js/request.js'

export default {
	// 商品添加
	goods_add(data) {
		console.log("商品添加")
		return request({
			url: '/app/Goods.Goods/add',
			method: 'POST',
			data: {
				...data
			}
		})
	},
	goods_list(data) {
		console.log("商品列表")
		return request({
			url: '/app/Goods.Goods/index',
			method: 'POST',
			data: {
				...data
			}
		})
	}
}