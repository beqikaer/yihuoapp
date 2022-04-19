<!-- 本示例未包含完整css，获取外链css请参考上文，在hello uni-app项目中查看 -->
<template>
	<view @touchmove.prevent :style="{'height': screenHeight  +'px'}" class="bg-gradual-blue">


		<bar-title bgColor="bg-white" isBack>
			<block slot="content">我的权益</block>
		</bar-title>

		<view>
			<z-swiper v-model="userlevellist" :options="options" ref="zSwiper" @slideChange="onChange">
				<z-swiper-item :custom-style="slideCustomStyle" v-for="(item,index) in userlevellist" :key="index">

					<view style="margin-top: 50rpx;">
						<image class="image" :src="item.memberlevel_pic" mode="aspectFill">
						</image>
			
						<view v-if="item.memberlevel_id-1==activeIndex">
							<view style="height: 400rpx;" class="bg-gray radius">
								<view>

									<view>{{item.memberlevel_name}}</view>
									<view>{{item.memberlevel_pay}}</view>
									<view>{{item.memberlevel_rate}}</view>
									<view>{{item.memberlevel_goodsnum}}</view>
								</view>

							</view>
							<view class="padding flex flex-direction">
								<button class="cu-btn bg-green margin-tb-sm lg" @click="changememberlevel(item.memberlevel_id)">{{bottomname}}</button>
							</view>
						</view>

					</view>
				</z-swiper-item>
			</z-swiper>



		</view>

	</view>
</template>

<script>
	import barTitle from '@/components/zaiui-common/basics/bar-title';
	import _tool from '@/static/zaiui/util/tools.js'; //工具函数
	import api from '@/api/userlevel'

	export default {
		components: {
			barTitle
		},
		data() {
			return {
				slideCustomStyle: {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '36rpx'
				},
				options: {
					effect: 'cards',
					initialSlide: 0 //初始化第几页
				},
				bottomname: '我的权益',
				activeIndex: 0,
				userlevellist: [],
				memberlevel_id: null //普通会员
			}
		},
		onLoad(e) {
			var that = this;
			console.log(e)

			if (e.memberlevel_id) {
				this.memberlevel_id = e.memberlevel_id;
				this.options.initialSlide = e.memberlevel_id - 1; //初始化第几页
				this.activeIndex = e.memberlevel_id - 1; 
				
				console.log(this.options.initialSlide)

			}

			console.log(this.screenHeight)
			this.getuserlevellist()
		},
		methods: {
			onChange(swiper) {

				console.log(this.options.initialSlide);
				console.log(swiper.activeIndex);

				this.activeIndex = swiper.activeIndex; //当前第几页

				console.log(this.activeIndex)

				if (swiper.activeIndex == this.options.initialSlide) {

					this.bottomname = "我的权益";
				} else {
					this.bottomname = "申请权益";
				}

				uni.showToast({
					title: '当前 swiper 索引：' + swiper.activeIndex,
					icon: 'none'
				})
			},
			async getuserlevellist() {
				const userlevellistres = await api.userlevel();
				console.log(userlevellistres)
				if (userlevellistres.status == 200) {
					this.userlevellist = userlevellistres.data.data;
				}

				console.log(this.userlevellist)

			},
			async changememberlevel(e){
				console.log(e)
			}
		}

	}
</script>




<style lang="scss">
	.image {

		height: 400rpx;
		width: 600rpx;
		border-radius: 24rpx;
	}

	//APP端引用。玄学问题，在这里引入css文件后，APP端才生效，在app.vue里引入无效。原因未知...
	//可自行测试在APP上是否有效，如果有效，可删除下面的引入代码。
	/* #ifdef APP-PLUS */
	@import "../../static/colorui/main.css";
	@import "../../static/colorui/icon.css";
	@import "../../static/zaiui/style/app.scss";
	/* #endif */
</style>
