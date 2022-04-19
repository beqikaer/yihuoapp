<template>
	<view>
		<!--标题栏-->
		<bar-title bgColor="bg-white" >
			<block slot="content">登录</block>
		</bar-title>

		<!--登录图标-->
		<view class="zaiui-user-login-avatar-view">
			<view class="cu-avatar round lg" style="background-image:url(/static/images/avatar/1.jpg);" />
		</view>
		<!--按钮-->

		<view class="flex flex-direction zaiui-btn-view" v-if="!mobilelogin">
			<view class="cu-form-group">
				<text class="cuIcon-friendfamous   margin-right-xs"></text>
				<view class="title">手机号/用户名</view>
				<input v-model="mobileorusername" placeholder="请输入手机号或用户名" name="input"></input>
			</view>
			<view class="cu-form-group" v-if="!mobileshow">
				<text class="cuIcon-barcode   margin-right-xs"></text>
				<view class="title">登录密码</view>
				<input v-model="pwd" placeholder="请输入登录密码" name="input" type="password"></input>
			</view>
			<view class="cu-form-group" v-if="mobileshow">
				<text class="cuIcon-safe   margin-right-xs"></text>
				<view class="title">
					验证码</view>

				<input v-model="code" placeholder="请输入验证码" name="input"></input>
				<button :disabled="getCodeDisabled" @click="get_smscode"
					class="cu-btn bg-blue shadow">{{getCodeBtnText}}</button>
			</view>

		</view>
		<view class="flex flex-direction zaiui-btn-view">
			<button v-if="mobilelogin" @tap="phone_login()" class="cu-btn bg-red margin-bottom-sm">
				<text class="cuIcon-mobile icon" />
				<text>手机登录</text>
			</button>
			<button v-if="!mobilelogin" @tap="login()" class="cu-btn bg-blue margin-bottom-sm">
				<text class="" />
				<text>登录</text>
			</button>
			<button v-if="wx_login" class="cu-btn bg-green margin-bottom-sm">
				<text class="cuIcon-weixin icon" />
				<text>微信登录</text>
			</button>
		</view>
		<!--按钮-->


		<!--协议-->
		<view class="zaiui-agreement-checked-view">
			<checkbox class='round red sm zaiui-checked checked' />
			<view class="text-sm text-black-view ">
				<view class="text-gray">已阅读并同意以下协议</view>
				<view class="text-red">《用户服务协议》《隐私政策》</view>
			</view>
		</view>

		<!--底部说明-->
		<view class="text-sm text-gray zaiui-foot-ad-view">更专业的易货交易平台</view>


	</view>
</template>

<script>
	import barTitle from '@/components/zaiui-common/basics/bar-title';
	import _tool from '@/static/zaiui/util/tools.js'; //工具函数
	import api from '@/api/auth.js';


	export default {
		components: {
			barTitle
		},
		data() {
			return {
				verification_code: true,
				mobileorusername: null,
				mobileshow: false,
				mobilelogin: true,
				ismobilelogin: false,
				pwd: '',
				code: '',
				countDownTime: 60,
				getCodeBtnText: '获取验证码',
				getCodeDisabled: false,
				wx_login: false
			}
		},
		onLoad() {

			// #ifdef H5 
			this.mobilelogin = false;
			//#endif 

			this.phone_login()
		},
		onReady() {
			_tool.setBarColor(true);
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			});
		},
		watch: {
			mobileorusername(curVal, oldVal) {
				// 实现input连续输入，只发一次请求
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					this.showmobile(curVal)
				}, 1500)
			}
		},
		methods: {

			showmobile(value) {
				if (value === '') {
					return false;
				}
				const ismobile = this.$util.checkStr(value, 'mobile');

				this.ismobilelogin = ismobile; //是否填写手机登录

				console.log(ismobile)

				if (ismobile) {
					//this.$util.msg('请获取验证码');
					this.mobileshow = true;
				} else {
					//this.$util.msg('请输入登录密码');
					this.mobileshow = false;
				}
			},
			phone_login() {
				var that = this;
				//this.$util.msg('请阅读并同意用户服务及隐私协议');
				//this.navTo('/pages/app/index')
				// #ifdef APP-PLUS
				uni.preLogin({
					provider: 'univerify',
					success() {
						// 显示一键登录选项

						uni.login({
							provider: 'univerify',
							univerifyStyle: { // 自定义登录框样式
								//参考`univerifyStyle 数据结构`
							},
							success(res) {

								uniCloud.callFunction({
									name: 'getmobile', // 你的云函数名称
									data: {
										'access_token': res.authResult.access_token,
										'openid': res.authResult.openid
									}
								}).then(res => {
									console.log(res)
									console.log(res.result.res) //得到手机号
									that.get_mobile_success(res.result.res);
								})
							},
							fail(res) { // 登录失败

								console.log('登录失败')
								console.log(res.errCode)
								console.log(res)
								
								//if(res.errCode==30002 || res.errCode== 30006){
									//console.log(res.errMsg);
									that.mobilelogin=false
							//	}
								
								uni.closeAuthView()
							}
						})
					},
					fail(res) { // 预登录失败
						that.mobilelogin = false
						// 不显示一键登录选项（或置灰）
						// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
						console.log(res.errCode)
						console.log(res.errMsg)
					}
				})
				// #endif
			},

			async login() {
				console.log('登录')
				console.log(this.ismobilelogin)
				console.log(this.mobileorusername)
				console.log(this.pwd)
				var that = this;
				//账号密码登录
				if (!this.ismobilelogin && this.mobileorusername && this.pwd) {
					//查询账号是否存在
					const hasnickname = await api.find_nickname({
						nickname: this.mobileorusername
					})

					console.log(hasnickname.data.total)
					if (hasnickname.status == 200) {
						if (hasnickname.data.total != 0) {
							//依据账号，有账号
							var postdata = {
								nickname: this.mobileorusername,
								pwd: this.pwd
							}
							//账号密码登录
							console.log(postdata)
							const member = await api.user_login(postdata)

							console.log(member);
							
							

							if (member.status == 411) {
								this.$util.msg(member.msg)
							} else if (member.status == 200) {
								//登陆成功1
								this.loginSuccessCallBack(member)
							}

						} else {
							//账号不存在，去注册
							uni.showModal({
								title: '提示注册',
								content: '您的信息系统未检测到，请点击确认注册。',
								success: function(res) {
									console.log(res)
									if (res.confirm) {
										that.navTo('/pages/login/step-addmore?nickname=' + that
											.mobileorusername + '&pwd=' + that
											.pwd)
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
					}
				}


				//手机号登录
				if (this.ismobilelogin && this.mobileorusername) {

					const hasmobile = await api.find_mobile({
						mobile: this.mobileorusername
					})
					console.log(hasmobile.data.total)

					console.log(this.mobileorusername)
					var post = {
						verify_id: this.smskey,
						mobile: this.mobileorusername,
						verify: this.code
					}
					console.log(post)
					const member = await api.sms_login(post)
					console.log(member)
					if (member.status == 411) {
						this.$util.msg(member.msg)
						if (hasmobile.data.total == 0 && member.msg == '登录失败，请检查手机号') {
							uni.showModal({
								title: '提示注册',
								content: '您的信息系统未检测到，请点击确认注册。',
								success: function(res) {
									console.log(res)
									if (res.confirm) {
										that.navTo('/pages/login/step-addmore?mobile=' + that
											.mobileorusername)
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});

						}
					} else if (member.status == 200) {
						//登陆成功1
						this.loginSuccessCallBack(member)

					} else {

					}
				}

			},
			async get_smscode() {
				var that = this;
				this.verification_code = false;
				if (this.ismobilelogin && this.mobileorusername) {
					console.log(this.mobileorusername)
					const get_smscode = await api.sendSms({
						mobile: this.mobileorusername
					})
					console.log(get_smscode)
					if (get_smscode.status == 411 || get_smscode.status == 500) {
						this.$util.msg(get_smscode.msg)
					}
					if (get_smscode.status == 200) {

						this.smskey = get_smscode.key;

						console.log(this.smskey)

						this.timeOut = false;
						//倒计时
						uni.showToast({
							title: '验证码已发送',
							position: 'center',
						});
						this.timer = setInterval(() => {
							that.countDownTime--;
							// that.getCodeBtnText = this.countDownTime + "s后重新获取";
							that.getCodeBtnText = this.countDownTime + "秒";
							that.getCodeDisabled = true;
							if (that.countDownTime <= 0) {
								clearInterval(this.timer);
								that.countDownTime = 60;
								that.timeOut = true;
								that.getCodeDisabled = false;
								that.getCodeBtnText = "获取验证码";
							}
						}, 1000)

					}
				}
			},
			async get_mobile_success(mobile) { //一键手机login成功

				const hasmobile = await api.find_mobile({
					mobile: mobile
				})
				console.log(hasmobile)

				uni.closeAuthView()

				if (hasmobile.data.total != 0 && hasmobile.status == 200) { //查询有用户，查询可用

					console.log(mobile)

					const member = await api.mobile_login({
						mobile: mobile
					})
					console.log(member)
					//登陆成功1
					this.loginSuccessCallBack(member)

					//this.navTo('/pages/app/index')
				} else {
					this.navTo('/pages/login/step-addmore?mobile=' + mobile)
				}

			},
			// 登录成功操作 vuex 
			loginSuccessCallBack(data) {
				this.$util.msg('登录成功')
				// 状态管理保存用户信息

				const logininfo = {
					access_token: data.token,
					userInfo: data.data
				}

				this.$store.commit('setToken', logininfo) //同步用户信息


				setTimeout(() => {

					console.log(uni.getStorageSync('userInfo'))
					uni.reLaunch({
						url:'/pages/app/index'
					})
				}, 500)
			}
			
		}
	}
</script>

<style lang="scss">
	/* #ifdef APP-PLUS */
	@import "../../static/colorui/main.css";
	@import "../../static/colorui/icon.css";
	@import "../../static/zaiui/style/app.scss";
	/* #endif */

	.zaiui-user-login-avatar-view {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 218.18rpx;

		.cu-avatar {
			width: 181.81rpx;
			height: 181.81rpx;
		}
	}

	.zaiui-btn-view {
		position: relative;
		margin-top: 72.72rpx;
		padding: 0 45.45rpx;

		.cu-btn .icon {
			position: relative;
			font-size: 47.27rpx;
			right: 9.09rpx;
			top: -3.63rpx;
		}
	}

	.zaiui-agreement-checked-view {
		position: relative;
		padding: 27.27rpx 45.45rpx;

		.zaiui-checked {
			position: absolute;
			transform: scale(0.7);
		}

		.text-black-view {
			padding-left: 54.54rpx;
			line-height: 47.27rpx;
		}
	}

	.zaiui-foot-ad-view {
		position: fixed;
		text-align: center;
		bottom: 72.72rpx;
		width: 100%;
	}
</style>
