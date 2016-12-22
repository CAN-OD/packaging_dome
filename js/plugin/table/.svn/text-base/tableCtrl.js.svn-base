define([], function() {
	var ctrl = function($scope, modelTableService, targetPlugin, designerService, modelSettingData, $timeout) {
		var selectPluginId = targetPlugin.getTargetModelSettingPlugin().pluginId,
			// selectPluginInfo = designerService.getCurrentPage()._getPlugin(selectPluginId).advanceSetting.modelSetting, //当前选择组件的模型设置值
			// modelArray = modelSettingData.getModelData(),
			selectPluginArray = designerService.getCurrentPage()._getPlugin(selectPluginId).advanceSetting.modelSetting, //当前选择组件的模型设置值
            modelArray = modelSettingData.getModel ? modelSettingData.getModel() : modelSettingData.getModelData(),
			totalModelSetting = designerService.getCurrentPage().modelSettings;
		modelSettingData.setIsSave(false);
		
		//兼容以前的老工程，以前数据结构为对象，现在改为数组
        if(Object.prototype.toString.call(selectPluginArray) == '[object Array]'){
          var selectPluginInfo = selectPluginArray ? selectPluginInfo(selectPluginArray) : undefined;  
        }else if(Object.prototype.toString.call(selectPluginArray) == '[object Object]'){
          var selectPluginInfo = selectPluginArray;
              selectPluginInfo['actived'] = true;    
        }
        selectPluginInfo && (selectPluginInfo = addSymbol(angular.copy(selectPluginInfo)));
		_initData(); //初始化数据
		/*这里单独列出两个变量直接对全局的组件信息引用，方便删除模型时候的联动，这里的设计实在是有点蠢
		模型的创建，保存，删除和组件对于模型的添加删除 是两套逻辑，存的地方 逻辑都不一样。*/
		var spit = selectPluginInfo ? selectPluginInfo.tableHeadData : [],
			spic = selectPluginInfo ? selectPluginInfo.columnData : [];
		// modelArray.fields
		$scope.showOrHide = modelTableService.showOrHide;
		$scope.headFilter = modelTableService.headFilter;
		$scope.rowSort = modelTableService.rowSort;
		$scope.countRule = modelTableService.countRule;
		$scope.drillSelect = modelTableService.drill;
		//显示 '0' 勾选后显示 '1' 不显示 '2'
		$scope.renameData = {
			id: '',
			label: ''
		};

		$scope.trChecked = {
			index: ''
		};

		$scope.numExp = [{
			exp: 'integer',
			msg: $i18n('src_app_business_modelSetting_table_tableCtrl_js_9')
		}];

		$scope.scroll = function() {
			var scrollObj = $('.right-table-content').find('.mCSB_container'),
				t = scrollObj.css('top'),
				l = scrollObj.css('left');
			$('.left-table-content').find('table').css({
				'top': t
			});
			$('.table-wrapper-right-title').css({
				'left': l
			});
		};
		function selectPluginInfo(array){
            for(var i = 0, len = array.length; i<len; i++){
                if(array[i].actived){
                    return array[i];
                }
            }
        }
		var colArray = [];
		//行内转换了数据就push原始数据
		if(selectPluginInfo && selectPluginInfo.row2col){
			_.each(selectPluginInfo.copyFields, function(item) {
				colArray.push(item);
			});
		}else{
			_.each($scope.model.columnData, function(item) {
				colArray.push($.extend(true,item.data,item.options));
			});
		}
			
		$scope.$emit('modelSetting.init', {
			// arrayModelData: colArray,
			// strModelId: selectPluginInfo ? selectPluginInfo.modelId : '',
			// flag: true,
			// type: selectPluginInfo ? !selectPluginInfo.row2col : !modelArray.row2col //行列转换

			arrayModelData:colArray,
            strModelId:selectPluginInfo ? selectPluginInfo.modelId : '',
            flag:true,
            type:selectPluginInfo ? !selectPluginInfo.row2col : !modelArray.row2col,
            bindModel:selectPluginInfo ? selectPluginArray : []
		});
		//点击切换模型接受广播事件
        $scope.$on('modelSetting.array',function(e,data){
            var modelData = modelSettingData.getBindModel(data.modelId);
            $scope.model = modelData;
        })
		$scope.$on('modify.modelSetting', function(events, data) {
			var resultData = angular.copy(_.values(data)[0]);
			_.each(resultData.fields, function(item) {
				_.each(modelArray.tableHeadData, function(indexItem, indexItemKey) {
					if (indexItem.data.id == item.id) {
						indexItem.data.modelName = item.name;
						modelArray.columnData[indexItemKey].data.modelName = item.name;
					}
				});
			});
			//处理维度分级情况
			if (resultData.isNewLevel) {
				resultData.levelsList && (_.each(resultData.levelsList, function(item) {
					_tool_deleteElement(modelArray.columnData, item.id);
					// _tool_deleteElement($scope.model.columnData, item.id);
					_tool_deleteElement(modelArray.tableHeadData, item.id);
					// _tool_deleteElement($scope.tableHeadData, item.id);
					_tool_deleteElement(modelArray.fields, item.id);
					_tool_deleteElement(modelArray.dimensionArray, item.id);
					_tool_deleteElement($scope.dimensionArray, item.id);
					modelSettingData.setTabData(item, selectPluginId, 'del');
					modelSettingData.setRawData(item, selectPluginId, 'DIMENSION', 'del', 'tab');
				}))
			}
			
			if(!resultData.levelsList.length){
				var array = angular.copy(modelArray.tableHeadData);
				delLevels(array);
			}
			var reData = {
				fieldsIdArray: {
					modelId: modelArray.modelId,
					list: modelArray.fields,
					index: modelArray.indexArray,
					dimension: modelArray.dimensionArray
				},
				newValue: totalModelSetting
			}
			$scope.$emit('tree-updata', reData);
			modelSettingData.setIsSave(true);
		});

		//初始化数据
		function _initData() {
			if (_.isEmpty(totalModelSetting) && selectPluginInfo) {
				for (var k in selectPluginInfo) {
					if (typeof selectPluginInfo[k] === 'string' || typeof selectPluginInfo[k] === 'number') {
						selectPluginInfo[k] = '';
					} else {
						selectPluginInfo[k] = [];
					}
				}
			}

			if (selectPluginInfo && selectPluginInfo.modelId) {
				var cd = selectPluginInfo.columnData,
					mi = selectPluginInfo.modelId;
				if (cd.length) {
					_.each(cd, function(item) {
						for (var i = 0, len = totalModelSetting[mi].fields.length; i < len; i++) {
							if (item.id == totalModelSetting[mi].fields[i].id) {
								item.modelName = totalModelSetting[mi].fields[i].name;
								break;
							}
						};
					})
				};
			};
			//初始化指标，维度值并且初始化缓存数据对象
			// $scope.tableHeadData = selectPluginInfo ? angular.copy(selectPluginInfo.tableHeadData) : [];
			// $scope.columnData = selectPluginInfo ? angular.copy(selectPluginInfo.columnData) : [];
			$scope.model = selectPluginInfo ? angular.copy(selectPluginInfo) : [];
			modelArray.tableHeadData = selectPluginInfo ? angular.copy(selectPluginInfo.tableHeadData) : [];
			modelArray.columnData = selectPluginInfo ? angular.copy(selectPluginInfo.columnData) : [];
			modelArray.copyFields = selectPluginInfo ? angular.copy(selectPluginInfo.copyFields) : [];
			//初始化行内转换的数据
			
			// $scope.indexArray = selectPluginInfo ? angular.copy(selectPluginInfo.indexArray) : [];
			// $scope.dimensionArray = selectPluginInfo ? angular.copy(selectPluginInfo.dimensionArray) : [];
			modelArray.indexArray = selectPluginInfo ? angular.copy(selectPluginInfo.indexArray) : [];
			modelArray.dimensionArray = selectPluginInfo ? angular.copy(selectPluginInfo.dimensionArray) : [];
			modelArray.customFields = selectPluginInfo ? angular.copy(selectPluginInfo.copyCustomFields) : [];
			modelArray.rawData = selectPluginInfo ? angular.copy(selectPluginInfo.rawData) : [];
			modelArray.row2col = selectPluginInfo ? angular.copy(selectPluginInfo.row2col) : false;
			modelArray.translatedData = selectPluginInfo ? angular.copy(selectPluginInfo.translatedData) : [];
			modelArray.allRawData = selectPluginInfo ? angular.copy(selectPluginInfo.allRawData) : [];
			modelArray.copyCustomFields = selectPluginInfo ? angular.copy(selectPluginInfo.copyCustomFields) : [];
			modelArray.isShowId = selectPluginInfo ? (selectPluginInfo.isShowId ? angular.copy(selectPluginInfo.isShowId) : 'off') : 'off';
			setService();
			setBindModelService();
			//add by chenanjie 处理老工程没有活动字段默认选中
			for (var i in $scope.model.columnData) {
				if (modelArray.tableHeadData[i].options.activityField == void 0) {
					// $scope.model.columnData[i].options.activityField = true;
					modelArray.columnData[i].options.activityField = true;
				}
			}
		};

		$scope.formatMap = {
			'1': $i18n('src_app_business_newModule_newModuleServices_js_1'),
			'2': $i18n('src_app_business_newModule_newModuleServices_js_28'),
			'3': $i18n('src_app_business_newModule_newModuleServices_js_29'),
			'4': $i18n('src_app_business_newModule_newModuleServices_js_21'),
			'5': $i18n('src_app_business_newModule_newModuleServices_js_30'),
			'6': $i18n('src_app_business_newModule_newModuleServices_js_31'),
			'7': $i18n('src_app_business_newModule_newModuleServices_js_32'),
			'8': $i18n('src_app_business_newModule_newModuleServices_js_7'),
			'9': $i18n('src_app_business_newModule_newModuleServices_js_33'),
			'11': $i18n('scripts_app_business_newModule_newModuleServices_js_2')
		};

		//这里代码要重构，太恶心了！
		$scope.$on('modelSetting.options', function(events, data) {
			//添加操作列后，删除模型，如果模型没有了就删除操作列
			if(data.operate){
				$scope.columnData = [];
				modelArray.columnData = [];
				$scope.tableHeadData = [];
				modelArray.tableHeadData = [];
				modelArray.fields = [];
			}
			//////////////////////////////////////
			modelArray = modelSettingData.getBindModel(data.modelId);
			allModel = modelSettingData.getBindModel();
			_.each(allModel, function(item, i) {
				if (item.actived) {
					$scope.model = allModel[i];
				}
			})
			///////////////////////////////////////
			var del = data.del,
			data = data.treeNode;
			if (data.checked) { //勾选中
				// modelArray.modelId = data.pId || data.id;
				addModelId(data); //添加模型ID
				if (!data.pId) { //根目录全选
					for (var i = 0, len = data.children.length; i < len; i++) {
						if (data.children[i].children) {
							var childrenArray = [];
							for (var k = 0, kLen = data.children[i].children.length; k < kLen; k++) {
								allChecked(data.children[i]);
								childrenArray.push({
									label: data.children[i].children[k].name,
									modelName: data.children[i].children[k].name,
									id: data.children[i].children[k].id,
									dsource: data.children[i].children[k].dsource,
									// format: data.children[i].children[k].formater,
									format: '',
									// formatStr: data.children[i].children[k].formatStr
									formatStr: ''
								});
								var newObj_1 = {
									data: {
										label: data.children[i].children[k].name,
										modelName: data.children[i].children[k].name,
										id: data.children[i].children[k].id,
										dsource: data.children[i].children[k].dsource,
										format: '',
										// format: data.children[i].children[k].formater,
										// formatStr: data.children[i].children[k].formatStr,//不继承模型设置配置的格式转换 2016.9.14 add by chenanjie
										formatStr: '',
										parId: data.children[i].id,
										type: data.children[i].children[k].type
									},
									options: {
										filter: '1',
										isShow: '1',
										activityField: true
									}
								}
								// $scope.columnData.push(newObj_1);
								modelSettingData.setRawData(newObj_1, selectPluginId, '', 'add', 'tab');
								modelSettingData.setTabData(newObj_1, selectPluginId, 'add');
								modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
								modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
								modelArray.columnData.push(newObj_1);
								modelArray.tableHeadData.push({
									label: data.children[i].children[k].name,
									id: data.children[i].children[k].id,
									_isObject: false,
									parId:data.children[i].id
								});
								modelArray.fields.push({
									id: data.children[i].children[k].id,
									name:data.children[i].children[k].label,
									isColumnField: true,
									parId:data.children[i].id
								});
								//构造表格indexArray和dimensionArray
								if(data.children[i].children[k].type == 'TIME' || data.children[i].children[k].type == '1'){
									modelArray.dimensionArray.push({
										id:data.children[i].children[k].id,
										name:data.children[i].children[k].name,
										sort:data.children[i].children[k].sort,
										// formater:data.children[i].children[k].formater
										formatStr: ''
									})
								}else{
									modelArray.indexArray.push({
										id:data.children[i].children[k].id,
										name:data.children[i].children[k].name,
										sort:data.children[i].children[k].sort,
										// formater:data.children[i].children[k].formater
										formatStr: '',
										parId:data.children[i].id
									})
								}
							}
							// $scope.tableHeadData.push({
							// 	label: data.children[i].name,
							// 	id: data.children[i].id,
							// 	_isObject: true,
							// 	children: childrenArray
							// });

							modelArray.tableHeadData.push({
								label: data.children[i].name,
								id: data.children[i].id,
								_isObject: true,
								children: childrenArray
							});
						} else {
							modelArray.tableHeadData.push({
								label: data.children[i].name,
								id: data.children[i].id,
								modelType:data.children[i].modelType,
								isName:data.children[i].isName ? data.children[i].isName : 'false',
								_isObject: false,
								levels: data.children[i].levels
							});
							addModelArray(data.children[i]);
						}
					}
				} else { //单个选中
					if (data.level == 1 && data.children) {
						addArray(data, data.children);
					} else if (data.level == 2) {
						addChildrenArray(data);
					} else if (data.children) {
						var childrenArray = [];
						for (var i = 0, len = data.children.length; i < len; i++) {
							childrenArray.push({
								label: data.children[i].name,
								modelName: data.children[i].name,
								id: data.children[i].id,
								dsource: data.children[i].dsource,
								format: '',
								// format: data.children[i].formater,
								// formatStr: data.children[i].formatStr,
								formatStr: '',
								type: data.children[i].type
							});
							addModelArray(data.children[i]);
						};
						modelArray.tableHeadData.push({
							label: data.name,
							id: data.id,
							_isObject: true,
							children: childrenArray
						});
						// modelArray.tableHeadData.push({
						// 	label: data.name,
						// 	id: data.id,
						// 	_isObject: true,
						// 	children: childrenArray
						// })
					} else if (data.getParentNode().pId) {
						var indexArray = indexOfArray(modelArray.tableHeadData, {
								id: data.getParentNode().id
							}),
							childObj = {
								id: data.id,
								modelName: data.name,
								label: data.name,
								dsource: data.dsource,
								format: '',
								// format: data.formater,
								// formatStr: data.formatStr
								formatStr: ''
							};
						if (indexArray < 0) {
							modelArray.tableHeadData.push({
								label: data.getParentNode().name,
								id: data.getParentNode().id,
								_isObject: true,
								children: [childObj]
							});
							// modelArray.tableHeadData.push({
							// 	label: data.getParentNode().name,
							// 	id: data.getParentNode().id,
							// 	_isObject: true,
							// 	children: [childObj]
							// })
						} else {
							modelArray.tableHeadData[indexArray].children.push(childObj);
							// modelArray.tableHeadData[indexArray].children.push(childObj);
						}
						addModelArray(data);
					} else {
						modelArray.tableHeadData.push({
							label: data.name,
							id: data.id,
							modelType:data.modelType,
							isName:data.isName ? data.isName : 'false',
							_isObject: false,
							levels: data.levels
						});
						addModelArray(data);
					}
				}
			} else { //取消勾选
				if (data.level == 1 && data.children) {
					removeArray(modelArray.tableHeadData, {
						id: data.id
					});
					// removeArray($scope.columnData, {
					// 	id: data.id
					// });
					removeArray(modelArray.columnData, {
						id: data.id
					});
					del && removeArray(spic, {
						id: data.id
					});
					removeFields(modelArray.fields, {
						id: data.id
					});
					if (data.type == 'TIME' || data.type == '1') {
						removeArray(modelArray.dimensionArray, {
							id: data.id
						});
					} else {
						removeArray(modelArray.indexArray, {
							id: data.id
						});
					}
					modelSettingData.setRawData(data, selectPluginId, '', 'del', 'tab');
					modelSettingData.setTabData(data, selectPluginId,'del');
					modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
					modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					_.each(data.children, function(item) {
						removeArray(modelArray.tableHeadData, {
							id: item.id
						},data.id);
						// removeArray($scope.columnData, {
						// 	id: item.id
						// },data.id);
						removeArray(modelArray.columnData, {
							id: item.id
						},data.id);
						if (item.type == 'TIME' || item.type == '1') {
							removeArray(modelArray.dimensionArray, {
								id: item.id
							});
						} else {
							removeArray(modelArray.indexArray, {
								id: item.id
							},data.id);
						}
						del && removeArray(spic, {
							id: item.id
						},data.id);
						removeFields(modelArray.fields, {
							id: item.id
						},data.id);
						modelSettingData.setRawData(item, selectPluginId, '', 'del', 'tab');
						modelSettingData.setTabData(item, selectPluginId,'del');
						modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
						modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					})
				} else if (data.level == 2) {

					removeArray(modelArray.tableHeadData, {
						id: data.id
					},data.getParentNode().id);
					// removeArray($scope.columnData, {
					// 	id: data.id
					// },data.getParentNode().id);
					removeArray(modelArray.columnData, {
						id: data.id
					},data.getParentNode().id);
					if (data.type == 'TIME' || data.type == '1') {
						removeArray(modelArray.dimensionArray, {
							id: data.id
						});
					} else if(data.type == '2' || data.type == 'counter'){
						removeArray(modelArray.indexArray, {
							id: data.id
						},data.getParentNode().id);
					};
					del && removeArray(spic, {
						id: data.id
					},data.getParentNode().id);
					removeFields(modelArray.fields, {
						id: data.id
					},data.getParentNode().id);
					modelSettingData.setRawData(data, selectPluginId, '', 'del', 'tab');
					modelSettingData.setTabData(data, selectPluginId,'del');
					modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
					modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					// removePar(data,del);
				} else if (data.children) {
					for (var i = 0, len = data.children.length; i < len; i++) {
						// removeArray($scope.tableHeadData, {
						// 	id: data.children[i].id
						// });
						removeArray(modelArray.tableHeadData, {
							id: data.children[i].id
						});
						del && removeArray(spit, {
							id: data.children[i].id
						});
						if (data.children[i].children) {
							for (var j = 0, jLen = data.children[i].children.length; j < jLen; j++) {
								// removeArray($scope.columnData, {
								// 	id: data.children[i].children[j].id
								// },data.children[i].id);
								removeArray(modelArray.columnData, {
									id: data.children[i].children[j].id
								},data.children[i].id);
								del && removeArray(spic, {
									id: data.children[i].children[j].id
								},data.children[i].id);
								removeFields(modelArray.fields, {
									id: data.children[i].children[j].id
								},data.children[i].id);
								removeArray(modelArray.tableHeadData, {
									id: data.children[i].children[j].id
								},data.children[i].id);
								if (data.children[i].children[j].type == 'TIME' || data.children[i].children[j].type == '1') {
									removeArray(modelArray.dimensionArray, {
										id: data.children[i].children[j].id
									});
								} else if(data.children[i].children[j].type == '2' || data.children[i].children[j].type == 'counter'){
									removeArray(modelArray.indexArray, {
										id: data.children[i].children[j].id
									},data.children[i].id);
								}
								modelSettingData.setRawData(data.children[i].children[j], selectPluginId, '', 'del', 'tab');
								modelSettingData.setTabData(data.children[i].children[j], selectPluginId,'del');
								modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
								modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
							}
						};
						// removeArray($scope.columnData, {
						// 	id: data.children[i].id
						// });
						removeArray(modelArray.columnData, {
							id: data.children[i].id
						});
						del && removeArray(spic, {
							id: data.children[i].id
						});
						removeFields(modelArray.fields, {
							id: data.children[i].id
						});
						if (data.children[i].type == 'TIME' || data.children[i].type == '1') {
							removeArray(modelArray.dimensionArray, {
								id: data.children[i].id
							});
						} else if(data.children[i].type == '2' || data.children[i].type == 'counter'){
							removeArray(modelArray.indexArray, {
								id: data.children[i].id
							});
						}
						modelSettingData.setRawData(data.children[i], selectPluginId, '', 'del', 'tab');
						modelSettingData.setTabData(data.children[i], selectPluginId,'del');
						modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
						modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					}
				} else {
					// removeArray($scope.tableHeadData, {
					// 	id: data.id
					// });
					removeArray(modelArray.tableHeadData, {
						id: data.id
					});
					del && removeArray(spit, {
						id: data.id
					});
				};
				// removeArray($scope.columnData, {
				// 	id: data.id
				// });
				removeArray(modelArray.columnData, {
					id: data.id
				});
				del && removeArray(spic, {
					id: data.id
				});
				removeFields(modelArray.fields, {
					id: data.id
				});
				if (data.type == 'TIME' || data.type == '1') {
					removeArray(modelArray.dimensionArray, {
						id: data.id
					});
				} else if(data.type == '2' || data.type == 'counter'){
					removeArray(modelArray.indexArray, {
						id: data.id
					});
				}
				modelSettingData.setRawData(data, selectPluginId, '', 'del', 'tab');
				modelSettingData.setTabData(data, selectPluginId,'del');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
			};
			$scope.$apply();
		});

		function addArray(data, children) {
			var newObj_1 = {
				data: {
					label: data.name,
					modelName: data.name,
					id: data.id,
					dsource: data.dsource,
					format: '',
					// format: data.formater,
					// formatStr: data.formatStr,
					formatStr: '',
					children: true,
					type: data.type
				},
				options: {
					filter: '1',
					isShow: '0',
					activityField: true
				}
			};
			// //构造表格indexArray和dimensionArray
			// if (data.type == 'TIME' || data.type == '1') {
			// 	modelArray.dimensionArray.push({
			// 		id: data.id,
			// 		name: data.name,
			// 		sort: data.sort,
			// 		// formater: data.formater
			// 		formatStr: ''
			// 	})
			// } else if(data.type == '2' || data.type == 'counter'){
			// 	modelArray.indexArray.push({
			// 		id: data.id,
			// 		name: data.name,
			// 		sort: data.sort,
			// 		// formater: data.formater
			// 		formatStr: ''
			// 	})
			// }
			// $scope.columnData.push(newObj_1);
			modelSettingData.setRawData(newObj_1, selectPluginId, '', 'add', 'tab');
			modelSettingData.setTabData(newObj_1, selectPluginId, 'add');
			modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
			modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
			modelArray.columnData.push(newObj_1);

			_.each(children, function(item) {
				newObj_2 = {
					data: {
						label: item.name,
						modelName: item.name,
						id: item.id,
						dsource: item.dsource,
						format: '',
						// format: item.formater,
						// formatStr: item.formatStr,
						formatStr: '',
						parId: data.id,
						type: data.type
					},
					options: {
						filter: '1',
						isShow: '1',
						activityField: true
					}
				};
				// $scope.columnData.push(newObj_2);
				modelArray.columnData.push(newObj_2);
				modelSettingData.setRawData(newObj_2, selectPluginId, '', 'add', 'tab');
				modelSettingData.setTabData(newObj_2, selectPluginId, 'add');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				//构造表格indexArray和dimensionArray
				if (item.type == 'TIME' || item.type == '1') {
					modelArray.dimensionArray.push({
						id: item.id,
						name: item.name,
						sort: item.sort,
						// formater: item.formater
						formatStr: ''
					})
				} else if(item.type == '2' || item.type == 'counter'){
					modelArray.indexArray.push({
						id: item.id,
						name: item.name,
						sort: item.sort,
						// formater: item.formater
						formatStr: '',
						parId:data.id
					})
				}
				//子级
				modelArray.tableHeadData.push({
					label: item.name,
					id: item.id,
					_isObject: false,
					levels: item.levels,
					parId:data.id
				});
				modelArray.fields.push({
					id:item.id,
					name:item.name,
					isColumnField:true,
					parId:data.id
				})
			})

			//父级
			modelArray.tableHeadData.push({
				label: data.name,
				id: data.id,
				_isObject: false,
				levels: data.levels
			});

			// modelArray.fields.push(data.id);
			modelArray.fields.push({
				id: data.id,
				name:data.name,
				isColumnField: true
			});
			//构造表格indexArray和dimensionArray
			if (data.type == 'TIME' || data.type == '1') {
				modelArray.dimensionArray.push({
					id: data.id,
					name: data.name,
					sort: data.sort,
					// formater: item.formater
					formatStr: ''
				})
			} else if (data.type == '2' || data.type == 'counter') {
				modelArray.indexArray.push({
					id: data.id,
					name: data.name,
					sort: data.sort,
					// formater: item.formater
					formatStr: ''
				})
			}
		};
		//添加子级，如果父级没有就把父级添加，如果有就添加到对应父级下面
		function addChildrenArray(data) {
			var j = 0;
			var temp, num;
			_.each(modelArray.columnData, function(item, i) {
				if (item.data.id == data.getParentNode().id) {
					num = i;
					temp = true;
					j++;
				}
			})
			if (j > 0) {
				if (temp) {
					var newObj_1 = {
						data: {
							label: data.name,
							modelName: data.name,
							id: data.id,
							dsource: data.dsource,
							format: '',
							// format: data.formater,
							// formatStr: data.formatStr,
							formatStr: '',
							parId: data.getParentNode().id,
							type: data.type
						},
						options: {
							filter: '1',
							isShow: '1',
							activityField: true
						}
					};
					// $scope.columnData.splice(num + 1, 0, newObj_1);
					modelSettingData.setRawData(newObj_1, selectPluginId, '', 'add', 'tab');
					modelSettingData.setTabData(newObj_1, selectPluginId, 'add');
					modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
					modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					modelArray.columnData.splice(num + 1, 0, newObj_1);
					//处理先勾选父级,在去选择counter在添加为父级加三角符号提供展开
					// $scope.columnData[num].data['children'] = true;
					modelArray.columnData[num].data['children'] = true;
					//构造表格indexArray和dimensionArray
					if (data.type == 'TIME' || data.type == '1') {
						modelArray.dimensionArray.splice(num +1 ,0,{
							id: data.id,
							name: data.name,
							sort: data.sort,
							// formater: data.formater
							formatStr: ''
						})
					} else if(data.type == '2' || data.type == 'counter'){
						modelArray.indexArray.splice(num + 1,0,{
							id: data.id,
							name: data.name,
							sort: data.sort,
							// formater: data.formater
							formatStr: '',
							parId:data.getParentNode().id
						})
					}
					modelArray.tableHeadData.push({
						label: data.name,
						id: data.id,
						_isObject: false,
						levels: data.levels,
						parId:data.getParentNode().id
					});
					// modelArray.fields.push(data.id);
					modelArray.fields.push({
						id: data.id,
						name:data.name,
						isColumnField: true,
						parId:data.getParentNode().id
					});
				} else {
					var newObj_2 = {
						data: {
							label: data.name,
							modelName: data.name,
							id: data.id,
							dsource: data.dsource,
							format: '',
							// format: data.formater,
							// formatStr: data.formatStr,
							formatStr: '',
							parId: data.getParentNode().id,
							type: data.type
						},
						options: {
							filter: '1',
							isShow: '1',
							activityField: true
						}
					}
					// $scope.columnData.push(newObj_2);
					modelArray.columnData.push(newObj_2);
					$scope.tableHeadData.push({
						label: data.name,
						id: data.id,
						_isObject: false,
						levels: data.levels,
						parId: data.getParentNode().id
					});
					// modelArray.fields.push(data.id);
					modelArray.fields.push({
						id: data.id,
						name:data.name,
						isColumnField: true,
						parId: data.getParentNode().id
					});
				}

			} else {
				var newObj_3 = {
					data: {
						label: data.getParentNode().name,
						modelName: data.getParentNode().name,
						id: data.getParentNode().id,
						dsource: data.getParentNode().dsource,
						format: '',
						// format: data.getParentNode().formater,
						// formatStr: data.getParentNode().formatStr,
						formatStr: '',
						children: true,
						type: data.getParentNode().type
					},
					options: {
						filter: '1',
						isShow: '0',
						activityField: true
					}
				},
				newObj_4 = {
					data: {
						label: data.name,
						modelName: data.name,
						id: data.id,
						dsource: data.dsource,
						format: '',
						// format: data.formater,
						// formatStr: data.formatStr,
						formatStr: '',
						parId: data.getParentNode().id,
						type: data.type

					},
					options: {
						filter: '1',
						isShow: '1',
						activityField: true
					}
				};
				// $scope.columnData.push(newObj_3);
				modelSettingData.setRawData(newObj_3, selectPluginId, '', 'add', 'tab');
				modelSettingData.setTabData(newObj_3, selectPluginId, 'add');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				modelArray.columnData.push(newObj_3);
				//构造表格indexArray和dimensionArray
					if (data.getParentNode().type == 'TIME' || data.getParentNode().type == '1') {
						modelArray.dimensionArray.push({
							id: data.getParentNode().id,
							name: data.getParentNode().name,
							sort: data.getParentNode().sort,
							// formater: data.getParentNode().formater
							formatStr: ''
						})
					} else {
						modelArray.indexArray.push({
							id: data.getParentNode().id,
							name: data.getParentNode().name,
							sort: data.getParentNode().sort,
							// formater: data.getParentNode().formater
							formatStr: ''
						})
					}
				modelArray.tableHeadData.push({
					label: data.getParentNode().name,
					id: data.getParentNode().id,
					_isObject: false,
					levels: data.getParentNode().levels
				});
				// modelArray.fields.push(data.id);
				modelArray.fields.push({
					id: data.id,
					name:data.name,
					isColumnField: true
				});

				// $scope.columnData.push(newObj_4);
				modelArray.columnData.push(newObj_4);
				modelSettingData.setRawData(newObj_4, selectPluginId, '', 'add', 'tab');
				modelSettingData.setTabData(newObj_4, selectPluginId, 'add');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				//构造表格indexArray和dimensionArray
					if (data.type == 'TIME' || data.type == '1') {
						modelArray.dimensionArray.push({
							id: data.id,
							name: data.name,
							sort: data.sort,
							// formater: data.formater
							formatStr: ''
						})
					} else if(data.type == '2' || data.type == 'counter'){
						modelArray.indexArray.push({
							id: data.id,
							name: data.name,
							sort: data.sort,
							// formater: data.formater
							formatStr: '',
							parId: data.getParentNode().id
						})
					}
				modelArray.tableHeadData.push({
					label: data.name,
					id: data.id,
					_isObject: false,
					levels: data.levels,
					parId: data.getParentNode().id
				});
				// modelArray.fields.push(data.id);
				modelArray.fields.push({
					id: data.id,
					name:data.name,
					isColumnField: true,
					parId: data.getParentNode().id
				});
			}
		};
		//删除counter的父级
		function removePar(data, del) {
			var j = 0;
			_.each(modelArray.columnData, function(item, i) {
				_.each(data.getParentNode().children, function(key) {
					if (item.data.id == key.id) {
						j++;
					}
				})
			})
			if (j <= 0) {
				removeArray(modelArray.tableHeadData, {
					id: data.getParentNode().id
				});
				// removeArray($scope.columnData, {
				// 	id: data.getParentNode().id
				// });
				removeArray(modelArray.columnData, {
					id: data.getParentNode().id
				});
				del && removeArray(spic, {
					id: data.getParentNode().id
				});
				removeFields(modelArray.fields, {
					id: data.getParentNode().id
				});
				removeFields(modelArray.indexArray, {
					id: data.getParentNode().id
				});
			} else {
				return;
			}
		};
		//全选，处理有counter类型
		function allChecked(data) {
			var temp;
			_.each(modelArray.columnData, function(item) {
				if (item.data.id == data.id) {
					temp = true;
				}
			})
			if (!temp) {
				modelArray.columnData.push({
					data: {
						label: data.name,
						modelName: data.name,
						id: data.id,
						dsource: data.dsource,
						format: '',
						// format: data.formater,
						// formatStr: data.formatStr,
						formatStr: '',
						children: true,
						type: data.type
					},
					options: {
						filter: '1',
						isShow: '0',
						activityField: true
					}
				});
				modelSettingData.setRawData({
					data: {
						label: data.name,
						modelName: data.name,
						id: data.id,
						dsource: data.dsource,
						format: '',
						// format: data.formater,
						// formatStr: data.formatStr,
						formatStr: '',
						children: true,
						type: data.type
					},
					options: {
						filter: '1',
						isShow: '0',
						activityField: true
					}
				}, selectPluginId, '', 'add', 'tab');
				modelSettingData.setTabData({
					data: {
						label: data.name,
						modelName: data.name,
						id: data.id,
						dsource: data.dsource,
						format: '',
						// format: data.formater,
						// formatStr: data.formatStr,
						formatStr: '',
						children: true,
						type: data.type
					},
					options: {
						filter: '1',
						isShow: '0',
						activityField: true
					}
				}, selectPluginId, 'add');
				modelArray.columnData.push({
					data: {
						label: data.name,
						modelName: data.name,
						id: data.id,
						dsource: data.dsource,
						format: '',
						// format: data.formater,
						// formatStr: data.formatStr,
						formatStr: '',
						children: true,
						type: data.type
					},
					options: {
						filter: '1',
						isShow: '0',
						activityField: true
					}
				});
				modelArray.tableHeadData.push({
					label: data.name,
					id: data.id,
					_isObject: false
						// children: childrenArray
				});
				// modelArray.fields.push(data.id);
				modelArray.fields.push({
					id: data.id,
					name:data.name,
					isColumnField: true
				});
				//构造表格indexArray和dimensionArray
				if (data.type == 'TIME' || data.type == '1') {
					modelArray.dimensionArray.push({
						id: data.id,
						name: data.name,
						sort: data.sort,
						// formater: data.formater
						formatStr: ''
					})
				} else if(data.type == '2' || data.type == 'counter'){
					modelArray.indexArray.push({
						id: data.id,
						name: data.name,
						sort: data.sort,
						// formater: data.formater
						formatStr: ''
					})
				}
			}

		}
		//添加模型ID
		function addModelId(data) {
			if (data.level != 0) {
				data = data.getParentNode();
				addModelId(data)
			} else if (data.level == 0) {
				modelArray.modelId = data.id
			}
		}
		$scope.openChilrden = function($event) {
			var tr = $($event.target).closest("tr");
			var trId = tr.attr('_id');
			var childrenTr = $("tr[pid='" + trId + "']");
			if ($($event.target).prop('class') == 'glyphicon glyphicon-triangle-bottom') {
				$($event.target).prop('class', 'glyphicon glyphicon-triangle-right');
				childrenTr.slideUp(500);
			} else if ($($event.target).prop('class') == 'glyphicon glyphicon-triangle-right') {
				$($event.target).prop('class', 'glyphicon glyphicon-triangle-bottom');
				childrenTr.slideDown(500);
			}

		}

		function removeFields(array, obj,parId) {
			for (var i in array) {
				if (parId && obj.id == array[i].id && array[i].parId == parId) {
					array.splice(i, 1);
					break;
				}else if(!('parId' in array[i]) && array[i].id == obj.id){
					array.splice(i,1);
					break;
				}
			}
		}

		function removeArray(array, obj,parId) {
			outerLoop: for (var i = 0, len = array.length; i < len; i++) {
				if (_.isObject(array[i])) {
					if (array[i].data) {
						//修改counter中id有相同的情况，删除有问题,by chenanjie
						if (parId && array[i].data.id == obj.id && array[i].data.parId == parId) {
							array.splice(i, 1);
							break;
						}else if(array[i].data.id == obj.id && !('parId' in array[i].data)){
							array.splice(i, 1);
							break;
						}
					} else {
						//修改counter中id有相同的情况，删除有问题,by chenanjie
						if (parId && array[i].id == obj.id && array[i].parId == parId) {
							array.splice(i, 1);
							break;
						} else if(array[i].id == obj.id && !('parId' in array[i])){
							array.splice(i, 1);
							break;
						}else if (array[i].children) {
							innerLoop: for (var j = 0, jlen = array[i].children.length; j < jlen; j++) {
								if (array[i].children[j].id == obj.id) {
									array[i].children.splice(j, 1);
									if (array[i].children.length == 0) {
										array.splice(i, 1);
									};
									break outerLoop;
								}
							};
						}
					}
				} else {
					if (array[i] == obj.id) {
						array.splice(i, 1);
						break;
					}
				}
			};
		};

		function indexOfArray(array, obj) {
			for (var i = 0, len = array.length; i < len; i++) {
				if (_.isObject(array[i])) {
					if (array[i].id == obj.id) {
						return i
					}
				}
			};
			return -1;
		}

		$scope.goForward = function(index, child) {
			if (index == 0) return;
			if (child || child == 0) {
				// $scope.tableHeadData[child].children = rebuildArray($scope.tableHeadData[child].children, index, index - 1);
				modelArray.tableHeadData[child].children = rebuildArray(modelArray.tableHeadData[child].children, index, index - 1);
			} else {
				// $scope.tableHeadData = rebuildArray($scope.tableHeadData, index, index - 1);
				modelArray.tableHeadData = rebuildArray(modelArray.tableHeadData, index, index - 1);
			}
		};

		$scope.goBack = function(index, child) {
			if (index == $scope.tableHeadData.length) return;
			if (child || child == 0) {
				// $scope.tableHeadData[child].children = rebuildArray($scope.tableHeadData[child].children, index, index + 1);
				modelArray.tableHeadData[child].children = rebuildArray(modelArray.tableHeadData[child].children, index, index + 1);
			} else {
				// $scope.tableHeadData = rebuildArray($scope.tableHeadData, index, index + 1);
				modelArray.tableHeadData = rebuildArray(modelArray.tableHeadData, index, index + 1);
			}
		};

		function rebuildArray(array, index, afterIndex) {
			if (!array) return;
			var val = array[index];
			array.splice(index, 1);
			array.splice(afterIndex, 0, val);
			return array;
		};

		$scope.addRow = function() {
			var addUid = new Date().getTime();
			var operateHead = {
					label: $i18n('src_app_business_modelSetting_table_tableCtrl_js_4'),
					id: 'operate-' + addUid,
					_isObject: false
				},
				operateCol = {
					data: {
						id: 'operate-' + addUid,
						label: $i18n('src_app_business_modelSetting_table_tableCtrl_js_4'),
						disable: true
					},
					options: {}
				};
			// $scope.tableHeadData.push(operateHead);
			modelArray.tableHeadData.push(operateHead);
			// $scope.columnData.push(operateCol);
			modelArray.columnData.push(operateCol);
			//行列转换后添加的操作列添加到customfields
			if(modelArray.row2col){
				modelArray.customFields.push({
					id:operateCol.data.id,
					name:operateCol.data.label,
					isColumnField:true
				})
			}else{
				modelArray.fields.push({
					id: operateCol.data.id,
					name: operateCol.data.label,
					isColumnField: true
				});
			}
			
		};

		function tipDel() {
			var message = {
				'content': $i18n('src_app_business_modelSetting_table_tableCtrl_js_5'),
				'type': 'prompt',
				'buttons': [{
					"label": $i18n('src_app_business_modelSetting_table_tableCtrl_js_7'),
					"focused": true,
					"handler": function() {
						removeMessage.destroy();
					}
				}]
			};
			var removeMessage = new tinyWidget.Message(message);
			removeMessage.show();
			return false;
		};

		//不显示或者显示某列的处理 false-->show true-->hide
		function isShowHead(id, is) {
			var i = 0,
				len = modelArray.tableHeadData.length;
			isOuterLoop:
				for (; i < len; i++) {
					var eachData = modelArray.tableHeadData[i];
					if (eachData._isObject) {
						isInnerLoop: for (var k = 0, klen = eachData.children.length; k < klen; k++) {
							if (eachData.children[k].id == id) {
								eachData.children[k].isHide = is;
								if (!is && eachData.isHide) {
									eachData.isHide = false;
								};
								if (!checkIsAllHide(eachData.children)) {
									eachData.isHide = true;
								}
								break isOuterLoop;
							}
						}
					}
					else {
						if (eachData.id == id) {
							eachData.isHide = is;
						}
					}
				};
			$scope.$digest();
		};

		function checkIsAllHide(array) {
			var i = 0,
				len = array.length,
				isAllShow = true;
			for (; i < len; i++) {
				var eachData = array[i];
				if (!eachData.isHide) {
					isAllShow = true;
					break;
				};
				isAllShow = false;
			};
			return isAllShow;
		};

		$scope.delRow = function() {
			if (!$scope.trChecked.index) {
				tipDel();
				return;
			};
			var deleteData = modelArray.columnData[$scope.trChecked.index],
				deleteId = deleteData.data.id,
				isShowId = modelSettingData.getIsShowId()[selectPluginId],
				isTranslated = modelSettingData.getRow2col()[selectPluginId];

			// removeArray(modelArray.tableHeadData, {
			// 	id: deleteId
			// });
			//存在counter的情况
			if (deleteData.data.children) {
				for (var j = 0; j < modelArray.columnData.length; j++) {
					if ('parId' in modelArray.columnData[j].data) {
						if (modelArray.columnData[j].data.parId == deleteId) {
							//删除数据转换里面存储好的原始数据
							modelSettingData.setRawData({
								label: modelArray.columnData[j].data.label,
								modelName: modelArray.columnData[j].data.modelName,
								id: modelArray.columnData[j].data.id,
								dsource: modelArray.columnData[j].data.dsource,
								format: modelArray.columnData[j].data.formater,
								formatStr: modelArray.columnData[j].data.formatStr,
								type: modelArray.columnData[j].data.type,
								pIndexId:modelArray.columnData[j].data.parId
							}, selectPluginId, '', 'del', 'tab');
							modelSettingData.setTabData({
								id:modelArray.columnData[j].data.id,
								pIndexId:modelArray.columnData[j].data.parId
							},selectPluginId,'del')
							modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
							modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
							removeArray(modelArray.tableHeadData, {
								id: modelArray.columnData[j].data.id
							},modelArray.columnData[j].data.parId);
							// $scope.columnData.splice(j, 1);
							modelArray.columnData.splice(j, 1);
							modelArray.fields.splice(j, 1);
							modelArray.indexArray.splice(j,1);
							// break;
							j--;
						}
					}
				}
				modelSettingData.setRawData({
					label: deleteData.data.label,
					modelName: deleteData.data.modelName,
					id: deleteData.data.id,
					dsource: deleteData.data.dsource,
					format: deleteData.data.formater,
					formatStr: deleteData.data.formatStr,
					children: deleteData.children,
					type: deleteData.data.type
				}, selectPluginId, '', 'del', 'tab');
				modelSettingData.setTabData({
					id:deleteData.data.id
				},selectPluginId,'del');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				// $scope.columnData.splice($scope.trChecked.index, 1);
				modelArray.columnData.splice($scope.trChecked.index, 1);
				modelArray.fields.splice($scope.trChecked.index, 1);
				removeArray($scope.tableHeadData, {
					id: deleteId
				});
				
			} else if(!isTranslated){
				var translatedObj = {
					label: deleteData.data.label,
					modelName: deleteData.data.modelName,
					id: deleteData.data.id,
					dsource: deleteData.data.dsource,
					format: deleteData.data.formater,
					formatStr: deleteData.data.formatStr,
					type: deleteData.data.type
				}
				if(isShowId == 'on'){
					if(deleteData.data.isId){
						modelArray.isShowId = 'off';
						modelSettingData.setIsShowId('off',selectPluginId);
					}
				}
				delTranslatedData($scope.columnData, deleteData);
				delTranslatedData(modelArray.columnData, deleteData);
				delTranslatedData(modelArray.translatedData, deleteData);
				delTranslatedData(modelArray.customFields, deleteData);
				if (modelArray.columnData.length <= 0) {
					clearData();
					var reData = {
						fieldsIdArray: {
							modelId: modelArray.modelId,
							list: modelArray.fields,
							index: modelArray.indexArray,
							dimension: modelArray.dimensionArray
						},
						newValue: totalModelSetting
					}
					$scope.$emit('tree-updata', reData);
				}
			} else {
				//parId是counter父级的id
				if(deleteData.data.parId){
					var obj_1 = {
						label: deleteData.data.label,
						modelName: deleteData.data.modelName,
						id: deleteData.data.id,
						dsource: deleteData.data.dsource,
						format: deleteData.data.formater,
						formatStr: deleteData.data.formatStr,
						children: deleteData.children,
						type: deleteData.data.type,
						pIndexId:deleteData.data.parId
					},
					obj_2 = {
						id:deleteData.data.id,
						pIndexId:deleteData.data.parId
					}
				}else{
					var obj_1 = {
						label: deleteData.data.label,
						modelName: deleteData.data.modelName,
						id: deleteData.data.id,
						dsource: deleteData.data.dsource,
						format: deleteData.data.formater,
						formatStr: deleteData.data.formatStr,
						children: deleteData.children,
						type: deleteData.data.type
					},
					obj_2 = {
						id:deleteData.data.id
					}
				}
				modelSettingData.setRawData(obj_1, selectPluginId, '', 'del', 'tab');
				modelSettingData.setTabData(obj_2,selectPluginId,'del');
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				// $scope.columnData.splice($scope.trChecked.index, 1);
				modelArray.columnData.splice($scope.trChecked.index, 1);
				modelArray.fields.splice($scope.trChecked.index, 1);
				removeArray($scope.tableHeadData, {
					id: deleteId
				});
			}
			for (var i = 0, len = $scope.tableHeadData.length; i < len; i++) {
				if (modelArray.tableHeadData[i].id == deleteId) {
					// $scope.tableHeadData.splice(i, 1);
					modelArray.tableHeadData.splice(i, 1);
					break;
				};
				if ($scope.tableHeadData[i].children) {
					for (var k = 0, kLen = $scope.tableHeadData[i].children.length; k < kLen; k++) {
						if ($scope.tableHeadData[i].children[k].id == deleteId) {
							// $scope.tableHeadData[i].children.splice(k, 1);
							modelArray.tableHeadData[i].children.splice(k, 1);
							if ($scope.tableHeadData[i].children.length == 0) {
								// $scope.tableHeadData.splice(i, 1);
								modelArray.tableHeadData.splice(i, 1);
							}
							break;
						}
					}
				}
			}
			_.each(modelArray.indexArray, function(item, i) {
				if (item.id == deleteId) {
					modelArray.indexArray.splice(i, 1);
				}
			})
			$scope.$emit('modelSetting.tableData.delete', deleteData.data);
			$scope.trChecked.index = null;
			//数据实在是驱动不到，强迫使用dom操作
			$('.table-wrapper-right').find('tr').removeClass('table-tr-checked');
		};
		//勾选活动项更新fields里面的字段数据 add by chenanjie
		function undataFields(name, type) {
			var array = modelArray.row2col ? modelArray.customFields : modelArray.fields;
			for (var i = 0; i < array.length; i++) {
				if (array[i].id == name.data.id) {
					array[i].isColumnField = type;
				}
			}
		};
		function clearData(){
			modelArray.fields = [];
            modelArray.dimensionArray = [];
            modelArray.indexArray = [];
            modelArray.tableHeadData = [];
            modelArray.modelInfoList = [];
            modelArray.customFields = [];
            modelArray.rawData = [];
            modelArray.allRawData = [];
            modelArray.row2col = false;
            modelArray.isShowId = 'off';
            $scope.dimensionArray = [];
            $scope.indexArray = [];
            modelArray.modelId = '';
		}
		//行转列之后删除数据
		function delTranslatedData(array,delData){
			for(var i = 0 ;i<array.length;i++){
				if(array[i].data && array[i].data.id == delData.data.id){
					array.splice(i,1);
					break;
				}
				if(!array[i].data && array[i].id == delData.data.id){
					array.splice(i,1);
					break;
				}
			}
		}
		//判断数组是否存在某个值
		function isVal(arr,val){
			var flag = false;
			for(var i = 0;i<arr.length;i++){
				if(arr[i].id == val.id){
					return true;
				}
			}
			return false;
		}
		//添加数据
		function addModelArray(obj) {
			var newObj = {
				data: {
					label: obj.name,
					modelName: obj.name,
					id: obj.id,
					dsource: obj.dsource,
					format: '',
					// format: obj.formater,
					// formatStr: obj.formatStr,
					formatStr: '',
					type: obj.type,
					modelType:obj.modelType,
					isName:obj.isName ? obj.isName : 'false'
				},
				options: {
					filter: '1',
					isShow: '0',
					activityField: true
				}
			}
			modelArray.columnData.push(newObj);
			if(!obj.levels && !_.isObject(obj.levels)){
				modelSettingData.setRawData(newObj, selectPluginId, '', 'add', 'tab');
				modelSettingData.setTabData(newObj, selectPluginId, 'add');
			}
			modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
			modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
			modelArray.columnData.push(newObj);
			modelArray.fields.push({
				id: obj.id,
				name:obj.name,
				isColumnField: true,
				modelType:obj.modelType,
				isName:obj.isName ? obj.isName : 'false'
			});
			//构造表格indexArray和dimensionArray
			if (obj.type == 'TIME' || obj.type == '1') {
				modelArray.dimensionArray.push({
					id: obj.id,
					name: obj.name,
					sort: obj.sort,
					modelType:obj.modelType,
					isName:obj.isName ? obj.isName : 'false',
					// formater: obj.formater
					formatStr: ''
				})
			} else if(obj.type == '2' || obj.type == 'counter'){
				modelArray.indexArray.push({
					id: obj.id,
					name: obj.name,
					sort: obj.sort,
					modelType:obj.modelType,
					// formater: obj.formater
					formatStr: ''
				})
			}
		}
		$scope.$watch('renameData', function(newValue, oldValue) {
			if (newValue != oldValue) {
				modelArray.tableHeadData = $scope.tableHeadData.slice(0);
				// $scope.tableHeadData = $scope.tableHeadData.slice(0);
				for (var i = 0, len = modelArray.columnData.length; i < len; i++) {
					if (modelArray.columnData[i].data.id == newValue.id) {
						modelArray.columnData[i].data.label = newValue.label;
						modelArray.columnData[i].data.label = newValue.label;
						break;
					}
				}
			}
		}, true);

		$scope.$watch('tableHeadData', function(newValue, oldValue) {
			$timeout(function() {
				var width = $('#head-table-head').width();
				if (width >= 668) {
					$('.head-table').mCustomScrollbar('update');
				} else {
					$('.head-table').mCustomScrollbar("disable", true);
				}
			}, 10);
			if (newValue != void 0) {
				modelArray.tableHeadData = newValue;
			}
		}, true);

		$scope.inputBlur = function($evt, index, name,data) {
			var currentTargetVal = $($evt.currentTarget).val(),
				arrayObj,
				j;
			for (var i = 0; i < modelArray.columnData.length; i++) {
				if (data.data.id == modelArray.columnData[i].data.id) {
					j = i;
					break;
				}
			}
			arrayObj = modelArray.columnData[j];	
			arrayObj.options[name] = currentTargetVal;
			modelSettingData.setIsSave(true);
		};

		$scope.tableSelect = function(selectId, label, index, name,data) {
			// var arrayObj = modelArray.columnData[index];
			var arrayObj,
				j;
			for (var i = 0; i < modelArray.columnData.length; i++) {
				if (data.data.id == modelArray.columnData[i].data.id) {
					j = i;
					break;
				}
			}
			arrayObj = modelArray.columnData[j];
			arrayObj.options[name] = selectId;
			if (name == 'isShow') {
				if (selectId == '2') {
					isShowHead(arrayObj.data.id, true);
					if(!modelArray.row2col){
						modelSettingData.setRawData(arrayObj.data, selectPluginId, '', 'del', 'tab');
						modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					}
					
				} else {
					isShowHead(arrayObj.data.id, false);
					if(!modelArray.row2col){
						modelSettingData.setRawData(arrayObj, selectPluginId, '', 'add', 'tab');
						modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
					}
					
				}
				modelSettingData.setTabData(arrayObj, selectPluginId, 'updata'); //更新表格原始数据，为了数据转换后再使用原始数据反填
				modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
			};
			modelSettingData.setIsSave(true);
		};
		//活动字段
		$scope.checkBoxChange = function(index, name,data) {
			var arrayObj,
				temp = 0,
				j;
			for (var i = 0; i < modelArray.columnData.length; i++) {
				if (data.data.id == modelArray.columnData[i].data.id) {
					j = i;
					break;
				}
			}
			arrayObj = modelArray.columnData[j];	
			arrayObj.options[name] = this.$$childHead.checked;
			if (arrayObj.options[name]) {
				if (arrayObj.options.isShow == '0' || arrayObj.options.isShow == '1') {
					if ('isHide' in modelArray.tableHeadData[j]) {
						delete modelArray.tableHeadData[j]['isHide'];
						// delete $scope.tableHeadData[j]['isHide'];
					}
				}
				//转换了数据不往原始数据服务添加数据
				if(modelArray.row2col){
					// modelSettingData.setIsShowId('on',selectPluginId);
					// modelArray.isShowId = 'on';
					undataFields(arrayObj, arrayObj.options[name]);
				}else{
					undataFields(arrayObj, arrayObj.options[name]);
					modelSettingData.setRawData(arrayObj, selectPluginId, '', 'add', 'tab');
					modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				}
			} else {
				modelArray.tableHeadData[j]['isHide'] = true;
				// $scope.tableHeadData[j]['isHide'] = true;
				if(arrayObj.data.parId){
					var obj = {
						label: arrayObj.data.label,
						modelName: arrayObj.data.modelName,
						id: arrayObj.data.id,
						dsource: arrayObj.data.dsource,
						format: arrayObj.data.formater,
						formatStr: arrayObj.data.formatStr,
						children: arrayObj.data.children,
						type: arrayObj.data.type,
						pIndexId: arrayObj.data.parId
					}	
				}else{
					var obj = {
						label: arrayObj.data.label,
						modelName: arrayObj.data.modelName,
						id: arrayObj.data.id,
						dsource: arrayObj.data.dsource,
						format: arrayObj.data.formater,
						formatStr: arrayObj.data.formatStr,
						children: arrayObj.data.children,
						type: arrayObj.data.type
					}
				}
				modelSettingData.setRawData(obj, selectPluginId, '', 'del', 'tab');
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
			};
			modelSettingData.setTabData(arrayObj, selectPluginId, 'updata'); //更新表格原始数据，为了数据转换后再使用原始数据反填
			modelArray.allRawData = modelSettingData.getTabData()[selectPluginId];
			undataFields(arrayObj, arrayObj.options[name]);
			modelSettingData.setIsSave(true);
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};

		//格式转换
		$scope.formatChange = function($index, value,data) {
				// designerService.windowData().set({
				// 	id: $scope.columnData[$index].data.format,
				// 	value: $scope.columnData[$index].data.formatStr
				// });
				var index;
				designerService.windowData().set({
					id: data.data.format,
					value: data.data.formatStr
				});
				for(var i = 0;i<modelArray.columnData.length;i++){
					if(data.data.id == modelArray.columnData[i].data.id){
						index = i;
						break;
					}
				}
				var options = {
					"winId": "changeManagess" + $.now(),
					"title": $i18n('src_app_business_modelSetting_table_tableCtrl_js_6'),
					"content-type": "url",
					"content": 'scripts/app/business/change/changeTpl.html',
					"height": 400,
					"width": 500,
					'controllerName': 'changeCtrlAbc',
					'controllerUrl': 'scripts/app/business/change/changeCtrl.js',
					"buttons": [{
						"label": $i18n('src_app_business_modelSetting_table_tableCtrl_js_7'),
						"focused": true,
						"handler": function(d, e, f) {
							var data = $('#changeListPage').scope().formData;
							// $scope.columnData[index].data.format = data.selectId;
							modelArray.columnData[index].data.format = data.selectId;
							// $scope.columnData[index].data.formatStr = data.value;
							modelArray.columnData[index].data.formatStr = data.value;
							modelSettingData.setIsSave(true);
							windowObject.destroy();
							$scope.$apply();
						}
					}, {
						"label": $i18n('src_app_business_modelSetting_table_tableCtrl_js_8'),
						"fucused": false,
						"handler": function() {
							windowObject.destroy();
						}
					}]
				};
				windowObject = tinyWidget.util.openWindow(options);
		};

		//关联显示
		$scope.modelRelationWin = function($index, value,data){
			var index;
			for (var i = 0; i < modelArray.columnData.length; i++) {
				if (data.data.id == modelArray.columnData[i].data.id) {
					index = i;
					break;
				}
			}
			var strMap = {
				title: '',
				sure: $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_1'),
				cancel: $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_2') 
			},
			openModelRelationWin = null;

			var options = {
				'winId': 'modelRelation' + $.now(),
				'title': strMap.title,
				'content-type': 'url',
				'content': 'scripts/app/business/modelSetting/table/modelRelation/modelRelationTpl.html',
				'height': 435,
				'width': 300,
				'controllerName': 'modelRelationCtrl',
                'controllerUrl': 'scripts/app/business/modelSetting/table/modelRelation/modelRelationCtrl.js',
                'scopeTarget': 'modelTableCtrl',
                'buttons': [{
                	'label': strMap.sure,
                	'focused': true,
                	'handler': function(){
                		var lastResult = modelSettingData.getTableModelRelation();
                		modelArray.columnData[index].options.modelRelation = lastResult;
                		// $scope.columnData[index].options.modelRelation = lastResult;
                		$scope.$digest();
                		openModelRelationWin.destroy();
                	}
                }, {
                	'label': strMap.cancel,
                	'focused': false,
                	'handler': function(){
                		openModelRelationWin.destroy();
                	}
                }],
                'close': function(){
                	openModelRelationWin.destroy();
                }
			};

			openModelRelationWin = tinyWidget.util.openWindow(options);
			$scope.modelRelationData = modelArray.columnData[index].options.modelRelation;
		};

		$scope.cancelModelRelationWin = function($index, value,data){
			var index;
			for (var i = 0; i < modelArray.columnData.length; i++) {
				if (data.data.id == modelArray.columnData[i].data.id) {
					index = i;
					break;
				}
			}
			delete modelArray.columnData[index].options.modelRelation;
			// delete $scope.columnData[index].options.modelRelation;
			$scope.$digest();
		};

		//数据转换
		$scope.data = function() {
			var isData = angular.copy(modelArray),
				flag = false;
			for(var x in modelArray.tableHeadData){
				if(_.isObject(modelArray.tableHeadData[x].levels)){
					flag = true;
					break;
				}
			}
			//表格如果维度分级了不提供数据转换
			if(flag){
				new tinyWidget.Message({
					content: $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_6'),
					type: 'error'
				}).show();
			} else if (isData.fields.length) {
				//往行内数据转换里面存储勾选的指标维度数据
				// selectPluginInfo ? modelSettingData.setData(angular.copy(selectPluginInfo), selectPluginId) : modelSettingData.setData(angular.copy(modelArray), selectPluginId);
				modelSettingData.setData(angular.copy(modelArray), selectPluginId)
				modelSettingData.setSelectId(selectPluginId);
				var data = $i18n('scripts_app_business_modelSetting_basic_basicCtrl_js_4');
				$scope.isWindowTree = true;
				var closeFlag = true,
					winObj = null,
					options = {
						"winId": 'data' + _.now(),
						"title": data,
						"content-type": "url",
						"content": 'scripts/app/business/modelSetting/translatedData/translatedDataTpl.html',
						"height": 625,
						"width": 1000,
						'controllerName': 'translatedDataCtrl',
						'controllerUrl': 'scripts/app/business/modelSetting/translatedData/translatedDataCtrl.js',

						'close': function() {
							if (closeFlag) {
								$scope.thisProject = null;
								$scope.isWindowTree = null;
								winObj.destroy();
							}
						},
						'buttons': [{
							"label": $i18n('src_app_business_designer_designerCtrl_js_4'),
							"focused": true,
							"handler": function() {
								var winScope = $('[ng-controller=translatedDataCtrl]').scope();
								var str = $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_3');
								modelSettingData.setRow2col(winScope.show, selectPluginId); //保存是否转换了数据字段
								modelArray.tempData = winScope.show;//保存一份临时的转换字段
								$scope.isDrop = winScope.isDrop;//原始数据表头拖动字段
								$scope.theadData = winScope.theadData;
								if (!winScope.show) { //转化了数据
									modelSettingData.setIsShowId(winScope.isShowId,selectPluginId);//保存是否显示id列
									modelArray.isShowId = winScope.isShowId;
									delHashKey(winScope.translatedTheadData);
									for (var i = 0; i < winScope.translatedTheadData.length; i++) {
										if (winScope.translatedTheadData[i].name == '') {
											new tinyWidget.Message({
												content: $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_7'),
												type: 'error'
											}).show();
											var windowFlag = true;
											modelSettingData.setRow2col(!winScope.show, selectPluginId); 
											return;
										}
									}
									//装换了数据了把之前的原始数据保存一份
									for (var i in winScope.theadData) {
										modelSettingData.setRawData(winScope.theadData[i], selectPluginId, '', 'add', 'tab');
									}
									//保存一份转换后的数据
									modelSettingData.setTranslatedData(winScope.translatedTheadData, selectPluginId);
									translatedData(winScope.show);
								} else {
									//没有转换数据就把原始数据保存一份，如果是不显示或者活动字段为false不保存，是为你回填数据时候正确
									var tabData = modelSettingData.getTabData()[selectPluginId] ? modelSettingData.getTabData()[selectPluginId] :  modelArray.allRawData;
									for(var j in tabData){
										if(tabData[j].options.activityField && tabData[j].options.isShow != '2'){
											modelSettingData.setRawData(tabData[j],selectPluginId,'', 'add', 'tab');
										}
										
									}
									translatedData(winScope.show);
								}
								if (!windowFlag) {
									winObj.destroy();
								}

							}
						}, {
							"label": $i18n('src_app_business_designer_designerCtrl_js_5'),
							"focused": false,
							"handler": function() {
								$scope.thisProject = null;
								$scope.isWindowTree = null;
								winObj.destroy();
							}
						}]
					};
				winObj = tinyWidget.util.openWindow(options);
			} else { //没有勾选指标维度不提供数据转换
				new tinyWidget.Message({
					content: $i18n('scripts_app_business_modelSetting_table_tableCtrl_js_5'),
					type: 'error'
				}).show();
				return;
			}
		};

		function delHashKey(array) {
			for (var i in array) {
				if ('$hashKey' in array[i]) {
					delete array[i].$hashKey
				}
			}
		}

		//构造转换的数据
		function translatedData(flag) {
			modelArray.fields = [];
			// var array = flag ? modelSettingData.getRawData()[selectPluginId] : modelSettingData.getTranslatedData()[selectPluginId];
			//转换了就是使用转换的数据，反之
			var array = flag ? (modelSettingData.getTabData()[selectPluginId] ? modelSettingData.getTabData()[selectPluginId] : modelArray.allRawData) : modelSettingData.getTranslatedData()[selectPluginId];
			var columnData = [],
				tableHeadData = [];
			if (!flag) { //转化了数据
				modelArray.customFields = [];
				modelArray.indexArray = [];
				modelArray.dimensionArray = [];
				if($scope.isDrop){
					rawData = $scope.theadData;
				}else{
				var data = modelSettingData.getRawData(),
					rawData = data[selectPluginId];	
				}
				
				modelArray.row2col = true;
				modelArray.rawData = rawData;
				modelArray.allRawData  = modelSettingData.getTabData()[selectPluginId];
				modelArray.translatedData = modelSettingData.getTranslatedData()[selectPluginId];
				for (var j in rawData) {
					var type = (rawData[j].data.type == 'TIME' || rawData[j].data.type == '1') ? 'DIMENSION' : (rawData[j].data.type == '2' || rawData[j].data.type == 'counter') ? 'MODEL' : '';
					// modelArray.customFields.push({
					// 	id: rawData[j].data.id,
					// 	name: rawData[j].data.label,
					// 	type: type
					// });
					modelArray.fields.push({
						id: rawData[j].data.id,
						name: rawData[j].data.label,
						isColumnField:rawData[j].options.activityField,
						type: type
					});
				}
				for (var i in array) {
					columnData.push({
						data: {
							id: array[i].id,
							dsource: array[i].name,
							format: '',
							formatStr: '',
							label: array[i].name,
							modelName: array[i].name,
							isId:array[i].isId == true ? array[i].isId : false //开启添加ID开关为isId设置为true，为了转换了数据后再模型界面删除维度id的使用	
						},
						options: {
							activityField: true,
							filter: '1',
							isShow: '0'
						}
					});
					tableHeadData.push({
						_isObject: false,
						id: array[i].id,
						label: array[i].name
					});
					modelArray.customFields.push({
						id: array[i].id,
						name:array[i].name,
						type:array[i].type,
						isColumnField: true,
						isId:array[i].isId == true ? array[i].isId : false 
					});
					if(array[i].type == 'MODEL'){
						modelArray.indexArray.push({
							id: array[i].id,
							name: array[i].name,
							sort: '0',
							formater: '',
							isId:array[i].isId == true ? array[i].isId : false 
						})
					}else if(array[i].type == 'DIMENSION'){
						modelArray.dimensionArray.push({
							id: array[i].id,
							name: array[i].name,
							sort: '0',
							formater: '',
							isId:array[i].isId == true ? array[i].isId : false 
						})
					}
				}
			} else {
				modelArray.row2col = false;
				modelArray.customFields = [];
				modelArray.allRawData  = modelSettingData.getTabData()[selectPluginId];
				modelArray.rawData = modelSettingData.getRawData()[selectPluginId];
				var obj = {};
				for (var i in array) {
					if (!array[i].options.activityField || array[i].options.isShow == '2') {
						obj = {
							_isObject: false,
							id: array[i].data.id,
							label: array[i].data.label,
							isHide: true
						}
					} else {
						obj = {
							_isObject: false,
							id: array[i].data.id,
							label: array[i].data.label
						}
					}
					if ('parId' in array[i].data) {

						columnData.push({
							data: {
								id: array[i].data.id,
								dsource: array[i].data.label,
								format: array[i].data.format,
								formatStr: array[i].data.formatStr,
								label: array[i].data.label,
								modelName: array[i].data.label,
								parId: array[i].data.parId
							},
							options: {
								activityField: array[i].options.activityField,
								filter: array[i].options.filter,
								isShow: array[i].options.isShow
							}
						});
						modelArray.fields.push({
							id: array[i].data.id,
							name:array[i].data.label,
							isColumnField: array[i].options.activityField,
							parId: array[i].data.parId
						});
					} else if ('children' in array[i].data) {
						columnData.push({
							data: {
								id: array[i].data.id,
								dsource: array[i].data.label,
								format: array[i].data.format,
								formatStr: array[i].data.formatStr,
								label: array[i].data.label,
								modelName: array[i].data.label,
								children: true
							},
							options: {
								activityField: array[i].options.activityField,
								filter: array[i].options.filter,
								isShow: array[i].options.isShow
							}
						});
						modelArray.fields.push({
							id: array[i].data.id,
							name:array[i].data.label,
							isColumnField: array[i].options.activityField
						});
					} else {
						columnData.push({
							data: {
								id: array[i].data.id,
								dsource: array[i].data.label,
								format: array[i].data.format,
								formatStr: array[i].data.formatStr,
								label: array[i].data.label,
								modelName: array[i].data.label
							},
							options: {
								activityField: array[i].options.activityField,
								filter: array[i].options.filter,
								isShow: array[i].options.isShow
							}
						});
						modelArray.fields.push({
							id: array[i].data.id,
							name:array[i].data.label,
							isColumnField: array[i].options.activityField
						});
					}
					tableHeadData.push(obj);
				}

			}


			// modelArray.columnData = angular.copy(columnData);
			modelArray.columnData = flag ? zIndex(columnData) : angular.copy(columnData);
			modelArray.tableHeadData = angular.copy(tableHeadData);
			// $scope.columnData = angular.copy(columnData);
			// $scope.columnData = flag ? zIndex(columnData) : angular.copy(columnData);
			// $scope.tableHeadData = angular.copy(tableHeadData);;

			var reData = {
				fieldsIdArray: {
					modelId: modelArray.modelId,
					list: modelArray.fields,
					index: modelArray.indexArray,
					dimension: modelArray.dimensionArray
				},
				newValue: totalModelSetting,
				flag: flag
			}
			$scope.$emit('tree-updata', reData);
			$scope.$digest();
		}
		//为指标维度添加type标示
		function indexDimension(array) {
			for (var i in array) {
				if (i == 'indexArray') {
					array[i]['type'] = 'MODEL'
				}
				if (i == 'dimensionArray') {
					array[i]['type'] = 'DIMENSION'
				}
			}
		};
		//行列转换后切换到原始数据有counter重新构层级结构
        function zIndex(array){
            var obj = {},
                key, ret = [];
            array.forEach(function(item) {
                var id = item.data.id,
                    pid = item.data.parId;
                if (pid) {
                    obj[pid] = obj[pid] || [];
                    obj[pid].push(item);
                } else {
                    obj[id] ? obj[id].unshift(item) : (obj[id] = [item])
                }
            });

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret = ret.concat(obj[key]);
                }
            }
            return ret;
        };
		function _tool_deleteElement(array, id){
			var i = 0,
				len = array.length;
			for(;i<len;i++){
				if(array[i].id && (array[i].id == id)){
					array.splice(i, 1);
					break;
				}
				if(!array[i].id && array[i].data && array[i].data.id == id){
					array.splice(i, 1);
					break;
				}

			}
		};
		function delLevels(array){
			_.each(array,function(item,i){
				if(_.isObject(item.levels)){
					_tool_deleteElement(modelArray.columnData, item.id);
					// _tool_deleteElement($scope.columnData, item.id);
					_tool_deleteElement(modelArray.fields, item.id);
					_tool_deleteElement(modelArray.dimensionArray, item.id);
					// _tool_deleteElement($scope.dimensionArray, item.id);
					_tool_deleteElement(modelArray.tableHeadData, item.id);
					// _tool_deleteElement($scope.tableHeadData, item.id);
				}
			})
		}
		//每次进来就把数据set到对应的服务里面,让对应的数据保存最新
        function setService() {
            modelSettingData.clearTranslatedData(); //先清空服务里面的数据
            selectPluginArray && _.each(selectPluginArray, function(item) {
                var allRawData = angular.copy(item.allRawData),
                    rawData = angular.copy(item.rawData),
                    translatedData = angular.copy(item.translatedData),
                    row2col = angular.copy(item.row2col),
                    isShowId = angular.copy(item.isShowId),
                    modelId = angular.copy(item.modelId);

                if (allRawData && allRawData.length) {
                    _.each(allRawData, function(item) {
                        var type = item.type != '' && item.type == 'MODEL' ? 'MODEL' : 'DIMENSION';
                        modelSettingData.setBasicData(item, selectPluginId + modelId, type, 'add');
                    })
                }
                if (rawData && rawData.length) {
                    _.each(rawData, function(item) {
                        var type = item.type != '' && item.type == 'MODEL' ? 'MODEL' : 'DIMENSION';
                        modelSettingData.setRawData(item, selectPluginId + modelId, type, 'add');
                    })
                }
                if (translatedData && translatedData.length) {
                    _.each(translatedData, function(item) {
                        modelSettingData.setTranslatedData(item, selectPluginId + modelId);
                    })
                }
                modelId && modelSettingData.setRow2col(!row2col, selectPluginId + modelId);
                modelId && modelSettingData.setIsShowId(isShowId, selectPluginId + modelId);

                // if (!modelArray.row2col) {
                //     modelArray.allRawData = modelSettingData.getBasicData()[selectPluginId + modelArray.modelId] ? modelSettingData.getBasicData()[selectPluginId + modelArray.modelId] : [];
                //     modelArray.rawData = modelSettingData.getRawData()[selectPluginId + modelArray.modelId] ? modelSettingData.getRawData()[selectPluginId + modelArray.modelId] : [];
                // }
            })
        }
        /**
         * [setBindModelService 更新bindModle服务数据]
         */
        function setBindModelService() {
            modelSettingData.clearBindModelData();
            if (Object.prototype.toString.call(selectPluginArray) == '[object Array]') {
                selectPluginArray && _.each(selectPluginArray, function(item, i) {
                    for (var k in item) {
                        if (Object.prototype.toString.call(item[k]) == '[object Array]') {
                            if (item[k].length) {
                                modelSettingData.setBindModel(k, item[k], item.modelId);
                            }
                        } else {
                            modelSettingData.setBindModel(k, item[k], item.modelId);
                        }
                    }
                })
            } else if (Object.prototype.toString.call(selectPluginArray) == '[object Object]') {
                for (var i in selectPluginArray) {
                    if (Object.prototype.toString.call(selectPluginArray[i]) == '[object Array]') {
                        if (selectPluginArray[i].length) {
                            modelSettingData.setBindModel(i, selectPluginArray[i], selectPluginArray.modelId);
                        }
                    }else{
                        modelSettingData.setBindModel(i, selectPluginArray[i], selectPluginArray.modelId);
                    }
                }
            }
        }
        //处理模型设置界面配置同比环比中id相同的情况
        function addSymbol(copySelectPluginInfo){
            for(var i in copySelectPluginInfo){
                if(Object.prototype.toString.call(copySelectPluginInfo[i]) == '[object Array]'){
                    _.each(copySelectPluginInfo[i],function(item){
                        if (item.id && typeof item.id == 'string' && item.modelType == '1' && item.id.indexOf('_INDEX_YoY') < 0) {
                            item.id = item.id + '_INDEX_YoY';
                        }
                        if(item.id && typeof item.id == 'string' && item.modelType == '2' && item.id.indexOf('_INDEX_QoQ') < 0) {
                        	item.id = item.id + '_INDEX_QoQ';
                        }
                        if (item.data && typeof item.data.id == 'string' && item.data.modelType == '1' && item.data.id.indexOf('_INDEX_YoY') < 0) {
                            item.data.id = item.data.id + '_INDEX_YoY';
                        }
                        if(item.data && typeof item.data.id == 'string' && item.data.modelType == '2' && item.data.id.indexOf('_INDEX_QoQ') < 0) {
                        	item.data.id = item.data.id + '_INDEX_QoQ';
                        }
                        // if(item.id && typeof item.id == 'string' && item.isName == 'true' && item.id.indexOf('_sefon') < 0){
                        // 	item.id = '_sefon' + item.id;
                        // }
                        // if(item.data && typeof item.data.id == 'string' && item.data.isName == 'true' && item.data.id.indexOf('_sefon') < 0){
                        // 	item.data.id = '_sefon' + item.data.id;
                        // }
                    })
                }
            }
            return copySelectPluginInfo;
        }
	};
	ctrl.$inject = ['$scope', 'modelTableService', 'targetPlugin', 'designerService', 'modelSettingData', '$timeout'];
	return ctrl;
})
