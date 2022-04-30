/**
 * @author Leo.Bi
 * @description 微信接龙信息提取工具
 * @date 2022-4-29
 */

const MAX_ORDER_ITEM_SIZE = 10;

const itemNumberHandlerMap = new Map([
	['一百', '100'],
	['九十九', '99'],
	['九十八', '98'],
	['九十七', '97'],
	['九十六', '96'],
	['九十五', '95'],
	['九十四', '94'],
	['九十三', '93'],
	['九十二', '92'],
	['九十一', '91'],
	['九十', '90'],
	['八十', '80'],
	['七十', '70'],
	['六十', '60'],
	['五十', '50'],
	['四十五', '45'],
	['四十', '40'],
	['三十五', '35'],
	['三十', '30'],
	['二十五', '25'],
	['二十', '20'],
	['十九', '19'],
	['十八', '18'],
	['十七', '17'],
	['十六', '16'],
	['十五', '15'],
	['十四', '14'],
	['十三', '13'],
	['十二', '12'],
	['十一', '11'],
	['十', '10'],
	['九', '9'],
	['八', '8'],
	['七', '7'],
	['六', '6'],
	['五', '5'],
	['四', '4'],
	['三', '3'],
	['仨', '2'],
	['二', '2'],
	['俩', '2'],
	['两', '2'],
	['一', '1'],
	['半', '0.5'],
	['蜜3刀', '蜜三刀'],
	['3鲜', '三鲜'],
	['4季豆', '四季豆'],
	['4喜丸子', '四喜丸子'],
	['5花肉', '五花肉'],
	['5香', '五香'],
	['6个核桃', '六个核桃'],
	['8宝', '八宝'],
	['8角', '八角']
]);

function format() {
	document.getElementById("result").value = '';

	let content = document.getElementById("content").value + "\n";

	content = prepareInitialContent(content);

	if (content) {
		const contentArray = content.match(/(\d+)\.\s(\S*)(.*)\n/g);
		const orderArray = new Array();

		for (let i = 0; i < contentArray.length; i++) {
			let line = contentArray[i];

			// in case someone didn't add a space after user name
			if (line.match(/(\d+)\.\s(\S*)(.*)\n/g)) {
				if (RegExp.$2.length > 8) {
					line = line.replace(",", " ").replace("，", " ").replace("。", " ");
				}
			}

			if (line.match(/(\d+)\.\s(\S*)(.*)\n/g)) {
				let order = new Order(RegExp.$1, RegExp.$2, RegExp.$3, "");
				orderArray.push(order);
			}
		}

		const dataElement = document.getElementById("result");

		let headerTextContent = "";
		headerTextContent = headerTextContent.concat("序号");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("微信名");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("联系方式");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("地址");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("项目");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("数量");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("单位");
		headerTextContent = headerTextContent.concat("\t");
		headerTextContent = headerTextContent.concat("备注");

		appendAsResultLine(dataElement, headerTextContent);

		orderArray.every(function (orderRow) {

			console.log(orderRow);

			if (orderRow.getMobile() || orderRow.getAddress()) {
				let orderItems = orderRow.getOrderItems();

				orderItems.every(function (orderItemRow) {
					let textContent = "";
					textContent = textContent.concat(orderRow.getOrderId());
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderRow.getUserName());
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderRow.getMobile() ? orderRow.getMobile() : "");
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderRow.getAddress() ? orderRow.getAddress() : "");
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderItemRow.getItemsName());
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderItemRow.getQuantity());
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderItemRow.getUnitName());
					textContent = textContent.concat("\t");
					textContent = textContent.concat(orderRow.getComments());

					appendAsResultLine(dataElement, textContent);

					return true;
				});
			}

			return true;
		});

	}
}

class Order {
	constructor(orderId, userName, rawContent, comments, orderItems = new Array()) {
		this.setOrderId(orderId);
		this.setUserName(userName);
		this.setOrderItems(orderItems);
		this.setComments(comments);
		this.parseRawContent(rawContent);
	}

	setOrderId(val) {
		this.orderId = val;
	}

	getOrderId() {
		return this.orderId;
	}

	setUserName(val) {
		this.userName = val;
	}

	getUserName() {
		return this.userName;
	}

	getMobile() {
		return this.mobile;
	}

	setAddress(val) {
		this.address = val;
	}

	getAddress() {
		return this.address;
	}

	setOrderItems(val) {
		this.orderItems = val;
	}

	getOrderItems() {
		return this.orderItems;
	}

	setComments(val) {
		this.comments = val;
	}

	getComments() {
		if (this.comments.length < 4) {
			return "";
		} else {
			return this.comments;
		}
	}

	appendOrderItem(val) {
		this.orderItems.push(val);
	}

	appendComments(val) {
		this.comments = this.comments + val + " ";
	}

	parseRawContent(val) {
		//this.rawContent = val; 

		let content = removeExtraInfo(val);
		content = removeDupSpaces(content);
		content = useSpecificSeparator(content, ",");
		content = removeDupSpaces(content);

		if (content.match(/.*(1[3-9][0-9]{9}).*/g)) {
			this.mobile = RegExp.$1;
			// remove mobile data from the raw content
			content = content.replaceAll(this.mobile, "");
		}

		// deal with the first level of content
		const firstLevelContentArray = content.split(",");

		let candidateItemArray = new Array();

		for (let i = 0; i < firstLevelContentArray.length; i++) {
			let firstLevelContent = firstLevelContentArray[i].trim();

			if (needAdditionalSplit(firstLevelContent)) {
				const secondLevelContentArray = firstLevelContent.split(" ");
				candidateItemArray = candidateItemArray.concat(secondLevelContentArray);
			} else {
				candidateItemArray.push(firstLevelContent);
			}
		}

		// process each single item
		candidateItemArray.every(function (itemRow) {
			// replace numbers
			itemRow = batchReplace(itemRow, itemNumberHandlerMap);

			if (itemRow.match(/[\D]*(\d[-]*[~]*[/.]*[\d]*)([|小|大|中|公]?[斤|个|颗|棵|根|份|箱|桶|包|块|两|把|盒|袋|瓶|升|串|挂|张|只|条|听|朵|板|提|节]{1}).*/g)) {
				let quantity = RegExp.$1;
				let unitName = RegExp.$2;
				let itemName = itemRow.replace(quantity + unitName, "");
				let orderItem = new OrderItem(itemName, fixQuantityContent(quantity), unitName);
				this.appendOrderItem(orderItem);
			} else {
				// append un-processed string to comments
				this.appendComments(itemRow);
			}

			if (containsAddressInfo(itemRow)) {
				this.setAddress(itemRow);
			}
			return true;
		}, this);
	}
}

class OrderItem {
	constructor(itemName, quantity, unitName) {
		this.setItemName(itemName);
		this.setQuantity(quantity);
		this.setUnitName(unitName);
	}

	setItemName(val) {
		this.itemName = val;
	}

	getItemsName() {
		return this.itemName;
	}

	setQuantity(val) {
		this.quantity = val;
	}

	getQuantity() {
		return this.quantity;
	}

	setUnitName(val) {
		this.unitName = val;
	}

	getUnitName() {
		return this.unitName;
	}
}

// remove extra spaces and trim spaces
function removeDupSpaces(val) {
	return val.replaceAll("  ", " ").replaceAll("  ", " ").trim();
}

// remove extra info
function removeExtraInfo(val) {
	return val.replaceAll("电话", "").replaceAll("号码", "")
		.replaceAll("手机号", "").replaceAll("手机", "")
		.replaceAll("联系", "").replaceAll("左右", "")
		.replaceAll("谢谢", "");
}

function fixQuantityContent(val) {
	return val.replaceAll("-", "~");
}

// replace different kinds of separators with the target separator
function useSpecificSeparator(val, targetSeparator) {
	return val.replaceAll("。", targetSeparator)
		.replaceAll("，", targetSeparator)
		.replaceAll("：", targetSeparator).replaceAll(":", targetSeparator)
		.replaceAll("；", targetSeparator).replaceAll(";", targetSeparator)
		.replaceAll("!", targetSeparator).replaceAll("！", targetSeparator)
		.replaceAll("+", targetSeparator).replaceAll("、", targetSeparator)
		.replaceAll("[", targetSeparator).replaceAll("]", targetSeparator);
}

function needAdditionalSplit(val) {
	if (val.length > MAX_ORDER_ITEM_SIZE) {
		if (val.split(" ").length - 1 > 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function containsAddressInfo(val) {
	if (val.includes("楼") || val.includes("单元") || val.includes("小区") || val.includes("栋")
		|| val.includes("室")
		|| val.includes("入口") || val.includes("出口") || val.includes("地址") || val.includes("社区")
		|| val.includes("物业") || val.includes("正门") || val.includes("侧门")
		|| val.includes("南区") || val.includes("北区") || val.includes("东区") || val.includes("西区")
		|| val.includes("南门") || val.includes("北门") || val.includes("东门") || val.includes("西门")
		|| val.includes("大门") || val.includes("小门") || val.includes("门口")
		|| val.includes("前门") || val.includes("后门")) {
		return true;
	} else if (val.match(/[\d]+[/-][\d]+[/-][\d]+/g)) {
		return true;
	} else {
		return false;
	}
}

function batchReplace(val, handlerMap) {
	for (const [key, value] of handlerMap.entries()) {
		val = val.replaceAll(key, value);
	}
	return val;
}

function appendAsResultLine(dataElement, val) {
	dataElement.value = dataElement.value + val + "\n";
}

// fix multiple line issues
function prepareInitialContent(val) {
	const lineContentArray = val.match(/.*\n/g);

	let result = "";

	for (let i = 0; i < lineContentArray.length; i++) {
		let lineContent = lineContentArray[i];

		// add an extra space before & after mobile pattern
		if (lineContent.match(/.*(1[3-9][0-9]{9}).*/g)) {
			let mobile = RegExp.$1;
			// remove mobile data from the raw content
			lineContent = lineContent.replace(RegExp.$1, " " + RegExp.$1 + " ");
		}

		if (lineContent.match(/(\d+)\.\s(\S*)(.*)\n/g)) {
			result = result.concat("\n");
			result = result + lineContent.replace("\n", "");
		} else {
			result = result.concat(",");
			result = result + lineContent.replace("\n", " ");
		}
	}

	result = result + "\n";

	return result;
}