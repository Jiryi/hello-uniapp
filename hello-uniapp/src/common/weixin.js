export const weixin = {
/* 获取地理位置接口 */
	getLocation: function (callback) {
		let option = {
			type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
			success: function (res) {
				// var latitude = res.latitude;    // 纬度，浮点数，范围为90 ~ -90
				// var longitude = res.longitude;  // 经度，浮点数，范围为180 ~ -180。
				// var speed = res.speed;          // 速度，以米/每秒计
				// var accuracy = res.accuracy;    // 位置精度
				if (callback && callback instanceof Function) {
					callback(res);
				}
			}
		}
		wx.getLocation(option);
	},
	/* 调起地图 */
	openLocation: function(data){
		wx.openLocation({
		  longitude: Number(data.longitude),
		  latitude: Number(data.latitude),
		  name: data.name,
		  address: data.address
		})
	},
}

