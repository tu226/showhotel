﻿Ext.define("app.modules.Room",
    {
        requires: [
        'app.models.RoomModel',
        'Ext.ux.touch.grid.List',
        'Ext.ux.touch.grid.feature.Feature',
        'Ext.ux.touch.grid.feature.Sorter',
        "app.models.HotelModel",
        "app.models.RoomTypeModel"
        ],
        constructor: function (args) {
            this.callParent(arguments);

            var store = Ext.create('Ext.data.Store', {
                model: 'app.models.RoomModel',
                autoLoad: true,
                proxy: {
                    type: 'ajax',
                    url: '/app/Rooms',
                    actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                    reader: {
                        type: 'json'
                    }
                }
            });

            var grid = Ext.create('Ext.ux.touch.grid.List', {
                itemId: "rooms_grid",
                store: store,

                features: [
                    {
                        ftype: 'Ext.ux.touch.grid.feature.Sorter',
                        launchFn: 'initialize'
                    }
                ],
                columns: [
                    {
                        header: '房间名称',
                        dataIndex: 'Name',
                        width: '20%',
                        style: 'text-align: center;',
                        filter: { type: 'string' }
                    },
                    {
                        header: '面积',
                        dataIndex: 'Size',
                        width: '20%',
                        style: 'text-align: center;',
                        filter: { type: 'int' }
                    },
                    {
                        header: '房型',
                        dataIndex: 'RoomType',
                        width: '20%',
                        style: 'text-align: center;',
                        filter: { type: 'int' }
                    },
                    {
                        header: '酒店',
                        dataIndex: 'Hotel',
                        style: 'text-align: center;',
                        width: '20%',
                        filter: { type: 'int' }
                    },
                    {
                        header: '窗户',
                        dataIndex: 'HasWindow',
                        style: 'text-align: center;',
                        cls: 'centered-cell redgreen-cell',
                        width: '15%',
                        renderer: function (value) {
                            var text = value ? "是" : "否";

                            return '<span>' + text + '</span>';
                        }
                    }
                ],
                listeners:
                {
                    selectionchange: function (view, records, eOpts) {
                        var btn_edit = Ext.Viewport.down("#t_top").down("#btn_edit");
                        btn_edit.setDisabled(!records.length);

                        var btn_delete = Ext.Viewport.down("#t_top").down("#btn_delete");
                        btn_delete.setDisabled(!records.length);
                    }
                }
            });

            Ext.Viewport.add(grid);
            this.buildToolbar();
        },

        btn_addHandler: function (btn) {
            var role_add = Ext.Viewport.down("#room_add");

            if (!role_add) {
                var overlay = Ext.Viewport.add({
                    xtype: 'app.modules.Room.Add',
                    itemId: "room_add"
                });
            }
        },

        buildToolbar: function () {
            var btn_add =
            {
                text: "添加",
                handler: this.btn_addHandler
            };

            var btn_edit =
            {
                itemId: "btn_edit",
                text: "编辑",
                disabled: true,
                handler: function (btn) {
                    var selections = Ext.Viewport.down("#rooms_grid").getSelection(),
                        role_add = Ext.Viewport.down("#room_add"),
                        id = selections[0].get("Id");

                    if (!role_add) {
                        var overlay = Ext.Viewport.add({
                            xtype: 'app.modules.Room.Add',
                            itemId: "room_add",
                            eId: id
                        });
                    }
                }
            };

            var btn_delete =
            {
                itemId: "btn_delete",
                text: "删除",
                disabled: true,
                handler: function (btn) {
                    util.ask("删除", "您确定要删除该房间吗？", function () {
                        var grid = Ext.Viewport.down("#rooms_grid"),
                            selections = grid.getSelection(),
                            id = selections[0].get("Id");

                        grid.setMasked({
                            xtype: 'loadmask',
                            message: '请稍候...'
                        });

                        Ext.Ajax.request({
                            url: '/app/DeleteRoom',
                            jsonData: {
                                Id: id
                            },
                            scope: this,
                            success: function (response) {
                                var data = Ext.decode(response.responseText);

                                if (data.success) {
                                    grid.getStore().load();
                                }
                                else {
                                    util.err("错误", data.error);
                                }

                                grid.setMasked(false);
                            }
                        });
                    });
                }
            };

            var btn_refresh =
            {
                text: "刷新",
                handler: function (btn) {
                    var grid = Ext.Viewport.down("#rooms_grid");
                    grid.getStore().load();
                }
            };

            Ext.Viewport.down("#moduleActions").insert(0, btn_delete);
            Ext.Viewport.down("#moduleActions").insert(0, btn_refresh);
            Ext.Viewport.down("#moduleActions").insert(0, btn_edit);
            Ext.Viewport.down("#moduleActions").insert(0, btn_add);
        },
        destroy: function () {
            var room_add = Ext.Viewport.down("#room_add");

            if (room_add) {
                room_add.destroy();
            }
        }
    });

Ext.define("app.modules.Room.Add",
    {
        extend: "Ext.Panel",
        id: "pnlRoomAdd",
        xtype: "app.modules.Room.Add",
        config: {
            modal: true,
            centered: true,
            hideOnMaskTap: false,
            layout: "fit",
            width: Ext.os.deviceType == 'Phone' ? "100%" : 400,
            height: Ext.os.deviceType == 'Phone' ? "100%" : 400,
            scrollable: true,

            items: [
                {
                    xtype: "formpanel",
                    listeners:
                    {
                        painted: function (comp, opts) {
                            var panel = Ext.getCmp("pnlRoomAdd"),
                                form = panel.down("formpanel");

                            if (panel.config.eId) {
                                form.setMasked({
                                    xtype: 'loadmask',
                                    message: '请稍候...'
                                });
                                Ext.Ajax.request({
                                    url: '/app/GetRoom',
                                    jsonData: {
                                        roomId: panel.config.eId
                                    },
                                    scope: this,
                                    success: function (response) {
                                        var data = Ext.decode(response.responseText);
                                        form.data = data;
                                        form.setValues(data);
                                        form.setMasked(false);
                                    }
                                });

                                form.setUrl("/app/UpdateRoom");
                            }
                            else {
                                form.setUrl("/app/CreateRoom");
                            }
                        }
                    },
                    items: [
                        {
                            xtype: "fieldset",
                            defaultType: "textfield",
                            defaults: {
                                required: true,
                                labelAlign: 'left',
                                autoComplete: false,
                                labelWidth: '40%'
                            },
                            title: "添加房间",
                            items: [
                                {
                                    id: "Name",
                                    name: 'Name',
                                    label: '房间名称'
                                },
                                {
                                    id: "Size",
                                    name: 'Size',
                                    required: false,
                                    label: '房间面积'
                                },
                                {
                                    id: "HasWin",
                                    name: 'HasWindow',
                                    required: false,
                                    xtype: 'togglefield',
                                    label: '窗户'
                                },
                                {
                                    name: "Sort",
                                    xtype: "numberfield",
                                    value: 10,
                                    minValue: 0,
                                    label: "排序"
                                },
                                {
                                    xtype: "selectfield",
                                    name: "HotelId",
                                    itemId: "hotels",
                                    displayField: 'Name',
                                    valueField: 'Id',
                                    label: '酒店',
                                    store: {
                                        autoLoad: true,
                                        proxy: {
                                            type: 'ajax',
                                            model: "app.models.HotelModel",
                                            url: '/app/HotelsSimple',
                                            actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    },
                                    listeners:
                                        {
                                            change: function (select, newValue, oldValue, eOpts) {
                                                var panel = Ext.getCmp("pnlRoomAdd"),
                                                    form = panel.down("formpanel"),
                                                    roomTypes = form.down("#roomTypes");

                                                var store = roomTypes.getStore();
                                                roomTypes.setValue(null);
                                                store.removeAll(true);
                                                form.setMasked({
                                                    xtype: 'loadmask',
                                                    message: '请稍候...'
                                                });
                                                store.load({
                                                    params: { hotelId: newValue },
                                                    callback: function (records, operation, success) {
                                                        roomTypes.setDisabled(false);
                                                        form.setMasked(false);
                                                        if (panel.config.eId) {
                                                            roomTypes.setValue(form.data.RoomTypeId);
                                                        }
                                                    },
                                                    scope: this
                                                });
                                            }
                                        }
                                },
                                {
                                    xtype: "selectfield",
                                    itemId: "roomTypes",
                                    name: "RoomTypeId",
                                    displayField: 'Name',
                                    valueField: 'Id',
                                    label: '房型',
                                    disabled: true,
                                    store: {
                                        autoLoad: false,
                                        proxy: {
                                            type: 'ajax',
                                            model: "app.models.RoomTypeModel",
                                            url: '/app/RoomTypes',
                                            actionMethods: { create: "POST", read: "POST", update: "POST", destroy: "POST" },
                                            reader: {
                                                type: 'json'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    docked: 'bottom',
                    xtype: 'toolbar',
                    defaultTypes: "button",
                    layout: {
                        pack: 'center',
                        align: 'center'
                    },
                    items: [
                        {
                            text: "提交",
                            ui: "confirm",
                            handler: function (btn) {
                                var form = btn.up("panel").down("formpanel"),
                                    eId = btn.up("panel").config.eId,
                                    values = form.getValues(),
                                    model = Ext.create('app.models.RoomModel', Ext.apply(values, { Id: eId })),
                                    errors = model.validate(),
                                    msg = '';

                                if (!errors.isValid()) {
                                    util.err("错误", errors);
                                }
                                else {
                                    form.setMasked({
                                        xtype: 'loadmask',
                                        message: '请稍候...'
                                    });

                                    Ext.apply(values, { Id: eId });

                                    Ext.Ajax.request(
                                    {
                                        url: form.getUrl(),
                                        method: "post",
                                        jsonData: values,
                                        success: function (response, opts) {
                                            var obj = Ext.decode(response.responseText);
                                            form.setMasked(false);
                                            if (obj.success) {
                                                var rooms_grid = Ext.Viewport.down("#rooms_grid");

                                                if (rooms_grid) {
                                                    rooms_grid.getStore().load();
                                                }

                                                btn.up("panel").destroy();
                                            }
                                            else {
                                                util.err("错误", obj.error);
                                            }
                                        }
                                    });
                                };
                            }
                        },
                        {
                            text: "重置",
                            handler: function (btn) {
                                btn.up("panel").down("formpanel").reset();
                            }
                        },
                        {
                            text: "取消",
                            ui: "decline",
                            handler: function (btn) {
                                btn.up("panel").destroy();
                            }
                        }
                    ]
                }
            ]
        }
    });