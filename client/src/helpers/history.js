import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

export const DeviceStatus = {
    ON: 'On',
    OFF: 'Off',
    FAULTY: 'Faulty',
    UNREACHABLE: 'Unreachable',
    NEW: 'New',
    DISCOVERED: 'Discovered',
    TO_BE_INSTALLED: 'To Be Installed',
    UNKNOWN: 'Unknown'
}

export const helpers = {

    //Viveks logic to get device state
    getStatusOfDeviceNew: function (device) {
        if (device.CURRENT_MAGNITUDE > 0) {
            return DeviceStatus.ON;
        } else if (device.CURRENT_MAGNITUDE === 0) {
            return DeviceStatus.OFF;
        } else if (device.CURRENT_MAGNITUDE == null && device.UIQ_DEVICE_STATE == null) {
            return DeviceStatus.FAULTY;
        } else if (device.UIQ_DEVICE_STATE === "Unreachable") {
            return DeviceStatus.UNREACHABLE;
        } else if (device.UIQ_DEVICE_STATE === "New") {
            return DeviceStatus.NEW;
        } else{
            return DeviceStatus.UNKNOWN;
        }
    },

    //existing logic to get device state
    getStatusOfDeviceOld: function (device) {
        var today = new Date();
        var curHr = today.getHours();
        if (device.CURRENT_MAGNITUDE > 0 && curHr > 18) {
            return DeviceStatus.ON;
        }
        if (device.CURRENT_MAGNITUDE === 0 && curHr < 18) {
            return DeviceStatus.OFF;
        }
        if (device.CURRENT_MAGNITUDE > 0 && curHr < 18) {
            return DeviceStatus.FAULTY;
        } else if (device.CURRENT_MAGNITUDE === 0 && curHr > 18) {
            return DeviceStatus.FAULTY;
        }
        if (device.UIQ_DEVICE_STATE === "Unreachable") {
            return DeviceStatus.UNREACHABLE;
        }
        if (device.UIQ_DEVICE_STATE === "New") {
            return DeviceStatus.NEW;
        }
        return DeviceStatus.UNKNOWN;
    }

}