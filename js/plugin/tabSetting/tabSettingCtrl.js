define([], function() {
	var ctrl = function($scope, designerService) {

		$scope.tabList = designerService.getRouteParam('Container_tabs_list');

		_.each($scope.tabList, function(tab, index){
			tab.titlePath = 'tabList[' + index + '].title';
			tab.idPath = 'tabList[' + index + '].id';
			tab.tipsPath = 'tabList[' + index + '].tips'
		});

		$scope.exp = [{
			exp: 'empty',
			msg: $i18n('i18n_165')
		}];
		$scope.expid = [{
			exp: 'empty',
			msg: $i18n('i18n_165')
		},{
			exp: 'letterNumber',
			msg: $i18n('scripts_app_business_tabSetting_tabSettingCtrl_js_1')
		}];
		$scope.exp64 = [];
		/**
		 * 1、创建tabList副本
		 * 2、表格中删除某个tab项时，与副本中数据比较判断删除的项是否是tabList中原有的数据而不是表格中新增的项
		 * 3、如果删除的项时tab中原有的项，则记录此项。 点击窗口确定按钮时将记录数据发送到tabs指令，并移除相应的compment.node
		 */

		//创建列表副本
		var oldList = angular.copy($scope.tabList),
			removeList = [];

		var count = $scope.tabList.length;
		var countId = $scope.tabList.length;
		$scope.showItem = [
			{
				selectId : 'true',
				label    : $i18n('src_app_business_form_PageProp_form_PagePropService_js_1')
			},
			{
				selectId : 'false',
				label    : $i18n('src_app_business_form_PageProp_form_PagePropService_js_2')
			}
		];

		$scope.getDefaultSelect = function(data){
			return data.isShow ? 'true' : 'false';
		};

		$scope.closeItem = [
			{
				selectId : 'false',
				label    : $i18n('src_app_business_form_PageProp_form_PagePropService_js_2')
			},
			{
				selectId : 'true',
				label    : $i18n('src_app_business_form_PageProp_form_PagePropService_js_1')
			}
		];
		$scope.getCloseSelect = function(data){
			return data.tabClose ? 'true' : 'false';
		};

		//判断名字是否存在，存在 index顺延
		function createName(){
			count += 1;

			var index = count,
				name = $i18n('i18n_781') + index;

			var isNameExist = _.find($scope.tabList, function(tab){
				return tab.title == name;
			});

			if(!isNameExist){
				return name;
			} else {
				return createName();
			}
		}
		function createId(){
			countId += 1;

			var index = countId,
				id = index;

			var isNameExist = _.find($scope.tabList, function(tab){
				return tab.id == id;
			});

			if(!isNameExist){
				return id;
			} else {
				return createId();
			}
		}
		$scope.addPageSetParams = function(){
			var now = Date.now();
			var name = createName();
			var id = createId();
			var length = $scope.tabList.length;

			$scope.tabList.length < 50 &&$scope.tabList.push({
				title : name,
				tips  : name,
				bgColor : 'transparent',
				id : id,
				isShow : true,
				idPath :  'tabList[' + length + '].id',
				titlePath : 'tabList[' + length + '].title',
				tipsPath : 'tabList[' + length + '].tips',
				isDefault : false
			});
			if($scope.tabList.length == 1 ){
				$scope.tabList[0].isDefault = true;
			}
		};

		$scope.remove = function(index){
			var item = $scope.tabList[index];
			var target = _.findWhere(oldList, {id : item.id});
			if(target){
				removeList.push(item.id);
			}
			if(item.isDefault){
				for(var i = 0; i<$scope.tabList.length;i++){
					if(!$scope.tabList[i].isDefault){
						$scope.tabList[i].isDefault = true;
						break;
					}
				}
			}
			
			$scope.tabList.splice(index, 1);
		};

		$scope.submit = function(){
			if($scope.tabList.length == 0){
				
			}
			if(removeList.length > 0){
				$('#'+designerService.getCurrentPlugin().pluginId).scope().removeList = removeList;
			}else{
				$('#'+designerService.getCurrentPlugin().pluginId).scope().removeList = [];
			}
			return $scope.tabList;
		};

		$scope.showSelect = function(selectId, label, index){
			if($scope.tabList[index].isDefault){
				var widget = $($('.tab-tb tr')[index]).find('.tab-show .tiny-select').widget();
				widget.updateDefaultId('true');
				$scope.tabList[index].isShow = true;
			} else {
				$scope.tabList[index].isShow = selectId == 'true';
			}
		};
		$scope.showTabCloseSelect = function(selectId, label, index){
			if($scope.tabList[index].isDefault){
				var widget = $($('.tab-tb tr')[index]).find('.tab-close .tiny-select').widget();
				widget.updateDefaultId('false');
				$scope.tabList[index].tabClose = false;
			} else {
				$scope.tabList[index].tabClose = selectId == 'true';
			}	
		}
		$scope.selectDefault = function($index){
			_.each($scope.tabList, function(list, index){
				list.isDefault = index == $index;
			});

			if(!$scope.tabList[$index].isShow){
				$scope.tabList[$index].isShow = true;
				var widget = $($('.tab-tb tr')[$index]).find('.tab-show .tiny-select').widget();
				widget.updateDefaultId('true');
			}
			if($scope.tabList[$index].tabClose){
				$scope.tabList[$index].tabClose = false;
				var widget = $($('.tab-tb tr')[$index]).find('.tab-close .tiny-select').widget();
				widget.updateDefaultId('fasle');
			}
		};
		$scope.focuscheck = function($id,$index){
			
			$scope.foucsId = $id;
		};
		$scope.blurcheck = function($id,$index){
			var isIdExist = false;
			_.each($scope.tabList, function(list, index){
				if(index!=$index){
					if(list.id == $id){

						isIdExist = true;
					}
				}
				
			});
			if(isIdExist){
				var errorMessage = function(message){
                    new tinyWidget.Tip({
                        content: message,
                        auto: false,
                        element: $($("#tabsCustomOptionWindow").find("td.index")[$index]).find("input"),
                        position: 'bottom'
                    }).show(2000);
                }
                var message = $i18n('scripts_app_business_tabSetting_tabSettingCtrl_js_2');
                errorMessage(message);
				$scope.tabList[$index].id = $scope.foucsId;
			}
		};
	};
	ctrl.$inject = ['$scope', 'designerService'];
	return ctrl;
});
