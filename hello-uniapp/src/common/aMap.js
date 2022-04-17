// <-- 原作者这里使用的是module.exports,在webpack环境下可能会导致一个错误
export const MapLoader = function () {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
            script.src = 'http://webapi.amap.com/maps?v=1.4.8&callback=initAMap&key=你的key值' //key值要去高德api官网申请
            script.onerror = reject
            document.head.appendChild(script)
        }
        window.initAMap = () => {
            resolve(window.AMap)
        }
    })
}

/**
 * 逆向地理编码：将地理坐标（经纬度）转换成地址描述信息
 * 对应为 AMap.Geocoder 的 getAddress 方法
 * @param {Number} longitude 经度
 * @param {Number} latitude  纬度
 */
export const getAddress = function (longitude, latitude) {
    // if (arguments[0] == null || arguments[1] == null) {
    //     longitude = 113.4129
    //     latitude = 23.172686
    // }
    MapLoader().then(AMap => {
        AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder()
            var lnglat = [longitude, latitude]
            geocoder.getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    // console.log(result)
                    return result
                    // result为对应的地理位置详细信息
                }
            })
        })
    },
        e => { console.log('地图加载失败', e) }
    )
}

/**
 * 正向地理编码：将地址描述信息转换成地理坐标（经纬度），
 * 对应为 AMap.Geocoder 的 getLocation 方法
 * @param {String} site 详细地址
 */
export const getLocation = function (site) {
	return new Promise((resolve)=>{
		MapLoader().then(AMap => {
		    AMap.plugin('AMap.Geocoder', function () {
		        var geocoder = new AMap.Geocoder()
		        geocoder.getLocation(site, function (status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		                // console.log(result,'result')
						resolve(result)
		                // return result
		                // result中对应详细地理坐标信息
		            }
		        })
		    })
		},
		    e => { 
				console.log('地图加载失败', e);
				resolve(false)
			}
		)
	})
}

/**
 * 获取地图周边
 */
export const getCircum = function (newLng,newLat) {
	return new Promise((resolve)=>{
		MapLoader().then(AMap => {
		    AMap.plugin('AMap.Geocoder', function () {
                var map = new AMap.Map("container", {
                    resizeEnable: true
                });
                AMap.service(["AMap.PlaceSearch"], function() {
                    //构造地点查询类
                    var placeSearch = new AMap.PlaceSearch({ 
                        type: '', // 兴趣点类别
                        pageSize: 6, // 单页显示结果条数
                        pageIndex: 1, // 页码
                        city: "", // 兴趣点城市
                        citylimit: false,  //是否强制限制在设置的城市内搜索
                        map: map, // 展现结果的地图实例
                        panel: "panel", // 结果列表将在此容器中进行展示。
                        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                    });
                    
                    var cpoint = [newLng, newLat]; //中心点坐标
                    // var cpoint = [113.342309, 23.170892]; //中心点坐标
                    placeSearch.searchNearBy('', cpoint, 200);
                    AMap.event.addListener(placeSearch, 'complete', onComplete)
    
                    function onComplete (data) {
                        console.log('定位成功信息')
                    }
                   
                });
		    })
		},
		    e => { 
				console.log('地图加载失败', e);
				resolve(false)
			}
		)
	})
}

