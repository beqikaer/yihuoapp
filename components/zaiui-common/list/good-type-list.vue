<template>
	<view class="zaiui-type-list-box">
		<!--一级view-->
		<view v-for="(first,indexs) in list_data" :key="indexs">
			<view class="bg-white margin-bottom zaiui-type-list" @tap="firsttap(first.goodstype_id,first.children)">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg"
							:style="[{backgroundImage:'url('+ first.goodstype_pic +')'}]" />
						<view class="content">
							<view class="text-black">
								<view class="text-cut">{{first.goodstype_name}}</view>
								<text class="margin-left-xs text-red cuIcon-roundright" />
							</view>
							<view class="text-sm flex">
								<view class="text-cut">{{first.goodstype_brief}}</view>

							</view>
						</view>
					</view>
				</view>
			</view>
			<!--二级view-->
			<view style="margin-left: 20px;" v-for="(secend,indexss) in first.children" :key="indexss"
				v-if="secend.goodstype_pid==currentfirstindex">

				<view class="bg-white margin-bottom zaiui-type-list"
					@tap="secendtap(secend.goodstype_id,secend.children)">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg"
								:style="[{backgroundImage:'url('+ secend.goodstype_pic +')'}]" />
							<view class="content">
								<view class="text-black">
									<view class="text-cut">{{secend.goodstype_name}}</view>
									<text class="margin-left-xs text-red cuIcon-roundright" />
								</view>
								<view class="text-sm flex">
									<view class="text-cut">{{secend.goodstype_brief}}</view>

								</view>
							</view>
						</view>
					</view>
				</view>
				<!--三级view-->
				<view style="margin-left: 20px;" v-for="(three,indexsss) in secend.children" :key="indexsss"
					v-if="three.goodstype_pid==currentsecendindex">
					<view class="bg-white margin-bottom zaiui-type-list" @tap="threetap(three.goodstype_id)">
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar round lg"
									:style="[{backgroundImage:'url('+ three.goodstype_pic +')'}]" />
								<view class="content">
									<view class="text-black">
										<view class="text-cut">{{three.goodstype_name}}</view>
										<text class="margin-left-xs text-red cuIcon-roundright" />
									</view>
									<view class="text-sm flex">
										<view class="text-cut">{{three.goodstype_brief}}</view>

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	import _tool from '@/static/zaiui/util/tools.js';

	export default {
		name: 'type-list',
		data() {
			return {
				currentfirstindex: null,
				currentsecendindex: null
			}
		},
		props: {
			list_data: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		mounted() {
			console.log(this.list_data)
		},
		methods: {
			listTap(data, type) {
				this.$emit('listTap', {
					data,
					type
				});
			},
			firsttap(e, f) {
				console.log(e)
				console.log(f)
				//二级存在判断
				if (f) {
					this.currentfirstindex = e;
				} else {
					this.listTap( "/pages/sell/addgoods-info?goods_type=" + e,'url')
				}

			},
			secendtap(e, f) {
				console.log(e)
				console.log(f)
				if (f) {
					this.currentsecendindex = e;
				} else {
					this.listTap( "/pages/sell/addgoods-info?goods_type=" + e,'url')
				}
			},
			threetap(e) {
				console.log(e)
				this.listTap( "/pages/sell/addgoods-info?goods_type=" + e,'url')  //下一页面没有onload接收数据跳转将失败
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zaiui-type-list-box {
		.zaiui-type-list {
			border-radius: 18.18rpx;
			padding: 9.09rpx;

			.cu-list.menu-avatar>.cu-item .content {
				width: calc(100% - 94.54rpx - 59.99rpx - 20rpx);
				line-height: 1.8em;
			}

			.cu-list.menu-avatar>.cu-item:after {
				width: 0;
				height: 0;
				border-bottom: 0;
			}
		}
	}
</style>
