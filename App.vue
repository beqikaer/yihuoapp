<script>
	import api from "@/api/common.js";

	export default {

		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					console.log(e)
					Vue.prototype.screenHeight = e.screenHeight;
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

			this.update()

		},
		methods: {
			update() {
				var that=this;
				// 获取本地应用资源版本号
				plus.runtime.getProperty(plus.runtime.appid, async (inf) => {
					//获取服务器的版本号
					console.log(inf.versionCode)

					if (uni.getSystemInfoSync().platform == 'ios') {
						console.log('ios');
						var platform_type = 1;
					}

					if (uni.getSystemInfoSync().platform == 'android') {
						var platform_type = 0;
					}

					var versionres = await api.version({
						platform_type: platform_type,
						status: 1
					})
					
					console.log(versionres.status)
					console.log(versionres.data.total)

					if (versionres.status == 200 && versionres.data.total != 0) {
						
						console.log(versionres)
						
						var version_data = versionres.data.data[0];
						var edition_number = version_data.edition_number;
						var edition_issue = version_data.edition_issue;


						if (Number(edition_number) > Number(inf.versionCode) &&
							edition_issue == 1) { //判断后台返回版本号是否大于当前应用版本号 && 是否发行 

							console.log()

							//如果写在App.vue中就是 
							uni.navigateTo({
								url: '/components/rt-uni-update/rt-uni-update?obj=' +
									JSON.stringify(version_data)
							});
						}

					}else{
						that.initLogin()
					}

				});
			},

			initLogin() {
				const userInfo = uni.getStorageSync('userInfo')
				const accessToken = uni.getStorageSync('accessToken')

				console.log(userInfo);

				if (userInfo && accessToken) {
					this.$store.commit('setState', {
						userInfo,
						accessToken
					})
				}
			}
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	//H5端引用。玄学问题，我这边在这里引入的css，在APP上无效。前面加/也一样。原因未知...
	//可自行测试在APP上是否有效，如果有效，可在vue里删除css引入的代码。
	//可自行测试在APP上是否有效，如果有效，可删除下面的引入代码。
	/* #ifdef APP-PLUS */
	@import "@/static/colorui/main.css";
	@import "@/static/colorui/icon.css";
	@import "@/static/zaiui/style/app.scss";
	/* #endif */
</style>
