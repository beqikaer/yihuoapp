<template>
	<view>
		<!--标题栏-->
		<bar-title bgColor="bg-white" :isBack="true" @rightTap="Submit">
			<block slot="content">商品资料</block>
			<block slot="right"><button class="cu-btn bg-blue round">发布商品</button></block>
		</bar-title>

		<view class="cu-form-group margin-top">
			<view class="title">商品名称</view>
			<input v-model="form.goods_name" placeholder="请输入商品名称" name="input"></input>
		</view>

		<view class="cu-bar bg-white margin-top">
			<view class="action">
				商品图片上传
			</view>
			<view class="action">
				{{imgList.length}}/6
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub">
				<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
					:data-url="imgList[index]">
					<image :src="imgList[index]" mode="aspectFill"></image>
					<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="imgList.length<6">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>




		<view class="cu-form-group margin-top">
			<view class="title">商品简介</view>
			<input v-model="form.goods_des" placeholder="请输入商品简介" name="input"></input>
		</view>

		<view class="cu-form-group">
			<view class="title">商品原价</view>
			<input v-model="form.goods_original_price" placeholder="请输入原价" name="input"></input>
			<text class='text-orange text-bold'>元(￥)</text>
		</view>

		<view class="cu-form-group">
			<view class="title">商品售价</view>
			<input v-model="form.goods_price" placeholder="请输入售价" name="input"></input>
			<text class='text-orange text-bold'>元(￥)</text>
		</view>

		<view class="cu-form-group">
			<view class="title">商品库存</view>
			<input v-model="form.goods_stock" placeholder="请输入库存" name="input"></input>

		</view>

		<view class="cu-form-group">
			<view class="title">是否上架</view>
			<switch @change="onsale" checked color="#FFCC33" />
		</view>



		<jinEdit ref="jinEdit" height="200" placeholder="请输入商品详情,可点击工具条上传图片" @editOk="editOk"></jinEdit>


		<view class="cu-form-group margin-top">
			<text class="cuIcon-locationfill text-orange margin-right"></text>
			<input name="input" :value="address" disabled="disabled"></input>
			<button class='cu-btn bg-green shadow' @tap="getLocation">重新定位</button>
		</view>

		<view class="padding flex flex-direction">
			<button @tap="Submit" class="cu-btn bg-blue lg">发布商品</button>
		</view>



	</view>
</template>

<script>
	import uploadImage from "@/js_sdk/yushijie-ossutil/ossutil/uploadFile.js";
	import barTitle from '@/components/zaiui-common/basics/bar-title';
	import jinEdit from '@/components/jin-edit/jin-edit.vue';
	import commonApi from '@/api/common.js';
	import api from '@/api/goods.js';



	export default {
		components: {
			barTitle,
			jinEdit
		},
		data() {
			return {
				form: {
					goods_stock: 999,
					goods_type: [], //类型为数组
					goods_name: '',
					goods_des: '', //描述
					goods_pic: [], //图片
					goods_is_spec: 0, //是否多规格
					spec_info: '', //多规格
					goods_original_price: 0, //原价
					goods_price: 0, //售价
					goods_on_sale: 1, //1上架0下架
					goods_details: '', //详情
					goods_status: 1, //0禁用1等待审核2允许销售
					goods_vendor: '',
					goods_label: '' //标签
				},
				address: "", //为了显示
				mycity: "", //为了交互后端
				detail: "<p>设置的内容</p>",
				imgList: [],

			}

		},
		onLoad(e) {

			var mycity = uni.getStorageSync('myCity');

			this.mycity = mycity;

			if (mycity) {
				console.log(mycity)
				this.address = mycity.address.province + '-' + mycity.address.city + '-' + mycity.address.district + '-' +
					mycity.address
					.street
			} else {
				this.getLocation()
			}

			console.log(e.goods_type)
			this.form.goods_type = this.form.goods_type.concat(e.goods_type); //类型为数组
			var userInfo = uni.getStorageSync('userInfo');
			console.log(userInfo)
			this.form.goods_vendor = userInfo.member_id
		},
		methods: {
			getLocation() {
				const that = this
				uni.getLocation({
					// #ifdef MP-ALIPAY
					type: 2,
					// #endif
					geocode: true,
					success(res) {

						this.mycity = res;

						console.log('----', res)
						this.address = res.address.province + res.address.city + res.address.district + res.address
							.street
						uni.setStorageSync('myCity', res)
					},
					fail(err) {
						that.hasLocation = false
						uni.showToast({
							icon: 'none',
							title: '获取用户定位失败，请手动选择当前城市'
						})
					},
				})
			},

			async editOk(res) { //子组件执行父中方法
				console.log(res.html)
				console.log(this.form.goods_pic)

				if (this.form.goods_pic.length == 0) {
					console.log('请输入商品详情')
					this.$util.msg('请上传商品图片')
					return
				}
				if (res.html == "<p><br></p>") {
					console.log('请输入商品详情')
					this.$util.msg('请输入商品详情')
					return
				}

				this.form.goods_details = res.html;

				console.log(this.form)

				var goods_add_res = await api.goods_add(this.form);
				console.log(goods_add_res)

				var place_info = {
					'goods_place_position': JSON.stringify({
						'address': this.mycity.address.province + this.mycity.address.city + this.mycity
							.address.district + this.mycity.address,
						'lng': this.mycity.longitude,
						'lat': this.mycity.latitude
					}),
					goods_id: goods_add_res.data
				}

				var goods_place_res = await api.goods_place(place_info);
				console.log(goods_place_res)

				if (goods_add_res.status == 200) {
					this.$util.msg(goods_add_res.msg)

					setTimeout(() => {
						uni.navigateBack({});
					}, 2000);

				} else {
					this.$util.msg(goods_add_res.msg)
				}

			},
			// 上传图片
			onsale(e) {
				console.log(e.detail.value)
				if (e.detail.value) {
					this.goods_on_sale = 1
				} else {
					this.goods_on_sale = 0
				}
			},
			ChooseImage() {
				let self = this;
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: async (res) => {
						console.log(res)

						var tempFiles = res.tempFiles;
						uni.showLoading({
							title: '正在上传中...'
						})

						for (var i = 0; i < tempFiles.length; i++) {
							// 图片上传服务器
							const pic_res = await commonApi.uploadImg(tempFiles[i].path);

							var addimg = {
								'url': pic_res.data,
								'name': ''
							}

							self.imgList = self.imgList.concat(pic_res.data) //上传返回视图
							self.form.goods_pic = self.form.goods_pic.concat(addimg) //form数据更新

							console.log(88, pic_res.data);
						}

						uni.hideLoading();
						console.log(self.imgList)
						console.log(self.form)

					}
				});
			},

			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				this.imgList.splice(e.currentTarget.dataset.index, 1)
			},
			async Submit() {
				await this.$refs.jinEdit.submit(); //父组件执行子组件方法
			}
		}
	}
</script>

<style>
	.zaiui-head-box {
		position: relative;
		padding: 45.45rpx 90.9rpx;
	}

	.zaiui-btn-view {
		position: fixed;
		width: 100%;
		bottom: 0;

		.flex {
			padding: 18.18rpx;
		}
	}
</style>
