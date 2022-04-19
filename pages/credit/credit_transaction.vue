<template>
	<scroll-view :refresher-triggered="triggered" :refresher-enabled="true" @refresherrefresh="onRefresh">
		<!--标题栏-->
		<bar-title bgColor="bg-white" isBack>
			<block slot="content">共享我的易货额度</block>
			<block slot="right"></block>
		</bar-title>

		<view class="bg-white">
			<uni-search-bar placeholder="输入手机号码查询下级" bgColor="#EEEEEE" @confirm="search" />
		</view>

		<view v-if="search_list.length!=0">
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-blue "></text>搜索到的用户
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item cur" v-for="(item,index) in search_list" :key="index"
					@tap="popupshow(item.member_id,item.nickname,item.name)">
					<view class="cu-avatar radius lg" :style="{'background-image':'url('+item.avatar+')'}">

					</view>
					<view class="content">
						<view>
							<view class="text-cut">{{item.nickname}} {{item.name}}</view>

							<view class="cu-tag round bg-orange sm" v-if="item.systemmemberlevel">
								{{item.systemmemberlevel.memberlevel_name}}
							</view>
							<view class="cu-tag round bg-yellow sm" v-if="item.systempartner">
								{{item.systempartner.partner_grade}}
							</view>
						</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut"><text
									class="cuIcon-mobile text-orange margin-left-xs"></text>{{item.mobile}}
								<text class="cuIcon-locationfill text-orange margin-left-xs"></text>加入时间
								{{$util.format(item.approval_time*1000,format = "yyyy-MM-dd") }}
							</view>
						</view>
					</view>
					<view class="action">

						<view class="cuIcon-pullright text-gray"></view>
					</view>
				</view>
			</view>
		</view>


		<view class="cu-bar bg-white solid-bottom margin-top">
			<view class="action">
				<text class="cuIcon-title text-blue "></text>您当前持有易货额度
				<view class='cu-tag line-blue margin-left'>{{member_credit}}</view>
			</view>
		</view>

		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-green "></text>您推荐的会员共有
				<view class='cu-tag line-green margin-left'>{{my_subordinate_totle + "名"}}</view>
			</view>
		</view>

		<view class="cu-list menu-avatar">
			<view class="cu-item cur" v-for="(item,index) in my_subordinate_list" :key="index"
				@tap="popupshow(item.member_id,item.nickname,item.name)">
				<view class="cu-avatar radius lg" :style="{'background-image':'url('+item.avatar+')'}">

				</view>
				<view class="content">
					<view>
						<view class="text-cut">{{item.nickname}} {{item.name}}</view>

						<view class="cu-tag round bg-orange sm" v-if="item.systemmemberlevel">
							{{item.systemmemberlevel.memberlevel_name}}
						</view>
						<view class="cu-tag round bg-yellow sm" v-if="item.systempartner">
							{{item.systempartner.partner_grade}}
						</view>
					</view>
					<view class="text-gray text-sm flex">
						<view class="text-cut"><text
								class="cuIcon-mobile text-orange margin-left-xs"></text>{{item.mobile}}
							<text class="cuIcon-locationfill text-orange margin-left-xs"></text>加入时间
							{{$util.format(item.approval_time*1000,format = "yyyy-MM-dd") }}
						</view>
					</view>
				</view>
				<view class="action">

					<view class="cuIcon-pullright text-gray"></view>
				</view>
			</view>
		</view>


		<uni-popup ref="popup" type="dialog" is-mask-click background-color="#fff">
			<uni-popup-dialog :title="'请确认给用户 '+userid.name+userid.nickname+' 充值'" mode="input" placeholder="请输入充值额度"
				confirmText="确认充值" cancelText="考虑考虑" @confirm='changecredit'></uni-popup-dialog>
		</uni-popup>


	</scroll-view>
</template>

<script>
	import barTitle from '@/components/zaiui-common/basics/bar-title';
	import api from '@/api/auth.js';
	import creditapi from '@/api/creditchange.js';
	export default {
		components: {
			barTitle
		},
		data() {
			return {
				triggered: false,
				_freshing: false,
				member_id: null,
				member_name: "",
				member_nickname: "",
				member_credit: null,
				my_subordinate_totle: 0,
				my_subordinate_list: [],
				userid: {},
				search_list: []
			}
		},

		onLoad() {
			this.int()
		},

		methods: {
			async int() {

				const userInfoMore = await api.detail({ //token过期问题解决
					member_id: uni.getStorageSync('userInfo').member_id
				})

				if (userInfoMore.status == 200) {
					console.log(userInfoMore.data)
					this.$store.commit('setToken', {
						userInfo: userInfoMore.data
					}) //同步用户信息
				}

				var userInfo = this.$store.state.userInfo;
				this.member_id = userInfo.member_id;
				this.member_name = userInfo.name;
				this.member_nickname = userInfo.nickname;
				this.member_credit = userInfo.credit;

				console.log(this.member_name + this.member_id + this.member_credit)
				this.find_my_subordinate()
			},
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

			async find_my_subordinate() {
				var {
					data: my_subordinate_res
				} = await api.index({
					Invitee: this.member_id,
					status: 2
				})
				this.my_subordinate_totle = my_subordinate_res.total;
				this.my_subordinate_list = my_subordinate_res.data;
				console.log(my_subordinate_res)
			},
			async search(e) {
				console.log(e)
				var data = {
					mobile: e.value,
					Invitee: this.member_id,
					status: 2
				}
				var {
					data: searchres
				} = await api.index(data)

				this.search_list = searchres.data;

				if (searchres.total == 0) {
					this.$util.msg('您名下查无此用户')
				}

			},
			popupshow(id, nickname, name) {

				console.log(id)
				this.userid = {
					'id': id,
					'nickname': nickname,
					'name': name
				}

				console.log(this.userid)
				this.$refs.popup.open('center')

			},
			async changecredit(num) {
				console.log('充值' + num)

				var regPos = /^[0-9]+.?[0-9]*/;


				if (regPos.test(num)) {
					var isnum = true;
				} else {
					var isnum = false;
				}
				console.log(isnum)


				if (isnum) {

					if (this.member_credit - num >= 0) { //给增用户加值
						var addpost = {
							creditchange_member_id: this.userid.id,
							creditchange_status: 1,
							creditchange_operator: this.member_id,
							creditchange_num: num,
							creditchange_remarks: this.member_name + this.member_nickname + "转移给" + this.userid
								.name +
								this
								.userid.nickname + "易货额度" + num,
						}

						var addcreditpost = {
							member_id: this.userid.id,
							credit: num
						}

						await creditapi.add(addpost)
						await creditapi.addcredit(addcreditpost)
						

						//给减用户减值
						var reducepost = {
							creditchange_member_id: this.member_id,
							creditchange_status: 2,
							creditchange_operator: this.member_id,
							creditchange_num: num,
							creditchange_remarks: this.member_name + this.member_nickname + "转移给" + this.userid
								.name +
								this
								.userid.nickname + "易货额度" + num,
						}

						var reducecreditpost = {
							member_id: this.member_id,
							credit: num
						}
						await creditapi.add(reducepost)
						await creditapi.reducecredit(reducecreditpost)

						this.int();
						
						this.$util.msg("完成交易", {
							'duration': 3000,
							'mask': true,
							'icon': 'success'
						})


					//跳转账单


				} else {

					this.$util.msg('您当前的持有易货额度为' + this.member_credit + "不足以转移额度" + num + "请通过其他途径充值您的额度", {
						'duration': 5000,
						'mask': true
					})

				}

			} else {

				this.$util.msg('请输入正确的易货额度值（只为数字）')
			}


		}

	}
	}
</script>

<style>

</style>
