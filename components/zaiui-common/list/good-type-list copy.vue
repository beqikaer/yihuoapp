<template>
	<view class="zaiui-type-list-box">

		<block v-for="(first,indexs) in list_data" :key="indexs">

			<view class="bg-white margin-bottom zaiui-type-list" @tap="clicktop()">
				<view class="cu-list menu-avatar">
					<view class="cu-item">
						<view class="cu-avatar round lg" :style="[{backgroundImage:'url('+ first.goodstype_pic +')'}]" />
						<view class="content">
							<view class="text-black">
								<view class="text-cut">{{first.goodstype_name}}</view>
								<text class="margin-left-xs text-red cuIcon-roundright" />
							</view>
							<view class="text-sm flex">
								<view class="text-cut">{{first.goodstype_brief}}1</view>

							</view>
						
						</view>
					</view>
				</view>
			</view>
			<block v-for="(secend,indexss) in first.children" :key="indexss">

				<view class="bg-white margin-bottom zaiui-type-list">
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="[{backgroundImage:'url('+ secend.goodstype_pic +')'}]" />
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
				<block v-for="(three,indexsss) in secend.children" :key="indexsss">

					<view class="bg-white margin-bottom zaiui-type-list">
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
										<view class="text-cut">{{three.goodstype_brief}}1</view>
									</view>
								</view>
							</view>
						</view>
					</view>

				</block>
			</block>
		</block>



	</view>
</template>

<script>
	import _tool from '@/static/zaiui/util/tools.js';
	

	export default {
		
		name: 'type-list',
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
			listTap(data, index) {
				this.$emit('listTap', {
					data,
					index
				});
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
