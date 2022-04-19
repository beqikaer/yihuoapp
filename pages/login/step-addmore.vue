<template>
	<view>
		<!--标题栏-->
		<bar-title bgColor="bg-white">
			<block slot="content">编辑个人信息</block>
		</bar-title>

		<!--登录图标-->
		<view class="text-center" @click="addavatar">
			<view class="zaiui-user-login-avatar-view margin-bottom-sm">
				<view class="cu-avatar round lg" :style="{'background-image': 'url('+ form.avatar+')'}" />
			</view>
			<text class="text-gray">选择头像</text>
		</view>
		<!--按钮-->

		<view class="flex flex-direction zaiui-btn-view">
			<view class="cu-form-group">
				<text class="cuIcon-mail   margin-right-xs"></text>
				<view class="title">手机号<text class="cuIcon-title text-red margin-left-xs" /></view>
				<input v-model="form.mobile" :disabled="mobileabled" placeholder="绑定的唯一凭证" name="input"></input>
			</view>
			<view class="cu-form-group">
				<text class="cuIcon-bad   margin-right-xs"></text>
				<view class="title">昵 称<text class="cuIcon-title text-red margin-left-xs" /></view>
				<input v-model="form.nickname" :disabled="nicknameabled" requied='true' placeholder="可用于登录用户名"
					name="input"></input>
			</view>
			<view class="cu-form-group">
				<text class="cuIcon-my   margin-right-xs"></text>
				<view class="title">姓 名<text class="cuIcon-title text-red margin-left-xs" /></view>
				<input v-model="form.name" placeholder="亦可是商户名" name="input"></input>
			</view>
			<view class="cu-form-group">
				<text class="cuIcon-mail   margin-right-xs"></text>
				<view class="title">邮 箱<text class="cuIcon-title text-blue margin-left-xs" /></view>
				<input v-model="form.mail" placeholder="用于接收信息" name="input"></input>
			</view>
			<view class="cu-form-group">
				<text class="cuIcon-emoji  margin-right-xs"></text>
				<view class="title">邀请人<text class="cuIcon-title text-blue margin-left-xs" /></view>
				<input v-model="form.Invitee" placeholder="成为他/她的下级" name="input"></input>
			</view>
		</view>

		<view class="text-center margin-top text-bold "><text class="cuIcon-title text-red margin-left-xs" />为必填项<text
				class="cuIcon-title text-blue margin-left-xs" />为非必填项</view>

		<view class="flex flex-direction zaiui-btn-view">



			<button @click="confirm()" class="cu-btn bg-gradual-green margin-bottom-sm">
				<text>确认信息</text>
			</button>

		</view>
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
				form: {
					mobile: null,
					avatar: null,
					nickname: '',
					name: '',
					Invitee: '',
					pwd: '123456',
					level: 1,
					partner_level: 1,
					cash: 0.00,
					credit: 0.00,
					status:1,
					mail:''
				},
				mobileabled: false,
				nicknameabled: false,
			}
		},
		onLoad(e) {
			console.log(e)

			this.form.avatar='/static/images/avatar/1.jpg';
			
			if (e.mobile) { //手机号登录,查无手机号在该页完成注册，并登录
				this.form.mobile = e.mobile;
				this.mobileabled = true;
			}

			if (e.nickname && e.pwd) { //账号密码登录,查无账号密码在该页完成注册，完成手机号码校验，并登录
				console.log(e.nickname)
				this.form.nickname = e.nickname;
				this.form.pwd = e.pwd;
				this.nicknameabled = true
			}

		},
		methods: {
			addavatar() {
				let self = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						console.log(res)
						let Imgsrc = res.tempFilePaths[0];
						self.fileUpload('image', Imgsrc);
					}
				});

			},
			// 文件上传
			fileUpload(type, path) {
				console.log(path)
				let self = this;
				uni.showLoading({
					title: '图片上传中'
				});
				uni.uploadFile({
					url: BASE_URL + '/app/Upload/Upload', //后台给的阿里云存储给的上传地址
					filePath: path,
					fileType: type,
					name: 'file',
					success: res => {
						var avatarpic = JSON.parse(res.data);
						console.log(avatarpic)
						self.form.avatar = avatarpic.data ;


						uni.hideLoading();
					},
					fail: err => {
						uni.hideLoading();
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
					}
				});
			},
			async confirm() {

				const res = await api.add(this.form)
				console.log(res)

				if (res.status == 411) {
					this.$util.msg(res.msg);
				} else if (res.status == 200) {
					console.log(res.data)
					var member_id = res.data;

					if (member_id && this.form.mobile != null) { //如果手机号存在手机号登录
						const member_info = await api.mobile_login({
							mobile: this.form.mobile
						})
						console.log(member_info)
						this.loginSuccessCallBack(member_info);
					} else {
						this.$util.msg('请核实信息');
					}

					//页面跳转

				} else {

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
						url: '/pages/app/index'
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
		margin-top: 150rpx;

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
