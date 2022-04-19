<template>
	<view>
		<!--标题栏-->
		<bar-title bgColor="bg-white" isBack @rightTap="addgoods">
			<block slot="content">我的商品</block>
			<block slot="right">添加商品</block>
		</bar-title>

		<!--商品列表-->
		<view class="bg-white zaiui-goods-list-view">
			<view class="zaiui-checkbox-view flex justify-between" style="margin-bottom: 20px;">
				<view class="text-black">上架商品 </view>
				<text class="text-green"> 共{{on_sell_goodslist_count}}件</text>
			</view>

			<view class="cu-list menu-avatar ">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''"
					v-for="(item,index) in on_sell_goodslist" :key="index" @touchstart="ListTouchStart"
					@touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<view class="cu-avatar round lg"
						:style="[{backgroundImage:'url('+JSON.parse(item.goods_pic)[0].url+')'}]">
					</view>
					<view class="content">
						<view class="text-grey">{{item.goods_name}}</view>

						<view class="text-gray text-sm" v-if="item.goodstype">
							分类:{{item.goodstype.goodstype_name }}
						</view>
						<view class="flex justify-start">
							<view class="text-gray text-sm">
								原价:{{item.goods_original_price || 0.00}} 元
							</view>
							<view class="text-gray text-sm margin-left">
								售价:{{item.goods_price || 0.00}} 元
							</view>
						</view>

					</view>
					<view class="action">
						<view class="cu-tag round bg-red sm" v-if="item.goods_status==0">已禁用</view>
						<view class="cu-tag round bg-grey sm" v-if="item.goods_status==1">等待审核</view>
						<view class="cu-tag round bg-green sm" v-if="item.goods_status==2">允许销售</view>

						<view v-if="item.goods_status==2">
							<view class="cu-tag round line-red sm" v-if="item.goods_on_sale==0">下架状态</view>
							<view class="cu-tag round line-olive sm" v-if="item.goods_on_sale==1">正在销售</view>

							<view class="cu-tag round line-cyan sm" v-if="item.goods_on_sale==1">
								库存{{item.goods_stock || 0}}</view>
						</view>
					</view>
					<view class="move">
						<view class="bg-red">下架</view>
						<view class="bg-cyan">库存</view>
					</view>
				</view>
			</view>

		</view>

		<!--商品列表-->
		<view class="bg-white zaiui-goods-list-view">
			<view class="zaiui-checkbox-view flex justify-between" style="margin-bottom: 20px;">
				<view class="text-black">下架商品</view>
				<text class="text-gray"> 共{{not_on_sell_goodslist_count}}件</text>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalNametwo=='move-box-2-'+ index?'move-cur':''"
					v-for="(item,index) in not_on_sell_goodslist" :key="index" @touchstart="ListTouchStart"
					@touchmove="ListTouchMove" @touchend="TouchEnd" :data-target="'move-box-2-' + index">
					<view class="cu-avatar round lg"
						:style="[{backgroundImage:'url('+JSON.parse(item.goods_pic)[0].url+')'}]">
					</view>
					<view class="content">
						<view class="text-grey">{{item.goods_name}}</view>

						<view class="text-gray text-sm" v-if="item.goodstype">
							分类:{{item.goodstype.goodstype_name }}
						</view>
						<view class="flex justify-start">
							<view class="text-gray text-sm">
								原价:{{item.goods_original_price || 0.00}} 元
							</view>
							<view class="text-gray text-sm margin-left">
								售价:{{item.goods_price || 0.00}} 元
							</view>
						</view>

					</view>

					<view class="action">
						<view class="cu-tag round bg-red sm" v-if="item.goods_status==0">已禁用</view>
						<view class="cu-tag round bg-grey sm" v-if="item.goods_status==1">等待审核</view>
						<view class="cu-tag round bg-green sm" v-if="item.goods_status==2">允许销售</view>

						<view v-if="item.goods_status==2">
							<view class="cu-tag round line-red sm" v-if="item.goods_on_sale==0">下架状态</view>
							<view class="cu-tag round line-olive sm" v-if="item.goods_on_sale==1">正在销售</view>

							<view class="cu-tag round line-cyan sm" v-if="item.goods_on_sale==1">
								库存{{item.goods_stock || 0}}</view>
						</view>

					</view>
					<view class="move">
						<view class="bg-olive">上架</view>
						<view class="bg-blue">编辑</view>
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
		</view>
		<!--占位底部距离-->
		<view class="cu-tabbar-height" />




	</view>
</template>

<script>
	import barTitle from '@/components/zaiui-common/basics/bar-title';
	import _tool from '@/static/zaiui/util/tools.js'; //工具函数
	import api from '@/api/goods.js'; //工具函数

	export default {
		components: {
			barTitle
		},
		data() {
			return {
				listTouchStart: 0,
				listTouchDirection: null,
				modalName: null,
				modalNametwo: null,
				on_sell_goodslist: [],
				not_on_sell_goodslist: [],
				to_goodslist: [],
				x_goodslist: [],
				member_id: null,
				on_sell_goodslist_count: null,
				not_on_sell_goodslist_count: null
			}
		},
		onShow() {
			this.int()
		},
		onLoad() {
			var userInfo = uni.getStorageSync('userInfo');
			console.log(userInfo)
			this.member_id = userInfo.member_id
		},
		onReady() {
			_tool.setBarColor(true);
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		methods: {
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					console.log(e)
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			// ListTouch计算滚动
			TouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					console.log(e)
					this.modalNametwo = e.currentTarget.dataset.target
				} else {
					this.modalNametwo = null
				}

				console.log(this.modalNametwo)
				this.listTouchDirection = null
			},
			async int() {
				//经过审核允许售卖 上架商品
				var {
					data: onsellgoodslist
				} = await api.goods_list({
					goods_on_sale: 1,
					goods_status: 2,
					goods_vendor: this.member_id

				});
				this.on_sell_goodslist = onsellgoodslist.data
				this.on_sell_goodslist_count = this.on_sell_goodslist.length
				console.log(onsellgoodslist.data)


				//经过审核允许售卖 自行下架商品
				var {
					data: notonsellgoodslist
				} = await api.goods_list({
					goods_on_sale: 0,
					goods_status: 2,
					goods_vendor: this.member_id
				});
				this.not_on_sell_goodslist = notonsellgoodslist.data
				console.log(this.not_on_sell_goodslist)

				//正在审核商品
				var {
					data: togoodslist
				} = await api.goods_list({
					goods_status: 1,
					goods_vendor: this.member_id
				});
				this.to_goodslist = togoodslist.data
				console.log(this.to_goodslist)

				this.not_on_sell_goodslist = this.not_on_sell_goodslist.concat(this.to_goodslist);

				//已禁用
				var {
					data: xgoodslist
				} = await api.goods_list({
					goods_status: 0,
					goods_vendor: this.member_id
				});
				this.x_goodslist = xgoodslist.data
				console.log(this.x_goodslist)

				this.not_on_sell_goodslist = this.not_on_sell_goodslist.concat(this.x_goodslist);

				console.log(this.not_on_sell_goodslist)
				this.not_on_sell_goodslist_count = this.not_on_sell_goodslist.length
			},
			addgoods() {
				console.log('添加商品')
				uni.navigateTo({
					url: "/pages/sell/addgoods"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/zaiui/style/footmark.scss";
</style>
