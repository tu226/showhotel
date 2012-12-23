﻿Ext.define('app.models.RoomBookingModel', {
    extend: 'app.models.ModelBase',

    config: {
        idProperty: "Id",
        fields: [
            { name: 'Id' },
            { name: 'BookingNumber', type: 'string' },
            { name: 'RoomId', type: 'int' },
            { name: 'HotelId', type: 'int' },
            { name: 'Price', type: 'NUMBER' },
            { name: 'CurrencyUnitId', type: 'int' },
            { name: 'Deposit', type: 'NUMBER' },
            { name: 'Start', type: 'MSDate' },
            { name: 'End', type: 'MSDate' },
            { name: 'AgentId', type: 'int' },
            { name: 'AdministratorId', type: 'int' },
            { name: 'BookingDate', type: 'MSDate' },
            { name: 'Status', type: 'int' }
        ],
        validations: [
            { type: 'presence', field: 'RoomId', message: "请选择预订房间" },
            { type: 'presence', field: 'CurrencyUnitId', message: "请选择价格货币种类" },
            { type: 'presence', field: 'HotelId', message: "请选择房间所属的酒店" },
            { type: 'presence', field: 'Price', message: "请输入订房价格" },
            { type: 'presence', field: 'Start', message: "请输入预订起始时间" },
            { type: 'presence', field: 'End', message: "请输入预订结束时间" }
        ]
    }
});