/*
* tinyChecked : [true/false] 此属性设置为true时，表格初始生成时，这行首列的Checkbox处于选中状态。
* 并且，当用户通过表格第一列CheckBox选中某行时，用户翻到下一页，再返回来时，用户之前的选中状态还会存在
* tinyCheckDisabled : [true/false] 设置是否置灰checkbox控件
* detail.show:true/false
* detail.contentType:simple/url
* detail.content
* operator
* */
define([], function(){
	var service = function(){
		//新建的项目 treeList 应该为空 文件包及文件应该用户自己建立
        this.tableList = [
            {id:"1",name:$i18n('src_app_business_table_tableService_js_1'),marryYear:9,createTime:"2013-12-03 ",description:$i18n('src_app_business_table_tableService_js_2'),age:77,tinyCheckDisabled:true,hasChildren:true,children:[
                {id:"11",name:$i18n('src_app_business_table_tableService_js_3'),marryYear:1,createTime:"2013-12-03 ",description:$i18n('src_app_business_table_tableService_js_4'),age:75,hasChildren:true,children:[
                    {id:"111",pId:"11",name:$i18n('src_app_business_table_tableService_js_5'),marryYear:22,createTime:"2013-12-03 ",description:$i18n('src_app_business_table_tableService_js_6'),age:47,hasChildren:true,children:[
                        {id:"1111",name:$i18n('src_app_business_table_tableService_js_7'),marryYear:333,createTime:"2013-12-05 ",description:$i18n('src_app_business_table_tableService_js_8'),age:70,hasChildren:false},
                        {id:"2222",name:$i18n('src_app_business_table_tableService_js_9'),marryYear:333,createTime:"2013-12-05 ",description:$i18n('src_app_business_table_tableService_js_10'),age:75,hasChildren:false}
                    ]}
                ]},
                {id:"12",name:$i18n('src_app_business_table_tableService_js_11'),marryYear:88,createTime:"2013-12-05 ",description:$i18n('src_app_business_table_tableService_js_12'),age:75,hasChildren:false}
            ],
                detail:{
                    contentType:"simple",
                    content:"aaa"
                }},
            {id:"2",name:$i18n('src_app_business_table_tableService_js_13'),marryYear:91,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_14'),operator:"",age:78,
                detail:{
                    contentType:"simple",
                    content:"cde"
                }
            },
            {id:"3",checked:true,name:$i18n('src_app_business_table_tableService_js_15'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_16'),age:79},
            {id:"4",name:$i18n('src_app_business_table_tableService_js_17'),marryYear:95,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_18'),age:80},
            {id:"5",name:$i18n('src_app_business_table_tableService_js_19'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_20'),age:75},
            {id:"6",name:$i18n('src_app_business_table_tableService_js_21'),marryYear:77,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_22'),age:75},
            {id:"7",name:$i18n('src_app_business_table_tableService_js_23'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_24'),age:75},
            {id:"8",name:$i18n('src_app_business_table_tableService_js_25'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_26'),age:75},
            {id:"9",name:$i18n('src_app_business_table_tableService_js_27'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_28'),age:78},
            {id:"10",name:$i18n('src_app_business_table_tableService_js_29'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_30'),age:75},
            {id:"11",name:$i18n('src_app_business_table_tableService_js_31'),marryYear:44,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_32'),age:75},
            {id:"12",name:$i18n('src_app_business_table_tableService_js_33'),marryYear:88,createTime:"2013-12-04 ",description:$i18n('src_app_business_table_tableService_js_34'),age:75}
        ];
        this.totalRecords = 12;
	};
	return service;
});
