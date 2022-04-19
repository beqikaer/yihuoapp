import request from '@/common/js/request.js'

export default {

	// 获取用户好友
	findFriends(data) {
		console.log("获取用户好友")
		return request({
			url: '/api/friends/friendlist',
			method: 'POST',
			data
		})
	},
	findFriendById(data){
		return request({
			url: '/api/member/index',
			method: 'POST',
			data
		})
	}

}
