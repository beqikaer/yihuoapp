<template>
	<view>
		
		<!--首页-->
		<home :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==0?true:false" v-if="loadOn.home" />

		<!--分类-->
		<goods-list :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==1?true:false"
			v-if="loadOn.goodlist" />

		<!--发布-->

		<sell :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==2?true:false" v-if="loadOn.sell"
					@closeTap="sellCloseTap" />


		<!--消息-->
		<news :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==3?true:false" v-if="loadOn.news" />

		<!--我的-->
		<my :scrollY="scrollY" :scrollBottom="scrollBottom" :show="tabID==4?true:false" v-if="loadOn.my" />

		<!--底部导航-->
		<footer-tabbar :tabID='tabID' :msgDot='true' @tabTap='tabTap' />
	</view>
</template>

<script>
	//加载组件
	import home from '@/components/zaiui-common/view/home';
	import goodsList from '@/components/zaiui-common/view/goods-list';
	import sell from '@/components/zaiui-common/view/sell';
	import news from '@/components/zaiui-common/view/news';
	import my from '@/components/zaiui-common/view/my';

	//固定组件
	import footerTabbar from '@/components/zaiui-common/footer/footer-tabbar';

	//工具函数
	import _tool from '@/static/zaiui/util/tools.js';
	export default {
		components: {
			home,
			goodsList,
			sell,
			news,
			my,
			footerTabbar,
		},
		data() {
			return {
				loadOn: {
					home: true,
					goodlist: false,
					sell: false,
					news: false,
					my: false
				},
				show: false,
				scrollY: 0,
				scrollBottom: 0,
				scrollTop: 0,
				tabID: 0,
				tabIndex: 0,
			}
		},
		onLoad() {

		},
		onReady() {
			_tool.setBarColor(true);
		},
		methods: {
			change(e) {
				this.show = e.show
			},
			close() {
				this.$refs.popup.close()
				console.log(this.loadOn)
			},
			tabTap(index) {

				this.tabIndex = this.tabID;
				if (index == 1 && !this.loadOn.goodlist) {
					this.loadOn.goodlist = true;
				}

				if (index == 2 && !this.loadOn.sell) {
					this.loadOn.sell = true;
				}

				if (index == 3 && !this.loadOn.news) {
					this.loadOn.news = true;
				}
				if (index == 4 && !this.loadOn.my) {
					this.loadOn.my = true;
					console.log(uni.getStorageSync('userInfo'))
					if (!uni.getStorageSync('userInfo')) {
						uni.navigateTo({
							url: "/pages/login/login"
						})
					}
				}

				this.tabID = index;

				//设置颜色
				if (index == 0) {
					_tool.setBarColor(false);
				}
				if (index == 1 || index == 2 || index == 3) {
					_tool.setBarColor(true);
				}
				if (index == 4) {
					_tool.setBarColor(false);
				}
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			},
			sellCloseTap() {
				this.tabTap(this.tabIndex);
			},
		},
		onPageScroll(e) {
			this.scrollY = e.scrollTop;
			//			console.log(e.scrollTop);
		},
		onReachBottom(e) {
			let timestamp = new Date().getTime();
			this.scrollBottom = timestamp;

		}
	}
</script>

<style lang="scss">

</style>
