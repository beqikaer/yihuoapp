<template>

	<scroll-view :refresher-triggered="triggered" :refresher-enabled="true" @refresherrefresh="onRefresh">

		<view class="zaiui-my-box" :class="show?'show':''">
			<view class="bg-gradual-red zaiui-head-box">
				<!--标题栏-->
				<!--小程序端不显示-->
				<!-- #ifndef MP -->
				<bar-title :isBack="false" :fixed="false">
					<block slot="right">
						<text class="cuIcon-camera" />
						<text class="cuIcon-settings" @tap="setupTap" />
					</block>
				</bar-title>
				<!-- #endif -->

				<!--用户信息-->
				<view class="zaiui-user-info-box">
					<!--未登陆-->
					<view class="login-user-view" v-if="login">
						<view class="login-user-avatar-view">
							<view class="cu-avatar round lg"
								:style="{'background-image':'url('+avatar+')'}" />
						</view>
						<button class="cu-btn sm radius" @tap="loginUrlTap">立即登录</button>
					</view>

					<!--已登陆-->
					<view class="cu-list menu-avatar" v-else>
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="{'background-image':'url('+avatar+')'}" />
							<view class="content text-xl">
								<view class="text-white">
									<text class="margin-right">{{userInfo.nickname}}</text>
									<text class="text-sm">{{userInfo.name}}</text>
								</view>
								<view class="text-white-bg text-sm">
									<text class="text-border-x" v-if="partner_grade">{{partner_grade}}</text>
									<text v-if="memberlevel_name">{{memberlevel_name}}</text>
								</view>
							</view>

						</view>
					</view>
				</view>

				<!--用户数据-->
				<view class="zaiui-user-info-num-box">
					<view class="cu-list grid col-4 no-border">
						<view class="cu-item" @tap="cartTap">
							<view class="text-xl" v-if="login">-</view>
							<view class="text-xl" v-else>0</view>
							<text class="text-sm">购物车</text>
						</view>
						<view class="cu-item" @tap="footmarkTap">
							<view class="text-xl" v-if="login">-</view>
							<view class="text-xl" v-else>4</view>
							<text class="text-sm">足迹</text>
						</view>
						<view class="cu-item" @tap="sponsoredTap">
							<view class="text-xl" v-if="login">-</view>
							<view class="text-xl" v-else>0</view>
							<text class="text-sm">红包</text>
						</view>
						<view class="cu-item">
							<view class="text-xl" v-if="login">-</view>
							<view class="text-xl" v-else>0</view>
							<text class="text-sm">账单</text>
						</view>
					</view>
				</view>

				<!--用户提示-->
				<view class="text-sm zaiui-user-info-tip-box" v-if="show_upgrade_tip" @tap="realNameTap">
					<view class="text-cut">偷偷告诉你，实名认证后宝贝更易卖出哦~</view>
					<text class="cuIcon-right icon" />
				</view>
			</view>


			<view class="zaiui-view-content">
				<!--用户数据-->
				<view class="padding-xs bg-white zaiui-user-info-order-box">
					<view class="text-black text-lg text-bold padding-sm">我的交易</view>
					<view class="cu-list grid col-4 no-border">
						<view class="cu-item">
							<view class="text-xxl text-red" v-if="login">
								<text class="cuIcon-presentfill"></text>
							</view>
							<view class="text-xxl text-black" v-else>0</view>
							<text class="text-sm">我发布的</text>
						</view>
						<view class="cu-item">
							<view class="text-xxl text-red" v-if="login">
								<text class="cuIcon-sponsorfill"></text>
							</view>
							<view class="text-xxl text-black" v-else>1</view>
							<text class="text-sm">我卖出的</text>
						</view>
						<view class="cu-item" @tap="order_list_tap">
							<view class="text-xxl text-red" v-if="login">
								<text class="cuIcon-cartfill"></text>
							</view>
							<view class="text-xxl text-black" v-else>2</view>
							<text class="text-sm">我买到的</text>
						</view>
						<view class="cu-item">
							<view class="text-xxl text-red" v-if="login">
								<text class="cuIcon-favorfill"></text>
							</view>
							<view class="text-xxl text-black" v-else>3</view>
							<text class="text-sm">我收藏的</text>
						</view>
					</view>
				</view>

				<!--天天有钱-->
				<view class="padding-xs bg-white margin-top zaiui-user-info-money-box">
					<view class="text-black text-lg text-bold padding-sm">易货账户 | {{memberlevel_name}}</view>
					<view class="grid col-2 money-col">
						<view class="money-item">
							<view class="money-item-view">
								<view class="cu-avatar lg" style="background-image:url(/static/images/my/1.png);" />
								<view class="money-content">
									<view class="text-black text-cut">我的易货额度</view>
									<view class="text-red text-sm  text-cut" v-if="userInfo.credit">{{userInfo.credit}}
									</view>
								</view>
							</view>
						</view>
						<view class="money-item">
							<view class="money-item-view">
								<view class="cu-avatar lg" style="background-image:url(/static/images/my/2.png);" />
								<view class="money-content">
									<view class="text-black text-cut">我的额度账单</view>
									<view class="text-gray text-sm text-cut">查询易货账单</view>
								</view>
							</view>
						</view>

					</view>
					<view class="zaiui-tools-list-box">
						<view class="cu-list grid col-3 no-border">
							<block v-for="(item,index) in creditToolList" :key="index">
								<view class="cu-item" v-if="index < 12" @tap="gridTapCredit(item)">
									<view class="text-black" :class="['cuIcon-' + item.icon]" />
									<text>{{item.name}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>

				<view class="padding-xs bg-white margin-top zaiui-user-info-money-box" v-if="userInfo.partner_level!=1">
					<view class="text-black text-lg text-bold padding-sm">现金账户 | {{partner_grade}}</view>
					<view class="grid col-2 money-col">
						<view class="money-item">
							<view class="money-item-view">
								<view class="cu-avatar lg" style="background-image:url(/static/images/my/1.png);" />
								<view class="money-content">
									<view class="text-black text-cut">我的现金收益</view>
									<view class="text-red text-sm text-cut" v-if="userInfo.cash">{{userInfo.cash}}
									</view>
								</view>
							</view>
						</view>
						<view class="money-item">
							<view class="money-item-view">
								<view class="cu-avatar lg" style="background-image:url(/static/images/my/2.png);" />
								<view class="money-content">
									<view class="text-black text-cut">现金收益账单</view>
									<view class="text-gray text-sm text-cut">查询现金收益</view>
								</view>
							</view>
						</view>
						<text>如果邀请的下级会员申请成为会员,绑定推荐人（已交钱）,查看推荐人角色,如果是非合伙人,推荐人我邀请的会员添加记录。如果是合伙人,计算收益，添加我的下级商户，如果推荐人还是会员，添加我邀请的会员。
							如果下级成为合伙人，推荐人是合伙人，计算收益，添加已推荐合伙人记录。（一切根据下级申请，给推荐人判断返利，记录不同值）</text>
					</view>

					<view class="zaiui-tools-list-box">
						<view class="cu-list grid col-3 no-border">
							<block v-for="(item,index) in cashToolList" :key="index">
								<view class="cu-item" v-if="index < 12" @tap="gridTap(item)">
									<view class="text-black" :class="['cuIcon-' + item.icon]" />
									<text>{{item.name}}</text>
								</view>
							</block>
						</view>
					</view>
				</view>



			</view>

			<!--占位底部距离-->
			<view class="cu-tabbar-height"></view>
		</view>
		<view v-show="loadingStatus" style="position: absolute;top:0">松开刷新</view>


		<uni-popup ref="popup">
			<image :src="path" mode="widthFix"></image>
			<l-painter :board="poster" isCanvasToTempFilePath @success="path = $event"
				custom-style="position: fixed; left: 200%" />
		</uni-popup>



	</scroll-view>


</template>

<script>
	import barTitle from '@/components/zaiui-common/basics/bar-title';

	import creditToolList from '@/static/zaiui/data/creditToolList.js'; //虚拟数据
	import cashToolList from '@/static/zaiui/data/cashToolList.js'; //虚拟数据
	import _tool from '@/static/zaiui/util/tools.js'; //工具函数
	import api from '@/api/auth.js';

	export default {
		name: 'my',
		components: {
			barTitle
		},
		data() {
			return {
				creditToolList: [],
				cashToolList: [],
				login: false,
				userInfo: {},
				show_upgrade_tip: true,
				triggered: false,
				_freshing: false,
				loadingStatus: false,
				avatar: "",
				memberlevel_name: "",
				memberlevel_id: null,
				partner_grade: "",
				path: '',
				poster: {
					css: {
						width: "750rpx",
						paddingBottom: "40rpx",
						background: "linear-gradient(,#000 0%, #ff5000 100%)"
					},
					views: [{
							src: "https://cdn.jsdelivr.net/gh/liangei/image@latest/avatar-1.jpeg",
							type: "image",
							css: {
								background: "#fff",
								objectFit: "cover",
								marginLeft: "40rpx",
								marginTop: "40rpx",
								width: "84rpx",
								border: "2rpx solid #fff",
								boxSizing: "border-box",
								height: "84rpx",
								borderRadius: "50%"
							}
						},
						{
							type: "view",
							css: {
								marginTop: "40rpx",
								paddingLeft: "20rpx",
								display: "inline-block"
							},
							views: [{
									text: "隔壁老王",
									type: "text",
									css: {
										display: "block",
										paddingBottom: "10rpx",
										color: "#fff",
										fontSize: "32rpx",
										fontWeight: "bold"
									}
								},
								{
									text: "为您挑选了一个好物",
									type: "text",
									css: {
										color: "rgba(255,255,255,.7)",
										fontSize: "24rpx"
									},
								}
							],
						},
						{
							css: {
								marginLeft: "40rpx",
								marginTop: "30rpx",
								padding: "32rpx",
								boxSizing: "border-box",
								background: "#fff",
								borderRadius: "16rpx",
								width: "670rpx",
								boxShadow: "0 20rpx 58rpx rgba(0,0,0,.15)"
							},
							views: [{
								src: "https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg",
								type: "image",
								css: {
									objectFit: "cover",
									objectPosition: "50% 50%",
									width: "606rpx",
									height: "606rpx"
								},
							}, {
								css: {
									marginTop: "32rpx",
									color: "#FF0000",
									fontWeight: "bold",
									fontSize: "28rpx",
									lineHeight: "1em"
								},
								views: [{
									text: "￥",
									type: "text",
									css: {
										verticalAlign: "bottom"
									},
								}, {
									text: "39",
									type: "text",
									css: {
										verticalAlign: "bottom",
										fontSize: "58rpx"
									},
								}, {
									text: ".39",
									type: "text",
									css: {
										verticalAlign: "bottom"
									},
								}, {
									text: "￥59.99",
									type: "text",
									css: {
										verticalAlign: "bottom",
										paddingLeft: "10rpx",
										fontWeight: "normal",
										textDecoration: "line-through",
										color: "#999999"
									}
								}],

								type: "view"
							}, {
								css: {
									marginTop: "32rpx",
									fontSize: "26rpx",
									color: "#8c5400"
								},
								views: [{
									text: "自营",
									type: "text",
									css: {
										color: "#212121",
										background: "#ffb400"
									},
								}, {
									text: "30天最低价",
									type: "text",
									css: {
										marginLeft: "16rpx",
										background: "#fff4d9",
										textDecoration: "line-through"
									},
								}, {
									text: "满减优惠",
									type: "text",
									css: {
										marginLeft: "16rpx",
										background: "#fff4d9"
									},
								}, {
									text: "超高好评",
									type: "text",
									css: {
										marginLeft: "16rpx",
										background: "#fff4d9"
									},

								}],

								type: "view"
							}, {
								css: {
									marginTop: "30rpx"
								},
								views: [{
									text: "360儿童电话手表9X 智能语音问答定位支付手表 4G全网通20米游泳级防水视频通话拍照手表男女孩星空蓝",
									type: "text",
									css: {
										paddingRight: "32rpx",
										boxSizing: "border-box",
										lineClamp: 2,
										color: "#333333",
										lineHeight: "1.8em",
										fontSize: "36rpx",
										width: "478rpx"
									},
								}, {
									text: "limeui.qcoon.cn",
									type: "qrcode",
									css: {
										width: "128rpx",
										height: "128rpx",
									},

								}],
								type: "view"
							}],
							type: "view"
						}
					]
				}
			}
		},
		props: {
			show: {
				type: Boolean,
				default: true
			},
			scrollY: {
				type: Number,
				default: 0
			},
			scrollBottom: {
				type: Number,
				default: 0
			},
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		watch: {


			scrollY() {
				//通知他妈的滚动了。
				this.setPageScroll(this.scrollY);
			},
			scrollBottom() {
				console.log(this.scrollBottom)
				if (this.scrollBottom != 0) {
					//通知他妈的触底了
					this.setReachBottom();
				}
			},
		},
		created() {
			//加载虚拟数据
			this.creditToolList = creditToolList.toolsListData();
			this.cashToolList = cashToolList.toolsListData();
		},
		mounted() {
			this.int()



			_tool.setBarColor(false);
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},

		methods: {
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				if (!this.triggered) //界面下拉触发，triggered可能不是true，要设为true  
					this.triggered = true;
				this.int();

				setTimeout(() => {
					this.triggered = false; //触发onRestore，并关闭刷新图标  
					this._freshing = false;
				}, 1000)
			},

			async int() {
				//用户信息准备
				this.userInfo = uni.getStorageSync('userInfo');

				console.log(this.userInfo.member_id)

				const userInfoMore = await api.detail({ //token过期问题解决
					member_id: this.userInfo.member_id
				})
				console.log(userInfoMore)

				if (userInfoMore.status == 200) {
					console.log(userInfoMore.data)

					this.userInfo = userInfoMore.data;
					
					this.$store.commit('setToken', {
						userInfo: userInfoMore.data
					}) //同步用户信息
					
					if (this.userInfo) {
						console.log(this.userInfo)
						this.avatar = this.userInfo.avatar

						var userInfo = this.userInfo;

						console.log(userInfo)

						this.memberlevel_name = userInfo.systemmemberlevel.memberlevel_name;
						this.memberlevel_id = userInfo.level;
						this.partner_grade = userInfo.systempartner.partner_grade;

						if (userInfo.level != 1) { //非普通会员
							//this.memberlevel_name = userInfo.systemmemberlevel.memberlevel_name;
							this.show_upgrade_tip = false;
						}
						if (userInfo.partner_level != 1) { //非合伙人
							//this.partner_grade = userInfo.systempartner.partner_grade;
						}

					}
				} else {
					this.$util.msg(userInfoMore.msg)
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}



			},
			//页面被滚动
			setPageScroll(scrollTop) {
				//console.log(scrollTop);

			},
			//触底了
			setReachBottom() {
				console.log('触底了');
			},
			//购物车
			cartTap() {
				uni.navigateTo({
					url: "/pages/goods/my_cart"
				});
			},
			//足迹
			footmarkTap() {
				uni.navigateTo({
					url: "/pages/my/footmark"
				});
			},
			//我买到的
			order_list_tap() {
				uni.navigateTo({
					url: "/pages/order/list"
				});
			},
			loginUrlTap() {
				uni.navigateTo({
					url: "/pages/my/login"
				});
			},
			loginTap() {
				if (this.login) {
					this.login = false;
				} else {
					this.login = true;
				}
			},
			realNameTap() {
				uni.navigateTo({
					url: "/pages/real_name/index"
				});
			},
			setupTap() {
				uni.navigateTo({
					url: "/pages/my/set-up"
				});
			},
			gridTapCredit(item) {
				if (item.name == '邀请会员') {
					this.$refs.popup.open('center')
				}

				if (item.name == '我的权益') {

					console.log(this.memberlevel_id)

					console.log('进入我的权益');

					uni.navigateTo({
						url: "/pages/my/select-userlevel?memberlevel_id=" + this.memberlevel_id
					})
				}

				if (item.name == '升级会员') {

					console.log(this.memberlevel_id)

					console.log('进入升级会员');

					uni.navigateTo({
						url: "/pages/my/select-userlevel?memberlevel_id=" + this.memberlevel_id + 1
					})
				}


				if (item.name == '我的认证') {

					console.log('进入我的认证');

					uni.navigateTo({
						url: "/pages/real_name/index?member_id=" + this.userInfo.member_id
					});
				}

				if (item.name == '转移易货额度') {

					console.log('进入转移易货额度');

					uni.navigateTo({
						url: "/pages/credit/credit_transaction"
					});
				}

				if (item.name == '我邀请的会员') {

					console.log('进入我邀请的会员');

					uni.navigateTo({
						url: "/pages/my/personal-member"
					});
				}

				if (item.name == '我的商品') {

					console.log(this.userInfo.member_id)

					console.log('进入我的商品');

					uni.navigateTo({
						url: "/pages/sell/my?member_id=" + this.userInfo.member_id
					})
				}


			},
			gridTap(item) {
				if (item.name == '设置') {
					this.setupTap();
				}
				if (item.name == '推荐合伙人') {
					this.$refs.popup.open('center')
				}
			},
			sponsoredTap() {
				uni.navigateTo({
					url: "/pages/my/sponsored"
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.zaiui-my-box {
		width: 100%;
		display: none;

		.zaiui-head-box {
			padding-top: 0;
			padding-bottom: 72.72rpx;

			.zaiui-user-info-box {
				/* #ifdef MP */
				padding-top: calc(var(--status-bar-height) + 50rpx);

				/* #endif */
				.login-user-view {
					position: relative;
					text-align: center;

					.login-user-avatar-view {
						position: relative;
						margin-bottom: 18.18rpx;
					}
				}

				.cu-list.menu-avatar>.cu-item {
					background-color: inherit;

					.content {
						width: calc(100% - 94.54rpx - 59.99rpx - 20rpx);

						.text-white-bg {
							color: #e8e8e8;

							.text-border-x {
								margin-right: 25.45rpx;
								position: relative;

								&:after {
									position: absolute;
									background: #dddddd;
									top: 5.45rpx;
									width: 1.81rpx;
									right: -12.72rpx;
									height: 16.36rpx;
									content: " ";
								}
							}
						}
					}

					&:after {
						width: 0;
						height: 0;
						border-bottom: 0;
					}
				}

				.cu-list.menu-avatar>.cu-item .content>view:first-child {
					font-size: 34.54rpx;
				}
			}

			.zaiui-user-info-num-box {
				.cu-list.grid.no-border {
					padding: 0;
				}

				.cu-list.grid.no-border>.cu-item {
					padding-top: 27.27rpx;
					padding-bottom: 9.09rpx;
				}

				.cu-list.grid {
					background-color: inherit;
				}

				.cu-list.grid>.cu-item text {
					color: #e8e8e8;
					font-size: 20rpx;
					line-height: 27.27rpx;
				}
			}

			.zaiui-user-info-tip-box {
				position: relative;
				margin: 18.18rpx 27.27rpx;
				border-radius: 9.09rpx;
				padding: 18.18rpx 27.27rpx;
				background: #ea8d8d;
				background-image: linear-gradient(45deg, #f7615f, #f553b3);

				.text-cut {
					padding-right: 45.45rpx;
				}

				.icon {
					position: absolute;
					right: 27.27rpx;
					top: 23.63rpx;
				}
			}
		}

		.zaiui-view-content {
			padding: 0 27.27rpx 54.54rpx;
			margin-top: -63.63rpx;

			.zaiui-user-info-order-box {
				border-radius: 18.18rpx;

				.cu-list.grid.no-border {
					padding: 0;
				}

				.cu-list.grid.no-border>.cu-item {
					padding-bottom: 9.09rpx;
				}
			}

			.cu-list.grid>.cu-item text {
				color: inherit;
			}

			.zaiui-user-info-money-box {
				border-radius: 18.18rpx;

				.money-col {
					padding: 0 9.09rpx 9.09rpx;

					.money-item {
						position: relative;
						padding: 9.09rpx;

						.money-item-view {
							border: 1.81rpx solid #f3f2f3;
							border-radius: 18.18rpx;
							position: relative;
							padding: 9.09rpx;

							.cu-avatar {
								position: absolute;
								left: 9.09rpx;
							}

							.money-content {
								position: relative;
								margin-left: 109.09rpx;
								margin-bottom: 27.27rpx;
								top: 12.72rpx;
							}
						}
					}
				}
			}

			.zaiui-user-info-tools-box {
				border-radius: 18.18rpx;

				.tools-view {
					position: relative;

					.tools-title {
						padding-right: 81.81rpx;
					}

					.tools-right {
						position: absolute;
						right: 9.09rpx;
						bottom: 23.63rpx;
					}
				}

			}
		}
	}

	.zaiui-my-box.show {
		display: block;
	}
</style>
